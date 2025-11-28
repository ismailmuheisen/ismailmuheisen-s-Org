import React from 'react';
import { HistoryItem, ContentType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Shield, AlertOctagon, ScanEye, FileWarning } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data for visualization
  const stats = [
    { title: 'إجمالي الفحوصات', value: '1,420', icon: ScanEye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'كشف تزييف عميق', value: '385', icon: AlertOctagon, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'محتوى حقيقي', value: '1,035', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'نسبة الدقة', value: '98.5%', icon: FileWarning, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  const chartData = [
    { name: 'نصوص', real: 400, fake: 120 },
    { name: 'صور', real: 300, fake: 150 },
    { name: 'فيديو', real: 206, fake: 72 },
    { name: 'صوت', real: 129, fake: 43 },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
        <p className="text-slate-400">نظرة عامة على نشاط الفحص والتهديدات المكتشفة</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6 transition-all hover:bg-slate-750 hover:border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-400">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">توزيع التزييف حسب النوع</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="real" name="حقيقي" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fake" name="تزييف (AI)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <div className="mb-4 p-4 bg-emerald-500/10 rounded-full">
                <Shield className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">النظام محمي ومحدث</h3>
            <p className="text-slate-400 max-w-sm">
                تستخدم كاشف أحدث نماذج Gemini 3.0 Pro لتحليل البصمات الرقمية وتحديد الأنماط الدلالية المعقدة في النصوص والوسائط.
            </p>
            <button className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium">
                عرض تقارير الأمان
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;