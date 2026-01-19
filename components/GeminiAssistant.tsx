
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

  const checkAndRun = async (action: () => Promise<void>) => {
    if (!canUseAI()) {
      alert("لقد استنفدت محاولاتك المجانية اليوم (2 مرات). عد غداً لمزيد من الإبداع!");
      return;
    }
    await action();
    incrementAIUsage();
    setRemaining(getRemainingUses());
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
  });

  const handleSearch = () => checkAndRun(async () => {
    if (!prompt) return;
    setLoading(true);
    const res = await groundedSearch(prompt);
    setResult(res);
    setLoading(false);
  });

  const handleVideoGen = () => checkAndRun(async () => {
    if (!prompt) return;
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
    setLoading(true);
    const res = await generateVideo(prompt, aspectRatio as any);
    setResult(res);
    setLoading(false);
  });

  return (
    <div className="bg-neutral-800 rounded-[3rem] p-6 md:p-12 border border-white/5 max-w-6xl mx-auto my-20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-500"></div>
      
      {/* Usage Limit Display */}
      <div className="absolute top-6 left-6 bg-black/40 px-4 py-2 rounded-full border border-amber-500/30 flex items-center gap-3">
        <span className="text-xs font-bold text-gray-400">المحاولات المتبقية اليوم:</span>
        <span className={`text-sm font-black ${remaining > 0 ? 'text-amber-500' : 'text-red-500'}`}>{remaining} / 2</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8 md:mt-0">
        {/* Sidebar Tabs */}
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

        {/* Workspace */}
        <div className="flex-grow bg-black/30 rounded-[2.5rem] p-8 border border-white/5 min-h-[400px]">
          <h3 className="text-2xl font-black mb-6 gold-text">مختبر حلبي الرقمي</h3>
          
          <div className="space-y-6">
            {activeTab === 'marketing' && (
              <>
                <p className="text-gray-400">توليد أفكار إعلانية مبنية على خدماتنا لزيادة مبيعاتك.</p>
                <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4">
                   {SERVICES.map(s => <option key={s.id}>{s.title}</option>)}
                </select>
                <button onClick={handleMarketing} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700 disabled:text-gray-500">توليد فكرة</button>
              </>
            )}

            {activeTab === 'image_gen' && (
              <>
                <p className="text-gray-400">توليد صور فائقة الدقة باستخدام Gemini-3-Pro.</p>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="صف الصورة التي تريدها بالإنجليزية..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 h-32"></textarea>
                <div className="grid grid-cols-2 gap-4">
                  <select value={imgSize} onChange={e => setImgSize(e.target.value as any)} className="bg-neutral-900 p-4 rounded-xl">
                    <option value="1K">1K Resolution</option>
                    <option value="2K">2K Resolution</option>
                    <option value="4K">4K Resolution</option>
                  </select>
                  <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="bg-neutral-900 p-4 rounded-xl">
                    <option value="1:1">1:1</option>
                    <option value="16:9">16:9</option>
                    <option value="9:16">9:16</option>
                    <option value="21:9">21:9</option>
                  </select>
                </div>
                <button onClick={handleAdvancedImageGen} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700">توليد الصورة</button>
              </>
            )}

            {activeTab === 'image_edit' && (
              <>
                <p className="text-gray-400">ارفع صورة واطلب تعديلها (مثلاً: "اجعل الخلفية ريترو" أو "أضف نظارات").</p>
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full p-4 bg-neutral-900 rounded-xl" />
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="ما التعديل المطلوب؟ (بالعربية أو الإنجليزية)..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 h-24"></textarea>
                <button onClick={handleImageEdit} disabled={loading || !imageFile || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700">بدء التعديل الذكي</button>
              </>
            )}

            {activeTab === 'video' && (
              <>
                <p className="text-gray-400">صناعة فيديو سينمائي باستخدام محرك Veo 3 الجديد.</p>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="صف الفيديو (مثلاً: غروب الشمس في دمشق القديمة)..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 h-32"></textarea>
                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-neutral-900 p-4 rounded-xl">
                  <option value="16:9">أفقي (16:9)</option>
                  <option value="9:16">طولي (9:16)</option>
                </select>
                <button onClick={handleVideoGen} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700">صناعة الفيديو (قد يستغرق دقائق)</button>
              </>
            )}

            {activeTab === 'search' && (
              <>
                <p className="text-gray-400">بحث دقيق باستخدام محرك جوجل للحصول على معلومات حديثة وموثقة.</p>
                <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="ماذا تريد أن تبحث عنه؟..." className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4" />
                <button onClick={handleSearch} disabled={loading || remaining === 0} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl disabled:bg-neutral-700">بحث وتلخيص</button>
              </>
            )}

            {remaining === 0 && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-500 text-sm font-bold text-center">
                لقد استهلكت جميع محاولاتك لليوم. عد غداً لمواصلة التجربة!
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-amber-500 font-bold animate-pulse italic">جاري المعالجة بأعلى دقة...</p>
              </div>
            )}

            {result && !loading && (
              <div className="mt-8 animate-in fade-in duration-700">
                {activeTab === 'marketing' && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-amber-500/20">
                    <h4 className="text-xl font-bold mb-2">{result.headline}</h4>
                    <p className="text-gray-300 mb-4">{result.body}</p>
                    <div className="text-xs font-black text-amber-500 tracking-widest uppercase">CTA: {result.cta}</div>
                  </div>
                )}
                {(activeTab === 'image_gen' || activeTab === 'image_edit') && (
                  <div className="flex flex-col items-center">
                    <img src={result} className="max-w-full rounded-2xl border-4 border-amber-500/30 shadow-2xl" alt="Result" />
                    <a href={result} download="halabi-ai-result.png" className="mt-4 px-6 py-2 bg-white/10 rounded-full text-xs font-bold hover:bg-amber-500 hover:text-black transition-all">تحميل الصورة</a>
                  </div>
                )}
                {activeTab === 'video' && (
                  <div className="flex flex-col items-center">
                    <video src={result} controls className="max-w-full rounded-2xl border-4 border-amber-500/30 shadow-2xl"></video>
                  </div>
                )}
                {activeTab === 'search' && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-blue-500/20">
                    <p className="text-gray-200 leading-relaxed mb-6">{result.text}</p>
                    <div className="space-y-2">
                      <h5 className="text-xs font-black text-blue-400 uppercase tracking-widest">المصادر:</h5>
                      {result.sources.map((s: any, i: number) => (
                        <a key={i} href={s.web?.uri} target="_blank" className="block text-[10px] text-gray-500 hover:text-amber-500 underline truncate">{s.web?.title || s.web?.uri}</a>
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
