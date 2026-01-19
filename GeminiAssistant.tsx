
import React, { useState } from 'react';
import { generateMarketingIdea } from '../services/gemini';
import { SERVICES } from '../constants';
import { AdSuggestion } from '../types';

const GeminiAssistant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AdSuggestion | null>(null);
  const [selectedService, setSelectedService] = useState(SERVICES[0].title);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateMarketingIdea(selectedService);
    setSuggestion(result);
    setLoading(false);
  };

  return (
    <div className="bg-neutral-800 rounded-3xl p-8 border border-white/5 max-w-2xl mx-auto my-20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -z-10"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-gradient-to-tr from-purple-500 to-pink-500 p-2 rounded-lg text-white">✨</span>
        <h3 className="text-2xl font-bold">مساعد حلبي الذكي</h3>
      </div>
      
      <p className="text-gray-400 mb-6">
        دع الذكاء الاصطناعي يقترح عليك أفكاراً إعلانية لترويج خدماتك! اختر الخدمة واضغط زر التوليد.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select 
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="flex-grow bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
        >
          {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
        </select>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-xl disabled:opacity-50 transition-all whitespace-nowrap"
        >
          {loading ? 'جاري التفكير...' : 'توليد فكرة إعلانية'}
        </button>
      </div>

      {suggestion && (
        <div className="bg-neutral-900 rounded-2xl p-6 border border-amber-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h4 className="text-amber-400 font-bold mb-2">{suggestion.headline}</h4>
          <p className="text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">{suggestion.body}</p>
          <div className="text-xs text-gray-500 uppercase tracking-widest font-black">CTA: {suggestion.cta}</div>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
