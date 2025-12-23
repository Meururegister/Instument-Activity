
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

  const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // เสถียรขึ้น: ลำดับการโหลดที่แน่นอน
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress > 100) {
        clearInterval(interval);
        setLoadingProgress(100);
        setTimeout(() => setIsLoading(false), 300);
      } else {
        setLoadingProgress(currentProgress);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);
    
    let p = 0;
    const inv = setInterval(() => {
      p += 20;
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
        addNotification('เข้าสู่ระบบสำเร็จ!', 'success');
      }
    }, 50);
  };

  const handleLogout = () => {
    setUser(null);
    addNotification('ออกจากระบบแล้ว', 'info');
  };

  const handleScan = (barcode: string) => {
    try {
      const instrument = instruments.find(i => i.barcode === barcode);
      if (!instrument) {
        addNotification(`ไม่พบข้อมูล: ${barcode}`, 'error');
        return;
      }

      if (instrument.status === InstrumentStatus.MAINTENANCE) {
        addNotification(`${instrument.name} กำลังซ่อมแซม`, 'warning');
        return;
      }

      if (instrument.status === InstrumentStatus.BORROWED) {
        setInstruments(prev => prev.map(i => i.id === instrument.id ? { ...i, status: InstrumentStatus.AVAILABLE } : i));
        setHistory(prev => prev.map(h => (h.instrumentId === instrument.id && h.status === 'active') ? { ...h, status: 'returned', returnDate: new Date().toISOString() } : h));
        addNotification(`คืนสำเร็จ: ${instrument.name}`, 'success');
      } else {
        setInstruments(prev => prev.map(i => i.id === instrument.id ? { ...i, status: InstrumentStatus.BORROWED, lastBorrowedBy: user?.name } : i));
        const newRecord: BorrowRecord = {
          id: Date.now().toString(),
          instrumentId: instrument.id,
          instrumentName: instrument.name,
          borrowerName: user?.name || 'Anonymous',
          borrowDate: new Date().toISOString(),
          status: 'active'
        };
        setHistory(prev => [newRecord, ...prev]);
        addNotification(`ยืมสำเร็จ: ${instrument.name}`, 'success');
      }
    } catch (e) {
      addNotification("เกิดข้อผิดพลาดในการทำรายการ", "error");
    }
  };

  // Loading Screen
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-['Kanit']">
        <LoadingBar progress={loadingProgress} isVisible={true} />
        <div className="space-y-6 text-center">
           <div className="bg-indigo-50 w-24 h-24 rounded-[30px] flex items-center justify-center mx-auto shadow-inner">
              <Music className="text-indigo-600 animate-pulse" size={48} />
           </div>
           <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">MelodyManager</h2>
              <div className="flex items-center justify-center gap-2 text-indigo-500 font-bold">
                 <Loader2 size={16} className="animate-spin" />
                 <span>{Math.round(loadingProgress)}%</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Kanit']">
        <LoadingBar progress={loadingProgress} isVisible={isLoading} />
        <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md space-y-8 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Music className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 italic">MelodyManager</h1>
            <p className="text-slate-400 text-sm">เข้าสู่ระบบเพื่อใช้งาน</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" defaultValue="admin" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="ชื่อผู้ใช้" />
            <input type="password" defaultValue="123456" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="รหัสผ่าน" />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95">เข้าสู่ระบบ</button>
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
