import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get(`/content/posts/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="p-20 text-center text-gray-400">Unfolding the scroll...</div>;
  if (!post) return <div className="p-20 text-center">Archive not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-6 py-20"
    >
      <Link to="/" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-20 block">
        ← Back to Overview
      </Link>

      <header className="mb-16">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          {new Date(post.createdAt).toLocaleDateString()} • {post.author.name}
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-black leading-tight">
          {post.title}
        </h1>
      </header>

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ...

      <div className="prose prose-lg max-w-none font-serif">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {typeof post.content === 'string' ? post.content : JSON.stringify(post.content)}
        </ReactMarkdown>
      </div>

      <div className="mt-32 pt-10 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
        <span>End of Archive</span>
        <span>{post.language.toUpperCase()}</span>
      </div>
    </motion.div>
  );
};

export default PostDetail;
