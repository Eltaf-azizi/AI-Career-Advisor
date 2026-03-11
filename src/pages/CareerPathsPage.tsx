import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Settings, Heart, Cpu, Briefcase, Palette, 
  Beaker, Gavel, GraduationCap, Coins, Radio 
} from 'lucide-react';
import { CareerField } from '../types';

const iconMap: Record<string, any> = {
  "Engineering": Settings,
  "Medical": Heart,
  "Technology": Cpu,
  "Business": Briefcase,
  "Creative Arts": Palette,
  "Science": Beaker,
  "Law and Public Service": Gavel,
  "Education": GraduationCap,
  "Finance": Coins,
  "Media and Communication": Radio
};

export default function CareerPathsPage() {
  const [fields, setFields] = useState<CareerField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/career-fields')
      .then(res => res.json())
      .then(data => {
        setFields(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="space-y-12 py-12">
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight text-stone-900">Career Path Explorer</h1>
        <p className="text-stone-600 text-xl">
          Explore the major fields of interest and discover the diverse specializations within each industry.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fields.map((field, i) => {
          const Icon = iconMap[field.field_name] || Briefcase;
          return (
            <motion.div
              key={field.field_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/career-paths/${field.field_name.toLowerCase()}`}
                className="group block h-full bg-white border border-stone-200 rounded-[2.5rem] p-8 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
              >
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-stone-50 text-stone-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold group-hover:text-emerald-700 transition-colors">{field.field_name}</h2>
                    <p className="text-stone-500 line-clamp-2 leading-relaxed">{field.description}</p>
                  </div>
                  <div className="flex items-center text-sm font-bold text-emerald-600 uppercase tracking-widest">
                    <span>Explore {field.subfields.length} Careers</span>
                    <motion.span 
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
