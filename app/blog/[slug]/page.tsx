import type { Metadata } from 'next';
import { API_URL } from '@/lib/api';
import BlogPostClient from './BlogPostClient';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blog/posts/${slug}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found | ELBER MARKET',
      description: 'This article is no longer available.',
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords || [post.focusKeyword],
    openGraph: {
      title: post.socialTitle || post.title,
      description: post.socialDescription || post.excerpt,
      url: `https://www.elbermarket.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.firstName + ' ' + post.author?.lastName],
      images: post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || `https://www.elbermarket.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Article not found</p>
          <a href="/blog" className="text-elba-secondary text-sm mt-2 inline-block">← Back to Blog</a>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url || 'https://www.elbermarket.com/logo.png',
    author: {
      '@type': 'Person',
      name: `${post.author?.firstName} ${post.author?.lastName}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ELBER MARKET',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.elbermarket.com/logo.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.elbermarket.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}