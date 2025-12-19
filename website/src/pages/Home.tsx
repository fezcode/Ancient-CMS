import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['public-posts'],
    queryFn: async () => {
      const res = await api.get('/content/posts?status=PUBLISHED');
      return res.data;
    },
  });

  if (isLoading) return <div className="p-20 text-center font-serif italic text-gray-400">Loading the archives...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <header className="mb-20 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-black mb-4">Ancient Wisdom</h1>
        <p className="text-gray-500 font-serif italic">A collection of thoughts, projects, and stories from the past.</p>
      </header>

      <section className="space-y-24">
        {posts?.map((post: any, index: number) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/post/${post.slug}`}>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                <div className="h-px flex-1 bg-gray-100 group-hover:bg-black transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{post.language}</span>
              </div>
              <h2 className="text-3xl font-bold text-black group-hover:underline decoration-4 underline-offset-8 transition-all">
                {post.title}
              </h2>
              <p className="mt-4 text-gray-600 font-serif leading-relaxed line-clamp-3">
                {typeof post.content === 'string' ? post.content : 'Structured content...'}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read Archive</span>
                <span className="text-lg">→</span>
              </div>
            </Link>
          </motion.article>
        ))}
      </section>

      {posts?.length === 0 && (
        <div className="text-center py-20 text-gray-400 italic">
          The archives are currently silent.
        </div>
      )}

      <footer className="mt-40 pt-20 border-t border-gray-100 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} AncientCMS • Built for Eternity
      </footer>
    </div>
  );
};

export default Home;
