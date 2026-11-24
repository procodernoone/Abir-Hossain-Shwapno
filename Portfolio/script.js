document.addEventListener('DOMContentLoaded', () => {
    const certs = Array.from({ length: 16 }, (_, i) => `certificate-${String(i + 1).padStart(2, '0')}.webp`);
    const lightbox = document.getElementById('lightbox');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touchOnly = window.matchMedia('(hover: none)').matches;

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function openLightbox(src) {
        document.getElementById('lightboxImg').src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function renderCerts() {
        const grid = document.getElementById('achievementGrid');
        certs.forEach((file, i) => {
            const n = String(i + 1).padStart(2, '0');
            const card = document.createElement('div');
            card.className = 'cert reveal';
            card.dataset.ref = `C${n}`;
            const img = document.createElement('img');
            img.src = file;
            img.alt = `Certificate ${i + 1} earned by Abir Hossain Shwapno`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onerror = () => {
                img.remove();
                const ph = document.createElement('span');
                ph.className = 'ph';
                ph.textContent = n;
                card.appendChild(ph);
            };
            card.appendChild(img);
            card.addEventListener('click', () => {
                if (img.isConnected) openLightbox(img.src);
            });
            grid.appendChild(card);
        });
        document.getElementById('certCount').textContent = certs.length;
    }

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    const rows = document.querySelectorAll('#projectsGrid .row');
    document.getElementById('projectCount').textContent = rows.length;
    document.getElementById('projectTabs').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        document.querySelectorAll('#projectTabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        rows.forEach(r => { r.hidden = f !== 'all' && r.dataset.cat !== f; });
    });

    renderCerts();

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.about-text, .log, .skill-group, .row, .contact-info, .form').forEach(el => el.classList.add('reveal'));
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    const links = document.querySelectorAll('.links a');
    const sections = document.querySelectorAll('.section');
    function spy() {
        let current = sections[0].id;
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
        });
        sections.forEach(sec => sec.classList.toggle('on', sec.id === current));
        links.forEach(a => a.classList.toggle('active', a.dataset.section === current));
    }

    const horn = document.getElementById('horn');
    const angEl = document.getElementById('ang');
    const pwmEl = document.getElementById('pwm');
    let angle = 90;
    let target = 90;
    let running = false;

    function paint() {
        const a = Math.round(angle);
        horn.setAttribute('transform', `rotate(${angle.toFixed(2)} 85 70)`);
        angEl.textContent = String(a).padStart(3, '0');
        pwmEl.textContent = Math.round(500 + (angle / 180) * 2000);
    }

    function tick() {
        const d = target - angle;
        if (Math.abs(d) < 0.05) {
            angle = target;
            paint();
            running = false;
            return;
        }
        angle += d * 0.14;
        paint();
        requestAnimationFrame(tick);
    }

    function setTarget(v) {
        target = Math.max(0, Math.min(180, v));
        if (reduced) {
            angle = target;
            paint();
            return;
        }
        if (!running) {
            running = true;
            requestAnimationFrame(tick);
        }
    }

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch' || touchOnly) return;
        setTarget((e.clientX / window.innerWidth) * 180);
    }, { passive: true });

    function scrollAngle() {
        if (!touchOnly) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setTarget(max > 0 ? (window.scrollY / max) * 180 : 90);
    }

    window.addEventListener('scroll', () => {
        spy();
        scrollAngle();
    }, { passive: true });
    spy();
    paint();

    const contactForm = document.getElementById('contactForm');
    const FORMSPREE_URL = 'https://formspree.io/f/mjgnrapb';
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const label = btn.textContent;
        btn.textContent = 'sending...';
        btn.disabled = true;
        try {
            const res = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            alert('Thanks! Your message was sent. I\'ll get back to you soon.');
            contactForm.reset();
        } catch (err) {
            console.error(err);
            alert('Couldn\'t send your message. Please try again in a moment.');
        } finally {
            btn.textContent = label;
            btn.disabled = false;
        }
    });

    document.getElementById('year').textContent = new Date().getFullYear();
});
