
import React from 'react';

const Navbar: React.FC = () => {
  // استخدام الصورة التي تنظر للكاميرا كأيقونة رسمية
  const LOGO_IMG = "https://files.oaiusercontent.com/file-NAnw5x4qL9B7qX8N3r8N2T"; // رابط افتراضي للصورة المعالجة

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500 to-yellow-200 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://files.oaiusercontent.com/file-NAnw5x4qL9B7qX8N3r8N2T" 
                alt="جمعة محيميد" 
                className="relative w-12 h-12 rounded-full border-2 border-amber-500/50 object-cover grayscale-[0.3] hover:grayscale-0 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              />
            </div>
            <span className="text-xl md:text-2xl font-black gold-text tracking-tighter">حلبي للخدمات</span>
          </div>
          <div className="hidden md:block">
            <div className="flex space-x-8 space-x-reverse font-bold text-sm">
              <a href="#hero" className="hover:text-amber-400 transition-colors uppercase tracking-widest">الرئيسية</a>
              <a href="#services" className="hover:text-amber-400 transition-colors uppercase tracking-widest">الخدمات</a>
              <a href="#portfolio" className="hover:text-amber-400 transition-colors uppercase tracking-widest">الأعمال</a>
              <a href="#contact" className="hover:text-amber-400 transition-colors uppercase tracking-widest">اتصل بنا</a>
            </div>
          </div>
          <div>
            <a 
              href="https://api.whatsapp.com/send?phone=905348292352" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full text-xs font-black transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <i className="fab fa-whatsapp"></i>
              تواصل الآن
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
