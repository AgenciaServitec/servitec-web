import { animate, stagger } from "motion";

type RevealOptions = {
    y?: number;
    duration?: number;
    delay?: number;
};

export function reveal(el: Element, opts: RevealOptions = {}) {
    const y = opts.y ?? 14;
    const duration = opts.duration ?? 0.6;
    const delay = opts.delay ?? 0;

    animate(
        el,
        { opacity: [0, 1], transform: [`translateY(${y}px)`, "translateY(0px)"] },
        { duration, delay, easing: "ease-out" }
    );
}

export function revealChildren(container: Element, selector = "[data-reveal-item]") {
    const items = Array.from(container.querySelectorAll(selector));
    if (!items.length) return;

    animate(
        items,
        { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] },
        { duration: 0.6, delay: stagger(0.08), easing: "ease-out" }
    );
}

export function pop(el: Element, opts: { duration?: number; delay?: number } = {}) {
    animate(
        el,
        { opacity: [0, 1], transform: ["scale(0.98)", "scale(1)"] },
        { duration: opts.duration ?? 0.6, delay: opts.delay ?? 0, easing: "ease-out" }
    );
}
