
import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Instruments from './views/Instruments';
import Scanner from './views/Scanner';
import History from './views/History';
import { Instrument, BorrowRecord, User, InstrumentStatus, ToastNotification, NotificationType } from './types';
import { INITIAL_INSTRUMENTS } from './constants';
import { Music } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'admin',
      username: 'admin',
      role: 'admin',
      name: 'ผู้ดูแลระบบ'
    });
    addNotification('เข้าสู่ระบบสำเร็จ', 'success');
  };

  const handleLogout = () => {
    setUser(null);
    addNotification('ออกจากระบบแล้ว', 'info');
  };

  const handleScan = (barcode: string) => {
    const inst = instruments.find(i => i.barcode === barcode);
    if (!inst) {
      addNotification(`ไม่พบรหัส: ${barcode}`, 'error');
      return;
    }

    if (inst.status === InstrumentStatus.BORROWED) {
      setInstruments(prev => prev.map(i => i.id === inst.id ? { ...i, status: InstrumentStatus.AVAILABLE } : i));
      setHistory(prev => prev.map(h => (h.instrumentId === inst.id && h.status === 'active') ? { ...h, status: 'returned', returnDate: new Date().toISOString() } : h));
      addNotification(`คืนสำเร็จ: ${inst.name}`, 'success');
    } else {
      setInstruments(prev => prev.map(i => i.id === inst.id ? { ...i, status: InstrumentStatus.BORROWED, lastBorrowedBy: user?.name } : i));
      setHistory(prev => [{
        id: Date.now().toString(),
        instrumentId: inst.id,
        instrumentName: inst.name,
        borrowerName: user?.name || 'Admin',
        borrowDate: new Date().toISOString(),
        status: 'active'
      }, ...prev]);
      addNotification(`ยืมสำเร็จ: ${inst.name}`, 'success');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Kanit']">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md space-y-8 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <Music className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 italic pt-2">MelodyManager</h1>
            <p className="text-slate-400 font-medium">ระบบจัดการเครื่องดนตรี</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" defaultValue="admin" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Username" />
            <input type="password" defaultValue="123456" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Password" />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all">
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
        loadingProgress={100} 
        isLoading={false}
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
