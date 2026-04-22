const canvas = document.getElementById('space-bg');

if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const STAR_COUNT = 180;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.008 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.00004,
    }));

    const nebulae = [
        { x: 0.15, y: 0.25, rx: 180, ry: 120, color: 'rgba(99,60,180,0.045)' },
        { x: 0.80, y: 0.65, rx: 220, ry: 150, color: 'rgba(245,196,0,0.03)' },
        { x: 0.50, y: 0.85, rx: 160, ry: 100, color: 'rgba(59,130,246,0.04)' },
        { x: 0.90, y: 0.10, rx: 140, ry: 90,  color: 'rgba(180,60,120,0.035)' },
    ];

    const DUST_COUNT = 30;
    const dust = Array.from({ length: DUST_COUNT }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.12 + 0.04,
        vx: (Math.random() - 0.5) * 0.00008,
        vy: (Math.random() - 0.5) * 0.00008,
    }));

    let t = 0;

    function draw() {
        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);

        for (const n of nebulae) {
            const gx = n.x * W;
            const gy = n.y * H;
            const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(n.rx, n.ry));
            grad.addColorStop(0, n.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.save();
            ctx.scale(1, n.ry / n.rx);
            ctx.beginPath();
            ctx.arc(gx, gy * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }

        for (const s of stars) {
            const twinkle = Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset);
            const alpha = s.alpha * (0.75 + 0.25 * twinkle);

            s.x += s.drift;
            if (s.x < 0) s.x = 1;
            if (s.x > 1) s.x = 0;

            ctx.beginPath();
            ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            ctx.fill();
        }

        for (const d of dust) {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0) d.x = 1;
            if (d.x > 1) d.x = 0;
            if (d.y < 0) d.y = 1;
            if (d.y > 1) d.y = 0;

            ctx.beginPath();
            ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,210,255,${d.alpha.toFixed(3)})`;
            ctx.fill();
        }

        t++;
        requestAnimationFrame(draw);
    }

    draw();
}