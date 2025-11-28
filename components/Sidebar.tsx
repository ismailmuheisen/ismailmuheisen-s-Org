import React from 'react';
import { LayoutDashboard, FileText, Image as ImageIcon, Video, ShieldCheck, Mic } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'text', label: 'فحص النصوص', icon: FileText },
    { id: 'image', label: 'فحص الصور', icon: ImageIcon },
    { id: 'video', label: 'فحص الفيديو', icon: Video },
    { id: 'audio', label: 'فحص الصوت', icon: Mic },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-800 border-l border-slate-700 flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-700">
        <ShieldCheck className="w-8 h-8 text-emerald-400" />
        <span className="text-xl font-bold text-white hidden md:block">كاشف AI</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="font-medium hidden md:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-900/50 rounded-lg p-4 hidden md:block">
          <p className="text-xs text-slate-400 mb-1">حالة النظام</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-emerald-400">Gemini 3.0 Pro Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;