"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

interface Chatter {
  slug: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
  mood?: string;
  cover?: string;
}

export default function ChattersManager() {
  const [chatters, setChatters] = useState<Chatter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [editData, setEditData] = useState<Chatter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤碎语
  const filteredChatters = chatters.filter(chatter => {
    const matchSearch = chatter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       chatter.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  useEffect(() => {
    fetchChatters();
  }, []);

  const fetchChatters = async () => {
    try {
      const res = await fetch('/api/admin/chatters');
      const data = await res.json();
      setChatters((data.data?.chatters || data.chatters || data.data || [])); // 支持多种返回格式
    } catch (error) {
      alert('加载碎语失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    const newChatter: Chatter = {
      slug: `chatter-${Date.now()}`,
      title: '新碎语',
      content: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      mood: '',
    };
    setEditData(newChatter);
    setEditing('new');
  };

  const handleEdit = (chatter: Chatter) => {
    setEditData({ ...chatter });
    setEditing(chatter.slug);
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      let updatedChatters: Chatter[];
      if (editing === 'new') {
        updatedChatters = [editData, ...chatters];
      } else {
        updatedChatters = chatters.map(c => c.slug === editData.slug ? editData : c);
      }

      const res = await fetch('/api/admin/chatters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatters: updatedChatters }),
      });

      if (res.ok) {
        alert('✅ 保存成功！碎语已写入本地文件。\n\n别忘了使用 Git 命令提交更改到线上。');
        setEditing(null);
        setEditData(null);
        fetchChatters();
      } else {
        alert('保存失败');
      }
    } catch (error) {
      alert('保存失败');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这条碎语吗？')) return;

    try {
      const updatedChatters = chatters.filter(c => c.slug !== slug);
      const res = await fetch('/api/admin/chatters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatters: updatedChatters }),
      });

      if (res.ok) {
        alert('删除成功！');
        fetchChatters();
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
            {editing === 'new' ? '新建碎语' : '编辑碎语'}
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
              placeholder="chatter-slug"
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
              placeholder="碎语标题"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              内容
            </label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={5}
              placeholder="写点什么..."
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
              标签 (逗号分隔)
            </label>
            <input
              type="text"
              value={(editData.tags || []).join(', ')}
              onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="标签1, 标签2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              心情 (可选)
            </label>
            <input
              type="text"
              value={editData.mood || ''}
              onChange={(e) => setEditData({ ...editData, mood: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="兴奋 / 专注 / 好奇"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              封面图片 URL (可选)
            </label>
            <input
              type="url"
              value={editData.cover || ''}
              onChange={(e) => setEditData({ ...editData, cover: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="https://..."
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
          碎语列表 ({filteredChatters.length}/{chatters.length})
        </h2>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 flex items-center gap-2"
        >
          <Plus size={16} /> 新建碎语
        </button>
      </div>

      {/* 搜索 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="搜索碎语标题或内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {filteredChatters.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          {chatters.length === 0 ? '暂无碎语，点击"新建碎语"开始记录' : '没有找到匹配的碎语'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChatters.map((chatter) => (
            <div
              key={chatter.slug}
              className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-start justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  {chatter.title}
                </h3>
                <p className="text-slate-900 dark:text-white mb-2 whitespace-pre-wrap">
                  {chatter.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
                  <span>📅 {chatter.date}</span>
                  {chatter.mood && <span>💭 {chatter.mood}</span>}
                  {chatter.tags && chatter.tags.length > 0 && (
                    <span>🏷️ {chatter.tags.join(', ')}</span>
                  )}
                  <span className="text-slate-400 dark:text-slate-600">🔗 {chatter.slug}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(chatter)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  title="编辑"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(chatter.slug)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  title="删除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
