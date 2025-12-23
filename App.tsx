
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Instruments from './views/Instruments';
import Scanner from './views/Scanner';
import History from './views/History';
import { Instrument, BorrowRecord, User, InstrumentStatus } from './types';
import { INITIAL_INSTRUMENTS } from './constants';
import { LogIn, Music } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [scannerMessage, setScannerMessage] = useState<string | undefined>();
  const [scannerError, setScannerError] = useState<string | undefined>();

  // Mock initial history
  useEffect(() => {
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
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    setUser({
      id: 'admin1',
      username: 'admin',
      role: 'admin',
      name: 'อาจารย์ผู้ดูแล'
    });
  };

  const handleLogout = () => setUser(null);

  const handleScan = (barcode: string) => {
    setScannerMessage(undefined);
    setScannerError(undefined);

    const instrument = instruments.find(i => i.barcode === barcode);

    if (!instrument) {
      setScannerError(`ไม่พบเครื่องดนตรีรหัส ${barcode} ในฐานข้อมูล`);
      return;
    }

    if (instrument.status === InstrumentStatus.MAINTENANCE) {
      setScannerError(`เครื่องดนตรี ${instrument.name} อยู่ระหว่างส่งซ่อม ไม่สามารถยืมได้`);
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

      setScannerMessage(`คืนสำเร็จ: ${instrument.name}`);
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
      setScannerMessage(`ยืมสำเร็จ: ${instrument.name} (โดย ${borrowerName})`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
              <Music className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 italic">MelodyManager</h1>
            <p className="text-slate-500 font-medium">เข้าสู่ระบบเพื่อจัดการเครื่องดนตรี</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">ชื่อผู้ใช้</label>
                <input 
                  type="text" 
                  defaultValue="admin"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">รหัสผ่าน</label>
                <input 
                  type="password" 
                  defaultValue="123456"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl"
            >
              <LogIn size={20} />
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">โรงเรียนดนตรีของเรา</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard instruments={instruments} history={history} />} />
          <Route path="/instruments" element={<Instruments instruments={instruments} />} />
          <Route path="/scanner" element={
            <Scanner 
              instruments={instruments} 
              onScan={handleScan} 
              message={scannerMessage} 
              error={scannerError} 
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
