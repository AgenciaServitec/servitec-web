const canvas = document.getElementById('space-bg');

if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    let W, H;
    let time = 0;

    let mouse = { x: -9999, y: -9999, active: false, targetX: -9999, targetY: -9999 };

    let stars = [];
    let nebulae = [];

    const PALETTE = [
        { r: 250, g: 204, b: 21 },
        { r: 234, g: 179, b: 8 },
        { r: 245, g: 158, b: 11 }
    ];

    function resize() {
        const parent = canvas.parentElement;
        W = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
        H = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
        initCosmos();
    }

    function createNebulaTexture(radius, color) {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = radius * 2;
        offCanvas.height = radius * 2;
        const offCtx = offCanvas.getContext('2d');

        const grad = offCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
        grad.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, 0.04)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        offCtx.fillStyle = grad;
        offCtx.fillRect(0, 0, radius * 2, radius * 2);
        return offCanvas;
    }

    function initCosmos() {
        stars = [];
        nebulae = [];

        const STAR_COUNT = W < 768 ? 200 : 400;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                z: Math.random() * 100 + 1,
                size: Math.random() * 1.5,
                alpha: Math.random(),
                blinkSpeed: Math.random() * 0.02 + 0.005
            });
        }

        const NEBULA_COUNT = W < 768 ? 6 : 12;
        for (let i = 0; i < NEBULA_COUNT; i++) {
            const radius = Math.random() * 300 + 150;
            const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

            nebulae.push({
                x: Math.random() * W,
                y: Math.random() * H,
                radius: radius,
                texture: createNebulaTexture(radius, color),
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.001 + 0.0005
            });
        }
    }

    window.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.targetX = e.clientX - r.left;
        mouse.targetY = e.clientY - r.top;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.targetX = W / 2;
        mouse.targetY = H / 2;
    });

    window.addEventListener('resize', resize);

    function draw() {
        if (!W || !H) resize();

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#05030a';
        ctx.fillRect(0, 0, W, H);

        time += 1;

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        let cx = W / 2;
        let cy = H / 2;

        let mouseOffsetX = (mouse.x - cx);
        let mouseOffsetY = (mouse.y - cy);

        ctx.globalCompositeOperation = 'screen';

        nebulae.forEach(n => {
            n.phaseX += n.speed;
            n.phaseY += n.speed * 0.8;

            let nx = n.x + Math.sin(n.phaseX) * 100;
            let ny = n.y + Math.cos(n.phaseY) * 100;

            let pX = mouse.active ? mouseOffsetX * -0.02 : 0;
            let pY = mouse.active ? mouseOffsetY * -0.02 : 0;

            ctx.drawImage(n.texture, (nx + pX) - n.radius, (ny + pY) - n.radius);
        });

        ctx.globalCompositeOperation = 'lighter';

        ctx.beginPath();

        stars.forEach(s => {
            s.alpha += Math.sin(time * s.blinkSpeed) * 0.05;

            let parallaxX = mouse.active ? mouseOffsetX * (1 / s.z) * -1 : 0;
            let parallaxY = mouse.active ? mouseOffsetY * (1 / s.z) * -1 : 0;

            s.x -= 0.2 * (100 / s.z);
            if (s.x < -50) s.x = W + 50;

            let px = s.x + parallaxX;
            let py = s.y + parallaxY;

            let a = Math.max(0.1, Math.min(1, s.alpha));
            let radius = s.size * (100 / s.z) * 0.4;

            if (px > -10 && px < W + 10 && py > -10 && py < H + 10) {
                ctx.moveTo(px, py);
                ctx.arc(px, py, Math.max(0.1, radius), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
                ctx.fill();
                ctx.beginPath();
            }
        });

        requestAnimationFrame(draw);
    }

    if (document.readyState === 'complete') {
        resize();
        draw();
    } else {
        window.addEventListener('load', () => {
            resize();
            draw();
        });
    }
}