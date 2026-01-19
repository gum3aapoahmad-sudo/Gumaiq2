
import React, { useState, useRef } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("User interaction required for autoplay"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3#t=54,114" type="audio/mpeg" />
      </audio>
      <button 
        onClick={toggleMusic}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-amber-500 text-black animate-pulse' : 'bg-white/10 text-white'}`}
        title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      >
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
      </button>
    </div>
  );
};

export default BackgroundMusic;
