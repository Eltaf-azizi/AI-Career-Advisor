import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeftRight, Search, Info, Briefcase, 
  Zap, User, GraduationCap, MapPin, 
  DollarSign, TrendingUp, AlertTriangle,
  ChevronDown, X
} from 'lucide-react';
import { Career } from '../types';

export default function CareerComparisonPage() {
  const [allCareers, setAllCareers] = useState<{ id: number; career_name: string }[]>([]);
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const [selectedB, setSelectedB] = useState<number | null>(null);
  const [careerA, setCareerA] = useState<Career | null>(null);
  const [careerB, setCareerB] = useState<Career | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  useEffect(() => {
    fetch('/api/careers')
      .then(res => res.json())
      .then(data => setAllCareers(data));
  }, []);

  useEffect(() => {
    const ids = [selectedA, selectedB].filter(Boolean);
    if (ids.length > 0) {
      setLoading(true);
      fetch(`/api/compare-careers?ids=${ids.join(',')}`)
        .then(res => res.json())
        .then(data => {
          const a = data.find((c: Career) => c.id === selectedA);
          const b = data.find((c: Career) => c.id === selectedB);
          setCareerA(a || null);
          setCareerB(b || null);
          setLoading(false);
        });
    } else {
      setCareerA(null);
      setCareerB(null);
    }
  }, [selectedA, selectedB]);

  const filteredA = allCareers.filter(c => 
    c.career_name.toLowerCase().includes(searchA.toLowerCase()) && c.id !== selectedB
  );
  const filteredB = allCareers.filter(c => 
    c.career_name.toLowerCase().includes(searchB.toLowerCase()) && c.id !== selectedA
  );

  const ComparisonRow = ({ 
    label, 
    icon: Icon, 
    valA, 
    valB, 
    isList = false,
    isTraits = false
  }: { 
    label: string, 
    icon: any, 
    valA: any, 
    valB: any,
    isList?: boolean,
    isTraits?: boolean
  }) => {
    const showA = !!careerA;
    const showB = !!careerB;
    const isSingle = (showA && !showB) || (!showA && showB);

    return (
      <div className={`grid grid-cols-1 ${isSingle ? 'md:grid-cols-[200px_1fr]' : 'md:grid-cols-[200px_1fr_1fr]'} border-b border-stone-100 last:border-0`}>
        <div className="bg-stone-50/50 p-6 flex items-center space-x-3 md:border-r border-stone-100">
          <Icon className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-stone-900 text-sm uppercase tracking-wider">{label}</span>
        </div>
        
        {showA && (
          <div className={`p-6 ${showB ? 'md:border-r' : ''} border-stone-100 bg-white`}>
            {isList ? (
              <ul className="space-y-2">
                {valA?.map((item: string, i: number) => (
                  <li key={i} className="flex items-start text-stone-600 text-sm">
                    <span className="mr-2 text-emerald-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : isTraits ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(valA || {}).map(([trait, score]: [string, any]) => (
                  <span key={trait} className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium">
                    {trait} ({score})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-stone-700 leading-relaxed">{valA || 'N/A'}</p>
            )}
          </div>
        )}

        {showB && (
          <div className="p-6 bg-white">
            {isList ? (
              <ul className="space-y-2">
                {valB?.map((item: string, i: number) => (
                  <li key={i} className="flex items-start text-stone-600 text-sm">
                    <span className="mr-2 text-emerald-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : isTraits ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(valB || {}).map(([trait, score]: [string, any]) => (
                  <span key={trait} className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium">
                    {trait} ({score})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-stone-700 leading-relaxed">{valB || 'N/A'}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4">
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold uppercase tracking-widest"
        >
          Decision Support
        </motion.div>
        <h1 className="text-5xl font-bold tracking-tight text-stone-900">Career Explorer & Comparison</h1>
        <p className="text-stone-600 text-xl leading-relaxed">
          Search for a single career to explore its details, or select two to compare them side-by-side.
        </p>
      </header>

      {/* Selection Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-40">
        {/* Dropdown A */}
        <div className="relative">
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-4">Career A</label>
          <div className="relative">
            <div 
              onClick={() => setShowDropdownA(!showDropdownA)}
              className="w-full bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-stone-400" />
                <span className={selectedA ? 'text-stone-900 font-medium' : 'text-stone-400'}>
                  {allCareers.find(c => c.id === selectedA)?.career_name || 'Search or select career...'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {selectedA && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedA(null);
                    }}
                    className="p-1 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${showDropdownA ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <AnimatePresence>
              {showDropdownA && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-stone-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        type="text"
                        placeholder="Search careers..."
                        className="w-full pl-9 pr-4 py-2 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                        value={searchA}
                        onChange={(e) => setSearchA(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredA.map(career => (
                      <div
                        key={career.id}
                        className="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-stone-700 hover:text-emerald-700 transition-colors"
                        onClick={() => {
                          setSelectedA(career.id);
                          setShowDropdownA(false);
                          setSearchA('');
                        }}
                      >
                        {career.career_name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-[60%] -translate-y-1/2 w-12 h-12 bg-emerald-600 text-white rounded-full items-center justify-center shadow-lg z-50">
          <ArrowLeftRight className="w-6 h-6" />
        </div>

        {/* Dropdown B */}
        <div className="relative">
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-4">Career B</label>
          <div className="relative">
            <div 
              onClick={() => setShowDropdownB(!showDropdownB)}
              className="w-full bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-stone-400" />
                <span className={selectedB ? 'text-stone-900 font-medium' : 'text-stone-400'}>
                  {allCareers.find(c => c.id === selectedB)?.career_name || 'Search or select career...'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {selectedB && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedB(null);
                    }}
                    className="p-1 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${showDropdownB ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <AnimatePresence>
              {showDropdownB && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-stone-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        type="text"
                        placeholder="Search careers..."
                        className="w-full pl-9 pr-4 py-2 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                        value={searchB}
                        onChange={(e) => setSearchB(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredB.map(career => (
                      <div
                        key={career.id}
                        className="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-stone-700 hover:text-emerald-700 transition-colors"
                        onClick={() => {
                          setSelectedB(career.id);
                          setShowDropdownB(false);
                          setSearchB('');
                        }}
                      >
                        {career.career_name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30 flex items-center justify-center rounded-[2.5rem]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {careerA || careerB ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-stone-200 rounded-[2.5rem] overflow-hidden shadow-sm"
          >
            {/* Table Header */}
            <div className={`grid grid-cols-1 ${(!careerA || !careerB) ? 'md:grid-cols-[200px_1fr]' : 'md:grid-cols-[200px_1fr_1fr]'} bg-stone-900 text-white`}>
              <div className="p-6 flex items-center justify-center md:border-r border-stone-800">
                {careerA && careerB ? <ArrowLeftRight className="w-8 h-8 text-emerald-500" /> : <Search className="w-8 h-8 text-emerald-500" />}
              </div>
              {careerA && (
                <div className={`p-8 text-center ${careerB ? 'md:border-r' : ''} border-stone-800`}>
                  <h3 className="text-3xl font-bold">{careerA.career_name}</h3>
                  {careerA.tagline && <p className="text-emerald-400 text-sm mt-1 font-medium italic">{careerA.tagline}</p>}
                </div>
              )}
              {careerB && (
                <div className="p-8 text-center">
                  <h3 className="text-3xl font-bold">{careerB.career_name}</h3>
                  {careerB.tagline && <p className="text-emerald-400 text-sm mt-1 font-medium italic">{careerB.tagline}</p>}
                </div>
              )}
            </div>

            {/* Comparison Rows */}
            <ComparisonRow 
              label="Overview" 
              icon={Info} 
              valA={careerA?.description} 
              valB={careerB?.description} 
            />
            <ComparisonRow 
              label="Responsibilities" 
              icon={Briefcase} 
              valA={careerA?.responsibilities} 
              valB={careerB?.responsibilities} 
            />
            <ComparisonRow 
              label="Required Skills" 
              icon={Zap} 
              valA={careerA?.required_skills} 
              valB={careerB?.required_skills} 
              isList 
            />
            <ComparisonRow 
              label="Personality Traits" 
              icon={User} 
              valA={careerA?.traits} 
              valB={careerB?.traits} 
              isTraits 
            />
            <ComparisonRow 
              label="Education" 
              icon={GraduationCap} 
              valA={careerA?.education_path} 
              valB={careerB?.education_path} 
            />
            <ComparisonRow 
              label="Work Environment" 
              icon={MapPin} 
              valA={careerA?.work_environment} 
              valB={careerB?.work_environment} 
            />
            <ComparisonRow 
              label="Salary Range" 
              icon={DollarSign} 
              valA={careerA?.salary_range} 
              valB={careerB?.salary_range} 
            />
            <ComparisonRow 
              label="Future Demand" 
              icon={TrendingUp} 
              valA={careerA?.future_demand} 
              valB={careerB?.future_demand} 
            />
            <ComparisonRow 
              label="Difficulty Level" 
              icon={AlertTriangle} 
              valA={careerA?.difficulty_level} 
              valB={careerB?.difficulty_level} 
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50 border-2 border-dashed border-stone-200 rounded-[2.5rem] text-stone-400 space-y-4">
            <Search className="w-16 h-16 opacity-20" />
            <p className="text-xl font-medium">Search for a career or select two to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}
