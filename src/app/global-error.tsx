'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              应用出错
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {error.message || '应用发生了严重错误'}
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
