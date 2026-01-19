
import React, { useState, useRef, useEffect } from 'react';
import { generalChat } from '../services/gemini';
import { canUseAI, incrementAIUsage, getRemainingUses } from '../utils/usageLimit';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'مرحباً بك! أنا مساعد حلبي الذكي. كيف يمكنني خدمتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [remaining, setRemaining] = useState(getRemainingUses());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!canUseAI()) {
      setMessages(prev => [...prev, { role: 'bot', text: 'لقد استنفدت محاولاتك المجانية لليوم. نراك غداً!' }]);
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const botResponse = await generalChat(userMsg);
    incrementAIUsage();
    setRemaining(getRemainingUses());
    
    setMessages(prev => [...prev, { role: 'bot', text: botResponse || "عذراً، حدث خطأ." }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-black text-2xl shadow-2xl hover:scale-110 transition-all border-4 border-black/20"
        >
          <i className="fas fa-comment-dots"></i>
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] md:w-[400px] h-[500px] bg-neutral-900 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-6 border-b border-white/5 bg-neutral-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">ح</div>
              <div>
                <h3 className="font-bold text-lg">مساعد حلبي</h3>
                <p className="text-[10px] text-amber-500">متبقي: {remaining} / 2</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-gray-200 border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-xs animate-pulse">جاري الكتابة...</div>}
          </div>

          <div className="p-4 border-t border-white/5 bg-neutral-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={remaining > 0 ? "اكتب سؤالك هنا..." : "انتهت المحاولات"}
              disabled={remaining === 0}
              className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus:ring-1 focus:ring-amber-500 outline-none text-sm disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={remaining === 0}
              className="w-10 h-10 bg-amber-500 text-black rounded-xl flex items-center justify-center hover:bg-amber-600 disabled:bg-neutral-700"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
