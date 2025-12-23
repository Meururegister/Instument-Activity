
import React from 'react';
import { BorrowRecord } from '../types';
import { Calendar, User, Tag } from 'lucide-react';

interface HistoryProps {
  history: BorrowRecord[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">ประวัติการใช้งาน</h2>
        <p className="text-slate-500">บันทึกความเคลื่อนไหวการยืมและคืนเครื่องดนตรี</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">วันที่/เวลา</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">เครื่องดนตรี</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">ผู้ยืม</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">สถานะ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase text-right">วันส่งคืน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {new Date(record.borrowDate).toLocaleDateString('th-TH')}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(record.borrowDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{record.instrumentName}</span>
                      <span className="text-xs text-slate-400 font-mono">ID: {record.instrumentId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600 font-medium">{record.borrowerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      record.status === 'active' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {record.status === 'active' ? 'กำลังยืม' : 'คืนแล้ว'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-500">
                      {record.returnDate ? new Date(record.returnDate).toLocaleDateString('th-TH') : '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <History className="mx-auto mb-4 opacity-20" size={64} />
            <p className="text-lg">ยังไม่มีประวัติการยืม-คืนในตอนนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
