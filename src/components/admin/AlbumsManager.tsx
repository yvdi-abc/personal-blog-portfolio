"use client";
import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

interface Photo {
  url: string;
  caption?: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  photos: Photo[];
}

export default function AlbumsManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Album>({
    id: '',
    title: '',
    description: '',
    cover: '',
    date: new Date().getFullYear().toString(),
    photos: [],
  });

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const res = await fetch('/api/admin/albums');
      const data = await res.json();
      setAlbums(data);
    } catch (error) {
      console.error('Failed to load albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...albums[index] });
  };

  const handleNew = () => {
    setEditingIndex(-1);
    setFormData({
      id: '',
      title: '',
      description: '',
      cover: '',
      date: new Date().getFullYear().toString(),
      photos: [],
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({
      id: '',
      title: '',
      description: '',
      cover: '',
      date: new Date().getFullYear().toString(),
      photos: [],
    });
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title || !formData.cover) {
      alert('请填写相册ID、标题并选择封面');
      return;
    }

    setSaving(true);
    try {
      let updatedAlbums;
      if (editingIndex === -1) {
        // 检查ID是否重复
        if (albums.some(a => a.id === formData.id)) {
          alert('❌ 相册ID已存在，请使用其他ID');
          setSaving(false);
          return;
        }
        updatedAlbums = [...albums, formData];
      } else {
        updatedAlbums = albums.map((a, i) => (i === editingIndex ? formData : a));
      }

      const res = await fetch('/api/admin/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAlbums),
      });

      if (res.ok) {
        setAlbums(updatedAlbums);
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
    if (!confirm('确定要删除这个相册吗？')) return;

    setSaving(true);
    try {
      const updatedAlbums = albums.filter((_, i) => i !== index);

      const res = await fetch('/api/admin/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAlbums),
      });

      if (res.ok) {
        setAlbums(updatedAlbums);
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

  const addPhoto = (url: string) => {
    setFormData({
      ...formData,
      photos: [...formData.photos, { url }],
    });
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
    });
  };

  const updatePhotoCaption = (index: number, caption: string) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos[index] = { ...updatedPhotos[index], caption };
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const setCoverFromPhoto = (url: string) => {
    setFormData({ ...formData, cover: url });
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
            {editingIndex === -1 ? '📸 新建相册' : '✏️ 编辑相册'}
          </h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ✕ 取消
          </button>
        </div>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                相册ID * <span className="text-xs text-slate-500">(英文，用于URL)</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                disabled={editingIndex !== -1}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-50"
                placeholder="dongwuyuan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                年份
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              相册标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="动物园"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              相册描述
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="可爱生灵的欢乐时光"
            />
          </div>

          {/* 封面图 */}
          <div>
            <ImageUploader
              currentImage={formData.cover}
              onImageUploaded={(url) => setFormData({ ...formData, cover: url })}
              label="相册封面 *"
            />
            {formData.photos.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                💡 提示：也可以从下方照片中选择一张作为封面
              </p>
            )}
          </div>

          {/* 照片管理 */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              📷 相册照片 ({formData.photos.length})
            </h3>

            {/* 上传新照片 */}
            <div className="mb-4">
              <ImageUploader
                onImageUploaded={addPhoto}
                label="添加照片到相册"
              />
            </div>

            {/* 照片列表 */}
            {formData.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative group bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `照片 ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => setCoverFromPhoto(photo.url)}
                        className="w-full px-3 py-1.5 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition-colors"
                      >
                        设为封面
                      </button>
                      <button
                        onClick={() => removePhoto(index)}
                        className="w-full px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                暂无照片，点击上方上传按钮添加
              </p>
            )}
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
            {saving ? '保存中...' : '💾 保存相册'}
          </button>
        </div>
      </div>
    );
  }

  // 相册列表
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          📸 相册管理 ({albums.length})
        </h2>
        <button
          onClick={handleNew}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">+</span> 新建相册
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album, index) => (
          <div
            key={album.id}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border-2 border-transparent hover:border-teal-500/30 transition-all"
          >
            <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {album.photos.length} 张
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {album.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {album.description}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                {album.date} · ID: {album.id}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm"
                >
                  ✏️ 编辑
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  🗑️ 删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {albums.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p className="text-lg mb-2">📸 暂无相册</p>
          <p className="text-sm">点击上方"新建相册"按钮开始添加</p>
        </div>
      )}
    </div>
  );
}
