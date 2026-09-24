'use client';

import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: { url: string; altText: string };
    category: { name: string; slug: string };
    author: { firstName: string; lastName: string };
    readingTime: number;
    publishedAt: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all group"
    >
      <div className="aspect-video bg-elba-surface overflow-hidden">
        {post.coverImage?.url ? (
          <img
            src={post.coverImage.url}
            alt={post.coverImage.altText || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🌾</div>
        )}
      </div>
      <div className="p-6">
        <span className="text-xs font-bold text-elba-secondary uppercase tracking-wider">
          {post.category?.name}
        </span>
        <h2 className="font-bold text-elba-primary text-lg mt-2 mb-2 group-hover:text-elba-secondary transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </Link>
  );
}