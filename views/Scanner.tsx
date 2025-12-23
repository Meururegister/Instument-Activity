
import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, CheckCircle2, AlertCircle, Camera, Search } from 'lucide-react';
import { Instrument, InstrumentStatus } from '../types';

interface ScannerProps {
  instruments: Instrument[];
  onScan: (barcode: string) => void;
  message?: string;
  error?: string;
}

const Scanner: React.FC<ScannerProps> = ({ instruments, onScan, message, error }) => {
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
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">สแกนยืม-คืน</h2>
        <p className="text-slate-500 mt-2">สแกนบาร์โค้ดที่ติดอยู่กับเครื่องดนตรีเพื่อดำเนินการ</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Scanner Simulation / Visual */}
        <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-8 group">
          {isCameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <Camera size={64} className="opacity-20" />
              <button 
                onClick={() => setIsCameraActive(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition-all shadow-lg shadow-indigo-200"
              >
                เปิดกล้องเพื่อสแกน
              </button>
            </div>
          )}
          
          {/* Overlay scanning animation */}
          {isCameraActive && (
            <div className="absolute inset-0 border-2 border-indigo-500 rounded-2xl pointer-events-none overflow-hidden">
               <div className="w-full h-1 bg-indigo-500 absolute animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          )}
        </div>

        {/* Message / Status */}
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3 border border-emerald-100">
            <CheckCircle2 size={20} />
            <p className="font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">หรือใส่รหัสด้วยตัวเอง</span>
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
                placeholder="ป้อนรหัสบาร์โค้ด (เช่น GTR-001)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              ยืนยัน
            </button>
          </form>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-500 font-bold uppercase mb-1">สาธิตการทำงาน</p>
                <p className="text-xs text-indigo-700">รหัสตัวอย่าง: GTR-001, GTR-002, PNO-001</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">เคล็ดลับ</p>
                <p className="text-xs text-slate-500">สแกนรหัสเพื่อทำรายการทันที</p>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
