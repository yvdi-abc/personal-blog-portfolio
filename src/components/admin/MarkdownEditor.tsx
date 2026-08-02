"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Upload, Eye, Code } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function MarkdownEditor({ value, onChange, height = '500px' }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const imageMarkdown = `\n![${file.name}](${data.url})\n`;
        onChange(value + imageMarkdown);
        alert('✅ 图片上传成功！');
      } else {
        alert('上传失败');
      }
    } catch (error) {
      alert('上传失败');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-600 px-3 py-2 flex items-center gap-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
            showPreview
              ? 'bg-teal-500 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          {showPreview ? <><Eye size={14} /> 预览</> : <><Code size={14} /> 编辑</>}
        </button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

        <label className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
          uploading
            ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
        }`}>
          <Upload size={14} />
          {uploading ? '上传中...' : '上传图片'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <div className="flex-1" />

        <span className="text-xs text-slate-500 dark:text-slate-400">
          {value.length} 字符
        </span>
      </div>

      {/* 内容区 */}
      <div className="relative" style={{ height }}>
        {showPreview ? (
          <div className="absolute inset-0 overflow-y-auto p-4 bg-white dark:bg-slate-900">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm resize-none focus:outline-none"
            placeholder="开始编写 Markdown 内容..."
          />
        )}
      </div>
    </div>
  );
}
