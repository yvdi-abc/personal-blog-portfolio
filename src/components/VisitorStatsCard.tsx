"use client";
import { useEffect, useState } from 'react';
import { Users, Eye, TrendingUp, Globe } from 'lucide-react';

export default function VisitorStatsCard() {
  const [stats, setStats] = useState({
    todayVisits: 0,
    totalVisits: 0,
    todayVisitors: 0,
    totalVisitors: 0,
  });

  useEffect(() => {
    // 模拟访客数据
    const simulateStats = () => {
      const baseTotal = 12580;
      const baseTodayVisits = 42;
      const randomVisits = Math.floor(Math.random() * 10);

      setStats({
        todayVisits: baseTodayVisits + randomVisits,
        totalVisits: baseTotal + randomVisits * 15,
        todayVisitors: Math.floor((baseTodayVisits + randomVisits) * 0.7),
        totalVisitors: Math.floor((baseTotal + randomVisits * 15) * 0.6),
      });
    };

    simulateStats();
    const interval = setInterval(simulateStats, 30000); // 每30秒更新

    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      icon: Eye,
      label: '今日访问',
      value: stats.todayVisits,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Globe,
      label: '总访问量',
      value: stats.totalVisits.toLocaleString(),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Users,
      label: '今日访客',
      value: stats.todayVisitors,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: TrendingUp,
      label: '总访客数',
      value: stats.totalVisitors.toLocaleString(),
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
  ];

  return (
    <div className="rounded-3xl glass p-6 relative overflow-hidden min-h-[280px] flex flex-col transition-all duration-700 hover:shadow-2xl group">
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-sm font-black text-purple-600 dark:text-purple-400 tracking-widest uppercase mb-6 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Visitor Stats
        </h3>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/30 dark:bg-slate-800/30 hover:scale-105 transition-transform duration-300 group/item"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-3 group-hover/item:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>实时统计中...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
