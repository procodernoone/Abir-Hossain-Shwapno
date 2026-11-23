document.addEventListener('DOMContentLoaded', () => {
    const skillsData = [
        { name: 'Python', pct: 88, tag: 'programming' },
        { name: 'JavaScript', pct: 78, tag: 'web' },
        { name: 'HTML/CSS', pct: 92, tag: 'web' },
        { name: 'Robotics', pct: 74, tag: 'engineering' },
        { name: 'AI / ML', pct: 70, tag: 'ai' },
        { name: 'Graphics Design', pct: 65, tag: 'design' },
        { name: 'Flask', pct: 72, tag: 'backend' },
        { name: 'UI/UX', pct: 62, tag: 'design' },
        { name: 'Git', pct: 58, tag: 'tools' },
        { name: 'Science Projects', pct: 82, tag: 'science' },
    ];

    const projectsData = [
        { title: 'G.A.M.S.', cat: 'robotics', desc: 'Gesture Assisted Mobility System: an assistive rover driven by hand gestures from a Flutter app, with an ESP32 dashboard and ESP32-CAM live stream', link: '#' },
        { title: 'PINCHSERVO', cat: 'robotics', desc: 'Browser hand-pinch controller (MediaPipe) for an ESP32 and SG90 servo', link: '#' },
        { title: 'ASTRO ROVER', cat: 'robotics', desc: 'Rover robotics project', link: '#' },
        { title: 'Lily AI', cat: 'ai', desc: 'friendly AI assistant with a web interface', link: 'https://lily-ai.onrender.com' },
        { title: 'Medicare+', cat: 'web', desc: 'hospital management system', link: 'https://test-deployment-e8og.onrender.com/' },
        { title: 'Patholab', cat: 'python', desc: 'offline pathology management (Flask + SQLite)', link: '#' },
        { title: 'Neon Dash', cat: 'game', desc: 'neon-themed mobile platformer built in Godot for Android', link: '#' },
        { title: 'Point Network', cat: 'web', desc: 'interactive canvas visualization', link: '#' },
        { title: 'Quiz Game', cat: 'python', desc: 'multi-category quiz with levels', link: '#' },
        { title: 'Robo Arm', cat: 'robotics', desc: 'servo-controlled arm with gripper', link: '#' },
    ];

    const certs = Array.from({ length: 16 }, (_, i) => `certificate-${String(i + 1).padStart(2, '0')}.webp`);
    function renderSkills() {
        const grid = document.getElementById('skillsGrid');
        grid.innerHTML = '';
        skillsData.forEach(s => {
            const circ = s.pct >= 85 ? 188.5 : 188.5;
            const offset = circ - (s.pct / 100) * circ;
            const colorClass = s.tag === 'ai' ? 'cyan' : s.tag === 'design' ? 'rose' : '';
            const div = document.createElement('div');
            div.className = 'skill-ring reveal';
            div.innerHTML = `
                <div class="ring">
                    <svg viewBox="0 0 100 100">
                        <circle class="bg" cx="50" cy="50" r="40" />
                        <circle class="progress ${colorClass}" cx="50" cy="50" r="40" style="stroke-dashoffset:${offset};" />
                    </svg>
                    <span class="label">${s.pct}%</span>
                </div>
                <span class="skill-name">${s.name}</span>
                <span class="skill-tag">${s.tag}</span>
            `;
            grid.appendChild(div);
        });
    }
    function renderProjects(filter = 'all') {
        const grid = document.getElementById('projectsGrid');
        const filtered = filter === 'all' ? projectsData : projectsData.filter(p => p.cat === filter);
        grid.innerHTML = '';
        if (!filtered.length) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#5a554a;padding:2rem 0;">nothing here yet · try another category</div>`;
            return;
        }
        filtered.forEach(p => {
            const catClass = p.cat === 'ai' ? 'cyan' : p.cat === 'web' ? '' : p.cat === 'robotics' ? 'rose' : 'gold';
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            const linkHtml = p.link && p.link !== '#'
                ? `<a href="${p.link}" class="link" target="_blank" rel="noopener">↗ open</a>`
                : '';
            card.innerHTML = `
                <span class="cat ${catClass}">${p.cat}</span>
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                ${linkHtml}
            `;
            grid.appendChild(card);
        });
    }
    function renderAchievements() {
        const grid = document.getElementById('achievementGrid');
        grid.innerHTML = '';
        certs.forEach((file, i) => {
            const card = document.createElement('div');
            card.className = 'achieve-card reveal';
            const img = document.createElement('img');
            img.src = file;
            img.alt = `Certificate ${i + 1} earned by Abir Hossain Shwapno`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onerror = function () {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.textContent = `📜 ${i + 1}`;
                card.appendChild(placeholder);
            };
            card.appendChild(img);
            card.addEventListener('click', () => {
                if (img.style.display !== 'none' && img.src) openLightbox(img.src);
            });
            grid.appendChild(card);
        });
        document.getElementById('certCount').textContent = certs.length;
    }
    function openLightbox(src) {
        const lb = document.getElementById('lightbox');
        document.getElementById('lightboxImg').src = src;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    document.getElementById('lightboxClose').addEventListener('click', () => {
        document.getElementById('lightbox').classList.remove('open');
        document.body.style.overflow = 'auto';
    });
    
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('lightbox').classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });
    document.getElementById('projectTabs').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        document.querySelectorAll('.project-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.filter);
        initReveal();
    });
    function initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
    function initNav() {
        const links = document.querySelectorAll('.side-nav a');
        const sections = document.querySelectorAll('.section');
        window.addEventListener('scroll', () => {
            let current = 'home';
            sections.forEach(sec => {
                const top = sec.offsetTop - 100;
                if (window.scrollY >= top) current = sec.id;
            });
            links.forEach(a => {
                a.classList.toggle('active', a.dataset.section === current);
            });
        }, { passive: true });
    }
    const contactForm = document.getElementById('contactForm');
    const FORMSPREE_URL = 'https://formspree.io/f/mjgnrapb';
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'sending...';
        submitBtn.disabled = true;
        
        try {
            const form = e.target;
            const formData = new FormData(form);
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('✉ Thanks! Your message was sent. I\'ll get back to you soon.');
                form.reset();
            } else {
                const errorText = await response.text();
                console.error('Formspree error:', errorText);
                throw new Error(`Server responded with ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('⚠️ Couldn\'t send your message. Please try again in a moment.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    document.getElementById('year').textContent = new Date().getFullYear();
    function initParticles() {
        const canvas = document.getElementById('particlesCanvas');
        const ctx = canvas.getContext('2d');
        let w, h;
        const particles = [];
        const count = window.innerWidth < 640 ? 25 : 40;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.r = Math.random() * 1.5 + 0.5;
                this.o = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 163, 115, ${this.o})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < count; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            
            const maxDist = window.innerWidth < 640 ? 100 : 150;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 163, 115, ${0.06 * (1 - dist / maxDist)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
    renderSkills();
    renderProjects('all');
    renderAchievements();
    initReveal();
    initNav();
    initParticles();
    document.getElementById('projectCount').textContent = projectsData.length;

});