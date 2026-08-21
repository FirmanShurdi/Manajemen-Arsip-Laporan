import { useState, useCallback, useEffect } from 'react';

const DURATION = 4200; // ms, durasi auto-dismiss

// State global & listener untuk Notifikasi Flash terpusat
let globalToasts = [];
let listeners = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...globalToasts]));
};

export function useFlash() {
  const [toasts, setToasts] = useState(globalToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter(l => l !== setToasts);
    };
  }, []);

  const removeToast = useCallback((id) => {
    globalToasts = globalToasts.filter(t => t.id !== id);
    notifyListeners();
  }, []);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message };
    globalToasts = [...globalToasts, newToast];
    notifyListeners();

    setTimeout(() => {
      removeToast(id);
    }, DURATION);
  }, [removeToast]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('_flash');
      if (raw) {
        const flash = JSON.parse(raw);
        localStorage.removeItem('_flash');
        if (flash.type && flash.message) {
          addToast(flash.type, flash.message);
        }
      }
    } catch (_) {}
  }, [addToast]);

  return { toasts, addToast, removeToast };
}
