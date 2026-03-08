import { useState } from "react";
import { FadeIn, Glass, Title } from "./components";
import { LOCATIONS } from "./expandedData";

export function LocationsPage() {
    const [selRegion, setSelRegion] = useState(null);
    const [search, setSearch] = useState("");
    const regions = Object.entries(LOCATIONS);

    const filtered = search.trim()
        ? regions.map(([name, data]) => ({
            name, ...data,
            places: data.places.filter(p => p.toLowerCase().includes(search.toLowerCase()))
        })).filter(r => r.places.length > 0)
        : regions.map(([name, data]) => ({ name, ...data }));

    const totalPlaces = regions.reduce((s, [, d]) => s + d.places.length, 0);

    const selRegionData = selRegion ? regions.find(([n]) => n === selRegion)?.[1] : null;

    return (
        <div className="locations-page" style={{ minHeight: "100vh", paddingTop: "5rem", position: "relative" }}>
            <style>{`
                .split-container {
                    display: flex;
                    max-width: 1600px;
                    margin: 0 auto;
                    align-items: flex-start;
                    gap: 3rem;
                    padding: 0 2rem;
                }
                .split-left {
                    flex: 1;
                    position: sticky;
                    top: 6rem;
                    height: calc(100vh - 8rem);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .split-right {
                    flex: 1.2;
                    padding-bottom: 5rem;
                    padding-top: 3rem;
                }
                @media (max-width: 1000px) {
                    .split-container { flex-direction: column; }
                    .split-left { position: relative; top: 0; height: auto; margin-bottom: 2rem; }
                }
            `}</style>

            <div className="split-container">
                {/* Left Side: Sticky Cinematic View */}
                <div className="split-left">
                    <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                        <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "#fff", textShadow: "0 0 30px rgba(212,175,55,0.4)" }}>Atlas of the Known World</h1>
                        <p style={{ fontFamily: "'Crimson Text',serif", fontSize: "1.2rem", color: "rgba(212,175,55,0.8)", letterSpacing: "0.1em" }}>{totalPlaces} locations across Westeros and Essos</p>
                    </div>

                    <div style={{ position: "relative" }}>
                        {/* Diagonal Scroll/Image Section Reveal */}
                        <div style={{
                            width: "100%", height: "45vh", minHeight: "300px",
                            borderRadius: "4px", overflow: "hidden",
                            clipPath: "polygon(0 4%, 100% 0, 100% 96%, 0 100%)",
                            position: "relative",
                            border: "1px solid rgba(212,175,55,0.3)",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                            background: "rgba(10,10,15,0.9)",
                            transition: "clip-path 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
                        }}>
                            {selRegionData?.image ? (
                                <img key={selRegionData.image} src={selRegionData.image} alt={selRegion} style={{ width: "100%", height: "100%", objectFit: "cover", animation: "videoFadeIn 0.8s ease" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)" }}>
                                    <span style={{ fontSize: "5rem", opacity: 0.2, filter: "blur(2px)" }}>🗺️</span>
                                </div>
                            )}
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg, transparent 40%, rgba(10,10,15,0.9) 100%)" }} />
                            {selRegion && <div style={{ position: "absolute", bottom: "2rem", left: "2rem", fontFamily: "'Cinzel Decorative',serif", fontSize: "2rem", color: selRegionData?.color || "#d4af37", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{selRegion}</div>}
                        </div>
                    </div>
                </div>

                {/* Right Side: Scrolling Content */}
                <div className="split-right">
                    {/* Search */}
                    <div style={{ marginBottom: "2.5rem" }}>
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search any location..."
                            style={{
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.2)",
                                borderRadius: "8px", padding: "1rem 1.5rem", width: "100%",
                                color: "#fff", fontFamily: "'Crimson Text',serif", fontSize: "1.1rem",
                                outline: "none", transition: "border-color 0.3s",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                            }}
                            onFocus={e => e.target.style.borderColor = "rgba(212,175,55,0.5)"}
                            onBlur={e => e.target.style.borderColor = "rgba(212,175,55,0.2)"}
                        />
                    </div>

                    {/* Region List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {filtered.map((region, ri) => (
                            <FadeIn key={region.name} delay={ri * 0.05} style={{ width: "100%" }}>
                                <Glass
                                    onClick={() => setSelRegion(selRegion === region.name ? null : region.name)}
                                    style={{
                                        padding: "1.5rem 2rem", position: "relative", overflow: "hidden", cursor: "pointer",
                                        border: selRegion === region.name ? `1px solid ${region.color}60` : undefined,
                                        boxShadow: selRegion === region.name ? `0 0 30px ${region.color}15, inset 0 0 20px ${region.color}05` : `0 4px 15px rgba(0,0,0,0.3)`,
                                        transform: selRegion === region.name ? "translateX(-10px)" : "none",
                                        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)"
                                    }}
                                    onMouseEnter={e => { if (selRegion !== region.name) e.currentTarget.style.transform = "translateX(-5px)"; }}
                                    onMouseLeave={e => { if (selRegion !== region.name) e.currentTarget.style.transform = "none"; }}
                                >
                                    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "3px", background: `linear-gradient(180deg,transparent,${region.color},transparent)` }} />

                                    <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: selRegion === region.name ? "1.5rem" : "0" }}>
                                        <div style={{ fontSize: "2.2rem", filter: `drop-shadow(0 0 12px ${region.color}60)` }}>{region.icon}</div>
                                        <div>
                                            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.2rem", color: region.color }}>{region.name}</div>
                                            <div style={{ fontFamily: "'Crimson Text',serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>{region.places.length} locations</div>
                                        </div>
                                        <div style={{ marginLeft: "auto", color: "rgba(212,175,55,0.4)", fontSize: "1rem", fontFamily: "'Cinzel',serif", transition: "transform 0.4s", transform: selRegion === region.name ? "rotate(90deg)" : "rotate(0)" }}>▶</div>
                                    </div>
                                    {selRegion === region.name && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                            {region.places.map(place => (
                                                <span key={place} style={{
                                                    padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem",
                                                    fontFamily: "'Crimson Text',serif",
                                                    background: `${region.color}10`, border: `1px solid ${region.color}30`,
                                                    color: `${region.color}e0`,
                                                    transition: "all 0.2s",
                                                }}
                                                    onMouseEnter={e => { e.target.style.background = `${region.color}25`; e.target.style.borderColor = `${region.color}60`; e.target.style.transform = "scale(1.05)"; }}
                                                    onMouseLeave={e => { e.target.style.background = `${region.color}10`; e.target.style.borderColor = `${region.color}30`; e.target.style.transform = "none"; }}
                                                >{place}</span>
                                            ))}
                                        </div>
                                    )}
                                </Glass>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
