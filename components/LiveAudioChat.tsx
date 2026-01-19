
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { canUseAI, incrementAIUsage } from '../utils/usageLimit';

const LiveAudioChat: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  let nextStartTime = 0;

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startSession = async () => {
    if (!canUseAI()) {
      alert("لقد استنفدت محاولاتك المجانية اليوم. عد غداً لمزيد من الإبداع!");
      return;
    }

    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            incrementAIUsage(); // Count this as one use
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              nextStartTime = Math.max(nextStartTime, audioContextRef.current.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (msg.serverContent?.outputTranscription) {
               setTranscript(prev => [...prev.slice(-4), `المساعد: ${msg.serverContent!.outputTranscription!.text}`]);
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => console.error("Live API Error", e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "أنت المساعد الصوتي لشركة حلبي للخدمات الرقمية. تحدث بلهجة عربية مهذبة.",
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (sourcesRef.current) {
        sourcesRef.current.forEach(s => {
            try { s.stop(); } catch(e) {}
        });
        sourcesRef.current.clear();
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  return (
    <div className="fixed bottom-6 right-24 z-50">
      <button 
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl ${
          isActive ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:scale-105'
        } text-white disabled:opacity-50`}
      >
        <i className={`fas ${isConnecting ? 'fa-spinner fa-spin' : isActive ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
      </button>
      {isActive && (
        <div className="absolute bottom-16 right-0 w-64 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-[10px] text-gray-300">
          <div className="font-bold text-amber-500 mb-2">مكالمة نشطة...</div>
          <div className="space-y-1">
            {transcript.map((t, i) => <div key={i}>{t}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAudioChat;
