import React from 'react';
import RolePick from './RolePick';
import TotpTimer from '../ui/TotpTimer';

export default function RegisterForm({
  regUsername,
  setRegUsername,
  regJabatan,
  setRegJabatan,
  regPassword,
  setRegPassword,
  showRegPassword,
  setShowRegPassword,
  regAuthCode,
  setRegAuthCode,
  regRole,
  setRegRole,
  isCodeVerified,
  setIsCodeVerified,
  verifyingCode,
  regInvalid,
  capsLockReg,
  setCapsLockReg,
  handleFormSubmit,
  toggleTab
}) {
  return (
    <section className="pane pane-register">
      <div className="card" role="region" aria-label="Form Sign Up">
        <h2>Daftar Baru</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>Buat akun untuk akses layanan maritim terpadu.</p>
        <div className="underline"></div>

        <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
          <div className={`field ${regInvalid && !regUsername ? 'invalid' : ''}`}>
            <input id="ru" type="text" name="username" required autoComplete="off" placeholder=" " value={regUsername} onChange={e => setRegUsername(e.target.value)} />
            <label htmlFor="ru">Username</label>
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </div>

          <div className={`field ${regInvalid && !regJabatan ? 'invalid' : ''}`}>
            <input id="rjabatan" type="text" name="jabatan" required autoComplete="off" placeholder=" " value={regJabatan} onChange={e => setRegJabatan(e.target.value)} />
            <label htmlFor="rjabatan">Jabatan</label>
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8" cy="12" r="2" />
              <path d="M14 11h4m-4 4h4m-9 0h.01" />
            </svg>
          </div>

          <div className={`field ${regInvalid && !regPassword ? 'invalid' : ''}`}>
            <input
              id="rp" type={showRegPassword ? 'text' : 'password'} name="password" minLength="1" required autoComplete="new-password" placeholder=" "
              value={regPassword} onChange={e => setRegPassword(e.target.value)}
              onKeyUp={e => setCapsLockReg(e.getModifierState && e.getModifierState('CapsLock') && regPassword.length > 0)}
              onBlur={() => setCapsLockReg(false)}
            />
            <label htmlFor="rp">Password</label>
            <svg className="ico toggle-pass" viewBox="0 0 24 24" fill="none" onClick={() => setShowRegPassword(!showRegPassword)}>
              {showRegPassword ? (
                <>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                </>
              ) : (
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.33 21.33 0 0 1 5.17-5.88M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12M1 1l22 22" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
            <div className={`caps-tip ${capsLockReg ? 'show' : ''}`}>CapsLock ON</div>
          </div>

          <div className={`field ${regInvalid && !regAuthCode ? 'invalid' : ''} ${isCodeVerified ? 'verified' : ''}`}>
            <input
              id="rcode"
              type="text"
              name="auth_code"
              maxLength="6"
              autoComplete="off"
              placeholder=" "
              value={regAuthCode}
              onChange={e => {
                setRegAuthCode(e.target.value);
                if (isCodeVerified) setIsCodeVerified(false);
              }}
              style={isCodeVerified ? { borderColor: '#16a34a', backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: '700', paddingRight: '84px' } : {}}
            />
            <label htmlFor="rcode" style={isCodeVerified ? { color: '#16a34a', fontWeight: '700' } : {}}>
              {isCodeVerified ? 'Kode Verifikasi Authenticator (Terverifikasi ✓)' : 'Kode Verifikasi Authenticator (6-digit)'}
            </label>
            
            {/* Timer Hitungan Mundur MUNCUL KETAT SETELAH tombol "Verifikasi Kode & Lanjut" dipencet & berhasil */}
            {isCodeVerified && <TotpTimer />}

            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke={isCodeVerified ? '#16a34a' : 'currentColor'} strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          {/* Dropdown Pilihan Role Akses User muncul secara ketat SETELAH kode verifikasi valid */}
          {isCodeVerified && (
            <RolePick
              regRole={regRole}
              setRegRole={setRegRole}
            />
          )}

          <button className="btn" type="submit" style={{ marginTop: '12px' }} disabled={verifyingCode}>
            {verifyingCode 
              ? 'Memeriksa Kode...' 
              : isCodeVerified 
                ? 'Konfirmasi & Daftar Akun' 
                : 'Verifikasi Kode & Lanjut'}
          </button>
        </form>

        <div className="tabs" style={{ marginTop: '16px', textAlign: 'center' }}>
          Sudah punya akun? <button className="link-btn" onClick={(e) => toggleTab(e, 'login')}>Masuk</button>
        </div>
      </div>
    </section>
  );
}
