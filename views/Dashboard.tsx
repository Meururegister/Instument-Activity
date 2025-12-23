
import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Music, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { Instrument, InstrumentStatus, BorrowRecord, DashboardStats } from '../types';
import { COLORS } from '../constants';
import { getAIInsights } from '../geminiService';

interface DashboardProps {
  instruments: Instrument[];
  history: BorrowRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ instruments, history }) => {
  const [aiInsights, setAiInsights] = useState<{ summary: string, popularTypes: string[], recommendations: string[] } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const stats: DashboardStats = {
    totalInstruments: instruments.length,
    currentlyBorrowed: instruments.filter(i => i.status === InstrumentStatus.BORROWED).length,
    availableNow: instruments.filter(i => i.status === InstrumentStatus.AVAILABLE).length,
    maintenanceCount: instruments.filter(i => i.status === InstrumentStatus.MAINTENANCE).length,
  };

  const statusData = [
    { name: 'พร้อมใช้งาน', value: stats.availableNow, color: '#10b981' },
    { name: 'ถูกยืม', value: stats.currentlyBorrowed, color: '#6366f1' },
    { name: 'ส่งซ่อม', value: stats.maintenanceCount, color: '#f59e0b' },
  ];

  // Group by type for bar chart
  const typeCounts = instruments.reduce((acc: any, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.keys(typeCounts).map(type => ({
    name: type,
    count: typeCounts[type]
  }));

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAI(true);
      const insights = await getAIInsights(history, instruments);
      setAiInsights(insights);
      setLoadingAI(false);
    };
    fetchAI();
  }, [history, instruments]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">ภาพรวมระบบ</h2>
        <p className="text-slate-500">ยินดีต้อนรับสู่ระบบจัดการเครื่องดนตรี</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'เครื่องดนตรีทั้งหมด', value: stats.totalInstruments, icon: Music, color: 'bg-blue-50 text-blue-600' },
          { label: 'กำลังถูกยืม', value: stats.currentlyBorrowed, icon: Clock, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'พร้อมให้บริการ', value: stats.availableNow, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'อยู่ระหว่างซ่อม', value: stats.maintenanceCount, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">สถานะเครื่องดนตรี</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">จำนวนตามประเภท</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-amber-300" />
            <h3 className="text-xl font-bold">AI สรุปข้อมูลอัจฉริยะ</h3>
          </div>
          
          {loadingAI ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          ) : aiInsights ? (
            <div className="space-y-4">
              <p className="text-indigo-50 leading-relaxed">
                {aiInsights.summary}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <h4 className="font-semibold text-amber-200 mb-2">ประเภทที่เป็นที่นิยม</h4>
                  <ul className="list-disc list-inside text-sm text-indigo-50">
                    {aiInsights.popularTypes.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <h4 className="font-semibold text-emerald-300 mb-2">ข้อแนะนำจาก AI</h4>
                  <ul className="list-disc list-inside text-sm text-indigo-50">
                    {aiInsights.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-indigo-100">กำลังประมวลผลข้อมูล...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
