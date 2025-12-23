
import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronRight } from 'lucide-react';
import { Instrument, InstrumentStatus } from '../types';

interface InstrumentsProps {
  instruments: Instrument[];
}

const Instruments: React.FC<InstrumentsProps> = ({ instruments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = instruments.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || i.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: InstrumentStatus) => {
    switch (status) {
      case InstrumentStatus.AVAILABLE: return 'bg-emerald-100 text-emerald-700';
      case InstrumentStatus.BORROWED: return 'bg-indigo-100 text-indigo-700';
      case InstrumentStatus.MAINTENANCE: return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: InstrumentStatus) => {
    switch (status) {
      case InstrumentStatus.AVAILABLE: return 'ว่าง';
      case InstrumentStatus.BORROWED: return 'ถูกยืม';
      case InstrumentStatus.MAINTENANCE: return 'ซ่อมแซม';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">เครื่องดนตรี</h2>
          <p className="text-slate-500">รายการพัสดุเครื่องดนตรีทั้งหมดในระบบ</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-indigo-100">
          <Plus size={20} />
          เพิ่มรายการใหม่
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ รหัสบาร์โค้ด..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">ทุกสถานะ</option>
            <option value={InstrumentStatus.AVAILABLE}>ว่าง</option>
            <option value={InstrumentStatus.BORROWED}>ถูกยืม</option>
            <option value={InstrumentStatus.MAINTENANCE}>ซ่อมแซม</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((inst) => (
          <div key={inst.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="relative h-48 bg-slate-200">
              <img src={inst.image} alt={inst.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(inst.status)}`}>
                  {getStatusText(inst.status)}
                </span>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{inst.type}</p>
                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{inst.name}</h3>
                <p className="text-sm text-slate-400 font-mono mt-1">{inst.barcode}</p>
              </div>
              
              {inst.lastBorrowedBy && (
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <p className="flex justify-between">
                    <span>ผู้ยืมล่าสุด:</span>
                    <span className="font-semibold text-slate-700">{inst.lastBorrowedBy}</span>
                  </p>
                </div>
              )}

              <button className="w-full mt-2 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-bold flex items-center justify-center gap-1 transition-colors">
                ดูรายละเอียด
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">ไม่พบรายการเครื่องดนตรี</h3>
          <p className="text-slate-400">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</p>
        </div>
      )}
    </div>
  );
};

export default Instruments;
