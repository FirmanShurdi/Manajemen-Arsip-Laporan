import React from 'react';

export default function AuthCopy({ toggleTab }) {
  return (
    <div className="copy" aria-hidden="true">
      <div className="box copy-register">
        <div>
          <h1>WELCOME<br />BACK!</h1>
          <p>Sudah punya akun? Masuk sekarang untuk mengakses layanan KSOP-K.</p>
          <button className="cta" onClick={(e) => toggleTab(e, 'login')}>Login Sekarang</button>
        </div>
      </div>
      <div className="box copy-login">
        <div>
          <h1>HALO USER!</h1>
          <p>Belum punya akun? Daftar sekarang untuk memulai ekosistem aplikasi maritim.</p>
          <button className="cta" onClick={(e) => toggleTab(e, 'register')}>Daftar Akun</button>
        </div>
      </div>
    </div>
  );
}
