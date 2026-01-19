
import React, { useState, useRef } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        if (playPromiseRef.current !== null) {
          await playPromiseRef.current;
        }
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        playPromiseRef.current = audioRef.current.play();
        if (playPromiseRef.current !== undefined) {
          await playPromiseRef.current;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.log("Background music blocked or interrupted:", error);
      setIsPlaying(false);
    } finally {
      playPromiseRef.current = null;
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <audio ref={audioRef} loop preload="none">
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3#t=54,114" type="audio/mpeg" />
      </audio>
      <button 
        onClick={toggleMusic}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl ${isPlaying ? 'bg-amber-500 text-black animate-pulse' : 'bg-white/10 text-white backdrop-blur-md border border-white/10'}`}
        title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      >
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
      </button>
    </div>
  );
};

export default BackgroundMusic;
