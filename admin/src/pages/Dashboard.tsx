import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Briefcase, BookOpen, Users, Activity, HardDrive, Database, ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return Math.floor(seconds) + " seconds ago";
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string; trend?: string }> = ({ icon, label, value, color, trend }) => (
  <div className="group bg-ancient-900/50 border border-ancient-800 rounded-2xl p-6 shadow-xl hover:border-gold-500/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-bl-full group-hover:scale-110 transition-transform`} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-ancient-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-4xl font-black text-ancient-50 mt-2 tracking-tight">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-3 text-emerald-400 text-xs font-bold bg-emerald-500/10 w-fit px-2 py-1 rounded-full">
            <ArrowUpRight size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-white shadow-inner`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'drop-shadow-lg' })}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: async () => {
      const res = await api.get('/content/activity');
      return res.data;
    },
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/content/stats');
      return res.data;
    },
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chart-stats'],
    queryFn: async () => {
      const res = await api.get('/content/stats/chart');
      return res.data;
    },
  });

  const { data: system, isLoading: systemLoading } = useQuery({
    queryKey: ['system'],
    queryFn: async () => {
      const res = await api.get('/system/health');
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  const isLoading = activityLoading || statsLoading;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-ancient-50 tracking-tighter mb-2">Command Center</h2>
          <p className="text-ancient-400">Real-time overview of the archives.</p>
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
          system?.dbStatus === 'ONLINE' ? 'bg-ancient-900 text-ancient-500 border-ancient-800' : 'bg-red-900/20 text-red-500 border-red-900/50'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            system?.dbStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500'
          }`} />
          {system?.dbStatus === 'ONLINE' ? 'SYSTEM OPERATIONAL' : 'SYSTEM CRITICAL'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FileText size={24} />} label="Total Posts" value={isLoading ? '-' : stats?.posts?.toString()} color="bg-blue-500" />
        <StatCard icon={<Briefcase size={24} />} label="Projects" value={isLoading ? '-' : stats?.projects?.toString()} color="bg-emerald-500" />
        <StatCard icon={<BookOpen size={24} />} label="Stories" value={isLoading ? '-' : stats?.stories?.toString()} color="bg-purple-500" />
        <StatCard icon={<Users size={24} />} label="Active Users" value={isLoading ? '-' : stats?.users?.toString()} color="bg-gold-500" />
      </div>

      {/* Activity Chart Section */}
      <div className="bg-ancient-900/50 border border-ancient-800 p-8 rounded-3xl shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-ancient-50 flex items-center gap-2">
            <Activity size={20} className="text-gold-500" />
            Activity Trends (Last 7 Days)
          </h3>
        </div>
        <div className="h-[300px] w-full">
          {chartLoading ? (
            <div className="flex h-full items-center justify-center text-ancient-500"><Loader2 className="animate-spin" /></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  tick={{ fill: '#666', fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666" 
                  tick={{ fill: '#666', fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#d4af37' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#d4af37" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-ancient-900/50 border border-ancient-800 p-8 rounded-3xl shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-ancient-50 flex items-center gap-2">
              <Activity size={20} className="text-gold-500" />
              Recent Updates
            </h3>
            <Link to="/posts" className="text-xs font-bold text-ancient-500 hover:text-gold-500 transition-colors uppercase tracking-wider">View All</Link>
          </div>
          
          <div className="space-y-1">
            {activityLoading ? (
              <div className="flex justify-center p-8 text-gold-500"><Loader2 className="animate-spin" /></div>
            ) : activity?.map((item: any) => (
              <Link 
                to={`/${item.type}s/edit/${item.id}`} 
                key={item.id} 
                className="group flex items-center gap-4 p-4 hover:bg-ancient-800/40 rounded-xl transition-all cursor-pointer border border-transparent hover:border-ancient-800/50"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-inner ${
                  item.type === 'post' ? 'bg-blue-500/10 text-blue-400' :
                  item.type === 'project' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  {item.type === 'post' ? <FileText size={20} /> :
                   item.type === 'project' ? <Briefcase size={20} /> :
                   <BookOpen size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ancient-100 font-bold text-sm group-hover:text-gold-500 transition-colors truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-ancient-500 bg-ancient-950 px-1.5 py-0.5 rounded border border-ancient-800">{item.type}</span>
                    <p className="text-ancient-500 text-xs">
                      updated by {item.author.name} • {timeAgo(item.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={18} className="text-ancient-500" />
                </div>
              </Link>
            ))}
            {!activityLoading && activity?.length === 0 && (
              <p className="text-ancient-500 italic text-center py-4">No recent activity detected.</p>
            )}
          </div>
        </div>

        <div className="bg-ancient-900/50 border border-ancient-800 p-8 rounded-3xl shadow-xl backdrop-blur-sm flex flex-col h-full">
          <h3 className="text-xl font-bold text-ancient-50 mb-8 flex items-center gap-2">
            <HardDrive size={20} className="text-blue-500" />
            System Status
          </h3>
          
          <div className="space-y-8 flex-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ancient-300 font-medium flex items-center gap-2">
                  <Database size={14} className="text-ancient-500" /> Database
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                  system?.dbStatus === 'ONLINE' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>{system?.dbStatus || 'CHECKING'}</span>
              </div>
              <div className="w-full bg-ancient-950 rounded-full h-1.5 overflow-hidden">
                <div className={`h-1.5 rounded-full w-full shadow-[0_0_10px_rgba(16,185,129,0.5)] ${
                   system?.dbStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
              </div>
              {system?.dbLatency && <p className="text-[10px] text-right text-ancient-600 font-mono">{system.dbLatency}ms latency</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ancient-300 font-medium flex items-center gap-2">
                  <HardDrive size={14} className="text-ancient-500" /> Storage
                </span>
                <span className="text-ancient-500 text-xs font-mono">{formatBytes(system?.storage?.used || 0)} / {formatBytes(system?.storage?.total || 0)}</span>
              </div>
              <div className="w-full bg-ancient-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                  style={{ width: `${system?.storage?.percent || 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ancient-300 font-medium flex items-center gap-2">
                  <Activity size={14} className="text-ancient-500" /> CPU Load
                </span>
                <span className="text-ancient-500 text-xs font-mono">{system?.cpuLoad || 0}%</span>
              </div>
              <div className="w-full bg-ancient-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000" 
                  style={{ width: `${Math.min(system?.cpuLoad || 0, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ancient-800/50 text-center">
             <p className="text-[10px] text-ancient-600 uppercase tracking-widest font-bold">
               Server Uptime: {system?.uptime ? formatUptime(system.uptime) : '-'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
