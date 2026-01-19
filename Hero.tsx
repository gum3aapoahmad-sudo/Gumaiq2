
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="block mb-2 text-white">حلبي للخدمات</span>
          <span className="gold-text">عالم من الإبداع الرقمي بين يديك</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          هل تبحث عن التميز؟ نحن نوفر لك خدمات رقمية متكاملة داخل سوريا. 
          من الإنتاج الصوتي المخصص، وتعديل الصور الاحترافي، إلى تصميم المواقع ومونتاج الفيديو.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="#services" 
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-lg text-lg transition-all"
          >
            تصفح خدماتنا الآن
          </a>
          <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg text-lg text-white">
            جودة عالمية، أسعار محلية
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
