/* ============================================================
   BACKGROUND — PARTICLE NETWORK
   ============================================================ */
(function () {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function init() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 90);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            pulse: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.5 + 0.15,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += 0.012;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.pulse));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,212,255,${alpha})`;
            ctx.fill();
        });

        const LINK_DIST = 110;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < LINK_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - d / LINK_DIST)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        raf = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(raf);
        resize();
        init();
        draw();
    });
})();

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
(function () {
    const roles = [
        'DevOps Engineer',
        'Future Kubestronaut 🚀',
        'Cloud Native Enthusiast',
        'Kubernetes Explorer',
        'CI/CD Pipeline Builder',
        'Platform Aficionado',
    ];

    const el = document.getElementById('typed-text');
    let roleIdx = 0, charIdx = 0, deleting = false;

    function tick() {
        const current = roles[roleIdx];
        el.textContent = deleting
            ? current.slice(0, charIdx - 1)
            : current.slice(0, charIdx + 1);

        deleting ? charIdx-- : charIdx++;

        let delay = deleting ? 45 : 75;

        if (!deleting && charIdx === current.length) {
            delay = 2200;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            delay = 350;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 800);
})();

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
(function () {
    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    });
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function () {
    const io = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const siblings = Array.from(
                    entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
                );
                const idx = siblings.indexOf(entry.target);
                const delay = Math.max(0, idx * 70);

                setTimeout(() => entry.target.classList.add('visible'), delay);
                io.unobserve(entry.target);
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ============================================================
   INTERACTIVE TERMINAL
   ============================================================ */
(function () {
    const output = document.getElementById('terminal-output');
    const input  = document.getElementById('terminal-input');
    const body   = document.getElementById('terminal-body');

    if (!output || !input || !body) return;

    let history = [];
    let histIdx  = -1;

    /* ---- helpers ---- */
    function esc(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function scrollDown() {
        body.scrollTop = body.scrollHeight;
    }

    function appendHtml(html) {
        const div = document.createElement('div');
        div.className = 'output-block';
        div.innerHTML = html;
        output.appendChild(div);
        scrollDown();
    }

    function appendCommandEcho(raw) {
        const div = document.createElement('div');
        div.className = 'output-command';
        div.innerHTML = `
            <span class="prompt-text">
                <span class="prompt-user">diogo</span><span class="prompt-at">@</span><span class="prompt-host">portfolio</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-dollar"> $</span>
            </span>
            <span style="color:var(--text)">${esc(raw)}</span>`;
        output.appendChild(div);
    }

    /* ---- i18n helper ---- */
    function lang() { return window.currentLang || 'pt-BR'; }

    const TERM_T = {
        'pt-BR': {
            help: `
<div class="output-header">Comandos disponíveis:</div>
<table class="output-table">
  <tr><td>whoami</td><td>→ Sobre mim</td></tr>
  <tr><td>skills</td><td>→ Habilidades técnicas</td></tr>
  <tr><td>experience</td><td>→ Experiência profissional</td></tr>
  <tr><td>education</td><td>→ Formação acadêmica</td></tr>
  <tr><td>goal</td><td>→ Minha jornada Kubestronaut</td></tr>
  <tr><td>contact</td><td>→ Formas de contato</td></tr>
  <tr><td>github</td><td>→ Abrir GitHub (nova aba)</td></tr>
  <tr><td>linkedin</td><td>→ Abrir LinkedIn (nova aba)</td></tr>
  <tr><td>ls</td><td>→ Listar seções do portfólio</td></tr>
  <tr><td>clear</td><td>→ Limpar terminal</td></tr>
</table>`,
            whoami: `
<div class="output-header">Diogo Buzatto</div>
<table class="output-table">
  <tr><td>role</td><td>Analista DevOps Jr</td></tr>
  <tr><td>company</td><td>Casa do Construtor</td></tr>
  <tr><td>location</td><td>Rio Claro, SP</td></tr>
  <tr><td>degree</td><td>Engenharia da Computação (11° semestre)</td></tr>
  <tr><td>focus</td><td>Kubernetes · Cloud Native · CI/CD</td></tr>
  <tr><td>email</td><td>diogobuzattoo@gmail.com</td></tr>
  <tr><td>github</td><td>github.com/dbuzatto</td></tr>
</table>
<span class="output-empty"></span>
<div class="output-text">Técnico em Mecatrônica, graduando em Engenharia da Computação e<br>apaixonado por automação, Kubernetes e infra cloud-native.</div>`,
            skills: `
<div class="output-header">Stack Técnico:</div>
<div class="output-section">▸ Infraestrutura &amp; Cloud</div>
<div class="output-text">&nbsp;&nbsp;Linux &nbsp;·&nbsp; AWS &nbsp;·&nbsp; Docker &nbsp;·&nbsp; Kubernetes</div>
<div class="output-section">▸ CI/CD &amp; Automação</div>
<div class="output-text">&nbsp;&nbsp;GitLab CI &nbsp;·&nbsp; CI/CD Pipelines &nbsp;·&nbsp; IaC</div>
<div class="output-section">▸ Observabilidade</div>
<div class="output-text">&nbsp;&nbsp;Prometheus &nbsp;·&nbsp; Grafana</div>
<div class="output-section">▸ Linguagens</div>
<div class="output-text">&nbsp;&nbsp;Python &nbsp;·&nbsp; Java</div>`,
            experience: `
<div class="output-header">Experiência Profissional:</div>
<span class="output-empty"></span>
<div class="output-accent">▸ AGO 2025 – ATUAL</div>
<div class="output-text">&nbsp;&nbsp;Analista DevOps Jr · Casa do Construtor</div>
<span class="output-empty"></span>
<div class="output-accent">▸ MAR 2024 – AGO 2025</div>
<div class="output-text">&nbsp;&nbsp;Assistente de Infraestrutura · Casa do Construtor</div>
<span class="output-empty"></span>
<div class="output-accent">▸ 2023 – FEV 2024</div>
<div class="output-text">&nbsp;&nbsp;Estagiário de Infraestrutura · Casa do Construtor</div>
<span class="output-empty"></span>
<div class="output-accent">▸ 2022 – JAN 2023</div>
<div class="output-text">&nbsp;&nbsp;Vendedor de Comércio Varejista · Agrofer – ACP Acabamentos LTDA</div>
<span class="output-empty"></span>
<div class="output-accent">▸ 2018 – 2021</div>
<div class="output-text">&nbsp;&nbsp;Ajudante Geral · Ricca Brindes Presentes e Produtos Personalizados LTDA</div>`,
            education: `
<div class="output-header">Formação Acadêmica:</div>
<span class="output-empty"></span>
<div class="output-accent">▸ Engenharia da Computação</div>
<div class="output-text">&nbsp;&nbsp;FHO – Fundação Hermínio Ometto</div>
<div class="output-text">&nbsp;&nbsp;2021 – 2026 · 11° Semestre em andamento</div>
<span class="output-empty"></span>
<div class="output-accent">▸ Técnico em Mecatrônica</div>
<div class="output-text">&nbsp;&nbsp;Complexo Educacional EDUQ</div>
<div class="output-text">&nbsp;&nbsp;2017 – 2020 · Concluído</div>`,
            goal: `
<div class="output-accent">&nbsp;██╗  ██╗██╗   ██╗██████╗ ███████╗</div>
<div class="output-accent">&nbsp;██║ ██╔╝██║   ██║██╔══██╗██╔════╝</div>
<div class="output-accent">&nbsp;█████╔╝ ██║   ██║██████╔╝█████╗</div>
<div class="output-accent">&nbsp;██╔═██╗ ██║   ██║██╔══██╗██╔══╝</div>
<div class="output-accent">&nbsp;██║  ██╗╚██████╔╝██████╔╝███████╗</div>
<div class="output-accent">&nbsp;╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝ ASTRONAUT</div>
<span class="output-empty"></span>
<div class="output-header">🚀 Missão: Kubestronaut</div>
<span class="output-empty"></span>
<div class="output-text">Certificações em progressão:</div>
<span class="output-empty"></span>
<div class="cert-row"><span class="cert-status active">[● EM CURSO]</span><span>DevOps Professional – LinuxTips</span></div>
<div class="cert-row"><span class="cert-status planned">[○ PRÓXIMO ]</span><span>KCNA – Kubernetes and Cloud Native Associate</span></div>
<div class="cert-row"><span class="cert-status planned">[○ FUTURO  ]</span><span>CKA – Certified Kubernetes Administrator</span></div>
<div class="cert-row"><span class="cert-status planned">[○ FUTURO  ]</span><span>CKAD – Certified Kubernetes Application Developer</span></div>
<div class="cert-row"><span class="cert-status planned">[○ FUTURO  ]</span><span>CKS – Certified Kubernetes Security Specialist</span></div>
<span class="output-empty"></span>
<div class="output-text">Progresso: <span class="progress-bar-ascii">████░░░░░░░░░░░░░░░░</span> 20%</div>
<span class="output-empty"></span>
<div class="output-success">As estrelas não são o limite. Kubernetes é o destino. 🛸</div>`,
            contact: `
<div class="output-header">Formas de Contato:</div>
<table class="output-table">
  <tr><td>email</td><td>diogobuzattoo@gmail.com</td></tr>
  <tr><td>phone</td><td>(19) 98156-0216</td></tr>
  <tr><td>github</td><td>github.com/dbuzatto</td></tr>
  <tr><td>linkedin</td><td>linkedin.com/in/diogo-buzatto-352093204</td></tr>
  <tr><td>location</td><td>Rio Claro, SP · Brasil</td></tr>
</table>`,
            github_open:   '✓ Abrindo github.com/dbuzatto numa nova aba...',
            linkedin_open: '✓ Abrindo LinkedIn numa nova aba...',
            err_permission: 'Permissão negada. Boa tentativa. 😏',
            err_exit:       'Você não consegue sair do portfólio. 🚀',
            err_no_history: 'Nenhum comando no histórico.',
            err_notfound:   cmd => `Comando não encontrado: <strong>${cmd}</strong>. Digite <span class="cmd-highlight">help</span> para ver os disponíveis.`,
            date_locale:    'pt-BR',
        },
        'en': {
            help: `
<div class="output-header">Available commands:</div>
<table class="output-table">
  <tr><td>whoami</td><td>→ About me</td></tr>
  <tr><td>skills</td><td>→ Technical skills</td></tr>
  <tr><td>experience</td><td>→ Professional experience</td></tr>
  <tr><td>education</td><td>→ Academic background</td></tr>
  <tr><td>goal</td><td>→ My Kubestronaut journey</td></tr>
  <tr><td>contact</td><td>→ Contact info</td></tr>
  <tr><td>github</td><td>→ Open GitHub (new tab)</td></tr>
  <tr><td>linkedin</td><td>→ Open LinkedIn (new tab)</td></tr>
  <tr><td>ls</td><td>→ List portfolio sections</td></tr>
  <tr><td>clear</td><td>→ Clear terminal</td></tr>
</table>`,
            whoami: `
<div class="output-header">Diogo Buzatto</div>
<table class="output-table">
  <tr><td>role</td><td>Jr DevOps Analyst</td></tr>
  <tr><td>company</td><td>Casa do Construtor</td></tr>
  <tr><td>location</td><td>Rio Claro, SP</td></tr>
  <tr><td>degree</td><td>Computer Engineering (11th Semester)</td></tr>
  <tr><td>focus</td><td>Kubernetes · Cloud Native · CI/CD</td></tr>
  <tr><td>email</td><td>diogobuzattoo@gmail.com</td></tr>
  <tr><td>github</td><td>github.com/dbuzatto</td></tr>
</table>
<span class="output-empty"></span>
<div class="output-text">Mechatronics Technician, Computer Engineering student and<br>passionate about automation, Kubernetes and cloud-native infra.</div>`,
            skills: `
<div class="output-header">Tech Stack:</div>
<div class="output-section">▸ Infrastructure &amp; Cloud</div>
<div class="output-text">&nbsp;&nbsp;Linux &nbsp;·&nbsp; AWS &nbsp;·&nbsp; Docker &nbsp;·&nbsp; Kubernetes</div>
<div class="output-section">▸ CI/CD &amp; Automation</div>
<div class="output-text">&nbsp;&nbsp;GitLab CI &nbsp;·&nbsp; CI/CD Pipelines &nbsp;·&nbsp; IaC</div>
<div class="output-section">▸ Observability</div>
<div class="output-text">&nbsp;&nbsp;Prometheus &nbsp;·&nbsp; Grafana</div>
<div class="output-section">▸ Languages</div>
<div class="output-text">&nbsp;&nbsp;Python &nbsp;·&nbsp; Java</div>`,
            experience: `
<div class="output-header">Professional Experience:</div>
<span class="output-empty"></span>
<div class="output-accent">▸ AUG 2025 – PRESENT</div>
<div class="output-text">&nbsp;&nbsp;Jr DevOps Analyst · Casa do Construtor</div>
<span class="output-empty"></span>
<div class="output-accent">▸ MAR 2024 – AUG 2025</div>
<div class="output-text">&nbsp;&nbsp;Infrastructure Assistant · Casa do Construtor</div>
<span class="output-empty"></span>
<div class="output-accent">▸ 2023 – FEB 2024</div>
<div class="output-text">&nbsp;&nbsp;Infrastructure Intern · Casa do Construtor</div>
<span class="output-empty"></span>
<div class="output-accent">▸ 2022 – JAN 2023</div>
<div class="output-text">&nbsp;&nbsp;Retail Sales Associate · Agrofer – ACP Acabamentos LTDA</div>
<span class="output-empty"></span>
<div class="output-accent">▸ 2018 – 2021</div>
<div class="output-text">&nbsp;&nbsp;General Assistant · Ricca Brindes Presentes e Produtos Personalizados LTDA</div>`,
            education: `
<div class="output-header">Academic Background:</div>
<span class="output-empty"></span>
<div class="output-accent">▸ Computer Engineering</div>
<div class="output-text">&nbsp;&nbsp;FHO – Fundação Hermínio Ometto</div>
<div class="output-text">&nbsp;&nbsp;2021 – 2026 · 11th Semester ongoing</div>
<span class="output-empty"></span>
<div class="output-accent">▸ Mechatronics Technician</div>
<div class="output-text">&nbsp;&nbsp;Complexo Educacional EDUQ</div>
<div class="output-text">&nbsp;&nbsp;2017 – 2020 · Completed</div>`,
            goal: `
<div class="output-accent">&nbsp;██╗  ██╗██╗   ██╗██████╗ ███████╗</div>
<div class="output-accent">&nbsp;██║ ██╔╝██║   ██║██╔══██╗██╔════╝</div>
<div class="output-accent">&nbsp;█████╔╝ ██║   ██║██████╔╝█████╗</div>
<div class="output-accent">&nbsp;██╔═██╗ ██║   ██║██╔══██╗██╔══╝</div>
<div class="output-accent">&nbsp;██║  ██╗╚██████╔╝██████╔╝███████╗</div>
<div class="output-accent">&nbsp;╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝ ASTRONAUT</div>
<span class="output-empty"></span>
<div class="output-header">🚀 Mission: Kubestronaut</div>
<span class="output-empty"></span>
<div class="output-text">Certifications in progress:</div>
<span class="output-empty"></span>
<div class="cert-row"><span class="cert-status active">[● IN PROGRESS]</span><span>DevOps Professional – LinuxTips</span></div>
<div class="cert-row"><span class="cert-status planned">[○ NEXT       ]</span><span>KCNA – Kubernetes and Cloud Native Associate</span></div>
<div class="cert-row"><span class="cert-status planned">[○ FUTURE     ]</span><span>CKA – Certified Kubernetes Administrator</span></div>
<div class="cert-row"><span class="cert-status planned">[○ FUTURE     ]</span><span>CKAD – Certified Kubernetes Application Developer</span></div>
<div class="cert-row"><span class="cert-status planned">[○ FUTURE     ]</span><span>CKS – Certified Kubernetes Security Specialist</span></div>
<span class="output-empty"></span>
<div class="output-text">Progress: <span class="progress-bar-ascii">████░░░░░░░░░░░░░░░░</span> 20%</div>
<span class="output-empty"></span>
<div class="output-success">The stars are not the limit. Kubernetes is the destination. 🛸</div>`,
            contact: `
<div class="output-header">Contact Info:</div>
<table class="output-table">
  <tr><td>email</td><td>diogobuzattoo@gmail.com</td></tr>
  <tr><td>phone</td><td>(19) 98156-0216</td></tr>
  <tr><td>github</td><td>github.com/dbuzatto</td></tr>
  <tr><td>linkedin</td><td>linkedin.com/in/diogo-buzatto-352093204</td></tr>
  <tr><td>location</td><td>Rio Claro, SP · Brazil</td></tr>
</table>`,
            github_open:   '✓ Opening github.com/dbuzatto in a new tab...',
            linkedin_open: '✓ Opening LinkedIn in a new tab...',
            err_permission: 'Permission denied. Nice try. 😏',
            err_exit:       "You can't leave the portfolio. 🚀",
            err_no_history: 'No commands in history.',
            err_notfound:   cmd => `Command not found: <strong>${cmd}</strong>. Type <span class="cmd-highlight">help</span> to see available commands.`,
            date_locale:    'en-US',
        },
    };

    function tCmd(key) { return TERM_T[lang()][key]; }

    /* ---- command definitions ---- */
    const COMMANDS = {
        help()       { return tCmd('help'); },
        whoami()     { return tCmd('whoami'); },
        skills()     { return tCmd('skills'); },
        experience() { return tCmd('experience'); },
        education()  { return tCmd('education'); },
        goal()       { return tCmd('goal'); },
        contact()    { return tCmd('contact'); },

        ls() {
            return `
<div class="output-text"><span class="output-accent">drwxr-xr-x</span> &nbsp;hero/</div>
<div class="output-text"><span class="output-accent">drwxr-xr-x</span> &nbsp;skills/</div>
<div class="output-text"><span class="output-accent">drwxr-xr-x</span> &nbsp;experience/</div>
<div class="output-text"><span class="output-accent">drwxr-xr-x</span> &nbsp;education/</div>
<div class="output-text"><span class="output-accent">-rw-r--r--</span> &nbsp;contact.txt</div>
<div class="output-text"><span class="output-accent">-rw-r--r--</span> &nbsp;goal.md</div>`;
        },

        github() {
            window.open('https://github.com/dbuzatto', '_blank', 'noopener');
            return `<div class="output-success">${tCmd('github_open')}</div>`;
        },

        linkedin() {
            window.open('https://www.linkedin.com/in/diogo-buzatto-352093204', '_blank', 'noopener');
            return `<div class="output-success">${tCmd('linkedin_open')}</div>`;
        },

        clear() {
            output.innerHTML = '';
            return null;
        },
    };

    /* ---- easter eggs ---- */
    const EGGS = {
        'kubectl get pods'() {
            return `
<div class="output-text">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; READY &nbsp; STATUS &nbsp;&nbsp;&nbsp; RESTARTS &nbsp; AGE</div>
<div class="output-success">diogo-devops-0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1/1 &nbsp;&nbsp;&nbsp; Running &nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3y</div>
<div class="output-success">kubernetes-skills-pod &nbsp;&nbsp;&nbsp; 1/1 &nbsp;&nbsp;&nbsp; Running &nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2y</div>
<div class="output-accent">kubeastronaut-dream-0 &nbsp;&nbsp;&nbsp; 0/1 &nbsp;&nbsp;&nbsp; Pending &nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; now</div>`;
        },

        'kubectl get nodes'() {
            return `
<div class="output-text">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; STATUS &nbsp; ROLES &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AGE &nbsp; VERSION</div>
<div class="output-success">rio-claro-01 &nbsp; Ready &nbsp;&nbsp; control-plane &nbsp; 3y &nbsp;&nbsp; v1.30.0</div>`;
        },

        'sudo rm -rf /'() { return `<div class="output-error">${tCmd('err_permission')}</div>`; },
        exit()             { return `<div class="output-text">${tCmd('err_exit')}</div>`; },
        pwd()              { return '<div class="output-text">/home/diogo/portfolio</div>'; },
        date()             { return `<div class="output-text">${new Date().toLocaleString(tCmd('date_locale'), { dateStyle: 'full', timeStyle: 'medium' })}</div>`; },
        'uname -a'()       { return '<div class="output-text">Linux portfolio 6.9.0 #1 SMP Kubestronaut x86_64 GNU/Linux</div>'; },
        'cat goal.md'()    { return COMMANDS.goal(); },
        'cat contact.txt'(){ return COMMANDS.contact(); },
        history()          { return history.map((c, i) => `<div class="output-text">&nbsp;${String(i + 1).padStart(3)} &nbsp; ${esc(c)}</div>`).join('') || `<div class="output-text">${tCmd('err_no_history')}</div>`; },
    };

    /* ---- autocomplete ---- */
    const ALL_CMDS = [...Object.keys(COMMANDS), ...Object.keys(EGGS)];

    /* ---- execute ---- */
    function run(raw) {
        const cmd = raw.trim();
        if (!cmd) return;

        history.unshift(cmd);
        if (history.length > 80) history.pop();
        histIdx = -1;

        appendCommandEcho(cmd);

        const key = cmd.toLowerCase();
        let result;

        if (EGGS[key]) {
            result = EGGS[key]();
        } else if (COMMANDS[key]) {
            result = COMMANDS[key]();
        } else {
            result = `<div class="output-error">${tCmd('err_notfound')(esc(cmd))}</div>`;
        }

        if (result !== null) appendHtml(result);
    }

    /* ---- event listeners ---- */
    body.addEventListener('click', () => input.focus());

    input.addEventListener('keydown', e => {
        switch (e.key) {
            case 'Enter':
                run(input.value);
                input.value = '';
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (histIdx < history.length - 1) {
                    histIdx++;
                    input.value = history[histIdx];
                    setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (histIdx > 0) {
                    histIdx--;
                    input.value = history[histIdx];
                } else {
                    histIdx = -1;
                    input.value = '';
                }
                break;

            case 'Tab':
                e.preventDefault();
                {
                    const val = input.value.toLowerCase();
                    const matches = ALL_CMDS.filter(c => c.startsWith(val));
                    if (matches.length === 1) {
                        input.value = matches[0];
                    } else if (matches.length > 1) {
                        appendCommandEcho(input.value);
                        appendHtml(`<div class="output-text">${matches.join(' &nbsp; ')}</div>`);
                    }
                }
                break;

            case 'l':
                if (e.ctrlKey) { e.preventDefault(); output.innerHTML = ''; }
                break;
        }
    });
})();

/* ============================================================
   LANGUAGE SWITCHER
   ============================================================ */
(function () {
    const T = {
        'pt-BR': {
            'nav.experience':       'Experiência',
            'nav.education':        'Formação',
            'nav.contact':          'Contato',
            'hero.badge':           'Em rota para me tornar Kubestronaut',
            'hero.desc':            'Analista DevOps Jr na <strong>Casa do Construtor</strong> · Rio Claro, SP<br>Apaixonado por Kubernetes, automação e infraestrutura cloud-native.',
            'hero.cta.terminal':    'Abrir Terminal',
            'hero.stat.years':      'Anos de Experiência',
            'hero.stat.focus':      'Foco Principal',
            'hero.stat.degree':     'Sem. Eng. Computação',
            'sec.terminal':         'Terminal Interativo',
            'terminal.desc':        'Explore meu perfil como um verdadeiro DevOps. Digite <code>help</code> para começar.',
            'terminal.placeholder': 'digite um comando...',
            'terminal.welcome':     'Bem-vindo ao portfólio de <span class="output-accent-inline">Diogo Buzatto</span>. Sistema inicializado com sucesso.',
            'terminal.hint':        '→ Digite <span class="cmd-highlight">help</span> para ver os comandos disponíveis.',
            'tag.skills':           '// habilidades',
            'sec.skills':           'Stack Técnico',
            'skills.infra':         'Infraestrutura & Cloud',
            'skills.cicd':          'CI/CD & Automação',
            'skills.obs':           'Observabilidade',
            'skills.lang':          'Linguagens',
            'tag.experience':       '// carreira',
            'sec.experience':       'Experiência Profissional',
            'exp.date1':            'AGO 2025 — ATUAL',
            'exp.current':          'Atual',
            'exp.role1':            'Analista DevOps Jr',
            'exp.role2':            'Assistente de Infraestrutura',
            'exp.role3':            'Estagiário de Infraestrutura',
            'exp.role4':            'Vendedor de Comércio Varejista',
            'exp.role5':            'Ajudante Geral',
            'tag.education':        '// formação',
            'sec.education':        'Educação & Certificações',
            'edu.degree1':          'Engenharia da Computação',
            'edu.period1':          '2021 – 2026 · 11° Semestre',
            'edu.ongoing':          'Em Curso',
            'edu.degree2':          'Técnico em Mecatrônica',
            'edu.done':             'Concluído',
            'mission.title':        'Jornada Kubestronaut',
            'cert.progress':        'Em Progresso',
            'cert.next':            'Próximo',
            'cert.future':          'Futuro',
            'cert.more':            'CKAD · CKS · e mais...',
            'cert.progress.label':  '20% — Jornada em andamento',
            'tag.contact':          '// contato',
            'sec.contact':          'Vamos Conversar',
            'contact.desc':         'Aberto a oportunidades em DevOps · SRE · Platform Engineering',
            'contact.location':     'Localização',
        },
        'en': {
            'nav.experience':       'Experience',
            'nav.education':        'Education',
            'nav.contact':          'Contact',
            'hero.badge':           'On track to become a Kubestronaut',
            'hero.desc':            'Jr DevOps Analyst at <strong>Casa do Construtor</strong> · Rio Claro, SP<br>Passionate about Kubernetes, automation and cloud-native infrastructure.',
            'hero.cta.terminal':    'Open Terminal',
            'hero.stat.years':      'Years of Experience',
            'hero.stat.focus':      'Main Focus',
            'hero.stat.degree':     'Sem. Computer Engineering',
            'sec.terminal':         'Interactive Terminal',
            'terminal.desc':        'Explore my profile like a true DevOps engineer. Type <code>help</code> to start.',
            'terminal.placeholder': 'type a command...',
            'terminal.welcome':     'Welcome to <span class="output-accent-inline">Diogo Buzatto</span>\'s portfolio. System initialized successfully.',
            'terminal.hint':        '→ Type <span class="cmd-highlight">help</span> to see available commands.',
            'tag.skills':           '// skills',
            'sec.skills':           'Tech Stack',
            'skills.infra':         'Infrastructure & Cloud',
            'skills.cicd':          'CI/CD & Automation',
            'skills.obs':           'Observability',
            'skills.lang':          'Languages',
            'tag.experience':       '// career',
            'sec.experience':       'Professional Experience',
            'exp.date1':            'AUG 2025 — PRESENT',
            'exp.current':          'Current',
            'exp.role1':            'Jr DevOps Analyst',
            'exp.role2':            'Infrastructure Assistant',
            'exp.role3':            'Infrastructure Intern',
            'exp.role4':            'Retail Sales Associate',
            'exp.role5':            'General Assistant',
            'tag.education':        '// education',
            'sec.education':        'Education & Certifications',
            'edu.degree1':          'Computer Engineering',
            'edu.period1':          '2021 – 2026 · 11th Semester',
            'edu.ongoing':          'Ongoing',
            'edu.degree2':          'Mechatronics Technician',
            'edu.done':             'Completed',
            'mission.title':        'Kubestronaut Journey',
            'cert.progress':        'In Progress',
            'cert.next':            'Next',
            'cert.future':          'Future',
            'cert.more':            'CKAD · CKS · and more...',
            'cert.progress.label':  '20% — Journey underway',
            'tag.contact':          '// contact',
            'sec.contact':          "Let's Talk",
            'contact.desc':         'Open to opportunities in DevOps · SRE · Platform Engineering',
            'contact.location':     'Location',
        },
    };

    window.currentLang = 'pt-BR';

    function applyLang(lang) {
        const dict = T[lang];
        if (!dict) return;
        window.currentLang = lang;

        document.getElementById('html-root').lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const v = dict[el.dataset.i18n];
            if (v !== undefined) el.textContent = v;
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const v = dict[el.dataset.i18nHtml];
            if (v !== undefined) el.innerHTML = v;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const v = dict[el.dataset.i18nPlaceholder];
            if (v !== undefined) el.placeholder = v;
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        localStorage.setItem('lang', lang);
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });

    const saved = localStorage.getItem('lang');
    if (saved && saved !== 'pt-BR') applyLang(saved);
})();
