import { useState, useCallback, useEffect } from 'react';

const DURATION = 4200; // ms, durasi auto-dismiss

export function useFlash() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), DURATION);
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
