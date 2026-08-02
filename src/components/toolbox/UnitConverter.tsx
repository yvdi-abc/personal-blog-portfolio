"use client";

import { useState } from 'react';

const CONVERSIONS = {
  length: {
    name: '长度',
    units: { 'm': '米', 'cm': '厘米', 'mm': '毫米', 'km': '千米', 'ft': '英尺', 'in': '英寸' },
    convert: (value: number, from: string, to: string) => {
      const toMeters: Record<string, number> = { m: 1, cm: 0.01, mm: 0.001, km: 1000, ft: 0.3048, in: 0.0254 };
      return (value * toMeters[from]) / toMeters[to];
    }
  },
  weight: {
    name: '重量',
    units: { 'kg': '千克', 'g': '克', 'mg': '毫克', 'lb': '磅', 'oz': '盎司' },
    convert: (value: number, from: string, to: string) => {
      const toKg: Record<string, number> = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 };
      return (value * toKg[from]) / toKg[to];
    }
  },
  temp: {
    name: '温度',
    units: { 'C': '摄氏度', 'F': '华氏度', 'K': '开尔文' },
    convert: (value: number, from: string, to: string) => {
      let celsius = value;
      if (from === 'F') celsius = (value - 32) * 5/9;
      if (from === 'K') celsius = value - 273.15;

      if (to === 'C') return celsius;
      if (to === 'F') return celsius * 9/5 + 32;
      if (to === 'K') return celsius + 273.15;
      return value;
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof CONVERSIONS>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [inputValue, setInputValue] = useState('1');

  const currentCategory = CONVERSIONS[category];
  const result = inputValue && !isNaN(parseFloat(inputValue))
    ? currentCategory.convert(parseFloat(inputValue), fromUnit, toUnit).toFixed(4)
    : '0';

  const handleCategoryChange = (newCategory: keyof typeof CONVERSIONS) => {
    setCategory(newCategory);
    const units = Object.keys(CONVERSIONS[newCategory].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 类别选择 */}
      <div className="flex gap-2">
        {Object.entries(CONVERSIONS).map(([key, { name }]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key as keyof typeof CONVERSIONS)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              category === key
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* 输入值 */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
          >
            {Object.entries(currentCategory.units).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        {/* 等号 */}
        <div className="text-center text-slate-400 text-xl">=</div>

        {/* 结果 */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-sm text-slate-900 dark:text-white font-bold">
            {result}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
          >
            {Object.entries(currentCategory.units).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
