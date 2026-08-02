"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

interface Friend {
  name: string;
  link: string;
  avatar: string;
  description: string;
}

export default function FriendsManager() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [editData, setEditData] = useState<Friend | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤友链
  const filteredFriends = friends.filter(friend => {
    const matchSearch = friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       friend.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       friend.link.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch('/api/admin/friends');
      const data = await res.json();
      setFriends(data.friends || []);
    } catch (error) {
      alert('加载友链失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    const newFriend: Friend = {
      name: '',
      link: '',
      avatar: '',
      description: '',
    };
    setEditData(newFriend);
    setEditing('new');
  };

  const handleEdit = (index: number) => {
    setEditData({ ...friends[index] });
    setEditing(index);
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      let updatedFriends: Friend[];
      if (editing === 'new') {
        updatedFriends = [...friends, editData];
      } else {
        updatedFriends = friends.map((f, i) => i === editing ? editData : f);
      }

      const res = await fetch('/api/admin/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friends: updatedFriends }),
      });

      if (res.ok) {
        alert('✅ 保存成功！友链已写入本地文件。\n\n别忘了使用 Git 命令提交更改到线上。');
        setEditing(null);
        setEditData(null);
        fetchFriends();
      } else {
        alert('保存失败');
      }
    } catch (error) {
      alert('保存失败');
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('确定要删除这个友链吗？')) return;

    try {
      const updatedFriends = friends.filter((_, i) => i !== index);
      const res = await fetch('/api/admin/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friends: updatedFriends }),
      });

      if (res.ok) {
        alert('删除成功！');
        fetchFriends();
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
  if (editing !== null && editData) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 填写完所有字段后，点击右上角的<strong>保存</strong>按钮，内容会立即写入文件系统
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {editing === 'new' ? '新建友链' : '编辑友链'}
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
              名称
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="网站名称"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              链接
            </label>
            <input
              type="url"
              value={editData.link}
              onChange={(e) => setEditData({ ...editData, link: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              头像 URL
            </label>
            <input
              type="url"
              value={editData.avatar}
              onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="https://..."
            />
            {editData.avatar && (
              <img
                src={editData.avatar}
                alt="预览"
                className="mt-2 w-16 h-16 rounded-full object-cover"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              描述
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={3}
              placeholder="网站简介"
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
          友链列表 ({filteredFriends.length}/{friends.length})
        </h2>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 flex items-center gap-2"
        >
          <Plus size={16} /> 新建友链
        </button>
      </div>

      {/* 搜索 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="搜索友链名称、描述或链接..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {filteredFriends.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          {friends.length === 0 ? '暂无友链，点击"新建友链"开始添加' : '没有找到匹配的友链'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFriends.map((friend, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-3">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate">
                    {friend.name}
                  </h3>
                  <a
                    href={friend.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline truncate block"
                  >
                    {friend.link}
                  </a>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                {friend.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(friends.indexOf(friend))}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <Edit size={14} /> 编辑
                </button>
                <button
                  onClick={() => handleDelete(friends.indexOf(friend))}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <Trash2 size={14} /> 删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
