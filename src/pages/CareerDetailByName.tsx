import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateFullCareerDetails } from '../services/geminiService';
import { Career } from '../types';

export default function CareerDetailByName() {
  const { careerName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await fetch(`/api/career-by-name/${encodeURIComponent(careerName || "")}`);
        const data = await res.json();
        
        if (data.needs_generation) {
          // Use AI to generate full details
          const generatedCareer = await generateFullCareerDetails(careerName || "");
          // Navigate to the standard career detail page with the generated data in state
          navigate(`/career/${generatedCareer.id}`, { state: { career: generatedCareer, isGenerated: true } });
        } else {
          // Career exists in DB, navigate to standard detail page
          navigate(`/career/${data.id}`);
        }
      } catch (error) {
        console.error("Error fetching career:", error);
        setLoading(false);
      }
    };

    fetchCareer();
  }, [careerName, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-stone-900">Analyzing {careerName}...</h2>
        <p className="text-stone-500">Our AI is researching this career path for you.</p>
      </div>
    </div>
  );
}
