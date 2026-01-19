
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-neutral-900 pt-20 pb-10 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-right">
          <div>
            <h4 className="text-2xl font-black gold-text mb-6">حلبي للخدمات الرقمية</h4>
            <p className="text-gray-400 leading-relaxed">
              بإدارة المبدع جمعة محيميد. نسعى دائماً لتقديم الأفضل في عالم الإنتاج الرقمي من قلب سوريا وإلى العالم أجمع.
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6">معلومات الدفع المعتمدة</h4>
            <div className="bg-black/40 p-6 rounded-2xl border border-blue-500/20 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">💳</span>
                <span className="text-xl font-black text-blue-400">شام كاش - Sham Cash</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 font-mono break-all leading-relaxed">
                ID: 5700883ba54c1ab80c6b78530e9a3646
              </p>
              <p className="text-xs text-gray-400">
                يرجى التواصل لتأكيد التحويل قبل وبعد العملية لضمان سرعة التنفيذ.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">قنوات التواصل</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-4 group">
                <span className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">📞</span>
                <span className="font-bold">
                  <a href="https://api.whatsapp.com/send?phone=905348292352" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500">+905348292352 (جمعة محيميد)</a>
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">📧</span>
                <span className="font-bold">Gum3aapoahmad@gmail.com</span>
              </li>
              <li className="flex gap-6 mt-8">
                <a href="https://api.whatsapp.com/send?phone=905348292352" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-green-500 transition-colors"><i className="fab fa-whatsapp"></i></a>
                <a href="https://instagram.com/j_x_003" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-pink-500 transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="https://tiktok.com/@halabi_4_4" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-white transition-colors"><i className="fab fa-tiktok"></i></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} حلبي للخدمات الرقمية. جميع الحقوق محفوظة لـ جمعة محيميد.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
