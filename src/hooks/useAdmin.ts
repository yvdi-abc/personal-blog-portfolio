/**
 * 管理后台通用 React Hooks
 */
import { useState, useCallback } from 'react';

/**
 * API 请求状态管理 Hook
 */
export function useApiRequest<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    request: () => Promise<Response>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
      successMessage?: string;
      errorMessage?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await request();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || '请求失败');
      }

      if (options?.successMessage) {
        alert(options.successMessage);
      }

      if (options?.onSuccess) {
        options.onSuccess(data);
      }

      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (options?.errorMessage || '操作失败');
      setError(errorMsg);

      if (options?.onError) {
        options.onError(errorMsg);
      } else {
        alert(`❌ ${errorMsg}`);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
}

/**
 * 数据列表管理 Hook
 */
export function useDataList<T>(fetchUrl: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await window.fetch(fetchUrl);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || result.error || '加载失败');
      }

      // 支持多种响应格式
      const items = result.data || result.posts || result.chatters ||
                    result.projects || result.friends || result.albums || result;

      setData(Array.isArray(items) ? items : []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '加载数据失败';
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  const refresh = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refresh, setData };
}

/**
 * 编辑器状态管理 Hook
 */
export function useEditor<T>() {
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<T | null>(null);

  const startNew = useCallback((defaultData: T) => {
    setEditData(defaultData);
    setEditing('new');
  }, []);

  const startEdit = useCallback((id: string, data: T) => {
    setEditData({ ...data } as T);
    setEditing(id);
  }, []);

  const cancel = useCallback(() => {
    setEditing(null);
    setEditData(null);
  }, []);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  return {
    editing,
    editData,
    isEditing: editing !== null,
    isNew: editing === 'new',
    startNew,
    startEdit,
    cancel,
    updateField,
    setEditData,
  };
}

/**
 * 搜索和过滤 Hook
 */
export function useFilter<T>(
  items: T[],
  searchFields: (keyof T)[],
  filterFn?: (item: T) => boolean
) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = items.filter(item => {
    // 搜索匹配
    const matchSearch = searchTerm === '' || searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (Array.isArray(value)) {
        return value.some(v =>
          typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    });

    // 自定义过滤
    const matchFilter = !filterFn || filterFn(item);

    return matchSearch && matchFilter;
  });

  return { searchTerm, setSearchTerm, filtered };
}

/**
 * 确认对话框 Hook
 */
export function useConfirm() {
  const confirm = useCallback((message: string): boolean => {
    return window.confirm(message);
  }, []);

  return { confirm };
}
