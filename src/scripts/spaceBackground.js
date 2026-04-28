const canvas = document.getElementById('space-bg');

if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    let W, H, time = 0, raf;
    let mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };

    let stars = [], deepStars = [], nebulae = [], meteors = [];
    let offNeb, offCtxNeb;

    const STAR_COLORS = [
        [220, 235, 255],
        [255, 255, 255],
        [255, 248, 230],
        [180, 200, 255],
        [200, 180, 255],
    ];

    const NEB_PALETTE = [
        [30,  60, 140,  0.10],
        [60,  30, 120,  0.10],
        [20,  80, 120,  0.09],
        [100, 40, 160,  0.08],
        [10,  50, 100,  0.07],
    ];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        mouse.x = mouse.tx = W * 0.5;
        mouse.y = mouse.ty = H * 0.5;
        buildScene();
    }

    function buildScene() {
        stars = []; deepStars = []; nebulae = [];

        offNeb = document.createElement('canvas');
        offNeb.width = W; offNeb.height = H;
        offCtxNeb = offNeb.getContext('2d');
        buildNebulae();

        const DC = Math.round((W * H) / 2400);
        for (let i = 0; i < DC; i++) {
            deepStars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                a: Math.random() * 0.35 + 0.05,
                r: Math.random() * 0.5 + 0.15,
                col: STAR_COLORS[Math.floor(Math.random() * 3)],
            });
        }

        const SC = W < 768 ? 320 : 640;
        for (let i = 0; i < SC; i++) {
            const layer = i < SC * 0.55 ? 0 : i < SC * 0.82 ? 1 : 2;
            const col = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
            const r = Math.random() * ([0.5, 0.9, 1.6][layer]) + 0.15;
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                layer,
                r,
                baseA: Math.random() * 0.55 + 0.35,
                a: 0,
                drift: [0.025, 0.07, 0.18][layer],
                par: [0.004, 0.011, 0.022][layer],
                bFreq: Math.random() * 0.014 + 0.003,
                bPhase: Math.random() * Math.PI * 2,
                col,
                cross: layer === 2 && r > 1.1,
            });
        }
    }

    function buildNebulae() {
        offCtxNeb.clearRect(0, 0, W, H);
        offCtxNeb.globalCompositeOperation = 'screen';

        for (let i = 0; i < 3; i++) {
            const [r, g, b, ao] = NEB_PALETTE[i % NEB_PALETTE.length];
            const cx = (0.2 + Math.random() * 0.6) * W;
            const cy = (0.2 + Math.random() * 0.6) * H;
            const rx = W * (0.25 + Math.random() * 0.3);
            const ry = H * (0.2 + Math.random() * 0.25);

            offCtxNeb.save();
            offCtxNeb.translate(cx, cy);
            offCtxNeb.rotate(Math.random() * Math.PI);
            offCtxNeb.scale(1, ry / rx);

            const grd = offCtxNeb.createRadialGradient(0, 0, 0, 0, 0, rx);
            grd.addColorStop(0,   `rgba(${r},${g},${b},${ao * 1.8})`);
            grd.addColorStop(0.3, `rgba(${r},${g},${b},${ao * 0.9})`);
            grd.addColorStop(0.7, `rgba(${r},${g},${b},${ao * 0.25})`);
            grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
            offCtxNeb.fillStyle = grd;
            offCtxNeb.beginPath();
            offCtxNeb.arc(0, 0, rx, 0, Math.PI * 2);
            offCtxNeb.fill();
            offCtxNeb.restore();
        }

        for (let i = 0; i < 6; i++) {
            const [r, g, b] = NEB_PALETTE[(i + 1) % NEB_PALETTE.length];
            const x0 = Math.random() * W, y0 = Math.random() * H;
            const x1 = x0 + (Math.random() - 0.5) * W * 0.6;
            const y1 = y0 + (Math.random() - 0.5) * H * 0.5;
            const grd = offCtxNeb.createLinearGradient(x0, y0, x1, y1);
            grd.addColorStop(0,   `rgba(${r},${g},${b},0)`);
            grd.addColorStop(0.4, `rgba(${r},${g},${b},0.05)`);
            grd.addColorStop(0.6, `rgba(${r},${g},${b},0.05)`);
            grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
            offCtxNeb.strokeStyle = grd;
            offCtxNeb.lineWidth = 60 + Math.random() * 120;
            offCtxNeb.beginPath();
            offCtxNeb.moveTo(x0, y0);
            offCtxNeb.quadraticCurveTo(
                (x0 + x1) / 2 + (Math.random() - 0.5) * 200,
                (y0 + y1) / 2 + (Math.random() - 0.5) * 200,
                x1, y1
            );
            offCtxNeb.stroke();
        }

        for (let i = 0; i < 4; i++) {
            const [r, g, b] = NEB_PALETTE[Math.floor(Math.random() * NEB_PALETTE.length)];
            const cx = Math.random() * W;
            const cy = Math.random() * H;
            const rad = 60 + Math.random() * 90;
            const grd = offCtxNeb.createRadialGradient(cx, cy, 0, cx, cy, rad);
            grd.addColorStop(0,   `rgba(${r},${g},${b},0.18)`);
            grd.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`);
            grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
            offCtxNeb.fillStyle = grd;
            offCtxNeb.beginPath();
            offCtxNeb.arc(cx, cy, rad, 0, Math.PI * 2);
            offCtxNeb.fill();
        }
    }

    function spawnMeteor() {
        if (meteors.length >= 3) return;
        const t = Math.random();
        const fromTop = Math.random() < 0.7;
        const angle = fromTop
            ? (Math.PI * 0.18 + Math.random() * 0.22)
            : (Math.PI * 0.55 + Math.random() * 0.2);
        const speed = 9 + Math.random() * 12;
        meteors.push({
            x: fromTop ? Math.random() * W * 1.2 : W + 20,
            y: fromTop ? -20 : Math.random() * H * 0.4,
            vx: -Math.cos(angle) * speed,
            vy:  Math.sin(angle) * speed,
            len: 90 + Math.random() * 140,
            alpha: 0,
            fadeIn: true,
            w: Math.random() * 0.9 + 0.3,
            cr: 200 + Math.floor(Math.random() * 55),
            cg: 210 + Math.floor(Math.random() * 45),
            cb: 255,
        });
    }

    window.addEventListener('mousemove', e => {
        mouse.tx = e.clientX;
        mouse.ty = e.clientY;
        mouse.active = true;
    });
    window.addEventListener('touchmove', e => {
        if (e.touches.length) {
            mouse.tx = e.touches[0].clientX;
            mouse.ty = e.touches[0].clientY;
            mouse.active = true;
        }
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.active = false; });
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); raf = requestAnimationFrame(draw); });

    function draw() {
        raf = requestAnimationFrame(draw);
        time++;

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#030209';
        ctx.fillRect(0, 0, W, H);

        const easeX = (mouse.tx - mouse.x) * 0.035;
        const easeY = (mouse.ty - mouse.y) * 0.035;
        mouse.x += easeX;
        mouse.y += easeY;
        const dx = mouse.active ? (mouse.x - W * 0.5) : 0;
        const dy = mouse.active ? (mouse.y - H * 0.5) : 0;

        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(offNeb, dx * -0.018, dy * -0.018);

        ctx.globalCompositeOperation = 'source-over';
        {
            const v = ctx.createRadialGradient(W*0.5, H*0.5, H*0.08, W*0.5, H*0.5, H*0.9);
            v.addColorStop(0, 'rgba(0,0,0,0)');
            v.addColorStop(1, 'rgba(0,0,4,0.6)');
            ctx.fillStyle = v;
            ctx.fillRect(0, 0, W, H);
        }

        ctx.globalCompositeOperation = 'lighter';
        deepStars.forEach(s => {
            ctx.fillStyle = `rgba(${s.col[0]},${s.col[1]},${s.col[2]},${s.a})`;
            ctx.fillRect(s.x, s.y, s.r, s.r);
        });

        stars.forEach(s => {
            s.a = s.baseA + Math.sin(time * s.bFreq + s.bPhase) * 0.2;

            s.x -= s.drift;
            if (s.x < -2) s.x = W + 2;

            const px = s.x + dx * -s.par;
            const py = s.y + dy * -s.par;
            if (px < -4 || px > W + 4 || py < -4 || py > H + 4) return;

            const a = Math.max(0.05, Math.min(1, s.a));
            const [r, g, b] = s.col;

            if (s.layer === 2 && s.r > 0.9) {
                const haloR = s.r * 5;
                const hg = ctx.createRadialGradient(px, py, 0, px, py, haloR);
                hg.addColorStop(0, `rgba(${r},${g},${b},${a * 0.18})`);
                hg.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = hg;
                ctx.beginPath();
                ctx.arc(px, py, haloR, 0, 6.283);
                ctx.fill();
            }

            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
            ctx.beginPath();
            ctx.arc(px, py, s.r, 0, 6.283);
            ctx.fill();

            if (s.cross) {
                const len = s.r * 3.5;
                ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.35})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(px - len, py); ctx.lineTo(px + len, py);
                ctx.moveTo(px, py - len); ctx.lineTo(px, py + len);
                ctx.stroke();
            }
        });

        if (time % 220 === 0) spawnMeteor();

        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            m.x += m.vx; m.y += m.vy;

            if (m.fadeIn) { m.alpha += 0.06; if (m.alpha >= 1) m.fadeIn = false; }
            else           { m.alpha -= 0.008; }

            if (m.alpha <= 0 || m.x < -80 || m.y > H + 80) {
                meteors.splice(i, 1); continue;
            }

            const tailX = m.x - m.vx * (m.len / Math.hypot(m.vx, m.vy));
            const tailY = m.y - m.vy * (m.len / Math.hypot(m.vx, m.vy));
            const mg = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            mg.addColorStop(0,    `rgba(${m.cr},${m.cg},${m.cb},0)`);
            mg.addColorStop(0.75, `rgba(${m.cr},${m.cg},${m.cb},${m.alpha * 0.5})`);
            mg.addColorStop(1,    `rgba(${m.cr},${m.cg},${m.cb},${m.alpha})`);
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = mg;
            ctx.lineWidth = m.w;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            ctx.fillStyle = `rgba(${m.cr},${m.cg},${m.cb},${m.alpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.w * 1.2, 0, 6.283);
            ctx.fill();
        }
    }

    resize();
    raf = requestAnimationFrame(draw);
}