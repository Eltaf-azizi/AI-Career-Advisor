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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Header */}
      <header className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full"
        >
          <Brain className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
          Career Discovery Test
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">
          Answer these questions to discover your unique career profile. 
          There are no right or wrong answers - be honest with yourself!
        </p>
      </header>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-stone-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {answeredCount} / {questions.length} answered
          </span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-stone-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm"
        >
          {currentQuestion && (
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                  {currentIndex + 1}
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-stone-900 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                  How much does this describe you?
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { value: 1, label: 'Strongly Disagree' },
                    { value: 2, label: 'Disagree' },
                    { value: 3, label: 'Neutral' },
                    { value: 4, label: 'Agree' },
                    { value: 5, label: 'Strongly Agree' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`p-4 rounded-2xl text-center transition-all ${
                        answers[currentQuestion.id] === option.value
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50'
                      } border`}
                    >
                      <div className="text-2xl mb-1">{option.value}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {answers[currentQuestion.id] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center space-x-2 text-emerald-600"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Answer recorded</span>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
