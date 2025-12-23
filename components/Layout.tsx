
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Music, 
  History, 
  ScanLine, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react';
import { User, ToastNotification } from '../types';
import LoadingBar from './LoadingBar';
import Toast from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  loadingProgress: number;
  isLoading: boolean;
  notifications: ToastNotification[];
  removeNotification: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, user, onLogout, loadingProgress, isLoading, notifications, removeNotification 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { path: '/instruments', label: 'เครื่องดนตรี', icon: Music },
    { path: '/scanner', label: 'สแกนยืม-คืน', icon: ScanLine },
    { path: '/history', label: 'ประวัติการใช้งาน', icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Kanit']">
      <LoadingBar progress={loadingProgress} isVisible={isLoading} />
      
      {/* Notifications Portal */}
      <div className="fixed top-6 right-6 z-[110] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto">
            <Toast notification={n} onClose={removeNotification} />
          </div>
        ))}
      </div>

      {user && (
        <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-indigo-800">
          <div className="p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2 italic">
              <Music className="text-indigo-400" /> MelodyManager
            </h1>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-950/20' 
                      : 'text-indigo-200 hover:bg-indigo-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-indigo-800/50">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border border-indigo-400">
                <UserIcon size={16} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-indigo-300 capitalize opacity-70">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-indigo-300 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {user && (
          <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between flex-shrink-0">
            <div className="md:hidden">
              <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-900 italic">
                <Music size={20} /> Melody
              </h1>
            </div>
            <div className="hidden md:block">
              <p className="text-slate-400 text-sm font-medium">Melody Instrument Service System</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full hidden sm:inline">
                {new Date().toLocaleDateString('th-TH', { 
                  weekday: 'short', 
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
              <div className="h-6 w-px bg-slate-200"></div>
              <button 
                onClick={() => navigate('/scanner')}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="สแกนบาร์โค้ด"
              >
                <ScanLine size={20} />
              </button>
            </div>
          </header>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Layout;
