"use client";
import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

interface SiteSettings {
  title: string;
  authorName: string;
  navTitle: string;
  bio: string;
  avatarUrl: string;
  email: string;
  github: string;
  musicIds: string[];
  danmakuList: string[];
  buildDate: string;
  icpName: string;
  icpLink: string;
}

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>({
    title: '',
    authorName: '',
    navTitle: '',
    bio: '',
    avatarUrl: '',
    email: '',
    github: '',
    musicIds: [],
    danmakuList: [],
    buildDate: '',
    icpName: '',
    icpLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMusicId, setNewMusicId] = useState('');
  const [newDanmaku, setNewDanmaku] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/site-settings');
      const data = await res.json();
      const settingsData = data.data || data; // 解包 successResponse 格式
      setSettings({
        ...settingsData,
        musicIds: settingsData.musicIds || [],
        danmakuList: settingsData.danmakuList || [],
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('✅ 保存成功！请重启开发服务器以查看更改');
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

  const addMusicId = () => {
    if (newMusicId.trim()) {
      setSettings({
        ...settings,
        musicIds: [...settings.musicIds, newMusicId.trim()],
      });
      setNewMusicId('');
    }
  };

  const removeMusicId = (index: number) => {
    setSettings({
      ...settings,
      musicIds: settings.musicIds.filter((_, i) => i !== index),
    });
  };

  const addDanmaku = () => {
    if (newDanmaku.trim()) {
      setSettings({
        ...settings,
        danmakuList: [...settings.danmakuList, newDanmaku.trim()],
      });
      setNewDanmaku('');
    }
  };

  const removeDanmaku = (index: number) => {
    setSettings({
      ...settings,
      danmakuList: settings.danmakuList.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 基本信息 */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🌐</span> 网站基本信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              网站标题
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="Yvdiの小窝"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              作者名称
            </label>
            <input
              type="text"
              value={settings.authorName}
              onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="Yvdi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              导航标题
            </label>
            <input
              type="text"
              value={settings.navTitle}
              onChange={(e) => setSettings({ ...settings, navTitle: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="Yvdiの小窝"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              个人简介
            </label>
            <input
              type="text"
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="在校大学生|业余开发者"
            />
          </div>
        </div>
      </section>

      {/* 头像上传 */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>👤</span> 头像设置
        </h2>
        <ImageUploader
          currentImage={settings.avatarUrl}
          onImageUploaded={(url) => setSettings({ ...settings, avatarUrl: url })}
          label="网站头像"
        />
      </section>

      {/* 联系方式 */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📧</span> 联系方式
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              GitHub 用户名
            </label>
            <input
              type="text"
              value={settings.github}
              onChange={(e) => setSettings({ ...settings, github: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="yvdi-abc"
            />
          </div>
        </div>
      </section>

      {/* 音乐ID管理 */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🎵</span> 音乐播放列表
        </h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMusicId}
              onChange={(e) => setNewMusicId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMusicId()}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="输入网易云音乐 ID（如：1809646618）"
            />
            <button
              onClick={addMusicId}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              添加
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(settings.musicIds || []).map((id, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <span className="text-slate-900 dark:text-white font-mono">{id}</span>
                <button
                  onClick={() => removeMusicId(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            💡 提示：访问网易云音乐网页版，播放歌曲后从URL中获取歌曲ID
          </p>
        </div>
      </section>

      {/* 弹幕管理 */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>💬</span> 背景弹幕内容
        </h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newDanmaku}
              onChange={(e) => setNewDanmaku(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDanmaku()}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="输入弹幕内容"
            />
            <button
              onClick={addDanmaku}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              添加
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(settings.danmakuList || []).map((text, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <span className="text-slate-900 dark:text-white">{text}</span>
                <button
                  onClick={() => removeDanmaku(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ICP备案 */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📋</span> ICP 备案信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              备案号
            </label>
            <input
              type="text"
              value={settings.icpName}
              onChange={(e) => setSettings({ ...settings, icpName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="萌ICP备20260249号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              备案链接
            </label>
            <input
              type="url"
              value={settings.icpLink}
              onChange={(e) => setSettings({ ...settings, icpLink: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="https://icp.gov.moe/?keyword=20260249"
            />
          </div>
        </div>
      </section>

      {/* 建站日期 */}
      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📅</span> 建站日期
        </h2>
        <input
          type="date"
          value={settings.buildDate}
          onChange={(e) => setSettings({ ...settings, buildDate: e.target.value })}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        />
      </section>

      {/* 保存按钮 */}
      <div className="flex justify-end gap-4">
        <button
          onClick={loadSettings}
          className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          重置
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? '保存中...' : '💾 保存所有设置'}
        </button>
      </div>
    </div>
  );
}
