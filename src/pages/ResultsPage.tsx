import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Award, TrendingUp, Sparkles } from 'lucide-react';
import { UserResult } from '../types';

export default function ResultsPage() {
  const location = useLocation();
  const result = location.state?.result as UserResult;

  if (!result) return (
    <div className="text-center py-20 space-y-6">
      <h2 className="text-2xl font-bold">No results found.</h2>
      <Link to="/test" className="text-emerald-600 hover:underline">Take the test first</Link>
    </div>
  );

  return (
    <div className="space-y-16 py-12">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <h1 className="text-5xl font-bold tracking-tight">Your Career Matches are Ready.</h1>
        <p className="text-stone-600 text-xl">
          Based on your unique profile, we've identified the paths where you're most likely to thrive and find fulfillment.
        </p>
      </header>

      {/* Traits Visualization */}
      <section className="bg-white border border-stone-200 rounded-[3rem] p-10 md:p-16 shadow-sm">
        <h2 className="text-2xl font-bold mb-10 flex items-center">
          <Award className="mr-3 text-emerald-600" />
          Your Personality Profile
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(result.traits).map(([trait, score], i) => (
            <motion.div 
              key={trait}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-3"
            >
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-stone-500">
                <span>{trait}</span>
                <span>{score}/10</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${score * 10}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Career Matches */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold flex items-center">
          <TrendingUp className="mr-3 text-emerald-600" />
          Top Career Recommendations
        </h2>
        <div className="grid gap-6">
          {result.matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="group bg-white border border-stone-200 rounded-3xl p-8 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-shrink-0 w-24 h-24 bg-stone-50 rounded-2xl flex flex-col items-center justify-center border border-stone-100 group-hover:bg-emerald-50 transition-colors">
                <span className="text-3xl font-bold text-emerald-600">{match.match_percentage}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Match</span>
              </div>
              
              <div className="flex-grow space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-bold group-hover:text-emerald-700 transition-colors">{match.career_name}</h3>
                <p className="text-stone-600 leading-relaxed max-w-2xl">{match.description}</p>
              </div>

              <Link
                to={`/career/${match.id}`}
                state={{ traits: result.traits }}
                className="flex-shrink-0 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-all flex items-center group/btn"
              >
                View Details
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="text-center pt-10">
        <Link to="/test" className="text-stone-500 hover:text-stone-900 font-medium underline underline-offset-4">
          Not satisfied? Retake the test
        </Link>
      </div>
    </div>
  );
}
