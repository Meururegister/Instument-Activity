
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: 'border-emerald-100 bg-emerald-50',
    error: 'border-rose-100 bg-rose-50',
    warning: 'border-amber-100 bg-amber-50',
    info: 'border-blue-100 bg-blue-50',
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-lg animate-in slide-in-from-right duration-300 max-w-sm w-full ${bgColors[notification.type]}`}>
      <div className="flex-shrink-0">{icons[notification.type]}</div>
      <p className="flex-1 text-sm font-medium text-slate-800">{notification.message}</p>
      <button 
        onClick={() => onClose(notification.id)}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
