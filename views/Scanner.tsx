
import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, CheckCircle2, AlertCircle, Camera, Search, Sparkles } from 'lucide-react';
import { Instrument } from '../types';

interface ScannerProps {
  instruments: Instrument[];
  onScan: (barcode: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ instruments, onScan }) => {
  const [manualCode, setManualCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    if (isCameraActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
          <Sparkles size={14} />
          AI Scanning Ready
        </div>
        <h2 className="text-3xl font-black text-slate-800">สแกนยืม-คืน</h2>
        <p className="text-slate-500 mt-2">วางบาร์โค้ดให้อยู่ในกรอบเพื่อทำรายการอัตโนมัติ</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl shadow-indigo-900/5 border border-slate-100">
        {/* Camera Container */}
        <div className="relative aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden mb-8 border-4 border-slate-100 shadow-inner group">
          {isCameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-6">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                <Camera size={40} className="opacity-40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-500">ปิดใช้งานกล้องอยู่</p>
                <button 
                  onClick={() => setIsCameraActive(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 transform hover:scale-105 active:scale-95"
                >
                  เปิดใช้งานกล้อง
                </button>
              </div>
            </div>
          )}
          
          {/* Scanning Overlay UI */}
          {isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-64 h-32 border-2 border-indigo-400/50 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
                
                <div className="w-full h-0.5 bg-indigo-500 absolute top-1/2 left-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_8px_#6366f1]"></div>
              </div>
              <p className="mt-8 text-white/60 text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur px-4 py-1.5 rounded-full">
                Scanning for barcode...
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manual Input</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="ป้อนรหัส (เช่น GTR-001)"
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-slate-900/10 active:scale-95"
            >
              ดำเนินการ
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <div className="mt-1"><Sparkles className="text-indigo-500" size={16} /></div>
                <div>
                  <p className="text-xs text-indigo-700 font-bold uppercase mb-0.5">รหัสตัวอย่าง</p>
                  <p className="text-[10px] text-indigo-600/70 font-mono">GTR-001, GTR-002, PNO-001</p>
                </div>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <div className="mt-1"><AlertCircle className="text-slate-400" size={16} /></div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">การทำงาน</p>
                  <p className="text-[10px] text-slate-400/70">สแกนซ้ำที่เดิมเพื่อ "คืน" เครื่องดนตรี</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-3.5rem); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(3.5rem); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
