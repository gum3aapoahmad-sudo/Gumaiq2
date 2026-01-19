
import React from 'react';

const Hero: React.FC = () => {
  const WHATSAPP_URL = "https://wa.me/905348292352";
  const HERO_IMG = "https://files.oaiusercontent.com/file-NAnw5x4qL9B7qX8N3r8N2T";

  return (
    <section id="hero" className="relative pt-48 pb-32 px-4 overflow-hidden text-right">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none opacity-50"></div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-black mb-10 tracking-widest">
          <img 
            src={HERO_IMG} 
            className="w-6 h-6 rounded-full border border-amber-500/50 object-cover" 
            alt="جمعة محيميد" 
          />
          بإدارة المبدع: جمعة محيميد
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black mb-10 leading-none tracking-tighter">
          <span className="block mb-4 text-white opacity-90">حلبي للخدمات</span>
          <span className="gold-text">إبداع بلا حدود</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-400 mb-14 leading-relaxed max-w-4xl mx-auto font-light">
          نحول رؤيتك إلى واقع ملموس. جودة استثنائية في الهندسة الصوتية، تعديل الصور، والمونتاج الفني تحت إشراف نخبة من المبدعين السوريين.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <a 
            href={WHATSAPP_URL} 
            target="_blank"
            rel="noreferrer"
            className="px-12 py-6 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-[2rem] text-xl transition-all shadow-[0_15px_40px_rgba(212,175,55,0.4)] transform hover:scale-105 active:scale-95"
          >
            اطلب خدمتك الآن
          </a>
          <a 
            href="#portfolio"
            className="px-12 py-6 bg-white/5 border border-white/10 hover:border-amber-500/50 rounded-[2rem] text-xl text-white font-bold transition-all backdrop-blur-xl hover:bg-white/10"
          >
            شاهد معرض الأعمال
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
