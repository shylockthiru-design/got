import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function useInView(ref, threshold = 0.15) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref, threshold]);
    return inView;
}

export function FadeIn({ children, delay = 0, style = {} }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            style={style}
        >
            {children}
        </motion.div>
    );
}

export function Glass({ children, style = {}, onClick, accent = "rgba(212,175,55,0.18)" }) {
    const [h, setH] = useState(false);
    return (
        <motion.div
            onClick={onClick}
            onMouseEnter={() => onClick && setH(true)}
            onMouseLeave={() => setH(false)}
            whileHover={{ y: -7, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${h ? "rgba(212,175,55,0.4)" : accent}`,
                borderRadius: "14px",
                boxShadow: h ? "0 16px 48px rgba(0,0,0,0.55), 0 0 24px rgba(212,175,55,0.06)" : "0 4px 24px rgba(0,0,0,0.3)",
                cursor: onClick ? "pointer" : "default",
                ...style,
            }}>
            {children}
        </motion.div>
    );
}

export function Title({ main, sub }) {
    return (
        <FadeIn style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(1.6rem,4vw,2.8rem)", color: "#d4af37", letterSpacing: "0.06em", textShadow: "0 0 50px rgba(212,175,55,0.25)", marginBottom: "0.6rem" }}>{main}</div>
            {sub && <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1.1rem", letterSpacing: "0.04em" }}>{sub}</div>}
            <div style={{ margin: "1rem auto 0", width: "60px", height: "1px", background: "linear-gradient(90deg,transparent,#d4af37,transparent)" }} />
        </FadeIn>
    );
}

export function Particles() {
    const ref = useRef(null);
    const mouse = useRef({ x: -1000, y: -1000 });
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext("2d");
        let id;
        const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
        resize(); window.addEventListener("resize", resize);
        const onMouse = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener("mousemove", onMouse);
        const pts = Array.from({ length: 120 }, () => ({
            x: Math.random() * c.width, y: Math.random() * c.height,
            r: Math.random() * 1.4 + 0.2, s: Math.random() * 0.25 + 0.04,
            o: Math.random() * 0.5 + 0.1, d: (Math.random() - 0.5) * 0.1,
            vx: 0, vy: 0,
        }));
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            const mx = mouse.current.x, my = mouse.current.y;
            pts.forEach(p => {
                const dx = p.x - mx, dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120 && dist > 0) {
                    const force = (120 - dist) / 120 * 0.8;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
                p.vx *= 0.92; p.vy *= 0.92;
                p.x += p.d + p.vx; p.y -= p.s + p.vy;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212,175,55,${p.o})`; ctx.fill();
                if (p.y < -4) { p.y = c.height + 4; p.x = Math.random() * c.width; }
                if (p.x < -4 || p.x > c.width + 4) p.x = Math.random() * c.width;
            });
            id = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.45 }} />;
}
