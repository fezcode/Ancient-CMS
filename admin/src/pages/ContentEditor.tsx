import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api, { SERVER_URL } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { 
  Save, ChevronLeft, Globe, Eye, FileCode, Calendar, 
  Hash, Tag, Loader2, Image as ImageIcon, X, Bold, Italic, Link as LinkIcon 
} from 'lucide-react';

interface ContentEditorProps {
  type: 'posts' | 'projects' | 'stories';
}

// --- Media Selector Modal Component ---
const MediaSelector: React.FC<{ onClose: () => void; onSelect: (url: string) => void }> = ({ onClose, onSelect }) => {
  const { data: media, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const res = await api.get('/media');
      return res.data;
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-ancient-900 border border-ancient-800 w-full max-w-4xl h-[80vh] rounded-3xl flex flex-col shadow-2xl">
        <div className="p-6 border-b border-ancient-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-ancient-50">Select Artifact</h3>
          <button onClick={onClose} className="text-ancient-400 hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center text-gold-500"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media?.map((item: any) => (
                <div 
                  key={item.id} 
                  onClick={() => onSelect(`${SERVER_URL}${item.url}`)}
                  className="cursor-pointer group relative aspect-square bg-ancient-950 rounded-xl overflow-hidden border border-ancient-800 hover:border-gold-500 transition-all"
                >
                  {item.mimetype.startsWith('image/') ? (
                    <img src={`${SERVER_URL}${item.url}`} alt={item.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-ancient-700"><FileCode /></div>
                  )}
                  <div className="absolute inset-0 bg-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Editor Component ---
const ContentEditor: React.FC<ContentEditorProps> = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'DRAFT',
    language: 'en',
  });

  useEffect(() => {
    if (id) {
      const fetchContent = async () => {
        try {
          const res = await api.get(`/content/${type}/${id}`);
          setFormData({
            title: res.data.title,
            slug: res.data.slug,
            content: typeof res.data.content === 'string' ? res.data.content : JSON.stringify(res.data.content, null, 2),
            status: res.data.status,
            language: res.data.language,
          });
        } catch (err) {
          console.error('Failed to fetch content');
        }
      };
      fetchContent();
    }
  }, [id, type]);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = formData.content;
    const selectedText = previousText.substring(start, end);

    const newText = previousText.substring(0, start) + before + selectedText + after + previousText.substring(end);
    setFormData({ ...formData, content: newText });

    // Restore focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleImageSelect = (url: string) => {
    insertText(`![Image](${url})`);
    setShowMediaModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Always save as string (Markdown)
      const payload = { ...formData }; 

      if (id) {
        await api.put(`/content/${type}/${id}`, payload);
      } else {
        await api.post(`/content/${type}`, payload);
      }
      navigate(`/${type}`);
    } catch (err) {
      alert('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {showMediaModal && (
        <MediaSelector onClose={() => setShowMediaModal(false)} onSelect={handleImageSelect} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/${type}`)}
            className="p-2 rounded-xl bg-ancient-900 border border-ancient-800 text-ancient-400 hover:text-ancient-100 hover:border-ancient-700 transition-all shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-ancient-50 tracking-tight flex items-center gap-2">
              {id ? 'Edit Artifact' : 'New Artifact'}
              <span className="px-2 py-0.5 rounded-md bg-ancient-800 text-ancient-400 text-[10px] uppercase font-bold tracking-wider">{type}</span>
            </h2>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-sm font-medium ${
              showPreview 
                ? 'bg-gold-500/10 border-gold-500 text-gold-500' 
                : 'border-ancient-800 text-ancient-300 hover:bg-ancient-800/50'
            }`}
          >
            <Eye size={16} />
            <span>{showPreview ? 'Edit Mode' : 'Preview'}</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-ancient-950 rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <div className="bg-ancient-900/50 border border-ancient-800 p-8 rounded-3xl shadow-xl backdrop-blur-sm flex-1 flex flex-col gap-6 relative overflow-hidden">
            
            {/* Title & Slug */}
            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-transparent border-none text-4xl font-black text-ancient-50 placeholder-ancient-800 focus:outline-none focus:ring-0 leading-tight"
                placeholder="Enter Title Here..."
              />
              <div className="flex items-center gap-4 text-sm text-ancient-500 font-mono">
                <span className="flex items-center gap-2"><Hash size={14} /> slug:</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-ancient-950/50 border border-ancient-800/50 px-3 py-1 rounded-lg text-ancient-300 focus:outline-none focus:border-gold-500/50 transition-colors w-full max-w-md"
                  placeholder="url-slug-goes-here"
                />
              </div>
            </div>

            {/* Editor / Preview Switcher */}
            <div className="flex-1 flex flex-col relative min-h-0">
              {showPreview ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-ancient-950/30 rounded-2xl p-6 border border-ancient-800/30">
                  <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-gold-500 prose-img:rounded-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content}
                    </ReactMarkdown>
                  </article>
                </div>
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mb-2 p-2 bg-ancient-950/50 border border-ancient-800/50 rounded-xl w-fit">
                    <button onClick={() => insertText('**', '**')} className="p-2 text-ancient-400 hover:text-gold-500 rounded-lg hover:bg-ancient-800" title="Bold">
                      <Bold size={16} />
                    </button>
                    <button onClick={() => insertText('*', '*')} className="p-2 text-ancient-400 hover:text-gold-500 rounded-lg hover:bg-ancient-800" title="Italic">
                      <Italic size={16} />
                    </button>
                    <button onClick={() => insertText('[', '](url)')} className="p-2 text-ancient-400 hover:text-gold-500 rounded-lg hover:bg-ancient-800" title="Link">
                      <LinkIcon size={16} />
                    </button>
                    <div className="w-px h-6 bg-ancient-800" />
                    <button onClick={() => setShowMediaModal(true)} className="p-2 text-ancient-400 hover:text-gold-500 rounded-lg hover:bg-ancient-800" title="Insert Image">
                      <ImageIcon size={16} />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="flex-1 w-full bg-ancient-950/30 border border-ancient-800/30 rounded-2xl p-6 text-ancient-200 text-base leading-relaxed placeholder-ancient-800 focus:outline-none focus:border-gold-500/30 focus:bg-ancient-950/50 transition-all resize-none font-mono"
                    placeholder="Write your story in Markdown..."
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Settings (Same as before) */}
        <div className="space-y-6">
          <div className="bg-ancient-900/50 border border-ancient-800 p-6 rounded-3xl shadow-xl backdrop-blur-sm space-y-6">
            <h3 className="text-xs font-bold text-ancient-500 uppercase tracking-widest flex items-center gap-2">
              <Tag size={12} />
              Publishing
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ancient-400 mb-2 uppercase tracking-wide">Status</label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-ancient-950 border border-ancient-800 rounded-xl px-4 py-3 text-ancient-100 focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer hover:bg-ancient-900 transition-colors"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="REVIEW">Review</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ancient-500"><ChevronLeft size={16} className="-rotate-90" /></div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ancient-400 mb-2 uppercase tracking-wide flex items-center gap-2"><Globe size={12} /> Language</label>
                <div className="relative">
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-ancient-950 border border-ancient-800 rounded-xl px-4 py-3 text-ancient-100 focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer hover:bg-ancient-900 transition-colors"
                  >
                    <option value="en">English (US)</option>
                    <option value="tr">Turkish</option>
                    <option value="de">German</option>
                    <option value="fr">French</option>
                  </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ancient-500"><ChevronLeft size={16} className="-rotate-90" /></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-ancient-900/50 border border-ancient-800 p-6 rounded-3xl shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="text-xs font-bold text-ancient-500 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Meta Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-ancient-400">Created</span><span className="text-ancient-200 font-mono">{id ? 'Dec 19, 2025' : 'Now'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-ancient-400">Author</span><span className="text-ancient-200 font-mono">The Architect</span></div>
              <div className="flex justify-between text-sm"><span className="text-ancient-400">ID</span><span className="text-ancient-500 font-mono text-xs">{id?.slice(0,8) || 'PENDING'}...</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
