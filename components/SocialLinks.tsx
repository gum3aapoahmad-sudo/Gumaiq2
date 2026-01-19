
import React from 'react';

const SocialLinks: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-10 mt-20 px-4">
      <a 
        href="https://wa.me/905348292352" 
        className="social-btn px-12 py-6 font-black text-xl rounded-[2.5rem] flex items-center gap-4 bg-[#25D366] text-white shadow-[0_15px_35px_rgba(37,211,102,0.3)]"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-whatsapp text-4xl"></i> 
        <span>واتساب</span>
      </a>
      
      <a 
        href="https://instagram.com/j_x_003" 
        className="social-btn px-12 py-6 font-black text-xl rounded-[2.5rem] flex items-center gap-4 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-[0_15px_35px_rgba(238,42,123,0.3)]"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-instagram text-4xl"></i> 
        <span>إنستغرام</span>
      </a>

      <a 
        href="https://tiktok.com/@halabi_4_4" 
        className="social-btn px-12 py-6 font-black text-xl rounded-[2.5rem] flex items-center gap-4 bg-black border border-white/20 text-white shadow-[0_15px_35px_rgba(255,255,255,0.1)]"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-tiktok text-4xl"></i> 
        <span>تيك توك</span>
      </a>
    </div>
  );
};

export default SocialLinks;
