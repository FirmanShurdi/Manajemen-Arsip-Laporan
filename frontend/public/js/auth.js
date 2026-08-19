document.addEventListener('DOMContentLoaded', () => {
    const authFrame = document.querySelector('.auth-frame');
    if (!authFrame) return;

    // Toggle Tab Logic
    const toggleToRegister = (e) => {
        if(e) e.preventDefault();
        authFrame.classList.add('is-register');
        setTimeout(() => document.getElementById('rn')?.focus(), 100);
    };

    const toggleToLogin = (e) => {
        if(e) e.preventDefault();
        authFrame.classList.remove('is-register');
        setTimeout(() => document.getElementById('le')?.focus(), 100);
    };

    window.toggleToRegister = toggleToRegister;
    window.toggleToLogin = toggleToLogin;

    // Keyboard navigation (Ctrl + ArrowLeft / ArrowRight)
    document.addEventListener('keydown', (e) => {
        if (!(e.ctrlKey || e.metaKey)) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (authFrame.classList.contains('is-register')) {
                toggleToLogin();
            } else {
                toggleToRegister();
            }
        }
    });

    // Password visibility logic
    const togglePassBtns = document.querySelectorAll('.toggle-pass');
    togglePassBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.currentTarget.previousElementSibling;
            const label = e.currentTarget.previousElementSibling.previousElementSibling; // Not needed, just input
            if (input && input.tagName === 'INPUT') {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.innerHTML = `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>`;
                } else {
                    input.type = 'password';
                    btn.innerHTML = `<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.33 21.33 0 0 1 5.17-5.88M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12M1 1l22 22" stroke="currentColor" stroke-width="1.5"/>`;
                }
            }
        });
    });

    // CapsLock logic
    const passInputs = document.querySelectorAll('input[type="password"]');
    passInputs.forEach(input => {
        input.addEventListener('keyup', (e) => {
            const capsTip = input.parentElement.querySelector('.caps-tip');
            if (!capsTip) return;
            if (e.getModifierState && e.getModifierState('CapsLock') && input.value.length > 0) {
                capsTip.classList.add('show');
            } else {
                capsTip.classList.remove('show');
            }
        });
        input.addEventListener('blur', () => {
            const capsTip = input.parentElement.querySelector('.caps-tip');
            if (capsTip) capsTip.classList.remove('show');
        });
    });
});
