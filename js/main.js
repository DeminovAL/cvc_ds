/* Цветокор — поведение интерфейса: меню, шапка, формы */
(() => {
    const header = document.getElementById('siteHeader');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('siteNav');

    const closeMenu = () => {
        if (!header || !nav) return;
        header.classList.remove('menu-open');
        nav.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
    };

    const onScroll = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isOpen = header.classList.toggle('menu-open');
            nav.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
        });

        nav.addEventListener('click', (event) => {
            if (event.target.closest('a')) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });

        document.addEventListener('click', (event) => {
            if (!header.classList.contains('menu-open')) return;
            if (nav.contains(event.target) || burger.contains(event.target)) return;
            closeMenu();
        });
    }

    const toast = document.getElementById('toast');
    let toastTimer;

    const showToast = (text) => {
        if (!toast) return;
        if (text) toast.textContent = text;
        toast.classList.add('is-visible');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 5000);
    };

    document.querySelectorAll('form[data-form]').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

            const panel = form.closest('.cta-panel');
            const success = panel ? panel.querySelector('.form-success') : null;

            form.reset();

            if (success) {
                form.hidden = true;
                success.classList.add('is-visible');
                success.setAttribute('tabindex', '-1');
                success.focus({ preventScroll: true });
            }

            showToast('Заявка отправлена. Свяжемся в рабочее время.');
        });
    });
})();
