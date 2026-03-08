import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "./components";
import { HOUSES } from "./data";

/* ═══════════════════════════════════════════
   EMBER PARTICLES (canvas)
═══════════════════════════════════════════ */
function EmberCanvas() {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext("2d");
        let id;
        const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);

        const embers = Array.from({ length: 90 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight + window.innerHeight,
            r: Math.random() * 2.5 + 0.5,
            s: Math.random() * 0.6 + 0.2,
            o: Math.random() * 0.7 + 0.1,
            d: (Math.random() - 0.5) * 0.8,
            life: Math.random(),
            hue: Math.random() * 40 + 10, // orange-red
        }));

        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            embers.forEach(e => {
                e.y -= e.s;
                e.x += e.d + Math.sin(e.life * 3) * 0.4;
                e.life += 0.008;
                const flicker = Math.sin(e.life * 8) * 0.15 + 0.85;

                ctx.beginPath();
                ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
                const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 2);
                grad.addColorStop(0, `hsla(${e.hue},100%,80%,${e.o * flicker})`);
                grad.addColorStop(1, `hsla(${e.hue},100%,50%,0)`);
                ctx.fillStyle = grad;
                ctx.fill();

                if (e.y < -10) {
                    e.y = c.height + 10;
                    e.x = Math.random() * c.width;
                    e.life = Math.random();
                }
            });
            id = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={ref} style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }} />;
}

/* ═══════════════════════════════════════════
   DRAGON SHADOW PASS
═══════════════════════════════════════════ */
function DragonShadow() {
    const [visible, setVisible] = useState(false);
    const [x, setX] = useState(-300);
    const [y, setY] = useState(120);
    const [dir, setDir] = useState(1);

    useEffect(() => {
        const fire = () => {
            const d = Math.random() > 0.5 ? 1 : -1;
            setDir(d);
            setX(d === 1 ? -300 : window.innerWidth + 300);
            setY(80 + Math.random() * (window.innerHeight * 0.4));
            setVisible(true);
            setTimeout(() => setVisible(false), 5000);
        };
        const t1 = setTimeout(fire, 6000);
        const iv = setInterval(fire, 28000 + Math.random() * 10000);
        return () => { clearTimeout(t1); clearInterval(iv); };
    }, []);

    useEffect(() => {
        if (!visible) return;
        const start = dir === 1 ? -300 : window.innerWidth + 300;
        const end = dir === 1 ? window.innerWidth + 300 : -300;
        let cur = start;
        const step = (end - start) / 240;
        let frame;
        const animate = () => {
            cur += step;
            setX(cur);
            if (dir === 1 ? cur < end : cur > end) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [visible, dir]);

    if (!visible) return null;
    return (
        <div style={{
            position: "fixed", left: x, top: y, zIndex: 6, pointerEvents: "none",
            fontSize: "7rem", lineHeight: 1,
            transform: dir === -1 ? "scaleX(-1)" : "none",
            filter: "brightness(0.08) drop-shadow(0 8px 30px rgba(0,0,0,0.9))",
            animation: "dragonFlap 0.35s ease-in-out infinite",
        }}>🐉</div>
    );
}

/* ═══════════════════════════════════════════
   RAVEN CURSOR
═══════════════════════════════════════════ */
function RavenCursor() {
    const [pos, setPos] = useState({ x: -200, y: -200 });
    const [onLink, setOnLink] = useState(false);
    useEffect(() => {
        const onMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
            const t = e.target;
            setOnLink(t.matches("button,a,[onClick]") || !!t.closest("button,a"));
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);
    return (
        <div style={{
            position: "fixed", left: pos.x, top: pos.y, zIndex: 9999,
            pointerEvents: "none", transform: "translate(-50%,-50%)",
            fontSize: onLink ? "1.8rem" : "1.3rem",
            transition: "font-size 0.2s ease",
            filter: onLink
                ? "brightness(0) drop-shadow(0 0 8px rgba(50,50,50,0.9))"
                : "sepia(1) contrast(1.4) drop-shadow(0 0 5px rgba(180,150,100,0.7))",
        }}>🪶</div>
    );
}

/* ═══════════════════════════════════════════
   SPARK BURST ON CLICK
═══════════════════════════════════════════ */
function SparkBurst({ bursts }) {
    return (
        <>
            {bursts.map(b => b.sparks.map(s => (
                <div key={`${b.id}-${s.i}`} style={{
                    position: "fixed", left: s.x, top: s.y, zIndex: 9998,
                    pointerEvents: "none",
                    width: `${s.size}px`, height: `${s.size}px`,
                    borderRadius: "50%",
                    background: s.color,
                    boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
                    animation: `spark_${s.i % 4} 0.75s ease-out forwards`,
                }} />
            )))}
        </>
    );
}

/* ═══════════════════════════════════════════
   FIRE BUTTON
═══════════════════════════════════════════ */
function FireButton({ label, primary, onClick }) {
    const [hov, setHov] = useState(false);
    const [bursts, setBursts] = useState([]);

    const fire = useCallback((e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const sparks = Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const dist = 30 + Math.random() * 60;
            return {
                i, x: cx, y: cy,
                size: 3 + Math.random() * 4,
                color: primary
                    ? `hsl(${Math.random() * 40 + 5},100%,${55 + Math.random() * 25}%)`
                    : `hsl(${Math.random() * 50 + 30},100%,${60 + Math.random() * 28}%)`,
            };
        });
        const id = Date.now();
        setBursts(prev => [...prev, { id, sparks }]);
        setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 800);
        if (onClick) onClick();
    }, [primary, onClick]);

    return (
        <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={fire}
            style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "0.82rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: primary ? "#0a0a14" : (hov ? "#ff8800" : "#d4af37"),
                background: primary
                    ? (hov ? "linear-gradient(135deg,#ff4500,#ff9000,#d4af37)" : "linear-gradient(135deg,#d4af37,#a0720a)")
                    : "rgba(0,0,0,0.35)",
                border: primary ? "none" : `1.5px solid ${hov ? "rgba(255,100,0,0.8)" : "rgba(212,175,55,0.6)"}`,
                borderRadius: "3px",
                padding: "1rem 2.6rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.35s ease",
                transform: hov ? "translateY(-4px) scale(1.05)" : "scale(1)",
                boxShadow: primary
                    ? (hov ? "0 0 50px rgba(255,80,0,0.8), 0 0 100px rgba(255,40,0,0.3), 0 10px 30px rgba(0,0,0,0.5)" : "0 0 25px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.4)")
                    : (hov ? "0 0 30px rgba(255,80,0,0.5), 0 4px 20px rgba(0,0,0,0.5)" : "0 0 0 1px rgba(212,175,55,0.1)"),
                backdropFilter: "blur(10px)",
            }}>
            {/* Fire glow border sweep */}
            {hov && primary && (
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg,transparent,rgba(255,150,0,0.15),transparent)",
                    animation: "shimmer 0.6s ease forwards",
                    pointerEvents: "none",
                }} />
            )}
            {/* Pulsing border for secondary */}
            {!primary && (
                <div style={{
                    position: "absolute", inset: "-1px",
                    borderRadius: "3px",
                    background: "transparent",
                    border: hov ? "1.5px solid rgba(255,100,0,0.5)" : "1.5px solid rgba(212,175,55,0.2)",
                    animation: hov ? "borderPulse 0.5s ease-in-out infinite alternate" : "none",
                    pointerEvents: "none",
                }} />
            )}
            {label}
            <SparkBurst bursts={bursts} />
        </button>
    );
}

/* ═══════════════════════════════════════════
   BOSS COMMANDER GALLERY
═══════════════════════════════════════════ */
const COMMANDERS = [
    { name: "Jon Snow", title: "King in the North", img: "/images/6- Got Pngs/bossCommander_Snow.png" },
    { name: "Daenerys Targaryen", title: "Mother of Dragons", img: "/images/6- Got Pngs/bossCommander_Daenerys.png" },
    { name: "Tyrion Lannister", title: "Hand of the Queen", img: "/images/6- Got Pngs/bossCommander_Tyrion.png" },
    { name: "Arya Stark", title: "No One", img: "/images/6- Got Pngs/bossCommander_Arya.png" },
    { name: "Cersei Lannister", title: "Queen of the Seven Kingdoms", img: "/images/6- Got Pngs/bossCommander_Cersei.png" },
    { name: "Jaime Lannister", title: "The Kingslayer", img: "/images/6- Got Pngs/bossCommander_Jaime.png" },
    { name: "Sansa Stark", title: "Queen in the North", img: "/images/6- Got Pngs/bossCommander_Sansa.png" },
    { name: "Robb Stark", title: "The Young Wolf", img: "/images/6- Got Pngs/bossCommander_Robb.png" },
    { name: "Theon Greyjoy", title: "Prince of Winterfell", img: "/images/6- Got Pngs/bossCommander_Theon.png" },
    { name: "Sandor Clegane", title: "The Hound", img: "/images/6- Got Pngs/bossCommander_Clegane.png" },
    { name: "Varys", title: "The Spider", img: "/images/6- Got Pngs/bossCommander_Varys.png" },
];

function CommanderGallery({ setPage }) {
    const { scrollYProgress } = useScroll();
    const galleryY = useTransform(scrollYProgress, [0, 1], [150, 0]);
    // Simulate "opening a storybook" / curtain reveal
    const clipPath = useTransform(scrollYProgress, [0.08, 0.45], ["inset(0 50% 0 50%)", "inset(0 0% 0 0%)"]);

    return (
        <motion.div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 2rem", position: "relative", zIndex: 10, y: galleryY, clipPath }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem", justifyContent: "center" }}>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4))" }} />
                <h2 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "2.5rem", color: "#d4af37", textShadow: "0 0 20px rgba(212,175,55,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Legends of Westeros</h2>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, transparent, rgba(212,175,55,0.4))" }} />
            </div>

            <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem" }}>
                {COMMANDERS.map((c, i) => (
                    <motion.div
                        key={c.name}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div style={{
                            background: "linear-gradient(180deg, rgba(10,10,15,0.9), rgba(8,8,12,0.95))",
                            border: "1px solid rgba(212,175,55,0.15)",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                            cursor: "pointer",
                            position: "relative",
                            borderBottom: "2px solid rgba(212,175,55,0.12)",
                        }}
                            onClick={() => setPage && setPage("characters")}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                                e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
                                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.2)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)";
                                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.8)";
                            }}
                        >
                            <div style={{ position: "relative", width: "100%", paddingTop: "135%", backgroundColor: "#080810" }}>
                                <img src={c.img} alt={c.name} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(8,8,12,1) 0%, rgba(8,8,12,0.4) 40%, transparent 100%)" }} />
                            </div>
                            <div style={{ padding: "1.5rem", position: "absolute", bottom: 0, left: 0, right: 0 }}>
                                <h3 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.4rem", color: "#fff", margin: "0 0 0.3rem", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{c.name}</h3>
                                <p style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1rem", color: "rgba(212,175,55,0.8)", margin: 0 }}>{c.title}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
export function HomePage({ setPage }) {
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVis(true), 400);
        return () => clearTimeout(t);
    }, []);

    const fade = (delay, extra = {}) => ({
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
        transition: `opacity 1.1s ease ${delay}s, transform 1.1s ease ${delay}s`,
        ...extra,
    });

    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -150]);
    const mistOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.8]);

    return (
        <>
            {/* ── Global Keyframes ── */}
            <style>{`
                @keyframes dragonFlap {
                    0%,100%{transform:rotate(-4deg) translateY(0);}
                    50%{transform:rotate(4deg) translateY(-10px);}
                }
                @keyframes shimmer {
                    0%{left:-100%;} 100%{left:200%;}
                }
                @keyframes borderPulse {
                    0%{box-shadow:0 0 8px rgba(255,100,0,0.3);}
                    100%{box-shadow:0 0 22px rgba(255,100,0,0.7);}
                }
                @keyframes floatV0 {
                    0%,100%{transform:translateY(0) rotate(0deg);}
                    33%{transform:translateY(-20px) rotate(4deg);}
                    66%{transform:translateY(-9px) rotate(-2deg);}
                }
                @keyframes floatV1 {
                    0%,100%{transform:translateY(0) scale(1);}
                    50%{transform:translateY(-25px) rotate(-5deg) scale(1.06);}
                }
                @keyframes floatV2 {
                    0%,100%{transform:translateX(0) rotate(0deg);}
                    40%{transform:translateX(14px) rotate(3deg) translateY(-12px);}
                    70%{transform:translateX(-10px) rotate(-3deg) translateY(-22px);}
                }
                @keyframes floatV3 {
                    0%,100%{transform:translateY(0);}
                    25%{transform:translateY(-30px);}
                    75%{transform:translateY(-14px) rotate(5deg);}
                }
                @keyframes spark_0 {
                    to{transform:translate(60px,-80px) scale(0);opacity:0;}
                }
                @keyframes spark_1 {
                    to{transform:translate(-70px,-60px) scale(0);opacity:0;}
                }
                @keyframes spark_2 {
                    to{transform:translate(50px,70px) scale(0);opacity:0;}
                }
                @keyframes spark_3 {
                    to{transform:translate(-55px,65px) scale(0);opacity:0;}
                }
                @keyframes scrollBob{0%,100%{opacity:0.4;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.18)}}
                @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
                @keyframes videoFadeIn{from{opacity:0}to{opacity:1}}
                @keyframes pulseRing{
                    0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.15);}
                    50%{box-shadow:0 0 0 24px rgba(212,175,55,0);}
                }
                @keyframes mistDrift {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 100% 0%; }
                }
            `}</style>

            <RavenCursor />
            <DragonShadow />

            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>

                {/* Cinematic dark overlays (handled partially by App.js background, but we keep some for Hero section depth) */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,15,0.3) 0%, transparent 40%, rgba(10,10,15,0.4) 75%, rgba(10,10,15,0.9) 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center 35%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />

                {/* Animated Mist Overlay */}
                <motion.div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "url('/images/parchment-texture.png')",
                    backgroundSize: "200% auto",
                    opacity: mistOpacity,
                    mixBlendMode: "overlay",
                    animation: "mistDrift 100s linear infinite",
                }} />
            </div>

            {/* ── EMBER PARTICLES ── */}
            <EmberCanvas />

            {/* ── HERO CONTENT ── */}
            <motion.div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", minHeight: "100vh",
                padding: "6rem 2rem 4rem",
                position: "relative", zIndex: 5,
                opacity: heroOpacity,
                y: heroY
            }}>

                {/* VALAR MORGHULIS — Main title */}
                <h1 style={{
                    ...fade(0.4),
                    fontFamily: "'Cinzel Decorative',serif",
                    fontSize: "clamp(2.2rem,7vw,5.5rem)",
                    color: "#d4af37",
                    margin: 0,
                    lineHeight: 1,
                    letterSpacing: "0.12em",
                    textAlign: "center",
                    textTransform: "uppercase",
                    textShadow: "0 0 80px rgba(212,175,55,0.3), 0 0 160px rgba(212,175,55,0.1), 0 4px 12px rgba(0,0,0,0.95)",
                }}>Valar Morghulis</h1>

                {/* Gold divider */}
                <div style={{
                    ...fade(0.7),
                    width: "100px", height: "1px",
                    background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)",
                    margin: "1.5rem 0",
                }} />

                {/* Subtitle */}
                <div style={{
                    ...fade(0.9),
                    fontFamily: "'Crimson Text',serif",
                    fontStyle: "italic",
                    fontSize: "clamp(0.9rem,1.6vw,1.2rem)",
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.15em",
                }}>All men must die</div>

                {/* Scroll indicator */}
                <div style={{
                    ...fade(1.6),
                    marginTop: "4rem",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                    opacity: vis ? 0.5 : 0,
                }}>
                    <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.56rem", letterSpacing: "0.25em", color: "rgba(212,175,55,0.8)", textTransform: "uppercase" }}>Scroll</span>
                    <div style={{ width: "1px", height: "48px", background: "linear-gradient(180deg,rgba(212,175,55,0.8),transparent)", animation: "scrollBob 2s ease infinite" }} />
                </div>
            </motion.div>

            <CommanderGallery setPage={setPage} />
        </>
    );
}
