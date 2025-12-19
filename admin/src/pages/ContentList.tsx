import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Plus, Edit2, Trash2, Globe, Clock, FileText, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentListProps {
  type: 'posts' | 'projects' | 'stories';
  title: string;
}

const ContentList: React.FC<ContentListProps> = ({ type, title }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [type],
    queryFn: async () => {
      const res = await api.get(`/content/${type}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/content/${type}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-96 text-ancient-500 gap-3">
      <Loader2 className="animate-spin" size={24} />
      <span>Loading archives...</span>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-ancient-50 tracking-tighter mb-2">{title}</h2>
          <p className="text-ancient-400">Manage and organize your digital artifacts.</p>
        </div>
        <Link
          to={`/${type}/new`}
          className="flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-500 text-ancient-950 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-gold-900/20 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>New Entry</span>
        </Link>
      </div>

      {/* Toolbar / Search placeholder */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ancient-500" size={18} />
          <input 
            type="text" 
            placeholder="Search archives..." 
            className="w-full bg-ancient-900/50 border border-ancient-800 rounded-xl py-3 pl-11 pr-4 text-ancient-100 placeholder:text-ancient-600 focus:outline-none focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all"
          />
        </div>
      </div>

      <div className="bg-ancient-900/50 border border-ancient-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ancient-950/50 border-b border-ancient-800">
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider w-1/3">Title & Slug</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">Locale</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ancient-800/50">
              {data?.map((item: any) => (
                <tr key={item.id} className="group hover:bg-ancient-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-lg bg-ancient-800/50 text-ancient-400 group-hover:text-gold-500 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ancient-100 group-hover:text-white transition-colors line-clamp-1">{item.title}</div>
                        <div className="text-xs text-ancient-500 font-mono mt-0.5">/{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      item.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.status === 'DRAFT' ? 'bg-ancient-700/20 text-ancient-400 border-ancient-700/30' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                         item.status === 'PUBLISHED' ? 'bg-emerald-500' :
                         item.status === 'DRAFT' ? 'bg-ancient-400' :
                         'bg-purple-500'
                      }`} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-ancient-300">
                      <Globe size={14} className="text-ancient-500" />
                      {item.language.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-ancient-800 flex items-center justify-center text-[10px] font-bold text-ancient-300">
                          {item.author.name?.[0] || 'U'}
                        </div>
                        <span className="text-sm text-ancient-300">{item.author.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-ancient-400">
                      <Clock size={14} />
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <Link
                        to={`/${type}/edit/${item.id}`}
                        className="p-2 text-ancient-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => { if(confirm('Are you sure you want to delete this artifact?')) deleteMutation.mutate(item.id) }}
                        className="p-2 text-ancient-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-ancient-950/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-ancient-600">
                <FileText size={32} />
              </div>
              <h3 className="text-ancient-200 font-bold mb-1">No entries found</h3>
              <p className="text-ancient-500 text-sm">Start by creating a new {title.toLowerCase().slice(0, -1)}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentList;