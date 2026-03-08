import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, Glass, Title } from "./components";
import { HOUSES, TIMELINE } from "./data";
import { ALL_CHARACTERS as CHARACTERS } from "./expandedData";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stage, OrbitControls, useGLTF, Environment } from "@react-three/drei";

/* ═══ 3D MODEL COMPONENT ═══ */
function HouseModel({ path }) {
    const { scene } = useGLTF(path);
    const ref = useState(() => ({ current: null }))[0];
    useFrame(() => {
        if (ref.current) ref.current.rotation.y -= 0.001;
    });
    return <primitive object={scene} ref={ref} />;
}

/* ═══ HOUSES PAGE ═══ */
export function HousesPage() {
    const [sel, setSel] = useState(null);

    if (sel) return (
        <div style={{ minHeight: "100vh", padding: "7rem 2rem 5rem" }}>
            <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: "rgba(212,175,55,0.6)", fontFamily: "'Cinzel',serif", fontSize: "0.7rem", letterSpacing: "0.15em", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem", padding: 0, textTransform: "uppercase" }}>← All Houses</button>
            <Glass style={{ padding: "3rem", position: "relative", overflow: "hidden" }} accent="rgba(212,175,55,0.18)">
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2.5px", background: `linear-gradient(90deg,transparent,${sel.color},transparent)` }} />
                <div style={{ position: "absolute", top: "-60px", right: "-30px", fontSize: "14rem", opacity: 0.04, pointerEvents: "none" }}>{sel.sigil}</div>

                {sel.model3d ? (
                    <div style={{ width: "calc(100% + 6rem)", height: "450px", margin: "-3rem -3rem 2.5rem -3rem", position: "relative", background: "#020205", overflow: "hidden" }}>
                        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 15, 40], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
                            <Stage environment="night" intensity={0.5}>
                                <HouseModel path={sel.model3d} />
                            </Stage>
                            <OrbitControls autoRotate autoRotateSpeed={0.5} makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} />
                            <Environment preset="night" background blur={0.8} />
                        </Canvas>
                        <div style={{ position: "absolute", bottom: "1.5rem", left: "3rem", zIndex: 10, pointerEvents: "none" }}>
                            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "2rem", color: sel.color, textShadow: `0 0 40px ${sel.color}80, 0 2px 12px rgba(0,0,0,0.9)` }}>{sel.name}</div>
                            <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>"{sel.words}"</div>
                        </div>
                        <div style={{ position: "absolute", top: "1.5rem", right: "2rem", zIndex: 10, pointerEvents: "none" }}>
                            <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", border: `1px solid ${sel.color}40`, padding: "0.5rem 1rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: sel.color, letterSpacing: "0.1em" }}>
                                <span style={{ fontSize: "1rem" }}>🏰</span> INTERACTIVE 3D MODEL
                            </div>
                        </div>
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 60%, rgba(10,10,15,0.97) 100%)`, pointerEvents: "none" }} />
                    </div>
                ) : (sel.place_image || sel.seat_image) && (
                    <div style={{ width: "calc(100% + 6rem)", height: "340px", margin: "-3rem -3rem 2.5rem -3rem", position: "relative" }}>
                        <img src={sel.place_image || sel.seat_image} alt={sel.seat} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, rgba(10,10,15,0.97) 100%)` }} />
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${sel.color}18, transparent 70%)` }} />
                        {/* House name overlay on image */}
                        <div style={{ position: "absolute", bottom: "1.5rem", left: "3rem" }}>
                            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "2rem", color: sel.color, textShadow: `0 0 40px ${sel.color}80, 0 2px 12px rgba(0,0,0,0.9)` }}>{sel.name}</div>
                            <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>"{sel.words}"</div>
                        </div>
                    </div>
                )}

                <div style={{ display: "flex", gap: "2.5rem", marginBottom: "2.5rem", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: "5.5rem", lineHeight: 1, filter: `drop-shadow(0 0 20px ${sel.color}60)` }}>{sel.sigil}</div>
                    <div>
                        {!(sel.place_image || sel.seat_image) && <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.8rem", color: sel.color, marginBottom: "0.35rem" }}>{sel.name}</div>}
                        {!(sel.place_image || sel.seat_image) && <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1.2rem", color: "rgba(255,255,255,0.55)", marginBottom: "0.5rem" }}>"{sel.words}"</div>}
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            {[["Seat", sel.seat], ["Region", sel.region]].map(([k, v]) => (
                                <div key={k} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "6px", padding: "0.4rem 0.8rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                                    <div style={{ fontSize: "0.58rem", fontFamily: "'Cinzel',serif", color: "rgba(212,175,55,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{k}</div>
                                    <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Crimson Text',serif", fontSize: "0.95rem" }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.72)", fontFamily: "'Crimson Text',serif", fontSize: "1.08rem", lineHeight: 1.78, marginBottom: "1.5rem" }}>{sel.description}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Crimson Text',serif", fontSize: "1rem", lineHeight: 1.75, marginBottom: "2rem" }}>{sel.history}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.62rem", color: "rgba(212,175,55,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.9rem" }}>Notable Members</div>
                        {sel.members.map(m => <div key={m} style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Crimson Text',serif", fontSize: "0.98rem", padding: "0.3rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>• {m}</div>)}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.62rem", color: "rgba(212,175,55,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.9rem" }}>Sigil</div>
                        {sel.sigil_image ? (
                            <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", marginBottom: "0.7rem", border: `2px solid ${sel.color}50`, boxShadow: `0 0 20px ${sel.color}30` }}>
                                <img src={sel.sigil_image} alt={`${sel.name} sigil`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            </div>
                        ) : (
                            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{sel.sigil}</div>
                        )}
                        <div style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "0.95rem" }}>{sel.sigil_desc}</div>
                    </div>
                </div>
            </Glass>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", padding: "7rem 2rem 5rem" }}>
            <style>{`
                /* House card shared */
                .house-card {
                    cursor: pointer;
                    border-radius: 14px;
                    overflow: hidden;
                    position: relative;
                    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid rgba(212,175,55,0.14);
                    background: rgba(10,10,15,0.7);
                    backdropFilter: blur(12px);
                }
                .house-card:hover {
                    transform: translateY(-7px) scale(1.012);
                }
                /* Themes */
                .house-card.theme-fire:hover {
                    box-shadow: 0 0 40px var(--hc), 0 12px 40px rgba(0,0,0,0.5);
                    border-color: var(--hc-border);
                    animation: houseFireGlow 2s ease-in-out infinite;
                }
                .house-card.theme-snow:hover {
                    box-shadow: 0 0 30px #a0c8e840, 0 12px 40px rgba(0,0,0,0.5);
                    border-color: var(--hc-border);
                }
                .house-card.theme-gold:hover {
                    box-shadow: 0 0 35px var(--hc), 0 12px 40px rgba(0,0,0,0.5);
                    border-color: var(--hc-border);
                    animation: houseGoldShimmer 1.8s ease-in-out infinite;
                }
                @keyframes houseFireGlow {
                    0%,100% { box-shadow: 0 0 25px var(--hc), 0 10px 32px rgba(0,0,0,0.5); }
                    50%     { box-shadow: 0 0 55px var(--hc), 0 15px 48px rgba(0,0,0,0.6); }
                }
                @keyframes houseGoldShimmer {
                    0%,100% { box-shadow: 0 0 20px var(--hc), 0 10px 32px rgba(0,0,0,0.5); }
                    50%     { box-shadow: 0 0 45px var(--hc), 0 15px 40px rgba(0,0,0,0.6), inset 0 0 30px var(--hc-subtle); }
                }
                @keyframes houseBannerWave {
                    0%,100% { transform: scaleX(1) skewX(0deg); opacity: 0.7; }
                    33%     { transform: scaleX(1.02) skewX(1deg); opacity: 1; }
                    66%     { transform: scaleX(0.99) skewX(-0.8deg); opacity: 0.8; }
                }
                .house-banner-stripe {
                    animation: houseBannerWave 3.5s ease-in-out infinite;
                    transform-origin: left center;
                }
                /* Snow particles */
                @keyframes snowDrift0 { 0%{opacity:0;transform:translateY(-10px) translateX(0)} 20%{opacity:0.8} 100%{opacity:0;transform:translateY(250px) translateX(18px)} }
                @keyframes snowDrift1 { 0%{opacity:0;transform:translateY(-10px) translateX(0)} 25%{opacity:0.7} 100%{opacity:0;transform:translateY(220px) translateX(-12px)} }
                @keyframes snowDrift2 { 0%{opacity:0;transform:translateY(-10px) translateX(0)} 30%{opacity:0.9} 100%{opacity:0;transform:translateY(240px) translateX(8px)} }
                /* House hero image zoom */
                .house-hero-img { transition: transform 6s cubic-bezier(0.23,1,0.32,1); transform: scale(1); }
                .house-card:hover .house-hero-img { transform: scale(1.08); }
            `}</style>
            <Title main="The Great Houses" sub="Lords and wardens of the Seven Kingdoms" />
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: "1.5rem" }}>
                {HOUSES.map((h, i) => {
                    const heroImg = h.place_image || h.seat_image || null;
                    const snowParticles = h.houseTheme === "snow" ? Array.from({ length: 8 }, (_, j) => j) : [];
                    return (
                        <FadeIn key={h.id} delay={i * 0.08}>
                            <div
                                className={`house-card theme-${h.houseTheme || "gold"}`}
                                style={{ "--hc": `${h.color}50`, "--hc-border": `${h.color}55`, "--hc-subtle": `${h.color}12` }}
                                onClick={() => setSel(h)}
                            >
                                {/* Hero image area */}
                                <div style={{ position: "relative", width: "100%", height: "220px", overflow: "hidden", background: `radial-gradient(ellipse at center, ${h.color}20 0%, rgba(10,10,15,0.98) 100%)`, flexShrink: 0 }}>
                                    {heroImg ? (
                                        <img className="house-hero-img" src={heroImg} alt={h.seat} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", filter: `drop-shadow(0 0 20px ${h.color}60)` }}>{h.sigil}</div>
                                    )}
                                    {/* Gradient overlay */}
                                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(10,10,15,0.05) 0%, rgba(10,10,15,0.15) 50%, rgba(10,10,15,0.92) 100%)` }} />
                                    {/* Color tint */}
                                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${h.color}12, transparent 60%)` }} />
                                    {/* Animated banner stripe */}
                                    <div className="house-banner-stripe" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, transparent, ${h.color}, transparent)` }} />
                                    {/* Snow particles for cold houses */}
                                    {snowParticles.map(j => (
                                        <div key={j} style={{
                                            position: "absolute",
                                            width: `${2 + j % 2}px`, height: `${2 + j % 2}px`,
                                            borderRadius: "50%",
                                            background: "rgba(200,230,255,0.85)",
                                            left: `${10 + (j * 12.5) % 80}%`,
                                            top: "0%",
                                            opacity: 0,
                                            boxShadow: "0 0 4px rgba(160,200,240,0.6)",
                                            animation: `snowDrift${j % 3} ${2.5 + j * 0.4}s ease-in ${j * 0.35}s infinite`,
                                        }} />
                                    ))}
                                    {/* Fire shimmer for fire houses */}
                                    {h.houseTheme === "fire" && (
                                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: `linear-gradient(0deg, ${h.color}25, transparent)`, pointerEvents: "none" }} />
                                    )}
                                    {/* Sigil badge */}
                                    {h.sigil_image && (
                                        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(10,10,15,0.7)", border: `1px solid ${h.color}40`, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", boxShadow: `0 0 12px ${h.color}30` }}>
                                            <img src={h.sigil_image} alt={h.name} style={{ width: "26px", height: "26px", objectFit: "contain", filter: `drop-shadow(0 0 6px ${h.color}80)` }} />
                                        </div>
                                    )}
                                    {/* House name overlay */}
                                    <div style={{ position: "absolute", bottom: "0.5rem", left: "1.25rem" }}>
                                        <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.15rem", color: h.color, lineHeight: 1.2, textShadow: `0 0 20px ${h.color}60, 0 2px 8px rgba(0,0,0,0.9)` }}>{h.name}</div>
                                    </div>
                                </div>
                                {/* Card body */}
                                <div style={{ padding: "1.25rem 1.5rem", flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${h.color}30, transparent)` }} />
                                    <div style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", marginBottom: "1rem" }}>"{h.words}"</div>
                                    <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
                                        {[["Seat", h.seat], ["Region", h.region]].map(([k, v]) => (
                                            <div key={k} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "0.4rem 0.65rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                                                <div style={{ fontSize: "0.52rem", fontFamily: "'Cinzel',serif", color: "rgba(212,175,55,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.1rem" }}>{k}</div>
                                                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontFamily: "'Crimson Text',serif" }}>{v}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Crimson Text',serif", fontSize: "0.92rem", lineHeight: 1.65, margin: "0 0 1rem", flex: 1 }}>{h.description.slice(0, 110)}…</p>
                                    <div style={{ color: `${h.color}80`, fontSize: "0.65rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                        Explore House <span style={{ fontSize: "0.8rem" }}>→</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══ CHARACTERS PAGE ═══ */
export function CharactersPage() {
    const [showFilter, setShowFilter] = useState("All");
    const shows = ["All", "Game of Thrones", "House of the Dragon", "A Knight of the Seven Kingdoms"];
    const filtered = showFilter === "All" ? CHARACTERS : CHARACTERS.filter(c => c.show === showFilter);
    return (
        <div style={{ minHeight: "100vh", padding: "7rem 2rem 5rem" }}>
            <style>{`
                .character-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .character-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0 20px var(--card-color), inset 0 0 10px var(--card-color) !important;
                    border-color: var(--card-color) !important;
                }
                .character-card[data-house*="Targaryen"]:hover {
                    box-shadow: 0 0 35px #e74c3c, inset 0 0 20px #e74c3c !important;
                    border-color: #ffaa00 !important;
                    animation: dragonFire 1s alternate infinite;
                }
                .major-character {
                    animation: breathe 3.5s ease-in-out infinite alternate;
                }
                @keyframes breathe {
                    0% { filter: brightness(1); transform: scale(1); box-shadow: 0 0 10px transparent; }
                    100% { filter: brightness(1.15); transform: scale(1.015); box-shadow: 0 0 20px rgba(255,255,255,0.15); }
                }
                .clashing-weapons {
                    display: inline-block;
                    margin-left: 10px;
                    animation: clash 0.4s infinite alternate cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transform-origin: center center;
                }
                @keyframes clash {
                    0% { transform: scale(1) rotate(-15deg); filter: brightness(1) drop-shadow(0 0 2px red); }
                    100% { transform: scale(1.3) rotate(15deg); filter: brightness(1.5) drop-shadow(0 0 10px #ffaa00); }
                }
                @keyframes dragonFire {
                    0% { box-shadow: 0 0 20px #c0392b, inset 0 0 10px #e74c3c; }
                    100% { box-shadow: 0 0 35px #ff7f50, inset 0 0 25px #ffaa00; }
                }
            `}</style>
            <Title main="Characters" sub={`${CHARACTERS.length} heroes, villains, and legends across all eras`} />
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ width: "100%", height: "220px", borderRadius: "12px", marginBottom: "2.5rem", position: "relative", overflow: "hidden", border: "1px solid rgba(212,175,55,0.15)" }}>
                    <img src="/images/characters/All Characters.png" alt="All Characters" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.8 }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(10,10,15,0.95) 100%)" }} />
                </div>
                {/* Show Filter */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
                    {shows.map(s => (
                        <button key={s} onClick={() => setShowFilter(s)} style={{
                            background: showFilter === s ? "rgba(212,175,55,0.15)" : "transparent",
                            border: showFilter === s ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "20px", padding: "0.35rem 0.9rem",
                            color: showFilter === s ? "#d4af37" : "rgba(255,255,255,0.4)",
                            fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.08em",
                            cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase",
                        }}>{s === "A Knight of the Seven Kingdoms" ? "Knight of 7 Kingdoms" : s}</button>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.25rem", marginBottom: "4rem", alignItems: "start" }}>
                    {filtered.map((c, i) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ y: -12, rotateX: 8, rotateY: -4, scale: 1.03 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: (i % 8) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            style={{ marginTop: i % 2 !== 0 ? "3rem" : "0", perspective: "1000px" }}
                        >
                            <Glass onClick={(e) => {
                                e.stopPropagation();
                                const url = window.location.origin + window.location.pathname + "?char=" + c.id;
                                window.open(url, "_blank");
                            }}
                                className={`character-card ${["jon", "daenerys", "tyrion", "arya", "cersei", "rhaenyra", "daemon", "aemond", "dunk"].includes(c.id) ? "major-character" : ""}`}
                                data-house={c.house}
                                style={{
                                    "--card-color": c.color,
                                    padding: "0", textAlign: "center", overflow: "hidden",
                                    border: "1px solid rgba(212,175,55,0.14)",
                                    boxShadow: "none",
                                }}>
                                <div style={{ position: "relative", width: "100%", height: "200px", overflow: "hidden", background: `radial-gradient(ellipse at center, ${c.color}12 0%, rgba(10,10,15,0.95) 100%)` }}>
                                    {/* House Sigil */}
                                    {(() => {
                                        const houseObj = HOUSES.find(h => c.house && c.house.includes(h.name.replace("House ", "")));
                                        if (houseObj) {
                                            if (houseObj.sigil_image) {
                                                return <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 2, background: "rgba(10,10,15,0.6)", borderRadius: "50%", padding: "0.2rem", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", border: `1px solid ${houseObj.color}40`, boxShadow: `0 0 10px ${houseObj.color}20` }} title={houseObj.name}><img src={houseObj.sigil_image} alt={houseObj.name} style={{ width: "22px", height: "22px", objectFit: "contain", filter: `drop-shadow(0 0 5px ${houseObj.color}80)` }} /></div>;
                                            }
                                            return <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "1.2rem", filter: `drop-shadow(0 0 5px ${houseObj.color})`, zIndex: 2, background: "rgba(10,10,15,0.6)", borderRadius: "50%", padding: "0.2rem", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", border: `1px solid ${houseObj.color}40`, boxShadow: `0 0 10px ${houseObj.color}20` }} title={houseObj.name}>{houseObj.sigil}</div>;
                                        }
                                        return null;
                                    })()}
                                    {c.image ? (
                                        <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", position: "relative", background: `radial-gradient(ellipse at 40% 30%, ${c.color}30 0%, ${c.color}08 50%, rgba(10,10,15,0.98) 100%)` }}>
                                            {/* Decorative diagonal texture */}
                                            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg, ${c.color}05 0px, ${c.color}05 1px, transparent 1px, transparent 12px)` }} />
                                            {/* Large watermark sigil */}
                                            <div style={{ position: "absolute", bottom: "-0.5rem", right: "-0.5rem", fontSize: "6rem", opacity: 0.08, filter: `blur(1px)`, pointerEvents: "none", lineHeight: 1 }}>{c.icon}</div>
                                            {/* Glowing top accent line */}
                                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${c.color}80, transparent)` }} />
                                            {/* Character icon centered */}
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", filter: `drop-shadow(0 4px 20px ${c.color}60) drop-shadow(0 0 40px ${c.color}30)`, position: "relative", zIndex: 1 }}>{c.icon}</div>
                                        </div>
                                    )}
                                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 30%, rgba(10,10,15,0.95) 100%)` }} />
                                    <div style={{ position: "absolute", bottom: "0.5rem", left: 0, right: 0 }}>
                                        <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "0.82rem", color: c.color, lineHeight: 1.3, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{c.name}</div>
                                        {c.show && <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>{c.show}</div>}
                                    </div>
                                </div>
                                <div style={{ padding: "0.8rem 1.25rem 1.25rem" }}>
                                    <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.4, marginBottom: "0.7rem" }}>{c.title.split("·")[0].trim()}</div>
                                    <div style={{ display: "inline-block", padding: "0.15rem 0.65rem", borderRadius: "20px", background: c.status === "Alive" ? "rgba(39,174,96,0.12)" : "rgba(200,50,50,0.12)", border: `1px solid ${c.status === "Alive" ? "rgba(39,174,96,0.4)" : "rgba(200,50,50,0.4)"}`, color: c.status === "Alive" ? "#2ecc71" : "#e74c3c", fontSize: "0.6rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em" }}>{c.status}</div>
                                </div>
                            </Glass>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══ CHARACTER DETAIL PAGE (For new tabs) ═══ */
export function CharacterDetailPage({ charId }) {
    const sel = CHARACTERS.find(c => c.id === charId);
    if (!sel) return <div style={{ padding: "8rem", textAlign: "center", fontFamily: "'Cinzel',serif", color: "#d4af37" }}>Character not found.</div>;

    return (
        <div style={{ minHeight: "100vh", padding: "8rem 2rem 5rem", maxWidth: "1000px", margin: "0 auto" }}>
            <FadeIn>
                <Glass style={{ padding: "3.5rem", position: "relative", overflow: "hidden" }} accent={`${sel.color}45`}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,transparent,${sel.color},transparent)` }} />
                    <div style={{ position: "absolute", top: "-50px", right: "-30px", fontSize: "16rem", opacity: 0.05, pointerEvents: "none" }}>{sel.icon}</div>

                    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "4rem", alignItems: "start" }}>
                        <div style={{ position: "sticky", top: "8rem" }}>
                            <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: "16px", overflow: "hidden", border: `3px solid ${sel.color}60`, boxShadow: `0 0 50px ${sel.color}30`, marginBottom: "1.5rem" }}>
                                {sel.image ? (
                                    <img src={sel.image} alt={sel.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", position: "relative", background: `radial-gradient(ellipse at center, ${sel.color}40 0%, rgba(10,10,15,1) 100%)` }}>
                                        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg, ${sel.color}08 0px, ${sel.color}08 1px, transparent 1px, transparent 15px)` }} />
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8rem", filter: `drop-shadow(0 0 30px ${sel.color})` }}>{sel.icon}</div>
                                    </div>
                                )}
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ display: "inline-block", padding: "0.4rem 1.2rem", borderRadius: "24px", background: sel.status === "Alive" ? "rgba(39,174,96,0.15)" : "rgba(200,50,50,0.15)", border: `1px solid ${sel.status === "Alive" ? "rgba(39,174,96,0.5)" : "rgba(200,50,50,0.5)"}`, color: sel.status === "Alive" ? "#2ecc71" : "#e74c3c", fontSize: "0.75rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>{sel.status}</div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                                <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "2.8rem", color: sel.color, margin: 0 }}>{sel.name}</h1>
                                {(() => {
                                    const houseObj = HOUSES.find(h => sel.house && sel.house.includes(h.name.replace("House ", "")));
                                    if (houseObj) {
                                        return <div style={{ fontSize: "2.5rem", filter: `drop-shadow(0 0 12px ${houseObj.color})` }} title={houseObj.name}>{houseObj.sigil}</div>;
                                    }
                                    return null;
                                })()}
                            </div>
                            <div style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", color: "rgba(212,175,55,0.6)", marginBottom: "2rem", letterSpacing: "0.05em" }}>{sel.title}</div>

                            <blockquote style={{ borderLeft: `4px solid ${sel.color}60`, paddingLeft: "1.5rem", margin: "0 0 2.5rem", fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1.4rem", color: "rgba(212,175,55,0.9)", lineHeight: 1.5 }}>"{sel.quote}"</blockquote>

                            <div style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "2.5rem" }}>
                                <p style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Crimson Text',serif", fontSize: "1.15rem", lineHeight: 1.85, margin: 0 }}>{sel.bio}</p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: "rgba(212,175,55,0.6)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Abilities & Talents</div>
                                    {sel.abilities.map((a, i) => (
                                        <div key={i} style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Crimson Text',serif", fontSize: "1.05rem", marginBottom: "0.5rem", display: "flex", gap: "0.75rem" }}>
                                            <span style={{ color: sel.color }}>⬥</span> {a}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", color: "rgba(212,175,55,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Weapon of Choice</div>
                                        <div style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Crimson Text',serif", fontSize: "1.05rem" }}>{sel.weapon}</div>
                                    </div>
                                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", color: "rgba(212,175,55,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Primary Allegiance</div>
                                        <div style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Crimson Text',serif", fontSize: "1.05rem" }}>{sel.allegiance}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Glass>
            </FadeIn>
        </div>
    );
}
export function TimelinePage() {
    return (
        <div style={{ minHeight: "100vh", padding: "7rem 2rem 5rem" }}>
            <Title main="The Timeline" sub="Ten thousand years of ice, fire, and blood" />
            <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative" }}>
                <div style={{ position: "absolute", left: "50%", top: "0", bottom: "0", width: "1px", background: "linear-gradient(180deg,transparent,rgba(212,175,55,0.25) 8%,rgba(212,175,55,0.25) 92%,transparent)", transform: "translateX(-50%)" }} />
                {TIMELINE.map((item, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                        <FadeIn key={i} delay={i * 0.07} style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", marginBottom: "2.25rem", position: "relative" }}>
                            <div style={{ position: "absolute", left: "50%", top: "1.4rem", transform: "translate(-50%,-50%)", width: "11px", height: "11px", borderRadius: "50%", background: item.color, boxShadow: `0 0 14px ${item.color}80`, zIndex: 2 }} />
                            <div style={{ position: "absolute", top: "1.4rem", [isLeft ? "right" : "left"]: "50%", width: "calc(4% - 6px)", height: "1px", background: `linear-gradient(${isLeft ? "90deg" : "270deg"},transparent,${item.color}50)`, transform: "translateY(-50%)" }} />
                            <Glass style={{ padding: "1.4rem 1.5rem", width: "45%", borderLeft: isLeft ? `2px solid ${item.color}50` : "none", borderRight: !isLeft ? `2px solid ${item.color}50` : "none" }} accent="rgba(212,175,55,0.1)">
                                <div style={{ display: "inline-block", padding: "0.12rem 0.55rem", borderRadius: "20px", background: `${item.color}18`, border: `1px solid ${item.color}40`, color: item.color, fontSize: "0.58rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{item.era}</div>
                                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", color: "rgba(212,175,55,0.5)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{item.year}</div>
                                <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "0.9rem", color: "#fff", marginBottom: "0.65rem", lineHeight: 1.3 }}>
                                    {item.event}
                                    {(item.event.includes("Battle") || item.event.includes("War") || item.event.includes("Conquest") || item.event.includes("Rebellion") || item.event.includes("Dance")) && (
                                        <span className="clashing-weapons" title="Battle/Conflict">⚔️</span>
                                    )}
                                </div>
                                <p style={{ color: "rgba(255,255,255,0.58)", fontFamily: "'Crimson Text',serif", fontSize: "0.95rem", lineHeight: 1.68, margin: 0 }}>{item.desc}</p>
                            </Glass>
                        </FadeIn>
                    );
                })}
            </div>
        </div>
    );
}
