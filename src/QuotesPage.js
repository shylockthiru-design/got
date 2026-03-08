import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, Glass, Title } from "./components";
import { QUOTES } from "./expandedData";

function QuoteCard({ q, index }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -15, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: (index % 10) * 0.05
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: "1.5rem 1.75rem", position: "relative", overflow: "hidden",
                borderLeft: `3px solid ${q.color}50`,
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(20px)", borderRadius: "14px",
                border: "1px solid rgba(212,175,55,0.18)",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered ? `0 16px 48px rgba(0,0,0,0.55), 0 0 20px ${q.color}30` : `0 4px 24px rgba(0,0,0,0.3)`,
            }}
        >
            <div style={{ position: "absolute", top: "0.8rem", left: "1.5rem", fontSize: "3rem", fontFamily: "'Cinzel Decorative',serif", color: `${q.color}15`, lineHeight: 1, pointerEvents: "none" }}>"</div>
            <p style={{
                fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "1.05rem",
                color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 1rem", position: "relative", zIndex: 1,
                paddingLeft: "0.5rem",
            }}>"{q.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "24px", height: "1px", background: `${q.color}50` }} />
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", color: q.color, letterSpacing: "0.1em" }}>{q.author}</span>
                {q.house !== "None" && q.house !== "Author" && (
                    <span style={{ padding: "0.1rem 0.5rem", borderRadius: "20px", background: `${q.color}10`, border: `1px solid ${q.color}30`, fontSize: "0.55rem", fontFamily: "'Cinzel',serif", color: `${q.color}aa`, letterSpacing: "0.08em" }}>{q.house}</span>
                )}
            </div>
        </motion.div>
    );
}

export function QuotesPage() {
    const [filter, setFilter] = useState("All");
    const houses = ["All", ...new Set(QUOTES.map(q => q.house).filter(h => h !== "None" && h !== "Author"))];
    const filtered = filter === "All" ? QUOTES : QUOTES.filter(q => q.house === filter);

    // Random featured quote
    const [featured] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    return (
        <div style={{ minHeight: "100vh", padding: "7rem 2rem 5rem" }}>
            <Title main="Words of Wisdom" sub={`${QUOTES.length} iconic quotes from the world of ice and fire`} />
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                {/* Featured Quote */}
                <FadeIn>
                    <div style={{
                        textAlign: "center", padding: "3rem 2rem", marginBottom: "2.5rem",
                        background: `radial-gradient(ellipse at center, ${featured.color}08 0%, transparent 70%)`,
                        borderTop: `1px solid ${featured.color}20`, borderBottom: `1px solid ${featured.color}20`,
                    }}>
                        <div style={{ fontSize: "4rem", fontFamily: "'Cinzel Decorative',serif", color: `${featured.color}15`, lineHeight: 1, marginBottom: "0.5rem" }}>"</div>
                        <p style={{ fontFamily: "'Crimson Text',serif", fontStyle: "italic", fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, maxWidth: "650px", margin: "0 auto 1.5rem" }}>{featured.text}</p>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.72rem", color: featured.color, letterSpacing: "0.15em" }}>— {featured.author}</div>
                    </div>
                </FadeIn>

                {/* Filter */}
                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
                    {houses.map(h => (
                        <button key={h} onClick={() => setFilter(h)} style={{
                            background: filter === h ? "rgba(212,175,55,0.15)" : "transparent",
                            border: filter === h ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "20px", padding: "0.3rem 0.8rem",
                            color: filter === h ? "#d4af37" : "rgba(255,255,255,0.4)",
                            fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.08em",
                            cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase",
                        }}>{h}</button>
                    ))}
                </div>

                {/* Quotes Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))", gap: "1rem" }}>
                    {filtered.map((q, i) => (
                        <FadeIn key={i} delay={i * 0.03}>
                            <QuoteCard q={q} index={i} />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    );
}
