import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, BookOpen, Image as ImageIcon, Users, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; to: string; active?: boolean }> = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
      active 
        ? 'bg-gradient-to-r from-ancient-800 to-ancient-900 text-gold-500 shadow-lg shadow-black/20' 
        : 'text-ancient-400 hover:bg-ancient-900/50 hover:text-ancient-100'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="font-medium tracking-wide text-sm">{label}</span>
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-500 rounded-r-full" />}
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/' },
    { icon: <FileText size={20} />, label: 'Posts', to: '/posts' },
    { icon: <Briefcase size={20} />, label: 'Projects', to: '/projects' },
    { icon: <BookOpen size={20} />, label: 'Stories', to: '/stories' },
    { icon: <ImageIcon size={20} />, label: 'Media', to: '/media' },
    { icon: <Users size={20} />, label: 'Users', to: '/users' },
  ];

  return (
    <aside className="w-72 bg-ancient-950 h-screen border-r border-ancient-800/50 flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      <div className="p-8 pb-6">
        <h1 className="text-3xl font-black text-ancient-50 tracking-tighter flex items-center gap-2 select-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">Ancient</span>
          <span className="text-ancient-200">CMS</span>
        </h1>
        <p className="text-xs font-bold text-ancient-600 uppercase tracking-[0.2em] mt-2 ml-1">v1.0.0 • Onyx</p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-2 text-xs font-bold text-ancient-600 uppercase tracking-wider mb-2">Menu</div>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={location.pathname === item.to}
          />
        ))}
      </nav>

      <div className="p-4 m-4 bg-ancient-900/50 rounded-2xl border border-ancient-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-600 to-gold-700 flex items-center justify-center text-ancient-950 font-bold shadow-lg shadow-gold-900/20 text-lg">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ancient-100 truncate">{user?.name}</p>
            <p className="text-xs text-ancient-500 truncate font-mono">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-xs font-bold uppercase tracking-wider border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} />
          <span>Disconnect</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
