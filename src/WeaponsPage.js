import { useState, useRef, Suspense } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { FadeIn, Glass, Title } from "./components";
import { WEAPONS } from "./data";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls, Environment, Html } from "@react-three/drei";

function WeaponModel({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}
useGLTF.preload("/images/Weapons/blackfyre_house_of_the_dragon_v1.glb");
useGLTF.preload("/images/Weapons/dark_sister_house_of_the_dragon_v1.glb");
useGLTF.preload("/images/Weapons/balerion_the_black_dread.glb");

function WeaponCard({ weapon, isSelected, onClick }) {
    const cardRef = useRef(null);
    const [rot, setRot] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouse = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRot({ x: -y * 20, y: x * 20 });
    };

    return (
        <motion.div ref={cardRef}
            layoutId={`weapon-${weapon.id}`}
            onMouseMove={handleMouse}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setRot({ x: 0, y: 0 }); }}
            onClick={onClick}
            style={{
                perspective: "800px", cursor: "pointer",
            }}>
            <motion.div
                layout
                style={{
                    background: "rgba(255,255,255,0.035)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${isSelected ? weapon.color + "80" : isHovered ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.15)"}`,
                    borderRadius: "14px",
                    padding: "2rem",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) ${isHovered ? "translateY(-4px)" : ""}`,
                    transformStyle: "preserve-3d",
                    boxShadow: isSelected
                        ? `0 0 40px ${weapon.glow}, 0 16px 48px rgba(0,0,0,0.5)`
                        : isHovered
                            ? `0 16px 48px rgba(0,0,0,0.55), 0 0 24px ${weapon.glow.replace("0.4", "0.15")}`
                            : "0 4px 24px rgba(0,0,0,0.3)",
                }}>
                {/* Valyrian shimmer */}
                {weapon.material === "Valyrian Steel" && (
                    <motion.div layout style={{
                        position: "absolute", top: 0, left: "-100%", width: "200%", height: "100%",
                        background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)`,
                        animation: isHovered ? "shimmer 2s ease infinite" : "none",
                        pointerEvents: "none",
                    }} />
                )}
                <motion.div layout style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,transparent,${weapon.color},transparent)` }} />
                {weapon.image ? (
                    <motion.div layout style={{ width: "100%", height: "140px", overflow: "hidden", borderRadius: "8px", marginBottom: "1rem", position: "relative" }}>
                        <motion.img layout src={weapon.image} alt={weapon.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `drop-shadow(0 0 15px ${weapon.glow})` }} />
                        <motion.div layout style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(10,10,15,0.6) 100%)" }} />
                    </motion.div>
                ) : (
                    <motion.div layout style={{ width: "100%", height: "140px", overflow: "hidden", borderRadius: "8px", marginBottom: "1rem", position: "relative", background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)" }}>
                        <motion.div layout style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", filter: `drop-shadow(0 0 20px ${weapon.glow})` }}>{weapon.icon}</motion.div>
                        <motion.div layout style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>3D Model</motion.div>
                        <motion.div layout style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(10,10,15,0.6) 100%)" }} />
                    </motion.div>
                )}
                <motion.div layout style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1rem", color: weapon.color, marginBottom: "0.3rem", transform: "translateZ(10px)" }}>{weapon.name}</motion.div>
                <motion.div layout style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.8rem" }}>{weapon.type} · {weapon.material}</motion.div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <motion.span layout style={{ padding: "0.15rem 0.6rem", borderRadius: "20px", background: `${weapon.color}15`, border: `1px solid ${weapon.color}40`, color: weapon.color, fontSize: "0.6rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.08em" }}>{weapon.owner}</motion.span>
                    {weapon.material === "Valyrian Steel" && (
                        <motion.span layout style={{ padding: "0.15rem 0.6rem", borderRadius: "20px", background: "rgba(180,210,255,0.08)", border: "1px solid rgba(180,210,255,0.3)", color: "rgba(180,210,255,0.8)", fontSize: "0.6rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.08em" }}>Valyrian</motion.span>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export function WeaponsPage() {
    const [sel, setSel] = useState(null);

    return (
        <div style={{ minHeight: "100vh", padding: "7rem 2rem 5rem" }}>
            <Title main="Legendary Weapons" sub="Valyrian steel, castle-forged blades, and weapons of myth" />
            <style>{`@keyframes shimmer{0%{transform:translateX(-30%)}100%{transform:translateX(30%)}}`}</style>
            <LayoutGroup>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
                        {WEAPONS.map((w, i) => (
                            <FadeIn key={w.id} delay={i * 0.08}>
                                <WeaponCard weapon={w} isSelected={sel?.id === w.id} onClick={() => setSel(sel?.id === w.id ? null : w)} />
                            </FadeIn>
                        ))}
                    </motion.div>

                    <AnimatePresence>
                        {sel && (
                            <motion.div
                                layoutId={`weapon-${sel.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{
                                    background: "rgba(255,255,255,0.035)",
                                    backdropFilter: "blur(20px)",
                                    border: `1px solid ${sel.color}80`,
                                    borderRadius: "14px",
                                    padding: "2.5rem", position: "relative", overflow: "hidden",
                                    boxShadow: `0 0 40px ${sel.glow}, 0 16px 48px rgba(0,0,0,0.5)`,
                                }}
                            >
                                <motion.div layout style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,transparent,${sel.color},transparent)` }} />
                                <motion.div layout style={{ position: "absolute", top: "-40px", right: "-20px", fontSize: "10rem", opacity: 0.04, pointerEvents: "none" }}>{sel.icon}</motion.div>
                                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2.5rem", alignItems: "start" }}>
                                    <div style={{ textAlign: "center", width: sel.model3d ? "300px" : "200px" }}>
                                        <motion.div layout style={{ width: "100%", height: sel.model3d ? "300px" : "200px", overflow: "hidden", borderRadius: "12px", border: `2px solid ${sel.color}50`, boxShadow: `0 0 30px ${sel.glow}`, marginBottom: "0.75rem", background: sel.model3d ? "radial-gradient(circle at center, #1a1a24 0%, #04040a 100%)" : "transparent" }}>
                                            {sel.model3d ? (
                                                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                                                    <ambientLight intensity={1.5} />
                                                    <directionalLight position={[-5, 5, 5]} intensity={2} />
                                                    <directionalLight position={[5, -5, -5]} intensity={0.5} />
                                                    <Environment preset="city" />
                                                    <Suspense fallback={<Html center><div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Cinzel',serif", fontSize: "0.8rem", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>Loading...</div></Html>}>
                                                        <Stage environment="city" intensity={0.6} adjustCamera={2}>
                                                            <WeaponModel url={sel.model3d} />
                                                        </Stage>
                                                    </Suspense>
                                                    <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={true} makeDefault />
                                                </Canvas>
                                            ) : (
                                                <motion.img layout src={sel.image} alt={sel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            )}
                                        </motion.div>
                                        {sel.material === "Valyrian Steel" && (
                                            <motion.div layout style={{ padding: "0.2rem 0.7rem", borderRadius: "20px", background: "rgba(180,210,255,0.08)", border: "1px solid rgba(180,210,255,0.3)", color: "rgba(180,210,255,0.8)", fontSize: "0.6rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", display: "inline-block" }}>Valyrian Steel</motion.div>
                                        )}
                                    </div>
                                    <div>
                                        <motion.div layout style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.6rem", color: sel.color, marginBottom: "0.3rem" }}>{sel.name}</motion.div>
                                        <motion.div layout style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", marginBottom: "1.25rem" }}>{sel.type} · {sel.material}</motion.div>
                                        <motion.p layout style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Crimson Text',serif", fontSize: "1.05rem", lineHeight: 1.78, marginBottom: "1.25rem" }}>{sel.description}</motion.p>
                                        <motion.p layout style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Crimson Text',serif", fontSize: "1rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>{sel.history}</motion.p>
                                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                            {[["Owner", sel.owner], ["House", sel.house], ["Type", sel.type]].map(([k, v]) => (
                                                <motion.div layout key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "0.6rem 1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                                                    <div style={{ fontSize: "0.58rem", fontFamily: "'Cinzel',serif", color: "rgba(212,175,55,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.15rem" }}>{k}</div>
                                                    <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Crimson Text',serif", fontSize: "0.95rem" }}>{v}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </LayoutGroup>
        </div>
    );
}
