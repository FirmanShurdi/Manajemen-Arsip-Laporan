import React, { useState, useEffect } from 'react';

export default function TotpTimer({ onTick, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(30 - (Math.floor(Date.now() / 1000) % 30));

  useEffect(() => {
    const updateTimer = () => {
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(remaining);
      if (onTick) onTick(remaining);
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [onTick, onExpire]);

  // Skema warna dinamis: Biru (>15s) -> Kuning (6-15s) -> Merah (1-5s + pulse)
  let colorClasses = "bg-blue-50/90 text-blue-600 border-blue-200/90";
  let ringColor = "#2563eb"; // Blue 600

  if (timeLeft <= 5) {
    colorClasses = "bg-red-50/90 text-red-600 border-red-300/90 animate-pulse font-bold";
    ringColor = "#dc2626"; // Red 600
  } else if (timeLeft <= 15) {
    colorClasses = "bg-amber-50/90 text-amber-600 border-amber-300/90 font-semibold";
    ringColor = "#d97706"; // Amber 600
  }

  // Lingkaran SVG animasi progres waktu
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  return (
    <div 
      className={`absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono tracking-tighter transition-all duration-300 pointer-events-none select-none z-20 shadow-xs ${colorClasses}`}
      title="Hitungan mundur masa berlaku kode authenticator"
    >
      <svg className="w-3.5 h-3.5 -rotate-90 transform" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="#cbd5e1"
          strokeWidth="3"
          fill="transparent"
        />
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke={ringColor}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span>{timeLeft}s</span>
    </div>
  );
}
