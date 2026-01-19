
import React, { useState, useRef, useEffect } from 'react';

const CustomAudioPlayer: React.FC<{ src: string; title: string; subtitle: string }> = ({ src, title, subtitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false); // Lazy loading state
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // تحميل المصدر فقط عند الحاجة (Lazy Loading)
  const ensureAudioLoaded = () => {
    if (!audioLoaded) {
      setAudioLoaded(true);
      if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.load();
      }
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    // تفعيل التحميل عند أول نقرة
    ensureAudioLoaded();
    setHasError(false);

    try {
      if (isPlaying) {
        // ننتظر حتى ينتهي أي طلب تشغيل قائم قبل الإيقاف لتجنب خطأ Interruption
        if (playPromiseRef.current !== null) {
          try { await playPromiseRef.current; } catch(e) { /* ignore */ }
        }
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        playPromiseRef.current = audioRef.current.play();
        
        if (playPromiseRef.current !== undefined) {
          await playPromiseRef.current;
          setIsPlaying(true);
          setIsBuffering(false);
        }
      }
    } catch (error: any) {
      console.error("Audio playback error:", error);
      // التعامل مع أخطاء الأمان أو الملفات المفقودة
      if (error.name === 'NotAllowedError') {
        console.warn("Playback blocked by browser policy. Interaction required.");
      } else {
        setHasError(true);
      }
      setIsPlaying(false);
      setIsBuffering(false);
    } finally {
      playPromiseRef.current = null;
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      if (audioRef.current.duration) {
        setProgress((current / audioRef.current.duration) * 100);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const seekTo = (val / 100) * duration;
    if (audioRef.current && isFinite(seekTo)) {
      audioRef.current.currentTime = seekTo;
      setProgress(val);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-neutral-900 to-black rounded-[2.5rem] p-8 border ${hasError ? 'border-red-500/50' : 'border-white/5'} mb-8 relative overflow-hidden group-hover:border-amber-500/30 transition-all shadow-2xl`}>
      {/* Visualizer Decoration */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-white/5">
        <div className={`h-full bg-amber-500 transition-all duration-300 ${isPlaying ? 'opacity-100 shadow-[0_0_15px_#d4af37]' : 'opacity-0'}`} style={{ width: `${progress}%` }}></div>
      </div>
      
      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={onLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        preload="none"
      />
      
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="relative">
            <button 
            onClick={togglePlay}
            disabled={(isBuffering && !isPlaying) || hasError}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-black shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform active:scale-95 z-10 relative disabled:opacity-50 ${hasError ? 'bg-red-500 shadow-red-500/20' : 'bg-amber-500'}`}
            >
            {isBuffering && !isPlaying ? (
              <i className="fas fa-spinner fa-spin text-3xl"></i>
            ) : hasError ? (
              <i className="fas fa-exclamation-triangle text-3xl text-white"></i>
            ) : (
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-3xl ${!isPlaying && 'ml-1'}`}></i>
            )}
            </button>
            {isPlaying && (
                <div className="absolute -inset-4 bg-amber-500/20 rounded-full animate-ping"></div>
            )}
        </div>
        
        <div className="text-center md:text-right flex-grow">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
            <h4 className={`text-2xl font-black ${hasError ? 'text-red-400' : 'text-white'}`}>{hasError ? 'خطأ في التحميل' : title}</h4>
            {!hasError && <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase">Original</span>}
          </div>
          <p className="text-gray-500 text-sm font-medium">{hasError ? 'يرجى التأكد من اتصال الإنترنت' : subtitle}</p>
        </div>

        <div className="flex items-end gap-1 h-8">
            {[...Array(12)].map((_, i) => (
                <div 
                key={i} 
                className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'animate-bounce bg-amber-500/60' : 'h-2 bg-white/10'}`}
                style={{ 
                    height: isPlaying ? `${Math.random() * 100 + 20}%` : '20%',
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: '0.6s'
                }}
                ></div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden group/slider">
          <div 
            className={`absolute top-0 right-0 h-full transition-all duration-100 ${hasError ? 'bg-red-500' : 'bg-gradient-to-l from-amber-600 to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.5)]'}`}
            style={{ width: `${progress}%` }}
          ></div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1"
            value={progress} 
            onChange={handleSeek}
            disabled={!audioLoaded || hasError}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
        </div>
        
        <div className="flex justify-between text-[11px] text-gray-500 font-mono font-black tracking-widest">
          <span>{formatTime(currentTime)}</span>
          <span className="text-amber-500/50 uppercase">Halabi Audio Lab • 48kHz High Quality</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const WHATSAPP_URL = "https://wa.me/905348292352";

  return (
    <section id="portfolio" className="py-32 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">معرض <span className="gold-text">الروائع</span></h2>
        <p className="text-amber-500 font-bold tracking-[0.4em] uppercase text-sm md:text-lg">توزيع وهندسة: جمعة محيميد</p>
        <div className="w-48 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-8 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* قسم الإنتاج الصوتي - الأغنية الأساسية */}
        <div className="luxury-card p-10 rounded-[3rem] group">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-4xl shadow-inner border border-amber-500/20">🎹</div>
            <div>
              <h3 className="text-3xl font-black">الإنتاج الصوتي الماستر</h3>
              <p className="text-amber-500/60 text-sm font-bold tracking-widest uppercase">Professional Audio Engineering</p>
            </div>
          </div>
          
          <CustomAudioPlayer 
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
            title='موال "يا شام"'
            subtitle="توزيع أوركسترالي + هندسة صوتية 8D بتوقيع جمعة محيميد"
          />

          <p className="text-gray-400 leading-relaxed text-lg font-light mb-8 italic border-r-4 border-amber-500/30 pr-6 text-right">
            "نقوم بتحويل الأحاسيس إلى نغمات خالدة. كل عمل ننتجه هو رحلة فريدة في عالم الصوت، نصنعها بدقة عالية لتناسب ذوقك الرفيع."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
                href={`${WHATSAPP_URL}?text=${encodeURIComponent("مرحباً جمعة، استمعت إلى موال شام وأريد طلب إنتاج أغنية خاصة بي")}`}
                target="_blank"
                rel="noreferrer"
                className="flex-grow flex items-center justify-center gap-4 px-10 py-5 bg-amber-500 text-black rounded-2xl font-black transition-all hover:scale-105 shadow-xl"
            >
                اطلب لحنك الخاص
                <i className="fas fa-music"></i>
            </a>
            <div className="px-6 py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3">
                <span className="text-amber-500 font-bold">48kHz</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400 text-xs">Hi-Res</span>
            </div>
          </div>
        </div>

        {/* نموذج الريتاتش المثالي */}
        <div className="luxury-card p-10 rounded-[3rem] group">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-4xl border border-amber-500/20">📸</div>
            <div>
              <h3 className="text-3xl font-black">ريتاتش فاشن VIP</h3>
              <p className="text-amber-500/60 text-sm font-bold uppercase tracking-widest">Digital Beauty Art</p>
            </div>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden aspect-video border border-white/10 group-hover:border-amber-500/30 transition-all mb-8 shadow-2xl">
            <div className="absolute inset-0 grid grid-cols-2">
              <div className="relative group/before">
                <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-50" alt="Original" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-[10px] font-bold border border-white/20 px-3 py-1 rounded-full">ORIGINAL</span>
                </div>
              </div>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="Retouched" />
                <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-black shadow-lg">RETUCHED</div>
              </div>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed text-lg font-light mb-8 text-right">
            تعديل احترافي للبشرة (Dodge & Burn) مع الحفاظ على المسام الطبيعية، وتنسيق ألوان سينمائي يجعل صورتك تبدو كغلاف مجلة عالمية.
          </p>

          <a 
            href={`${WHATSAPP_URL}?text=${encodeURIComponent("أريد طلب خدمة ريتاتش صور احترافية لصور الشخصية")}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-white/10"
          >
            حوّل صورك إلى تحفة فنية
          </a>
        </div>

        {/* نموذج المونتاج المثالي */}
        <div className="luxury-card p-10 rounded-[3rem] group">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-4xl border border-amber-500/20">🎬</div>
            <div>
              <h3 className="text-3xl font-black">مونتاج فيديو سينمائي</h3>
              <p className="text-amber-500/60 text-sm font-bold uppercase tracking-widest">Visual Storytelling</p>
            </div>
          </div>

          <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-black/40 mb-8 border border-white/10 relative group-hover:border-amber-500/50 transition-all flex items-center justify-center group/vid">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
             <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition-all">
               <i className="fas fa-play text-2xl ml-1"></i>
             </div>
             <div className="absolute bottom-6 right-6 flex gap-2">
                <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded">4K ULTRA HD</span>
                <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded">60 FPS</span>
             </div>
          </div>

          <p className="text-gray-400 leading-relaxed text-lg font-light mb-8 text-right">
            نقوم بدمج المؤثرات البصرية والصوتية (SFX) مع مزامنة دقيقة للإيقاع، لإنتاج فيديوهات تخطف الأنظار في أول 3 ثوانٍ.
          </p>

          <a 
            href={`${WHATSAPP_URL}?text=${encodeURIComponent("أريد طلب مونتاج فيديو احترافي لمشروعي")}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-5 bg-amber-500 text-black rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg"
          >
            ابدأ صناعة فيديوهاتك
          </a>
        </div>

        {/* نموذج الهوية المثالي */}
        <div className="luxury-card p-10 rounded-[3rem] group bg-gradient-to-br from-neutral-900 to-amber-900/10">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl border border-white/10">💎</div>
            <div>
              <h3 className="text-3xl font-black">تصميم هوية بصرية</h3>
              <p className="text-amber-500/60 text-sm font-bold uppercase tracking-widest">Identity & Branding</p>
            </div>
          </div>

          <div className="h-64 flex flex-col items-center justify-center gap-6 mb-8 relative">
            <div className="absolute inset-0 bg-amber-500/5 blur-[100px] rounded-full"></div>
            <div className="flex -space-x-12 rtl:space-x-reverse">
              <div className="w-36 h-36 bg-neutral-800 rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl rotate-[-15deg] group-hover:rotate-[-5deg] transition-all duration-700">
                <span className="text-4xl font-black gold-text">H</span>
              </div>
              <div className="w-36 h-36 bg-amber-500 rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl z-10 scale-110 group-hover:scale-125 transition-all duration-700">
                <span className="text-4xl font-black text-black">حلبي</span>
              </div>
              <div className="w-36 h-36 bg-neutral-800 rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl rotate-[15deg] group-hover:rotate-[5deg] transition-all duration-700">
                <span className="text-4xl font-black gold-text">A</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed text-lg font-light mb-8 text-right">
            بناء هوية متكاملة تتضمن الشعار، اختيار الألوان، وتصاميم السوشيال ميديا، لتعطي مشروعك هيبة ومصداقية فورية.
          </p>

          <a 
            href={`${WHATSAPP_URL}?text=${encodeURIComponent("أريد طلب تصميم هوية بصرية VIP لمشروعي الجديد")}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all text-center"
          >
            تحدث معنا حول علامتك التجارية
          </a>
        </div>

      </div>

      <div className="mt-32 text-center">
        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-amber-500 to-transparent mb-6">
            <div className="bg-black rounded-full px-6 py-2 text-xs font-black text-amber-500 uppercase tracking-widest">
                Halabi Quality Standards
            </div>
        </div>
        <p className="text-gray-500 text-sm italic font-light">"الإبداع ليس مجرد عمل، بل هو شغف نترجمه في كل مشروع." - جمعة محيميد</p>
      </div>
    </section>
  );
};

export default Portfolio;
