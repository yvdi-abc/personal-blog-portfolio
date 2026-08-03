"use client";

import { useState } from 'react';

export default function CalculatorTool() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(current);
    } else if (operation) {
      const result = calculate(prevValue, current, operation);
      setDisplay(String(result));
      setPrevValue(result);
    }

    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const current = parseFloat(display);
      const result = calculate(prevValue, current, operation);
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['C', '0', '.', '+'],
  ];

  return (
    <div className="flex flex-col gap-3" style={{ cursor: 'auto' }}>
      {/* 显示屏 */}
      <div className="bg-slate-900/60 dark:bg-slate-950/60 rounded-xl p-4 text-right border border-slate-700/50" style={{ cursor: 'default' }}>
        <div className="text-xs text-slate-400 font-mono h-4 truncate">
          {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
        </div>
        <div className="text-2xl font-bold text-white font-mono mt-1 truncate">
          {display}
        </div>
      </div>

      {/* 按键区 */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn) => {
          const isOperation = ['÷', '×', '-', '+'].includes(btn);
          const isClear = btn === 'C';

          return (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === '.') handleDecimal();
                else if (isOperation) handleOperation(btn);
                else handleNumber(btn);
              }}
              className={`h-12 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                isClear
                  ? 'bg-red-500/80 hover:bg-red-600 text-white'
                  : isOperation
                  ? 'bg-indigo-500/80 hover:bg-indigo-600 text-white'
                  : 'bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 text-slate-800 dark:text-white'
              }`}
              style={{ cursor: 'pointer' }}
            >
              {btn}
            </button>
          );
        })}
      </div>

      {/* 等号按钮 */}
      <button
        onClick={handleEquals}
        className="h-12 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-bold text-lg transition-all active:scale-95 shadow-md"
        style={{ cursor: 'pointer' }}
      >
        =
      </button>
    </div>
  );
}
