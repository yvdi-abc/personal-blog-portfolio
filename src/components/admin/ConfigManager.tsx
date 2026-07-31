"use client";
import { useState, useEffect } from 'react';
import { Save, User, Mail, Image as ImageIcon, FileText, Link } from 'lucide-react';

interface Config {
  title: string;
  authorName: string;
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  email: string;
}

export default function ConfigManager() {
  const [config, setConfig] = useState<Config>({
    title: '',
    authorName: '',
    bio: '',
    avatarUrl: '',
    githubUrl: '',
    email: '',
  });
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      setConfig(data.config || {});
      setAboutContent(data.aboutContent || '');
    } catch (error) {
      alert('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, aboutContent }),
      });

      if (res.ok) {
        alert('✅ 保存成功！\n\n请按以下步骤操作：\n1. 按 Ctrl+C 停止开发服务器\n2. 重新运行 npm run dev\n3. 刷新页面查看更新');
      } else {
        alert('保存失败');
      }
    } catch (error) {
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600 dark:text-slate-400">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 修改个人信息后，点击右上角的<strong>保存</strong>按钮。<strong className="text-amber-700 dark:text-amber-400">保存后需要重启开发服务器</strong>（Ctrl+C 然后重新运行 npm run dev）才能看到配置更新
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          个人信息配置
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> {saving ? '保存中...' : '保存'}
        </button>
      </div>

      {/* 基本信息 */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={20} /> 基本信息
        </h3>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            网站标题
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Yuxi Wang · 全栈开发"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            作者名称
          </label>
          <input
            type="text"
            value={config.authorName}
            onChange={(e) => setConfig({ ...config, authorName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Yuxi Wang"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            个人简介（一句话）
          </label>
          <input
            type="text"
            value={config.bio}
            onChange={(e) => setConfig({ ...config, bio: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="全栈开发工程师 | 热衷于构建兼具性能与美感的数字产品"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            显示在首页个人卡片和各个页面的作者信息中
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <ImageIcon size={16} /> 头像 URL
          </label>
          <input
            type="url"
            value={config.avatarUrl}
            onChange={(e) => setConfig({ ...config, avatarUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="/avatar.jpg"
          />
          {config.avatarUrl && (
            <img
              src={config.avatarUrl}
              alt="头像预览"
              className="mt-2 w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      {/* 社交链接 */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Link size={20} /> 社交链接
        </h3>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Link size={16} /> GitHub URL
          </label>
          <input
            type="url"
            value={config.githubUrl}
            onChange={(e) => setConfig({ ...config, githubUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Mail size={16} /> 邮箱
          </label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => setConfig({ ...config, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="hello@example.com"
          />
        </div>
      </div>

      {/* 关于页面详细内容 */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText size={20} /> 关于页面详细内容
        </h3>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            内容 (Markdown)
          </label>
          <textarea
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
            rows={15}
            placeholder="# 关于我&#10;&#10;这里写你的详细介绍..."
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            显示在 /about 页面，支持 Markdown 格式
          </p>
        </div>
      </div>

      {/* 提示 */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          💡 <strong>提示：</strong>保存后需要重启开发服务器 (Ctrl+C 然后重新运行 <code className="bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded">npm run dev</code>) 才能看到配置更新。
        </p>
      </div>
    </div>
  );
}
