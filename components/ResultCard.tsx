import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert, Cpu, Activity, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isAi = result.isAiGenerated;
  const color = isAi ? '#ef4444' : '#10b981'; // Red for AI, Green for Real
  const chartData = [
    { name: 'Confidence', value: result.confidenceScore },
    { name: 'Remaining', value: 100 - result.confidenceScore },
  ];

  return (
    <div className="mt-8 animate-fade-in">
      <div className={`rounded-2xl border ${isAi ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'} p-6 md:p-8 relative overflow-hidden`}>
        {/* Background glow effect */}
        <div className={`absolute top-0 right-0 w-64 h-64 ${isAi ? 'bg-red-500/10' : 'bg-emerald-500/10'} blur-3xl rounded-full pointer-events-none -mr-32 -mt-32`}></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Gauge Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={color} />
                    <Cell fill="#334155" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{result.confidenceScore}%</span>
                <span className="text-xs text-slate-400">احتمالية AI</span>
              </div>
            </div>
            <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold border ${isAi ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-emerald-500 text-emerald-400 bg-emerald-500/10'}`}>
              {result.verdict}
            </div>
          </div>

          {/* Reasoning Section */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                تحليل الأدلة
              </h3>
              <ul className="space-y-3">
                {result.reasoning.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                    {isAi ? <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                المؤشرات التقنية
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.technicalIndicators.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-slate-300 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-slate-500" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500">
            تم التحليل في: {new Date(result.analyzedAt).toLocaleString('ar-EG')} • نظام Gemini 3.0 Pro للفحص الجنائي
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;