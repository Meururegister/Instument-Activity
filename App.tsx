
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingBar from './components/LoadingBar';
import Dashboard from './views/Dashboard';
import Instruments from './views/Instruments';
import Scanner from './views/Scanner';
import History from './views/History';
import { Instrument, BorrowRecord, User, InstrumentStatus, ToastNotification, NotificationType } from './types';
import { INITIAL_INSTRUMENTS } from './constants';
import { LogIn, Music, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  
  // Loading & Notification State
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [bootError, setBootError] = useState<string | null>(null);

  const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Simulate Initial Boot Sequence with Progress %
  useEffect(() => {
    let progress = 0;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      // เพิ่มความเร็วแบบสุ่มเพื่อให้ดูสมจริง
      const increment = Math.random() * 10;
      progress = Math.min(progress + increment, 99);
      setLoadingProgress(progress);
      
      // ตรวจสอบว่านานเกินไปหรือไม่ (Timeout)
      if (Date.now() - startTime > 10000) {
        clearInterval(interval);
        setBootError("การเชื่อมต่อฐานข้อมูลใช้เวลานานผิดปกติ");
      }
    }, 150);

    // จำลองการโหลดข้อมูลเสร็จสิ้น
    const timer = setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 400);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);
    
    let p = 0;
    const inv = setInterval(() => {
      p += 25;
      setLoadingProgress(p);
      if (p >= 100) {
        clearInterval(inv);
        setUser({
          id: 'admin1',
          username: 'admin',
          role: 'admin',
          name: 'อาจารย์ผู้ดูแลระบบ'
        });
        setIsLoading(false);
        addNotification('ยินดีต้อนรับกลับเข้าสู่ระบบ!', 'success');
      }
    }, 100);
  };

  const handleLogout = () => {
    setUser(null);
    addNotification('คุณออกจากระบบแล้ว', 'info');
  };

  const handleScan = (barcode: string) => {
    try {
      const instrument = instruments.find(i => i.barcode === barcode);

      if (!instrument) {
        addNotification(`ไม่พบเครื่องดนตรีรหัส ${barcode}`, 'error');
        return;
      }

      if (instrument.status === InstrumentStatus.MAINTENANCE) {
        addNotification(`${instrument.name} กำลังซ่อมแซม`, 'warning');
        return;
      }

      if (instrument.status === InstrumentStatus.BORROWED) {
        setInstruments(prev => prev.map(i => 
          i.id === instrument.id ? { ...i, status: InstrumentStatus.AVAILABLE } : i
        ));
        setHistory(prev => prev.map(h => 
          (h.instrumentId === instrument.id && h.status === 'active')
            ? { ...h, status: 'returned', returnDate: new Date().toISOString() } : h
        ));
        addNotification(`รับคืน: ${instrument.name} เรียบร้อย`, 'success');
      } else {
        setInstruments(prev => prev.map(i => 
          i.id === instrument.id ? { ...i, status: InstrumentStatus.BORROWED, lastBorrowedBy: user?.name } : i
        ));
        const newRecord: BorrowRecord = {
          id: Date.now().toString(),
          instrumentId: instrument.id,
          instrumentName: instrument.name,
          borrowerName: user?.name || 'Unknown',
          borrowDate: new Date().toISOString(),
          status: 'active'
        };
        setHistory(prev => [newRecord, ...prev]);
        addNotification(`ยืมสำเร็จ: ${instrument.name}`, 'success');
      }
    } catch (err) {
      addNotification("เกิดข้อผิดพลาดในการประมวลผลข้อมูลสแกน", "error");
    }
  };

  // Error State Screen
  if (bootError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center font-['Kanit']">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ขออภัย ระบบขัดข้อง</h1>
        <p className="text-slate-500 mt-2 max-w-sm">{bootError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200"
        >
          รีโหลดหน้าเว็บ
        </button>
      </div>
    );
  }

  // Initial Loading Screen with Progress
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Kanit']">
        <LoadingBar progress={loadingProgress} isVisible={true} />
        <div className="space-y-8 text-center">
           <div className="relative inline-block">
              <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl border border-indigo-50 flex items-center justify-center">
                <Music className="text-indigo-600 animate-bounce" size={40} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                {Math.round(loadingProgress)}%
              </div>
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 italic tracking-tight">MelodyManager</h2>
              <div className="flex items-center justify-center gap-2 text-slate-400 mt-2 font-medium">
                <Loader2 className="animate-spin" size={16} />
                <span>กำลังเตรียมข้อมูลเครื่องดนตรี...</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-['Kanit'] relative overflow-hidden">
        <LoadingBar progress={loadingProgress} isVisible={isLoading} />
        <div className="absolute top-0 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md space-y-8 relative z-10 border border-white/20">
          <div className="text-center space-y-3">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/40">
              <Music className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 italic tracking-tight pt-2">MelodyManager</h1>
            <p className="text-slate-500 font-medium italic opacity-80">Sign in to start your session</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-black text-slate-700 ml-1">USERNAME</label>
                <input type="text" defaultValue="admin" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-black text-slate-700 ml-1">PASSWORD</label>
                <input type="password" defaultValue="123456" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        loadingProgress={loadingProgress} 
        isLoading={isLoading}
        notifications={notifications}
        removeNotification={removeNotification}
      >
        <Routes>
          <Route path="/" element={<Dashboard instruments={instruments} history={history} />} />
          <Route path="/instruments" element={<Instruments instruments={instruments} />} />
          <Route path="/scanner" element={<Scanner instruments={instruments} onScan={handleScan} />} />
          <Route path="/history" element={<History history={history} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
