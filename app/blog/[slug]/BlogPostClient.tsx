// client/app/blog/[slug]/BlogPostClient.tsx
'use client';

import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: { url: string; altText: string };
  category: { name: string; slug: string };
  tags: { _id: string; name: string; slug: string }[];
  author: { firstName: string; lastName: string };
  readingTime: number;
  publishedAt: string;
}

// Inline SVG social icons (lucide-react removed brand icons)
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const shareUrl = `https://www.elbermarket.com/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-elba-primary">Home</Link></li>
            <li><span className="text-gray-300">/</span></li>
            <li><Link href="/blog" className="hover:text-elba-primary">Blog</Link></li>
            <li><span className="text-gray-300">/</span></li>
            <li className="text-elba-primary truncate">{post.category?.name}</li>
          </ol>
        </nav>

        {/* Cover Image */}
        {post.coverImage?.url && (
          <div className="rounded-3xl overflow-hidden mb-8 aspect-video bg-elba-surface">
            <img
              src={post.coverImage.url}
              alt={post.coverImage.altText || post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-elba-primary mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-elba-primary text-white flex items-center justify-center font-bold">
              {post.author?.firstName?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-elba-primary">{post.author?.firstName} {post.author?.lastName}</p>
              <p className="text-xs text-gray-400">Author</p>
            </div>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag._id || tag.slug}
                href={`/blog?tag=${tag.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-elba-surface rounded-full text-xs font-medium text-elba-primary hover:bg-elba-secondary/10 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-500">Share:</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            aria-label="Share on Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
            aria-label="Share on Twitter"
          >
            <TwitterIcon />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>

        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-elba-secondary hover:text-elba-secondary-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}