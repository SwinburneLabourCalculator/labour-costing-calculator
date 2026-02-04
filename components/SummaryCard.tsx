
import React from 'react';

interface SummaryCardProps {
  title: string;
  rows: { 
    label: string; 
    value: string | number; 
    isBold?: boolean; 
    isCurrency?: boolean;
    hint?: string;
  }[];
  accentColor?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, rows, accentColor = "indigo" }) => {
  const colorMap: Record<string, string> = {
    indigo: "border-indigo-500 bg-indigo-50/30",
    emerald: "border-emerald-500 bg-emerald-50/30",
    orange: "border-orange-500 bg-orange-50/30",
    rose: "border-rose-500 bg-rose-50/30",
  };

  return (
    <div className={`p-5 rounded-xl border-l-4 shadow-sm ${colorMap[accentColor]}`}>
      <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2">
        {rows.map((row, idx) => (
          // Wrapped in a flex-col container to support optional hint rendering below the label/value row
          <div key={idx} className="flex flex-col">
            <div className={`flex justify-between items-center ${row.isBold ? 'pt-2 mt-2 border-t border-slate-200' : ''}`}>
              <span className={`text-sm ${row.isBold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{row.label}:</span>
              <span className={`text-sm ${row.isBold ? 'text-lg font-extrabold text-slate-900' : 'font-semibold text-slate-800'}`}>
                {row.isCurrency ? `$${Number(row.value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : row.value}
              </span>
            </div>
            {row.hint && (
              <span className="text-[10px] text-slate-500 italic text-right -mt-0.5 leading-tight pr-1">
                {row.hint}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
