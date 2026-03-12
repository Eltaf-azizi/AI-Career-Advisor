import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, ArrowLeft, Sparkles, Trash2 } from 'lucide-react';
import { startCareerChat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const location = useLocation();
  const career = location.state?.career;
  
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startCareerChat(career);
    
    // Initial greeting
    const greeting = career 
      ? `Hello! I see you're interested in becoming a ${career.career_name}. That's a fantastic choice! How can I help you navigate this path today?`
      : "Hello! I'm your AI Career Mentor. I'm here to help you discover your strengths and find the perfect career path. What's on your mind?";
    
    setMessages([{ role: 'model', text: greeting }]);
  }, [career]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <Link to={career ? `/career/${career.id}` : "/"} className="text-stone-500 hover:text-stone-900 font-medium flex items-center group">
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {career ? `Back to ${career.career_name}` : "Back to Home"}
        </Link>
        <button 
          onClick={() => setMessages([])}
          className="text-stone-400 hover:text-rose-600 transition-colors p-2 rounded-lg"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-grow bg-white border border-stone-200 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900">AI Career Mentor</h2>
            <div className="flex items-center text-xs text-emerald-600 font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              Online & Ready to Help
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`p-5 rounded-[1.5rem] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-stone-900 text-white rounded-tr-none' 
                      : 'bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100'
                  }`}>
                    <div className="prose prose-sm prose-stone max-w-none prose-invert">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl rounded-tl-none animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-stone-100 bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about careers, skills, or your future..."
              className="w-full p-5 pr-16 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-3 p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-stone-400 mt-3 text-center uppercase tracking-widest font-bold">
            Powered by Gemini AI • Professional Career Guidance
          </p>
        </div>
      </div>
    </div>
  );
}
