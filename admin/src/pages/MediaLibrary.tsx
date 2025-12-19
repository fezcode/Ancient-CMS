import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { SERVER_URL } from '../services/api';
import { Upload, Trash2, Link as LinkIcon, Image as ImageIcon, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Warning Modal Component ---
const UsageWarningModal: React.FC<{ 
  usage: any[]; 
  onClose: () => void; 
  onConfirm: () => void; 
  deleting: boolean 
}> = ({ usage, onClose, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
    <div className="bg-ancient-900 border border-red-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-50"><AlertTriangle size={64} className="text-red-500/20" /></div>
      
      <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
        <AlertTriangle size={20} />
        Artifact in Use
      </h3>
      <p className="text-ancient-300 text-sm mb-4">
        This artifact is currently referenced in <strong>{usage.length}</strong> items. Deleting it will break images in these posts:
      </p>

      <div className="bg-ancient-950/50 rounded-xl border border-ancient-800 p-3 max-h-48 overflow-y-auto mb-6 custom-scrollbar">
        {usage.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 py-2 border-b border-ancient-800/50 last:border-0">
            <span className="text-[10px] uppercase font-bold bg-ancient-800 text-ancient-400 px-1.5 py-0.5 rounded">{item.type}</span>
            <span className="text-ancient-200 text-sm truncate">{item.title}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-ancient-700 text-ancient-300 font-bold hover:bg-ancient-800 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/50 font-bold hover:bg-red-500/20 transition-colors"
        >
          {deleting ? 'Deleting...' : 'Delete Anyway'}
        </button>
      </div>
    </div>
  </div>
);

const MediaLibrary: React.FC = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usageData, setUsageData] = useState<any[] | null>(null); // If not null, modal is shown
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: media, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const res = await api.get('/media');
      return res.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    const fullUrl = `${SERVER_URL}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteClick = async (id: string) => {
    setTargetDeleteId(id);
    try {
      // Check usage first
      const res = await api.get(`/media/${id}/usage`);
      if (res.data.length > 0) {
        setUsageData(res.data);
      } else {
        // Safe to delete immediately if no usage
        if (confirm('Are you sure you want to delete this artifact?')) {
          await performDelete(id);
        }
      }
    } catch (err) {
      alert('Failed to check dependency');
    }
  };

  const performDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await api.delete(`/media/${id}`);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setUsageData(null);
      setTargetDeleteId(null);
    } catch (err) {
      alert('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div className="text-gold-500 p-10">Retrieving artifacts...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {usageData && targetDeleteId && (
        <UsageWarningModal 
          usage={usageData} 
          onClose={() => { setUsageData(null); setTargetDeleteId(null); }}
          onConfirm={() => performDelete(targetDeleteId)}
          deleting={isDeleting}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-ancient-50 tracking-tighter mb-2">Media Library</h2>
          <p className="text-ancient-400">Manage your visual and digital assets.</p>
        </div>
        <label className="flex items-center gap-2 bg-ancient-800 hover:bg-ancient-700 text-ancient-100 px-6 py-3 rounded-xl font-bold transition-all cursor-pointer border border-ancient-700 shadow-xl">
          <Upload size={18} />
          <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {media?.map((item: any) => (
          <div key={item.id} className="group bg-ancient-900 border border-ancient-800 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all duration-300 shadow-lg">
            <div className="aspect-square bg-ancient-950 relative flex items-center justify-center overflow-hidden">
              {item.mimetype.startsWith('image/') ? (
                <img
                  src={`${SERVER_URL}${item.url}`}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <FileText size={48} className="text-ancient-800" />
              )}
              
              <div className="absolute inset-0 bg-ancient-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => copyToClipboard(item.url, item.id)}
                  className="p-3 bg-ancient-800 text-ancient-100 rounded-full hover:bg-gold-600 hover:text-ancient-950 transition-all"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <CheckCircle2 size={20} /> : <LinkIcon size={20} />}
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="p-3 bg-ancient-800 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-bold text-ancient-200 truncate" title={item.filename}>
                {item.filename}
              </p>
              <p className="text-[10px] text-ancient-500 mt-1 uppercase font-mono">
                {(item.size / 1024).toFixed(1)} KB • {item.mimetype.split('/')[1]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {media?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-ancient-500">
          <div className="bg-ancient-900 w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-ancient-800 shadow-inner">
            <ImageIcon size={32} className="opacity-20" />
          </div>
          <h3 className="text-ancient-200 font-bold">Archives are empty</h3>
          <p className="italic text-sm">Upload your first artifact to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
