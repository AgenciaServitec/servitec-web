import { animate, stagger } from "motion";

const hero = document.querySelector("[data-hero]");
if (hero) {
    const items = hero.querySelectorAll("[data-hero-item]");
    animate(
        items,
        { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
        { duration: 0.8, delay: stagger(0.15), easing: [0.16, 1, 0.3, 1] }
    );
}

// 2. Animación interactiva del personaje (Avatar)
const container = document.getElementById('character-container');
const faceGroup = document.getElementById('face-group');
const pupilsGroup = document.getElementById('pupils-group');
const hairGroup = document.getElementById('hair-group');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentFaceX = 0, currentFaceY = 0;
let currentPupilX = 0, currentPupilY = 0;

if (container && faceGroup && pupilsGroup) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function render() {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = (mouseX - centerX) / (window.innerWidth / 2);
        let deltaY = (mouseY - centerY) / (window.innerHeight / 2);

        deltaX = Math.max(-1, Math.min(1, deltaX));
        deltaY = Math.max(-1, Math.min(1, deltaY));

        const targetFaceX = deltaX * 4;
        const targetFaceY = deltaY * 3;

        const targetPupilX = deltaX * 3.5;
        const targetPupilY = deltaY * 3.5;

        currentFaceX += (targetFaceX - currentFaceX) * 0.1;
        currentFaceY += (targetFaceY - currentFaceY) * 0.1;

        currentPupilX += (targetPupilX - currentPupilX) * 0.15;
        currentPupilY += (targetPupilY - currentPupilY) * 0.15;

        faceGroup.style.transform = `translate(${currentFaceX}px, ${currentFaceY}px)`;
        pupilsGroup.style.transform = `translate(${currentPupilX}px, ${currentPupilY}px)`;

        if (hairGroup) {
            hairGroup.style.transform = `translate(${currentFaceX * 0.4}px, ${currentFaceY * 0.3}px)`;
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}