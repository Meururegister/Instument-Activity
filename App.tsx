
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Add missing import for LoadingBar component used in the initial loading screen
import LoadingBar from './components/LoadingBar';
import Dashboard from './views/Dashboard';
import Instruments from './views/Instruments';
import Scanner from './views/Scanner';
import History from './views/History';
import { Instrument, BorrowRecord, User, InstrumentStatus, ToastNotification, NotificationType } from './types';
import { INITIAL_INSTRUMENTS } from './constants';
import { LogIn, Music, Loader2 } from 'lucide-react';

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

  // Simulate Initial Boot Sequence
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500);
      }
      setLoadingProgress(progress);
    }, 100);

    // Mock initial history
    setHistory([
      {
        id: 'h1',
        instrumentId: '2',
        instrumentName: 'Yamaha U1 Piano',
        borrowerName: 'สมชาย รักดี',
        borrowDate: '2023-10-25T10:30:00',
        status: 'active'
      },
      {
        id: 'h2',
        instrumentId: '1',
        instrumentName: 'Fender Stratocaster',
        borrowerName: 'ประภาส นามสกุล',
        borrowDate: '2023-10-24T09:00:00',
        returnDate: '2023-10-24T17:00:00',
        status: 'returned'
      }
    ]);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate auth loading
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
        addNotification('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ!', 'success');
      }
    }, 50);
  };

  const handleLogout = () => {
    setUser(null);
    addNotification('ออกจากระบบเรียบร้อยแล้ว', 'info');
  };

  const handleScan = (barcode: string) => {
    const instrument = instruments.find(i => i.barcode === barcode);

    if (!instrument) {
      addNotification(`ไม่พบเครื่องดนตรีรหัส ${barcode} ในฐานข้อมูล`, 'error');
      return;
    }

    if (instrument.status === InstrumentStatus.MAINTENANCE) {
      addNotification(`เครื่องดนตรี ${instrument.name} อยู่ระหว่างส่งซ่อม ไม่สามารถยืมได้`, 'warning');
      return;
    }

    if (instrument.status === InstrumentStatus.BORROWED) {
      // Logic for Returning
      setInstruments(prev => prev.map(i => 
        i.id === instrument.id 
          ? { ...i, status: InstrumentStatus.AVAILABLE, lastBorrowedBy: undefined, lastBorrowedDate: undefined }
          : i
      ));

      setHistory(prev => prev.map(h => 
        (h.instrumentId === instrument.id && h.status === 'active')
          ? { ...h, status: 'returned', returnDate: new Date().toISOString() }
          : h
      ));

      addNotification(`คืนสำเร็จ: ${instrument.name}`, 'success');
    } else {
      // Logic for Borrowing
      const borrowerName = user?.name || 'Unknown User';
      const borrowTime = new Date().toLocaleString('th-TH');

      setInstruments(prev => prev.map(i => 
        i.id === instrument.id 
          ? { ...i, status: InstrumentStatus.BORROWED, lastBorrowedBy: borrowerName, lastBorrowedDate: borrowTime }
          : i
      ));

      const newRecord: BorrowRecord = {
        id: Math.random().toString(36).substr(2, 9),
        instrumentId: instrument.id,
        instrumentName: instrument.name,
        borrowerName: borrowerName,
        borrowDate: new Date().toISOString(),
        status: 'active'
      };

      setHistory(prev => [newRecord, ...prev]);
      addNotification(`ยืมสำเร็จ: ${instrument.name} (โดย ${borrowerName})`, 'success');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Kanit']">
        <LoadingBar progress={loadingProgress} isVisible={true} />
        <div className="space-y-6 text-center animate-pulse">
           <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center">
              <Loader2 className="text-indigo-600 animate-spin" size={48} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 italic">MelodyManager</h2>
              <p className="text-slate-500 font-medium mt-1">กำลังเตรียมความพร้อมของระบบ... {Math.round(loadingProgress)}%</p>
           </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-['Kanit'] overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl"></div>

        <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-md space-y-8 relative z-10 border border-white/20 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
              <Music className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 italic tracking-tight mt-4">MelodyManager</h1>
            <p className="text-slate-500 font-medium">เข้าสู่ระบบเพื่อจัดการเครื่องดนตรี</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">ชื่อผู้ใช้</label>
                <input 
                  type="text" 
                  defaultValue="admin"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="admin"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">รหัสผ่าน</label>
                <input 
                  type="password" 
                  defaultValue="123456"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-lg transition-all transform hover:translate-y-[-2px] active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
            >
              <LogIn size={20} />
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">Music Inventory System v2.0</p>
          </div>
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
          <Route path="/scanner" element={
            <Scanner 
              instruments={instruments} 
              onScan={handleScan} 
            />
          } />
          <Route path="/history" element={<History history={history} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
