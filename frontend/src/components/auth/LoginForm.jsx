import React from 'react';

export default function LoginForm({
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  showLoginPassword,
  setShowLoginPassword,
  loginInvalid,
  capsLockLogin,
  setCapsLockLogin,
  handleLoginSubmit,
  toggleTab
}) {
  return (
    <section className="pane pane-login">
      <div className="card" role="region" aria-label="Form Login">
        <h2>Masuk Akun</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>Silakan masuk menggunakan username terdaftar.</p>
        <div className="underline"></div>

        <form onSubmit={handleLoginSubmit} noValidate autoComplete="off">
          <div className={`field ${loginInvalid && !loginUsername ? 'invalid' : ''}`}>
            <input
              id="le" type="text" name="username" required autoComplete="off" placeholder=" "
              value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
            />
            <label htmlFor="le">Username</label>
            <svg className="ico" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 3-9 6v2h18v-2c0-3-4-6-9-6Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          <div className={`field ${loginInvalid && !loginPassword ? 'invalid' : ''}`}>
            <input
              id="lp" type={showLoginPassword ? 'text' : 'password'} name="password" required autoComplete="new-password" placeholder=" "
              value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
              onKeyUp={e => setCapsLockLogin(e.getModifierState && e.getModifierState('CapsLock') && loginPassword.length > 0)}
              onBlur={() => setCapsLockLogin(false)}
            />
            <label htmlFor="lp">Password</label>
            <svg className="ico toggle-pass" viewBox="0 0 24 24" fill="none" onClick={() => setShowLoginPassword(!showLoginPassword)}>
              {showLoginPassword ? (
                <>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                </>
              ) : (
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.33 21.33 0 0 1 5.17-5.88M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12M1 1l22 22" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
            <div className={`caps-tip ${capsLockLogin ? 'show' : ''}`}>CapsLock ON</div>
          </div>

          <button className="btn" type="submit" style={{ marginTop: '12px' }}>Login</button>
        </form>

        <div className="tabs" style={{ marginTop: '16px', textAlign: 'center' }}>
          Belum punya akun? <button className="link-btn" onClick={(e) => toggleTab(e, 'register')}>Daftar di sini</button>
        </div>
      </div>
    </section>
  );
}
