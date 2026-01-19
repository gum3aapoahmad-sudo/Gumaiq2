
import React, { useState, useRef, useEffect } from 'react';
import { generateMarketingIdea, editImagePrompt, generateAdvancedImage, groundedSearch, generateVideo } from '../services/gemini';
import { SERVICES } from '../constants';
import { canUseAI, incrementAIUsage, getRemainingUses } from '../utils/usageLimit';

const GeminiAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'image_gen' | 'image_edit' | 'video' | 'search'>('marketing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [remaining, setRemaining] = useState(getRemainingUses());
  
  // States for various tools
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [imgSize, setImgSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [selectedService, setSelectedService] = useState(SERVICES[0].title);

  // تحديث عدد المحاولات المتبقية عند التحميل
  useEffect(() => {
    setRemaining(getRemainingUses());
  }, []);

  const checkAndRun = async (action: () => Promise<void>, requiresPaidKey: boolean = false) => {
    if (!canUseAI()) {
      alert("لقد استنفدت محاولاتك المجانية اليوم (2 مرات). عد غداً لمزيد من الإبداع!");
      return;
    }

    if (requiresPaidKey && window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // إذا لم يكن هناك مفتاح، نفتح نافذة الاختيار
        await window.aistudio.openSelectKey();
      }
    }

    try {
      await action();
      incrementAIUsage();
      setRemaining(getRemainingUses());
    } catch (err) {
      console.error("Action Execution Error:", err);
    }
  };

  const handleMarketing = () => checkAndRun(async () => {
    setLoading(true);
    const res = await generateMarketingIdea(selectedService);
    setResult(res);
    setLoading(false);
  });

  const handleImageEdit = () => checkAndRun(async () => {
    if (!imageFile || !prompt) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const res = await editImagePrompt(base64, imageFile.type, prompt);
      setResult(res);
      setLoading(false);
    };
    reader.readAsDataURL(imageFile);
  });

  const handleAdvancedImageGen = () => checkAndRun(async () => {
    if (!prompt) return;
    setLoading(true);
    const res = await generateAdvancedImage(prompt, imgSize, aspectRatio);
    setResult(res);
    setLoading(false);
  }, true);

  const handleSearch = () => checkAndRun(async () => {
    if (!prompt) return;
    setLoading(true);
    const res = await groundedSearch(prompt);
    setResult(res);
    setLoading(false);
  });

  const handleVideoGen = () => checkAndRun(async () => {
    if (!prompt) return;
    setLoading(true);
    const res = await generateVideo(prompt, aspectRatio as any);
    setResult(res);
    setLoading(false);
  }, true);

  return (
    <div className="bg-neutral-800 rounded-[3rem] p-6 md:p-12 border border-white/5 max-w-6xl mx-auto my-20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-500"></div>
      
      {/* Usage Limit, Security & Billing Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-black/40 px-4 py-2 rounded-full border border-amber-500/30 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400">المحاولات المتبقية:</span>
            <span className={`text-sm font-black ${remaining > 0 ? 'text-amber-500' : 'text-red-500'}`}>{remaining} / 2</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
             <i className="fas fa-clock-rotate-left text-amber-500/50"></i>
             <span>تأمين الجلسة: سيتم حذف المفتاح بعد 60 دقيقة من الخمول</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-gray-500 hover:text-amber-500 underline flex items-center gap-2"
          >
            <i className="fas fa-info-circle"></i>
            تأكد من استخدام حساب مدفوع لميزات Pro/Veo
          </a>
          <button 
            onClick={() => window.aistudio?.openSelectKey()}
            className="text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          >
            إعادة ربط مفتاح API
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex flex-col gap-2">
          {[
            { id: 'marketing', label: 'التسويق الذكي', icon: 'fa-bullhorn' },
            { id: 'image_gen', label: 'توليد صور 4K', icon: 'fa-wand-magic-sparkles' },
            { id: 'image_edit', label: 'تعديل الصور بالذكاء', icon: 'fa-image' },
            { id: 'video', label: 'صناعة الفيديو (Veo)', icon: 'fa-video' },
            { id: 'search', label: 'بحث دقيق (Grounded)', icon: 'fa-search' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setResult(null); setPrompt(''); }}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-right ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-grow bg-black/30 rounded-[2.5rem] p-8 border border-white/5 min-h-[400px]">
          <h3 className="text-2xl font-black mb-6 gold-text">مختبر حلبي الرقمي</h3>
          
          <div className="space-y-6">
            {activeTab === 'marketing' && (
              <>
                <p className="text-gray-400">توليد أفكار إعلانية مبنية على خدماتنا لزيادة مبيعاتك.</p>
                <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-white">
                   {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                </select>
                <button onClick={handleMarketing} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700 disabled:text-gray-500 transition-all">توليد فكرة</button>
              </>
            )}

            {activeTab === 'image_gen' && (
              <>
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl mb-4 flex items-center gap-3">
                  <i className="fas fa-crown text-amber-500"></i>
                  <p className="text-[10px] text-amber-200">هذه الميزة تتطلب مشروع Google Cloud مدفوع.</p>
                </div>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="صف الصورة بالإنجليزية (مثلاً: A luxury car in Damascus)..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 h-32 text-white"></textarea>
                <div className="grid grid-cols-2 gap-4">
                  <select value={imgSize} onChange={e => setImgSize(e.target.value as any)} className="bg-neutral-900 p-4 rounded-xl text-white">
                    <option value="1K">دقة 1K</option>
                    <option value="2K">دقة 2K</option>
                    <option value="4K">دقة 4K</option>
                  </select>
                  <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="bg-neutral-900 p-4 rounded-xl text-white">
                    <option value="1:1">1:1 مربع</option>
                    <option value="16:9">16:9 عريض</option>
                    <option value="9:16">9:16 طولي</option>
                  </select>
                </div>
                <button onClick={handleAdvancedImageGen} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700 transition-all">توليد الصورة الاحترافية</button>
              </>
            )}

            {activeTab === 'image_edit' && (
              <>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full p-4 bg-neutral-900 rounded-xl text-white text-sm" />
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="ما التعديل المطلوب؟ (مثلاً: Change background to a music studio)..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 h-24 text-white"></textarea>
                <button onClick={handleImageEdit} disabled={loading || !imageFile || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700 transition-all">تنفيذ التعديل الذكي</button>
              </>
            )}

            {activeTab === 'video' && (
              <>
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl mb-4 flex items-center gap-3">
                  <i className="fas fa-video text-blue-400"></i>
                  <p className="text-[10px] text-blue-200">صناعة فيديو Veo تتطلب حساباً مدفوعاً وقد تستغرق دقائق.</p>
                </div>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="صف المشهد بالإنجليزية بدقة..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 h-32 text-white"></textarea>
                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-neutral-900 p-4 rounded-xl text-white mb-4">
                  <option value="16:9">أفقي (16:9)</option>
                  <option value="9:16">طولي (9:16)</option>
                </select>
                <button onClick={handleVideoGen} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700 transition-all">صناعة الفيديو (Veo)</button>
              </>
            )}

            {activeTab === 'search' && (
              <>
                <p className="text-gray-400 mb-4">بحث مباشر في جوجل مدعوم بالذكاء الاصطناعي.</p>
                <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="ماذا تريد أن تعرف؟..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-white mb-4" />
                <button onClick={handleSearch} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700 transition-all">بحث عميق وتلخيص</button>
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-amber-500 font-bold animate-pulse">جاري الاتصال بالسيرفر...</p>
              </div>
            )}

            {result && !loading && (
              <div className="mt-8 animate-in fade-in duration-700">
                {activeTab === 'marketing' && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-amber-500/20">
                    <h4 className="text-xl font-bold mb-2">{result.headline}</h4>
                    <p className="text-gray-300 mb-4">{result.body}</p>
                    <div className="text-xs font-black text-amber-500 tracking-widest uppercase">CTA: {result.cta}</div>
                    <a 
                        href={`https://api.whatsapp.com/send?phone=905348292352&text=${encodeURIComponent(`أعجبتني فكرة التسويق: ${result.headline}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block text-center py-2 bg-green-600 text-white rounded-lg text-sm font-bold"
                    >
                        ناقش التنفيذ عبر واتساب
                    </a>
                  </div>
                )}
                {(activeTab === 'image_gen' || activeTab === 'image_edit') && (
                  <div className="flex flex-col items-center">
                    <img src={result} className="max-w-full rounded-2xl border-4 border-amber-500/30 shadow-2xl" alt="AI Output" />
                    <div className="flex gap-4 mt-6">
                      <a href={result} download="halabi-result.png" className="px-6 py-2 bg-white/10 rounded-full text-xs font-bold hover:bg-amber-500 transition-all">تحميل النتيجة</a>
                      <a 
                        href={`https://api.whatsapp.com/send?phone=905348292352&text=${encodeURIComponent("أريد تنفيذ تصميم احترافي بناءً على نتيجة الذكاء الاصطناعي")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-green-600/20 text-green-500 border border-green-500/30 rounded-full text-xs font-bold"
                      >
                        اطلب تنفيذ احترافي
                      </a>
                    </div>
                  </div>
                )}
                {activeTab === 'video' && (
                  <div className="flex flex-col items-center">
                    <video src={result} controls className="max-w-full rounded-2xl border-4 border-amber-500/30 shadow-2xl"></video>
                    <p className="mt-4 text-xs text-gray-500">ملاحظة: الرابط مؤقت، يرجى حفظ الفيديو.</p>
                  </div>
                )}
                {activeTab === 'search' && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-blue-500/20">
                    <p className="text-gray-200 leading-relaxed mb-6">{result.text}</p>
                    <div className="space-y-2">
                      <h5 className="text-xs font-black text-blue-400 uppercase tracking-widest">المصادر المكتشفة:</h5>
                      {result.sources.map((s: any, i: number) => (
                        <a key={i} href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-gray-500 hover:text-amber-500 underline truncate">
                          {s.web?.title || s.web?.uri}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
