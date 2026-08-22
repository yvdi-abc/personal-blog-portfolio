"use client";
import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

interface Project {
  name: string;
  desc: string;
  tags: string[];
  icon: string;
  link?: string;
  cover?: string;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>({
    name: '',
    desc: '',
    tags: [],
    icon: '📦',
    link: '',
    cover: '',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data.data || data); // 支持两种返回格式
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...projects[index] });
  };

  const handleNew = () => {
    setEditingIndex(-1);
    setFormData({
      name: '',
      desc: '',
      tags: [],
      icon: '📦',
      link: '',
      cover: '',
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({
      name: '',
      desc: '',
      tags: [],
      icon: '📦',
      link: '',
      cover: '',
    });
    setTagInput('');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.desc) {
      alert('请填写项目名称和描述');
      return;
    }

    setSaving(true);
    try {
      let updatedProjects;
      if (editingIndex === -1) {
        // 新建
        updatedProjects = [...projects, formData];
      } else {
        // 编辑
        updatedProjects = projects.map((p, i) => (i === editingIndex ? formData : p));
      }

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects),
      });

      if (res.ok) {
        setProjects(updatedProjects);
        handleCancel();
        alert('✅ 保存成功！');
      } else {
        alert('❌ 保存失败，请重试');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ 保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('确定要删除这个项目吗？')) return;

    setSaving(true);
    try {
      const updatedProjects = projects.filter((_, i) => i !== index);

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects),
      });

      if (res.ok) {
        setProjects(updatedProjects);
        alert('✅ 删除成功！');
      } else {
        alert('❌ 删除失败，请重试');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ 删除失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  // 编辑/新建表单
  if (editingIndex !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {editingIndex === -1 ? '📦 新建项目' : '✏️ 编辑项目'}
          </h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ✕ 取消
          </button>
        </div>

        <div className="space-y-4">
          {/* 项目名称和图标 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                项目名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="输入项目名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                图标 Emoji
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-center text-2xl"
                placeholder="📦"
                maxLength={4}
              />
            </div>
          </div>

          {/* 项目描述 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              项目描述 *
            </label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none"
              placeholder="输入项目描述"
            />
          </div>

          {/* 项目链接 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              项目链接
            </label>
            <input
              type="url"
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* 标签管理 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              技术标签
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="输入标签（如：Python、React）"
              />
              <button
                onClick={addTag}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 封面图片 */}
          <div>
            <ImageUploader
              currentImage={formData.cover}
              onImageUploaded={(url) => setFormData({ ...formData, cover: url })}
              label="项目封面图片（可选）"
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? '保存中...' : '💾 保存项目'}
          </button>
        </div>
      </div>
    );
  }

  // 项目列表
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          📦 项目管理 ({projects.length})
        </h2>
        <button
          onClick={handleNew}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">+</span> 新建项目
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border-2 border-transparent hover:border-teal-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              {/* 图标和封面 */}
              <div className="flex-shrink-0">
                {project.cover ? (
                  <img
                    src={project.cover}
                    alt={project.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-3xl">
                    {project.icon}
                  </div>
                )}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {project.desc}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗 查看链接
                    </a>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
                >
                  ✏️ 编辑
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  disabled={saving}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                >
                  🗑️ 删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p className="text-lg mb-2">📦 暂无项目</p>
          <p className="text-sm">点击上方"新建项目"按钮开始添加</p>
        </div>
      )}
    </div>
  );
}
