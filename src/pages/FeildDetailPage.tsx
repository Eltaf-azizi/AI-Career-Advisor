import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, Briefcase, BookOpen, 
  Layers, Zap, GraduationCap 
} from 'lucide-react';
import { CareerField } from '../types';

export default function FieldDetailPage() {
  const { fieldName } = useParams();
  const [field, setField] = useState<CareerField | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/career-fields/${fieldName}`)
      .then(res => res.json())
      .then(data => {
        setField(data);
        setLoading(false);
      });
  }, [fieldName]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!field) return <div className="text-center py-20">Field not found.</div>;

  const sections = [
    {
      id: "overview",
      title: "Field Overview",
      icon: BookOpen,
      content: field.description,
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      id: "subfields",
      title: "Major Areas & Career Paths",
      icon: Layers,
      isGrid: true,
      items: field.subfields,
      isClickable: true,
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      id: "skills",
      title: "Common Skills",
      icon: Zap,
      isGrid: true,
      items: field.skills,
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      id: "education",
      title: "Education Paths",
      icon: GraduationCap,
      isList: true,
      items: field.education_paths,
      color: "bg-rose-50 text-rose-600 border-rose-100"
    }
  ];

  return (
    <div className="space-y-12 py-12 max-w-6xl mx-auto px-4">
      <Link to="/career-paths" className="inline-flex items-center text-stone-500 hover:text-stone-900 font-medium group">
        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Career Paths
      </Link>

      <header className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900">{field.field_name}</h1>
        <p className="text-2xl text-stone-500 font-light max-w-3xl">Comprehensive guide to foundations and opportunities in this field.</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {sections.map((section, i) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${section.color} border`}>
                <section.icon className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-stone-900">{section.title}</h2>
            </div>

            <div className="bg-white border border-stone-200 rounded-[2rem] p-8 md:p-10 shadow-sm">
              {section.content && (
                <p className="text-xl text-stone-700 leading-relaxed">{section.content}</p>
              )}

              {section.isGrid && section.items && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items.map((item: any) => (
                    section.isClickable ? (
                      <Link
                        key={item.name}
                        to={`/career-detail-by-name/${encodeURIComponent(item.name)}`}
                        className="group p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                          <p className="text-stone-600 leading-relaxed">{item.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                      </Link>
                    ) : (
                      <div key={item.name} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                        <h3 className="text-lg font-bold text-stone-900">{item.name}</h3>
                        <p className="text-stone-600 leading-relaxed">{item.description}</p>
                      </div>
                    )
                  ))}
                </div>
              )}

              {section.isList && section.items && (
                <ul className="space-y-4">
                  {section.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <div className="mt-2.5 mr-4 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="text-lg text-stone-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
