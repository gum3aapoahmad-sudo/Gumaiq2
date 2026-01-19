
import React from 'react';

const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-32 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-7xl font-black mb-6">معرض الإبداع</h2>
        <p className="text-amber-500 font-bold tracking-[0.3em] uppercase text-lg">بصمة المبدع جمعة محيميد</p>
        <div className="w-32 h-1.5 bg-amber-500 mx-auto mt-6 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* YouTube Section */}
        <div className="luxury-card p-10 rounded-[3rem] group overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl">🎵</div>
              <h3 className="text-3xl font-black">أحدث الإنتاجات الصوتية</h3>
            </div>
            <span className="px-4 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">توزيع جمعة محيميد</span>
          </div>
          <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative group-hover:border-amber-500/30 transition-all duration-500">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/ugIQwJdjb34?start=0&end=60" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-8 text-gray-400 leading-relaxed text-lg font-light italic">
            "استمع إلى دقيقة من الإبداع في التوزيع والمواويل. نحن نصنع لك صوتاً يليق بمقامك."
          </p>
          <a 
            href="https://wa.me/905348292352?text=أريد طلب إنتاج صوتي مثل العمل في يوتيوب" 
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-amber-500 text-black font-black hover:scale-105 transition-all"
          >
            اطلب أغنيتك الآن
            <i className="fas fa-arrow-left"></i>
          </a>
        </div>

        {/* Photo Editing Section */}
        <div className="luxury-card p-10 rounded-[3rem] group">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl">🎨</div>
            <h3 className="text-3xl font-black">احترافية الصور (فاشن)</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 relative">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] group-hover:opacity-40 transition-opacity">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=600&auto=format&fit=crop" alt="Before" className="w-full h-full object-cover grayscale blur-[1px]" />
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase">قبل التعديل</div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] border-2 border-amber-500/50 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=600&auto=format&fit=crop" alt="After" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase">بعد التعديل الاحترافي</div>
            </div>
          </div>
          <p className="mt-8 text-gray-400 leading-relaxed text-lg font-light">
            نحول صورك الشخصية إلى صور فاشن وموديل احترافية تناسب أرقى المجلات والحسابات الرسمية.
          </p>
          <div className="mt-6 flex gap-4">
             <span className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">تعديل ملامح</span>
             <span className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">تنسيق ألوان</span>
             <span className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">خلفيات سينمائية</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
