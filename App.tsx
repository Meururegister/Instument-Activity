
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
import { Music, Loader2 } from 'lucide-react';

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

  // ระบบโหลดเริ่มต้น - ปรับให้สั้นลงและแม่นยำขึ้น
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingProgress(100);
      setIsLoading(false);
    }, 800); // โหลดเร็วๆ เพื่อป้องกันการค้าง
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'admin-01',
      username: 'admin',
      role: 'admin',
      name: 'ผู้ดูแลระบบเครื่องดนตรี'
    });
    addNotification('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ', 'success');
  };

  const handleLogout = () => {
    setUser(null);
    addNotification('ออกจากระบบเรียบร้อยแล้ว', 'info');
  };

  const handleScan = (barcode: string) => {
    const instrument = instruments.find(i => i.barcode === barcode);
    if (!instrument) {
      addNotification(`ไม่พบข้อมูลสำหรับรหัส: ${barcode}`, 'error');
      return;
    }

    if (instrument.status === InstrumentStatus.MAINTENANCE) {
      addNotification(`${instrument.name} กำลังซ่อมบำรุง ไม่สามารถยืมได้`, 'warning');
      return;
    }

    if (instrument.status === InstrumentStatus.BORROWED) {
      // คืนเครื่อง
      setInstruments(prev => prev.map(i => 
        i.id === instrument.id ? { ...i, status: InstrumentStatus.AVAILABLE } : i
      ));
      setHistory(prev => prev.map(h => 
        (h.instrumentId === instrument.id && h.status === 'active')
          ? { ...h, status: 'returned', returnDate: new Date().toISOString() } : h
      ));
      addNotification(`คืน ${instrument.name} สำเร็จ`, 'success');
    } else {
      // ยืมเครื่อง
      setInstruments(prev => prev.map(i => 
        i.id === instrument.id ? { ...i, status: InstrumentStatus.BORROWED, lastBorrowedBy: user?.name } : i
      ));
      const newRecord: BorrowRecord = {
        id: Date.now().toString(),
        instrumentId: instrument.id,
        instrumentName: instrument.name,
        borrowerName: user?.name || 'User',
        borrowDate: new Date().toISOString(),
        status: 'active'
      };
      setHistory(prev => [newRecord, ...prev]);
      addNotification(`ยืม ${instrument.name} สำเร็จ`, 'success');
    }
  };

  // หน้าจอตอนกำลังโหลด
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
           <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Music className="text-white" size={32} />
           </div>
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">MelodyManager</h2>
           <div className="flex items-center justify-center gap-2 text-indigo-500 font-medium">
             <Loader2 size={18} className="animate-spin" />
             <span>กำลังเข้าสู่ระบบ...</span>
           </div>
        </div>
      </div>
    );
  }

  // หน้า Login
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Kanit']">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md space-y-8 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Music className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 italic pt-2">MelodyManager</h1>
            <p className="text-slate-400 font-medium">เข้าสู่ระบบเพื่อจัดการเครื่องดนตรี</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <input type="text" defaultValue="admin" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" defaultValue="123456" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium mt-1" />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95">
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
