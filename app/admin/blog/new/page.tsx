'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Save, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function AdminBlogNewPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    keywords: '',
    status: 'draft',
  });

  const [categories, setCategories] = useState([]);

  useState(() => {
    fetch(`${API_URL}/blog/categories`)
      .then(r => r.json())
      .then(d => { if (d.success) setCategories(d.data); })
      .catch(console.error);
  });

  const handleSubmit = async (publish: boolean) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const body = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        status: publish ? 'published' : 'draft',
        publishedAt: publish ? new Date() : undefined,
      };

      const res = await fetch(`${API_URL}/blog/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(publish ? 'Post published!' : 'Draft saved!');
        setTimeout(() => router.push('/admin/blog'), 1500);
      } else {
        setError(data.message || 'Failed to save post');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-elba-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-elba-primary">Create New Post</h1>
        <p className="text-sm text-gray-500 mt-1">Write a new blog article</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-600">
          <CheckCircle className="w-5 h-5" /> {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Enter post title..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          />
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Excerpt *</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            placeholder="Brief summary of the post..."
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 resize-none"
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
          >
            <option value="">Select category...</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
            placeholder="Write your content in HTML format..."
            rows={15}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          />
        </div>

        {/* SEO Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-elba-primary mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => updateField('metaTitle', e.target.value)}
                maxLength={70}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">{formData.metaTitle.length}/70 characters</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                maxLength={200}
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{formData.metaDescription.length}/200 characters</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Focus Keyword</label>
              <input
                type="text"
                value={formData.focusKeyword}
                onChange={(e) => updateField('focusKeyword', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Keywords (comma-separated)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => updateField('keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex-1 py-3 bg-elba-primary text-white rounded-xl text-sm font-semibold hover:bg-elba-primary-light disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}