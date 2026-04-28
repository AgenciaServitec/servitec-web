import { animate, stagger } from "motion";

// 1. Animación de entrada (Motion One)
const hero = document.querySelector("[data-hero]");
if (hero) {
    animate(
        hero.querySelectorAll("[data-hero-item]"),
        { opacity: [0, 1], y: [40, 0], scale: [0.98, 1] },
        { duration: 1, delay: stagger(0.15), easing: [0.16, 1, 0.3, 1] }
    );
}

// 2. Animación del Personaje (Seguimiento 3D)
const container = document.getElementById('character-container');
const head = document.getElementById('head-group');
const face = document.getElementById('face-group');
const pupils = document.getElementById('pupils-group');
const hair = document.getElementById('hair-group');
const body = document.getElementById('body-group');

let mouse = { x: 0, y: 0 };
let current = { x: 0, y: 0 };

if (container && head) {
    window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalizamos el movimiento (-1 a 1)
        mouse.x = (e.clientX - centerX) / (window.innerWidth / 2);
        mouse.y = (e.clientY - centerY) / (window.innerHeight / 2);
    });

    function tick() {
        // Suavizado ultra fluido (LERP)
        current.x += (mouse.x - current.x) * 0.07;
        current.y += (mouse.y - current.y) * 0.07;

        // Efecto Paralaje (Diferentes intensidades)
        // Pupilas: Máximo movimiento
        if (pupils) pupils.style.transform = `translate(${current.x * 10}px, ${current.y * 8}px)`;

        // Facciones: Movimiento medio
        if (face) face.style.transform = `translate(${current.x * 5}px, ${current.y * 4}px)`;

        // Cabeza completa: Rotación leve + traslación
        if (head) head.style.transform = `translate(${current.x * 3}px, ${current.y * 2}px) rotate(${current.x * 2}deg)`;

        // Cabello: Movimiento opuesto leve (da volumen)
        if (hair) hair.style.transform = `translate(${current.x * -1.5}px, ${current.y * -1}px)`;

        // Cuerpo: Movimiento mínimo base
        if (body) body.style.transform = `translate(${current.x * 1.5}px, 0px)`;

        requestAnimationFrame(tick);
    }
    tick();
}