"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostsManager from '@/components/admin/PostsManager';
import ChattersManager from '@/components/admin/ChattersManager';
import FriendsManager from '@/components/admin/FriendsManager';
import ConfigManager from '@/components/admin/ConfigManager';

type Tab = 'posts' | 'chatters' | 'friends' | 'config';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  // 检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth');
        const data = await res.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // 登出功能
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 正在检查认证状态
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">验证身份中...</p>
        </div>
      </div>
    );
  }

  // 未认证
  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: 'config' as Tab, label: '👤 个人信息', color: 'teal' },
    { id: 'posts' as Tab, label: '📝 博客文章', color: 'teal' },
    { id: 'chatters' as Tab, label: '💭 碎语', color: 'purple' },
    { id: 'friends' as Tab, label: '🔗 友链', color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              🛠️ 管理后台
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              编辑网站内容，保存后提交到 Git 即可同步到线上
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            登出
          </button>
        </div>

        {/* 使用说明 */}
        <div className="mb-6 p-5 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-l-4 border-teal-500 rounded-xl">
          <h3 className="font-bold text-teal-900 dark:text-teal-400 mb-3 text-lg flex items-center gap-2">
            📖 使用说明
          </h3>
          <div className="space-y-2 text-sm text-teal-800 dark:text-teal-300">
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">1.</span>
              <span>在下方选择要编辑的内容类型（个人信息、博客文章、碎语、友链）</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">2.</span>
              <span>点击<strong>新建</strong>按钮创建内容，或点击<strong>编辑</strong>按钮修改现有内容</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">3.</span>
              <span>编辑完成后点击<strong>保存</strong>按钮，更改会立即写入本地文件</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">4.</span>
              <span><strong className="text-amber-700 dark:text-amber-400">重要：</strong>修改个人信息配置后，需要重启开发服务器才能看到效果</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">5.</span>
              <span>所有修改完成后，使用下方的 Git 命令提交到仓库并推送到线上</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
          {activeTab === 'config' && <ConfigManager />}
          {activeTab === 'posts' && <PostsManager />}
          {activeTab === 'chatters' && <ChattersManager />}
          {activeTab === 'friends' && <FriendsManager />}
        </div>

        {/* Git 提交说明 */}
        <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-xl">
          <h3 className="font-bold text-amber-900 dark:text-amber-400 mb-3 flex items-center gap-2">
            🚀 提交更改到线上
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
            编辑完成后，在终端运行以下命令将更改提交到 Git 仓库：
          </p>
          <div className="space-y-2">
            <div className="bg-amber-100 dark:bg-amber-950/50 p-4 rounded-lg">
              <code className="block text-sm font-mono text-amber-900 dark:text-amber-200">
                git add -A
              </code>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">暂存所有修改的文件</p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-950/50 p-4 rounded-lg">
              <code className="block text-sm font-mono text-amber-900 dark:text-amber-200">
                git commit -m "update: 更新网站内容"
              </code>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">创建提交（可以修改提交信息）</p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-950/50 p-4 rounded-lg">
              <code className="block text-sm font-mono text-amber-900 dark:text-amber-200">
                git push
              </code>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">推送到远程仓库，Vercel 会自动部署</p>
            </div>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">
            💡 提示：也可以合并为一条命令：<code className="bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded">git add -A && git commit -m "update: 更新内容" && git push</code>
          </p>
        </div>
      </div>
    </div>
  );
}
