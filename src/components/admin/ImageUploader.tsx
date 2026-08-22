"use client";
import { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
  accept?: string;
}

export default function ImageUploader({
  onImageUploaded,
  currentImage,
  label = "上传图片",
  accept = "image/*"
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);

    try {
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
      };
      reader.readAsDataURL(file);

      // 上传到服务器
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('上传失败');
      }

      const data = await res.json();
      onImageUploaded(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (!url) {
      alert('请输入图片 URL');
      return;
    }

    // 验证是否为有效 URL
    try {
      new URL(url);
    } catch {
      if (!url.startsWith('/')) {
        alert('请输入有效的图片 URL');
        return;
      }
    }

    setPreview(url);
    onImageUploaded(url);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    setPreview('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border-2 border-slate-200 dark:border-slate-700"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              更换图片
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
            >
              🔗 使用 URL
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              移除图片
            </button>
          </div>
        </div>
      ) : (
        <>
          {showUrlInput ? (
            <div className="space-y-3 p-4 border-2 border-dashed border-teal-500 rounded-xl bg-teal-50 dark:bg-teal-900/10">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="font-medium text-teal-700 dark:text-teal-300">输入图片 URL</span>
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://example.com/image.jpg 或 /uploads/image.jpg"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
                >
                  ✓ 确认
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                  }}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-teal-500 transition-colors flex flex-col items-center justify-center gap-3 text-slate-600 dark:text-slate-400 hover:text-teal-500 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-12 w-12" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>上传中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium">点击上传图片</span>
                    <span className="text-sm">支持 JPG、PNG、GIF（最大 5MB）</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="w-full py-2.5 border-2 border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                或使用图片 URL
              </button>
            </div>
          )}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
