import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ActionDropdown({
  item,
  onEdit,
  onDelete,
  onViewFile,
  editLabel = 'Edit Data',
  deleteLabel = 'Hapus Data',
  viewLabel = 'Buka / Lihat File',
  disabledDelete = false,
  deleteTitle = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0, isUpward: false });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const calculatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const isUpward = spaceBelow < 200;

    if (isUpward) {
      // Centered vertically relative to the ⋮ button
      setCoords({
        top: rect.top + rect.height / 2,
        right: window.innerWidth - rect.right,
        isUpward: true
      });
    } else {
      setCoords({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
        isUpward: false
      });
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (e, callback) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsOpen(false);
    if (callback) {
      callback(item);
    }
  };

  return (
    <div className="inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors font-bold text-lg leading-none focus:outline-none cursor-pointer"
        title="Opsi Aksi"
      >
        ⋮
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              right: `${coords.right}px`,
              transform: coords.isUpward ? 'translateY(-50%)' : 'none'
            }}
            className="z-[9999] w-48 md:w-52 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
          >
            {onViewFile && (
              <button
                type="button"
                onClick={(e) => handleAction(e, onViewFile)}
                className="block w-full rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left cursor-pointer"
              >
                {viewLabel}
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={(e) => handleAction(e, onEdit)}
                className="block w-full rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                {editLabel}
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => !disabledDelete && handleAction(e, onDelete)}
                disabled={disabledDelete}
                title={deleteTitle}
                className={`block w-full rounded-lg px-3.5 py-2.5 text-sm font-semibold text-left transition-colors ${
                  disabledDelete
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-rose-600 hover:bg-rose-50 cursor-pointer'
                }`}
              >
                {deleteLabel}
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
