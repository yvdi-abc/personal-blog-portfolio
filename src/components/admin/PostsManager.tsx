"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover: string;
  tags: string[];
  content: string;
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      alert('加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    const newPost: Post = {
      slug: `post-${Date.now()}`,
      title: '新文章',
      date: new Date().toISOString().split('T')[0],
      description: '',
      cover: '',
      tags: [],
      content: '# 新文章\n\n开始编写...',
    };
    setEditData(newPost);
    setEditing('new');
  };

  const handleEdit = (post: Post) => {
    setEditData({ ...post });
    setEditing(post.slug);
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        alert('✅ 保存成功！文章已写入本地文件。\n\n别忘了使用 Git 命令提交更改到线上。');
        setEditing(null);
        setEditData(null);
        fetchPosts();
      } else {
        alert('保存失败');
      }
    } catch (error) {
      alert('保存失败');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        alert('删除成功！');
        fetchPosts();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600 dark:text-slate-400">加载中...</div>;
  }

  // 编辑模式
  if (editing && editData) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 填写完所有字段后，点击右上角的<strong>保存</strong>按钮，内容会立即写入文件系统
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {editing === 'new' ? '新建文章' : '编辑文章'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 flex items-center gap-2"
            >
              <Save size={16} /> 保存
            </button>
            <button
              onClick={() => { setEditing(null); setEditData(null); }}
              className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-400 dark:hover:bg-slate-600 flex items-center gap-2"
            >
              <X size={16} /> 取消
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Slug (URL 标识)
            </label>
            <input
              type="text"
              value={editData.slug}
              onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="post-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              标题
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              日期
            </label>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              描述
            </label>
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              封面图片 URL
            </label>
            <input
              type="text"
              value={editData.cover}
              onChange={(e) => setEditData({ ...editData, cover: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              标签 (逗号分隔)
            </label>
            <input
              type="text"
              value={editData.tags.join(', ')}
              onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="标签1, 标签2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              内容 (Markdown)
            </label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              rows={20}
            />
          </div>
        </div>
      </div>
    );
  }

  // 列表模式
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          文章列表 ({posts.length})
        </h2>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 flex items-center gap-2"
        >
          <Plus size={16} /> 新建文章
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                {post.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                <span>📅 {post.date}</span>
                <span>🔗 {post.slug}</span>
                {post.tags.length > 0 && (
                  <span>🏷️ {post.tags.join(', ')}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(post)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                title="编辑"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(post.slug)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
