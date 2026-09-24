// client/app/admin/blog/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Plus, Edit, Trash2, FolderOpen, ArrowLeft, AlertCircle, CheckCircle, X, Tag, BookOpen } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  postCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

interface BlogTag {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
}

export default function AdminBlogCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'tag'; item: any } | null>(null);

  // Category form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    sortOrder: '0',
  });

  // Tag form
  const [tagForm, setTagForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchTags();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/blog/categories`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/blog/tags`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTags(data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/blog/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...categoryForm,
          sortOrder: Number(categoryForm.sortOrder),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Category created successfully');
        setShowCreateCategory(false);
        setCategoryForm({ name: '', description: '', metaTitle: '', metaDescription: '', sortOrder: '0' });
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to create category');
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/blog/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tagForm),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Tag created successfully');
        setShowCreateTag(false);
        setTagForm({ name: '', description: '' });
        fetchTags();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to create tag');
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setError('');

    try {
      const endpoint = deleteTarget.type === 'category' ? 'categories' : 'tags';
      const res = await fetch(`${API_URL}/blog/${endpoint}/${deleteTarget.item._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(`${deleteTarget.type === 'category' ? 'Category' : 'Tag'} deleted successfully`);
        setDeleteTarget(null);
        if (deleteTarget.type === 'category') fetchCategories();
        else fetchTags();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-elba-primary mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <h1 className="text-2xl font-bold text-elba-primary">Categories & Tags</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your blog organization</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'categories' ? (
            <button
              onClick={() => setShowCreateCategory(true)}
              className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Category
            </button>
          ) : (
            <button
              onClick={() => setShowCreateTag(true)}
              className="btn-elba-primary text-sm py-2.5 px-5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Tag
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-600">
          <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
          <button onClick={() => setSuccess('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'categories' ? 'bg-elba-primary text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tags' ? 'bg-elba-primary text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Tag className="w-4 h-4" />
          Tags ({tags.length})
        </button>
      </div>

      {/* Categories List */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No categories yet</p>
              <button
                onClick={() => setShowCreateCategory(true)}
                className="btn-elba-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" /> Create Category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <div key={cat._id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-elba-primary">{cat.name}</h3>
                        <span className="text-xs text-gray-400">/{cat.slug}</span>
                        <span className="text-[10px] bg-elba-surface px-2 py-0.5 rounded-full font-medium text-elba-primary">
                          {cat.postCount} posts
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setDeleteTarget({ type: 'category', item: cat })}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags List */}
      {activeTab === 'tags' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {tags.length === 0 ? (
            <div className="p-12 text-center">
              <Tag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No tags yet</p>
              <button
                onClick={() => setShowCreateTag(true)}
                className="btn-elba-primary text-sm py-2.5 px-5 inline-flex items-center gap-2 mt-4"
              >
                <Plus className="w-4 h-4" /> Create Tag
              </button>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="flex items-center gap-2 bg-elba-surface rounded-full px-4 py-2"
                  >
                    <Tag className="w-3.5 h-3.5 text-elba-primary" />
                    <span className="text-sm font-medium text-elba-primary">{tag.name}</span>
                    <span className="text-xs text-gray-400">({tag.postCount})</span>
                    <button
                      onClick={() => setDeleteTarget({ type: 'tag', item: tag })}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateCategory(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Create Category</h3>
              <button onClick={() => setShowCreateCategory(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Market Insights"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Brief description of this category..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Meta Title (SEO)</label>
                <input
                  type="text"
                  value={categoryForm.metaTitle}
                  onChange={(e) => setCategoryForm({ ...categoryForm, metaTitle: e.target.value })}
                  placeholder="SEO title for this category..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Meta Description (SEO)</label>
                <textarea
                  value={categoryForm.metaDescription}
                  onChange={(e) => setCategoryForm({ ...categoryForm, metaDescription: e.target.value })}
                  placeholder="SEO description for this category..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                <input
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !categoryForm.name}
                className="btn-elba-primary w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Tag Modal */}
      {showCreateTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateTag(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Create Tag</h3>
              <button onClick={() => setShowCreateTag(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTag} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                <input
                  type="text"
                  value={tagForm.name}
                  onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                  placeholder="e.g. maize, warehousing, export"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={tagForm.description}
                  onChange={(e) => setTagForm({ ...tagForm, description: e.target.value })}
                  placeholder="Brief description of this tag..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !tagForm.name}
                className="btn-elba-primary w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Tag'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-lg text-elba-primary mb-2">
              Delete {deleteTarget.type === 'category' ? 'Category' : 'Tag'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete "{deleteTarget.item.name}"? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}