
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black gold-text">حلبي للخدمات</span>
          </div>
          <div className="hidden md:block">
            <div className="flex space-x-8 space-x-reverse">
              <a href="#hero" className="hover:text-amber-400 transition-colors">الرئيسية</a>
              <a href="#services" className="hover:text-amber-400 transition-colors">الخدمات</a>
              <a href="#contact" className="hover:text-amber-400 transition-colors">اتصل بنا</a>
            </div>
          </div>
          <div>
            <a 
              href="https://wa.me/905348292352" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105"
            >
              اطلب الآن
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
