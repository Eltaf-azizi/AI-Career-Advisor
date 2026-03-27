import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Brain, Target } from 'lucide-react';
import { Question } from '../types';

export default function CareerTestPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load questions', err);
        setLoading(false);
      });
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (score: number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: score }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (answeredCount < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([questionId, score]) => ({
        questionId: parseInt(questionId),
        score
      }));

      const response = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerArray })
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      const result = await response.json();
      navigate('/results', { state: { result } });
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  