import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Users as UsersIcon, Shield, Trash2, Mail, Calendar, Loader2 } from 'lucide-react';

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/auth');
      return res.data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => api.put(`/auth/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/auth/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-96 text-ancient-500 gap-3">
      <Loader2 className="animate-spin" size={24} />
      <span>Loading guardians...</span>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-ancient-900 border border-ancient-800 rounded-xl text-gold-500">
          <UsersIcon size={24} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-ancient-50 tracking-tighter">Guardians</h2>
          <p className="text-ancient-400">Manage access and permissions for the archives.</p>
        </div>
      </div>

      <div className="bg-ancient-900/50 border border-ancient-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ancient-950/50 border-b border-ancient-800">
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-5 text-xs font-bold text-ancient-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ancient-800/50">
              {users?.map((user: any) => (
                <tr key={user.id} className="group hover:bg-ancient-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ancient-700 to-ancient-800 flex items-center justify-center text-xs font-bold text-ancient-200 border border-ancient-700">
                        {user.name?.[0].toUpperCase() || 'U'}
                      </div>
                      <span className="font-bold text-ancient-100">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-ancient-300">
                      <Mail size={14} className="text-ancient-500" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select
                        value={user.role}
                        onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value })}
                        className="appearance-none bg-ancient-950 border border-ancient-800 rounded-lg pl-8 pr-4 py-1 text-xs font-bold uppercase tracking-wide text-ancient-300 focus:outline-none focus:border-gold-500/50 hover:bg-ancient-900 cursor-pointer transition-colors"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="EDITOR">Editor</option>
                        <option value="AUTHOR">Author</option>
                        <option value="USER">User</option>
                      </select>
                      <Shield size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ancient-500 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-ancient-400">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { if(confirm('Revoke access for this guardian?')) deleteMutation.mutate(user.id) }}
                      className="p-2 text-ancient-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
