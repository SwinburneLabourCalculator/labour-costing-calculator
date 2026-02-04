
import React from 'react';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  hint?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, value, onChange, prefix, suffix, step = "0.01", hint 
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-400 text-sm font-medium">{prefix}</span>
        )}
        <input
          type="number"
          step={step}
          value={value === 0 ? "" : value}
          placeholder="0.00"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 font-medium ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-12' : 'pr-4'}`}
        />
        {suffix && (
          <span className="absolute right-3 text-slate-400 text-xs font-semibold">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-[10px] text-slate-500 italic mt-0.5 leading-tight">{hint}</p>}
    </div>
  );
};
