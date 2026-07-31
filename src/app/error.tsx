'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          出错了
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {error.message || '页面加载时发生错误'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  );
}
