import React from 'react';

// set ketinggian 
export default function Flash({ toasts, removeToast, topClass = 'top-16' }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={`fixed ${topClass} left-1/2 -translate-x-1/2 z-[999999] flex flex-col gap-3 items-center pointer-events-none transition-all duration-300`}>
      {toasts.map(t => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        
        const borderClass = isSuccess ? 'border-emerald-500' : isError ? 'border-rose-500' : 'border-blue-500';
        const iconColorClass = isSuccess ? 'text-emerald-500' : isError ? 'text-rose-500' : 'text-blue-500';

        return (
          <div 
            key={t.id} 
            className={`pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-[90vw] p-4 rounded-xl bg-white shadow-2xl border-l-4 ${borderClass} transition-all duration-300 relative overflow-hidden`}
          >
            <div className={`w-6 h-6 shrink-0 ${iconColorClass}`}>
              {isSuccess && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              )}
              {isError && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              )}
              {!isSuccess && !isError && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              )}
            </div>
            <div className="flex-1 text-sm font-semibold text-slate-800">{t.message}</div>
            <button 
              type="button"
              className="bg-transparent border-0 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-800 p-1 rounded-md transition-all flex items-center justify-center" 
              onClick={() => removeToast(t.id)}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
