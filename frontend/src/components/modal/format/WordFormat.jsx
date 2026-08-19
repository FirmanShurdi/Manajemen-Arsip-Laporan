import React, { useState, useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import mammoth from 'mammoth';
import PreviewNotice from '../../common/PreviewNotice';

export default function WordFormat({ fileUrl, fileName, ext = 'docx', onError }) {
  const [loading, setLoading] = useState(true);
  const [useFallbackMammoth, setUseFallbackMammoth] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Berkas Word tidak dapat diakses');
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        if (!isMounted) return;

        if (containerRef.current && (ext.toLowerCase() === 'docx' || ext.toLowerCase() === 'doc')) {
          containerRef.current.innerHTML = '';
          return renderAsync(arrayBuffer, containerRef.current, null, {
            className: 'docx',
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            breakPages: true,
            ignoreLastRenderedPageBreak: false,
            experimental: true,
            renderHeaders: true,
            renderFooters: true,
            renderFootnotes: true,
            renderEndnotes: true,
            trimXmlDeclaration: true
          })
            .then(() => {
              if (!isMounted) return;

              // Deteksi dan bersihkan halaman fisik kosong tak terpakai di bagian paling akhir
              if (containerRef.current) {
                const sections = containerRef.current.querySelectorAll('section.docx');
                sections.forEach((sec, idx) => {
                  const textContent = sec.textContent ? sec.textContent.trim() : '';
                  const hasMedia = sec.querySelector('img, table, canvas, svg, iframe');

                  // Jika halaman terakhir kosong tanpa teks dan tanpa media, hapus halaman kosong buatan tersebut
                  if (!textContent && !hasMedia && idx > 0) {
                    sec.remove();
                  }
                });

                const validPages = containerRef.current.querySelectorAll('section.docx');
                setTotalPages(validPages.length || 1);
              }

              setLoading(false);
            })
            .catch((renderErr) => {
              console.warn('Docx-preview render fallback to mammoth:', renderErr);
              return mammoth.convertToHtml({ arrayBuffer }).then((result) => {
                if (isMounted) {
                  setHtmlContent(result.value || '<p class="text-slate-400">Dokumen tidak berisi teks.</p>');
                  setUseFallbackMammoth(true);
                  setLoading(false);
                }
              });
            });
        } else {
          return mammoth.convertToHtml({ arrayBuffer }).then((result) => {
            if (isMounted) {
              setHtmlContent(result.value || '<p class="text-slate-400">Dokumen tidak berisi teks.</p>');
              setUseFallbackMammoth(true);
              setLoading(false);
            }
          });
        }
      })
      .catch((err) => {
        console.error('Error loading Word document:', err);
        if (isMounted) {
          setLoading(false);
          if (onError) onError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fileUrl, ext, onError]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-100/90 rounded-2xl border border-slate-300 shadow-xl text-slate-800 relative">
      {/* Bar Indikator Halaman Dokumen Word */}
      {!loading && !useFallbackMammoth && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white border-b border-slate-200 text-slate-800 shrink-0 text-xs font-semibold shadow-2xs relative z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-bold text-slate-800">Dokumen Microsoft Word (.docx)</span>
          </div>

          <div className="flex items-center gap-3">
            <PreviewNotice fileType="Word" />
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-lg font-bold text-[11px] shadow-2xs">
              {totalPages} Halaman Fisik
            </span>
          </div>
        </div>
      )}

      {/* Viewport Kontainer Kertas Halaman Terpisah */}
      <div className="flex-1 w-full h-full overflow-auto p-4 md:p-8 flex justify-center items-start">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 text-slate-600 bg-white rounded-2xl border border-slate-200 shadow-xl my-auto">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold text-slate-700">Membaca dan memisahkan halaman lembar kertas Word...</p>
          </div>
        )}

        <style>{`
          .docx-wrapper {
            background-color: transparent !important;
            padding: 1rem 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2rem !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .docx-wrapper > section.docx {
            background: #ffffff !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06) !important;
            border-radius: 0.5rem !important;
            border: 1px solid #cbd5e1 !important;
            margin-bottom: 2rem !important;
            position: relative !important;
            box-sizing: border-box !important;
          }
          .docx-wrapper > section.docx:empty {
            display: none !important;
          }
        `}</style>

        <div
          ref={containerRef}
          className={`w-full flex flex-col items-center overflow-x-auto ${loading || useFallbackMammoth ? 'hidden' : 'block'}`}
        />

        {!loading && useFallbackMammoth && (
          <div className="w-full max-w-5xl mx-auto bg-white rounded-xl border border-slate-300 p-6 md:p-12 shadow-2xl font-sans min-h-[850px] my-2 text-slate-900 leading-relaxed overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        )}
      </div>
    </div>
  );
}
