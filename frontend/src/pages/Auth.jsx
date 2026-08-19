import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useFlash } from '../hooks/useFlash';
import Flash from '../components/flash/flash';
import AuthCopy from '../components/auth/AuthPanel';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';


export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const { toasts, addToast, removeToast } = useFlash();

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState(false);
  const [capsLockLogin, setCapsLockLogin] = useState(false);

  // Register Form States
  const [regUsername, setRegUsername] = useState('');
  const [regJabatan, setRegJabatan] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAuthCode, setRegAuthCode] = useState('');
  const [regRole, setRegRole] = useState(3); // Default Pegawai (3)
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regInvalid, setRegInvalid] = useState(false);
  const [capsLockReg, setCapsLockReg] = useState(false);

  const toggleTab = (e, tab) => {
    e?.preventDefault();
    setIsRegister(tab === 'register');
    if (tab === 'register') {
      setTimeout(() => document.getElementById('ru')?.focus(), 100);
    } else {
      setTimeout(() => document.getElementById('le')?.focus(), 100);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setIsRegister(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      setLoginInvalid(true);
      setTimeout(() => setLoginInvalid(false), 400);
      return;
    }

    try {
      const res = await api.post('/auth/login', { 
        username: loginUsername, 
        password: loginPassword 
      });
      const data = res.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        const roleId = Number(data.user?.id_role || 3);
        const tipeRole = data.user?.tipe_role || data.user?.role?.tipe_role || ([1, 2].includes(roleId) ? 'admin' : 'pegawai');
        const targetPath = tipeRole === 'admin' ? '/dashboard' : '/';

        localStorage.setItem('_flash', JSON.stringify({ 
          type: 'success', 
          message: `Selamat datang, ${data.user?.nama_lengkap || data.user?.username || 'Pengguna'}!` 
        }));

        window.location.href = targetPath;
      } else {
        addToast('error', data.msg || data.message || 'Login gagal.');
      }
    } catch (err) {
      addToast('error', err.response?.data?.msg || err.response?.data?.message || 'Terjadi kesalahan pada server');
    }
  };

  // Step 1: Verifikasi 6-Digit TOTP Authenticator Code
  const handleVerifyCode = async () => {
    if (!regUsername || !regPassword || !regAuthCode) {
      setRegInvalid(true);
      addToast('error', 'Username, password, dan Kode Verifikasi (6-digit) wajib diisi!');
      setTimeout(() => setRegInvalid(false), 400);
      return;
    }

    if (!/^\d{6}$/.test(regAuthCode.trim())) {
      addToast('error', 'Kode Verifikasi Authenticator harus berupa 6-digit angka!');
      return;
    }

    setVerifyingCode(true);
    try {
      const res = await api.post('/auth/verify-code', { auth_code: regAuthCode.trim() });
      if (res.data.success) {
        setIsCodeVerified(true);
        addToast('success', res.data.msg || 'Kode Verifikasi valid! Silakan pilih Role Akun Anda.');
      } else {
        addToast('error', res.data.msg || 'Kode Verifikasi tidak valid.');
      }
    } catch (err) {
      addToast('error', err.response?.data?.msg || 'Kode Verifikasi Google Authenticator tidak valid atau kadaluarsa.');
    } finally {
      setVerifyingCode(false);
    }
  };

  // Step 2: Registrasi Akun dengan Role Terpilih
  const handleRegisterSubmit = async () => {
    try {
      const res = await api.post('/auth/register', { 
        username: regUsername, 
        jabatan: regJabatan, 
        password: regPassword,
        auth_code: regAuthCode.trim(),
        id_role: regRole 
      });
      const data = res.data;
      if (data.user || data.msg) {
        addToast('success', data.msg || 'Registrasi akun berhasil!');
        setIsRegister(false);
        setIsCodeVerified(false);
        setRegUsername('');
        setRegJabatan('');
        setRegPassword('');
        setRegAuthCode('');
        setRegRole(3);
      } else {
        addToast('error', data.msg || 'Registrasi gagal.');
      }
    } catch (err) {
      addToast('error', err.response?.data?.msg || 'Terjadi kesalahan pada server saat registrasi');
    }
  };

  // Handler Gabungan 2-Step Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isCodeVerified) {
      await handleVerifyCode();
    } else {
      await handleRegisterSubmit();
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-frame ${isRegister ? 'is-register' : ''}`}>
        <div className="wedge" aria-hidden="true"></div>

        <AuthCopy toggleTab={toggleTab} />

        <Flash toasts={toasts} removeToast={removeToast} />

        <LoginForm
          loginUsername={loginUsername}
          setLoginUsername={setLoginUsername}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          showLoginPassword={showLoginPassword}
          setShowLoginPassword={setShowLoginPassword}
          loginInvalid={loginInvalid}
          capsLockLogin={capsLockLogin}
          setCapsLockLogin={setCapsLockLogin}
          handleLoginSubmit={handleLoginSubmit}
          toggleTab={toggleTab}
        />

        <RegisterForm
          regUsername={regUsername}
          setRegUsername={setRegUsername}
          regJabatan={regJabatan}
          setRegJabatan={setRegJabatan}
          regPassword={regPassword}
          setRegPassword={setRegPassword}
          showRegPassword={showRegPassword}
          setShowRegPassword={setShowRegPassword}
          regAuthCode={regAuthCode}
          setRegAuthCode={setRegAuthCode}
          regRole={regRole}
          setRegRole={setRegRole}
          isCodeVerified={isCodeVerified}
          setIsCodeVerified={setIsCodeVerified}
          verifyingCode={verifyingCode}
          regInvalid={regInvalid}
          capsLockReg={capsLockReg}
          setCapsLockReg={setCapsLockReg}
          handleFormSubmit={handleFormSubmit}
          toggleTab={toggleTab}
        />
      </div>
    </div>
  );
}