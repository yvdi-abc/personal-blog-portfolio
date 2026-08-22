"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EffectsContextType {
  heavyEffectsEnabled: boolean;
  toggleHeavyEffects: () => void;
}

const EffectsContext = createContext<EffectsContextType | null>(null);

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [heavyEffectsEnabled, setHeavyEffectsEnabled] = useState(false);

  // 从 localStorage 读取用户偏好
  useEffect(() => {
    const saved = localStorage.getItem('heavyEffectsEnabled');
    if (saved !== null) {
      setHeavyEffectsEnabled(saved === 'true');
    }
  }, []);

  const toggleHeavyEffects = () => {
    setHeavyEffectsEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('heavyEffectsEnabled', String(newValue));
      return newValue;
    });
  };

  return (
    <EffectsContext.Provider value={{ heavyEffectsEnabled, toggleHeavyEffects }}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error('useEffects must be used within EffectsProvider');
  }
  return context;
}
