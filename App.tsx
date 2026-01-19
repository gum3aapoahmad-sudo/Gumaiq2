
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCard from './components/ServiceCard';
import GeminiAssistant from './components/GeminiAssistant';
import Footer from './components/Footer';
import BackgroundMusic from './components/BackgroundMusic';
import SocialLinks from './components/SocialLinks';
import Portfolio from './components/Portfolio';
import ChatBot from './components/ChatBot';
import LiveAudioChat from './components/LiveAudioChat';
import { SERVICES } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 selection:bg-amber-500 selection:text-black">
      <Navbar />
      <BackgroundMusic />
      
      {/* AI Interactivity */}
      <ChatBot />
      <LiveAudioChat />
      
      <main>
        <Hero />
        
        {/* Rapid Contact Bar */}
        <section className="py-16 relative overflow-hidden bg-neutral-900/10">
          <div className="max-w-7xl mx-auto text-center px-4 relative z-10">
             <h3 className="text-gray-500 font-black mb-12 uppercase tracking-[0.5em] text-sm opacity-60">تواصل مباشر مع جمعة محيميد</h3>
             <SocialLinks />
          </div>
        </section>

        {/* Sham Cash Trust Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto luxury-card rounded-[3rem] p-12 border-amber-500/20 shadow-[0_0_50px_rgba(212,175,55,0.05)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-5xl mb-2">💳</div>
              <h3 className="text-3xl md:text-5xl font-black gold-text">دفع آمن وسريع (شام كاش)</h3>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                ندعم خدمة التحويل المباشر داخل سوريا عبر تطبيق <span className="text-white font-bold">Sham Cash</span>. المعرف الرسمي الوحيد لخدماتنا:
              </p>
              <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-white/10 w-full font-mono text-amber-500 text-sm md:text-lg break-all shadow-inner tracking-tighter">
                ID: 5700883ba54c1ab80c6b78530e9a3646
              </div>
              <span className="text-xs text-gray-600 mt-2 uppercase tracking-widest font-bold">يرجى التأكد من المعرف قبل التحويل</span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-32 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">خدماتنا المميزة</h2>
            <div className="w-32 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
            <p className="mt-8 text-gray-400 max-w-2xl mx-auto text-xl font-light">باقات متكاملة تحت إشراف مباشر لضمان أعلى جودة في السوق السوري.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* AI Labs Section */}
        <section id="ai-lab" className="py-32 px-4 bg-gradient-to-b from-transparent to-neutral-900/20">
          <div className="text-center mb-16">
            <h3 className="text-amber-500 font-black tracking-widest uppercase mb-4">مختبرات حلبي للذكاء الاصطناعي</h3>
            <h2 className="text-4xl md:text-6xl font-black">أدوات إبداعية بلا حدود</h2>
          </div>
          <GeminiAssistant />
        </section>

        {/* Portfolio Showcase */}
        <Portfolio />

        {/* Why Us Section */}
        <section className="py-32 px-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="luxury-card rounded-[4rem] p-16 flex flex-col lg:flex-row items-center gap-24 relative overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full"></div>
              
              <div className="lg:w-1/2">
                <h3 className="text-5xl md:text-7xl font-black mb-12 leading-tight">لماذا نحن؟</h3>
                <div className="space-y-12">
                  <div className="flex items-start gap-8 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500 flex items-center justify-center text-black text-2xl font-black shrink-0 shadow-[0_10px_25px_rgba(212,175,55,0.4)] transition-all group-hover:scale-110">١</div>
                    <div>
                      <h4 className="text-2xl font-black mb-3">احترافية جمعة محيميد</h4>
                      <p className="text-gray-400 text-lg leading-relaxed">خبرة سنوات في الهندسة الصوتية والتوزيع الفني تضمن لك عملاً فريداً ومميزاً.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-8 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500 flex items-center justify-center text-black text-2xl font-black shrink-0 shadow-[0_10px_25px_rgba(212,175,55,0.4)] transition-all group-hover:scale-110">٢</div>
                    <div>
                      <h4 className="text-2xl font-black mb-3">أمان في المعاملات</h4>
                      <p className="text-gray-400 text-lg leading-relaxed">نحن علامة مسجلة وموثوقة، وخدمة شام كاش توفر لك سهولة تامة في الدفع والتحويل.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-8 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500 flex items-center justify-center text-black text-2xl font-black shrink-0 shadow-[0_10px_25px_rgba(212,175,55,0.4)] transition-all group-hover:scale-110">٣</div>
                    <div>
                      <h4 className="text-2xl font-black mb-3">دعم فني 24/7</h4>
                      <p className="text-gray-400 text-lg leading-relaxed">تواصل مباشر وسريع للرد على كافة التعديلات والاستفسارات لضمان رضاكم التام.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                 <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full"></div>
                 <img 
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800" 
                    alt="Audio Production" 
                    className="relative rounded-[3rem] shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-[1.02] aspect-square object-cover" 
                 />
                 <div className="absolute -bottom-8 -left-8 bg-amber-500 text-black p-8 rounded-[2rem] font-black text-center shadow-2xl">
                    <span className="block text-4xl">100%</span>
                    <span className="text-sm uppercase tracking-widest">ضمان الجودة</span>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
