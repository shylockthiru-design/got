import { useState, useEffect } from "react";
import { FadeIn, Title } from "./components";
import { SHOWS, ALL_CHARACTERS } from "./expandedData";

export function ShowsPage({ showId, setPage }) {
    const show = SHOWS.find(s => s.id === showId);
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        if (show) {
            // Find characters that belong to this show (if showId is present in their 'show' array/string, or filter by logic)
            // For now, based on the data, we'll try to find any character that might belong to the show's era or house
            // A perfect mapping would require a 'showId' array on each character, but we'll do our best with what we have.
            let cast = [];
            if (showId === "got") {
                cast = ALL_CHARACTERS.filter(c => ["Jon", "Daenerys", "Tyrion", "Arya", "Cersei", "Ned", "Sansa", "Bran", "Robb", "Joffrey", "Margaery", "Olenna"].some(n => c.name.includes(n)));
            } else if (showId === "hotd") {
                cast = ALL_CHARACTERS.filter(c => ["Rhaenyra", "Daemon", "Viserys I", "Alicent", "Aemond", "Corlys", "Rhaenys", "Otto"].some(n => c.name.includes(n)));
            } else if (showId === "knight") {
                cast = ALL_CHARACTERS.filter(c => ["Duncan", "Egg", "Baelor", "Maekar", "Aerion"].some(n => c.name.includes(n)));
            }
            setCharacters(cast);
        }
        window.scrollTo(0, 0);
    }, [showId, show]);

    if (!show) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Show not found</div>;

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "5rem" }}>

            {/* ── HERO SECTION ── */}
            <div style={{ position: "relative", minHeight: "65vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "4rem 2rem", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <img src={show.image} alt={show.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, #04040a 0%, transparent 60%), radial-gradient(circle at top right, ${show.bg} 0%, transparent 80%)` }} />
                </div>

                <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
                    <FadeIn>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                            <span style={{ fontSize: "3rem", filter: `drop-shadow(0 0 15px ${show.color}80)` }}>{show.icon}</span>
                            <div style={{ fontFamily: "'Cinzel',serif", color: show.color, letterSpacing: "0.2em", fontSize: "0.8rem", textTransform: "uppercase" }}>
                                {show.network} Original Series
                            </div>
                        </div>
                        <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", color: "#fff", margin: "0 0 0.5rem 0", lineHeight: 1.1, textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
                            {show.name}
                        </h1>
                        <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                            <span>{show.years}</span>
                            <span style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: show.color }} />
                            <span>{show.seasons} Season{show.seasons !== 1 ? 's' : ''}</span>
                            <span style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: show.color }} />
                            <span style={{ color: show.status === "Ended" ? "rgba(255,255,255,0.4)" : "#2ecc71" }}>{show.status}</span>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "4rem", alignItems: "start", marginTop: "-2rem", position: "relative", zIndex: 10 }}>

                    {/* ── LEFT COLUMN: INFO & CAST ── */}
                    <div>
                        <FadeIn delay={0.2}>
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "2rem", marginBottom: "4rem", backdropFilter: "blur(10px)" }}>
                                <h3 style={{ fontFamily: "'Cinzel',serif", color: show.color, fontSize: "1.2rem", marginBottom: "1rem", letterSpacing: "0.1em" }}>Synopsis</h3>
                                <p style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                                    {show.premise}
                                </p>
                                <p style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                                    {show.desc}
                                </p>
                            </div>
                        </FadeIn>

                        <Title main="Full Cast" sub={`Key figures from ${show.name}`} align="left" />

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1.5rem", marginTop: "2rem" }}>
                            {characters.map((c, i) => (
                                <FadeIn key={c.id} delay={0.1 * i}>
                                    <div
                                        onClick={() => setPage(c.showId || "characters")} // Would ideally route to character detail
                                        style={{
                                            background: "rgba(255,255,255,0.03)", borderRadius: "8px", overflow: "hidden",
                                            border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = show.color + "50"; e.currentTarget.style.boxShadow = `0 10px 20px rgba(0,0,0,0.5)`; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.boxShadow = "none"; }}
                                    >
                                        <div style={{ width: "100%", height: "240px", backgroundColor: "#0a0a0f", position: "relative" }}>
                                            {c.image ? (
                                                <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                                            ) : (
                                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>{c.icon || "👤"}</div>
                                            )}
                                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(8,8,18,0.9) 0%, transparent 50%)" }} />
                                        </div>
                                        <div style={{ padding: "1.2rem" }}>
                                            <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.9rem", color: "#fff", marginBottom: "0.2rem" }}>{c.name}</div>
                                            <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.title}</div>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                            {characters.length === 0 && (
                                <div style={{ gridColumn: "1/-1", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.4)", fontFamily: "'Crimson Text',serif" }}>
                                    Cast data being compiled by the Maesters of the Citadel...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: METADATA ── */}
                    <FadeIn delay={0.4}>
                        <div style={{ position: "sticky", top: "6rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "2rem" }}>
                            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>CREATED BY</div>
                                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.1rem", color: "#fff" }}>{show.creator}</div>
                            </div>
                            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>NETWORK</div>
                                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.1rem", color: "#fff" }}>{show.network}</div>
                            </div>
                            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>RUN</div>
                                <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.1rem", color: "#fff" }}>{show.years}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>THEME</div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: show.color, border: "2px solid rgba(255,255,255,0.2)" }} />
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#04040a", border: "2px solid rgba(255,255,255,0.2)" }} />
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </div>
    );
}
