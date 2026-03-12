import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Target, Zap, Brain, Rocket } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold tracking-tighter text-stone-900 leading-[1.1]"
          >
            Discover the Career You Were <span className="text-emerald-600 italic">Born</span> to Lead.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
          >
            Stop guessing your future. Our AI-driven career advisor uses psychology and data science to match your unique personality with the perfect professional path.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              to="/test" 
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center group"
            >
              Start Career Discovery Test
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/career-paths" 
              className="px-8 py-4 bg-white text-stone-900 border border-stone-200 rounded-2xl font-semibold text-lg hover:bg-stone-50 transition-all"
            >
              Explore Career Fields
            </Link>
            <Link 
              to="/career-comparison" 
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
            >
              Compare Careers
            </Link>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Brain,
            title: "Psychology-Based",
            desc: "Our test is built on established psychological frameworks to understand your core traits."
          },
          {
            icon: Target,
            title: "Precision Matching",
            desc: "Advanced algorithms compare your profile against 100+ career paths for the best fit."
          },
          {
            icon: Rocket,
            title: "Actionable Roadmaps",
            desc: "Don't just find a career—get a step-by-step plan to acquire the skills you need."
          }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats/Social Proof */}
      <section className="bg-stone-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trusted by 50,000+ Students Worldwide.</h2>
            <p className="text-stone-400 text-lg">
              We've helped thousands of high school and college graduates find their purpose and start their journey with confidence.
            </p>
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-emerald-400">94%</div>
                <div className="text-stone-500 text-sm">Match Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">100+</div>
                <div className="text-stone-500 text-sm">Career Profiles</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-stone-700 rounded-full" />
              <div>
                <div className="font-bold">Sarah Jenkins</div>
                <div className="text-stone-500 text-sm">Now a UX Designer</div>
              </div>
            </div>
            <p className="text-stone-300 italic">
              "I was completely lost after graduation. PathFinder didn't just tell me what I should do, it showed me exactly how to get there. The AI mentor is like having a career coach in my pocket."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
