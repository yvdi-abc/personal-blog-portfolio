"use client";

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  timestamp: number;
}

export default function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputValue, setInputValue] = useState('');

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem('quick-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load notes');
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('quick-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    if (inputValue.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        timestamp: Date.now()
      };
      setNotes([newNote, ...notes]);
      setInputValue('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 max-h-80 overflow-hidden">
      {/* 输入区 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addNote()}
          placeholder="快速记点什么..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addNote}
          className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 便签列表 */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-60 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            还没有便签<br/>
            快速记录你的想法吧
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="group bg-amber-50 dark:bg-slate-700/50 p-3 rounded-lg border border-amber-200 dark:border-slate-600 relative hover:shadow-md transition-all"
            >
              <p className="text-sm text-slate-700 dark:text-slate-200 pr-6 break-words">
                {note.text}
              </p>
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {new Date(note.timestamp).toLocaleString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
