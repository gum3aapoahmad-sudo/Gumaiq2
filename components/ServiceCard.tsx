
import React from 'react';
import { Service } from '../types';

interface Props {
  service: Service;
}

const ServiceCard: React.FC<Props> = ({ service }) => {
  return (
    <div className="service-card bg-neutral-900 border border-white/5 p-8 rounded-2xl transition-all flex flex-col h-full">
      <div className="text-5xl mb-6">{service.icon}</div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold">{service.title}</h3>
        {service.badge && (
          <span className="bg-amber-500/20 text-amber-500 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30">
            {service.badge}
          </span>
        )}
      </div>
      <p className="text-gray-400 mb-8 flex-grow leading-relaxed">
        {service.description}
      </p>
      <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
        <div>
          <span className="block text-gray-500 text-sm">تبدأ من</span>
          <span className="text-2xl font-black text-amber-400">{service.price}</span>
        </div>
        <a 
          href={`https://api.whatsapp.com/send?phone=905348292352&text=${encodeURIComponent(`أريد طلب خدمة: ${service.title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.087 3.389l-.694 2.54 2.603-.684c.847.509 1.835.805 2.891.805 3.181 0 5.767-2.586 5.767-5.767s-2.586-5.767-5.887-5.767zm5.105 8.125c-.229.645-1.323 1.188-1.833 1.25-.469.052-.948.115-3.042-.719-2.615-1.042-4.219-3.708-4.344-3.875-.125-.167-.938-1.25-.938-2.385 0-1.135.594-1.698.813-1.938.219-.24.479-.302.635-.302.156 0 .313 0 .448.01.146.01.344-.052.531.396.198.479.677 1.646.74 1.771.063.125.104.271.021.438-.083.167-.125.271-.25.417-.125.146-.271.323-.385.438-.135.135-.281.281-.125.552.156.271.698 1.146 1.49 1.854.604.531 1.115.708 1.417.844.292.135.458.115.625-.073.167-.188.719-.833.906-1.125.188-.292.375-.25.635-.156.26.104 1.646.771 1.927.917.281.146.469.219.542.344.073.125.073.719-.156 1.365z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
