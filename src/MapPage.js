import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn, Glass, Title } from "./components";
import { LOCATIONS } from "./expandedData";

/* ═══ MAP GALLERY DATA ═══ */
const MAPS = [
    { id: 'world', name: 'The Known World', region: 'Global', image: '/images/Maps/The Known World.jpg', lore: 'The continent of Westeros and the vast lands of Essos across the Narrow Sea.' },
    { id: 'westeros', name: 'Westeros', region: 'Global', image: '/images/Maps/westeros-map.jpeg', lore: 'The Seven Kingdoms, stretching from the lands of Always Winter to the summer sea of Dorne.' },
    { id: 'north', name: 'The North', region: 'The North', image: '/images/Maps/The North.jpg', lore: 'The largest of the Seven Kingdoms, ruled by House Stark from Winterfell.' },
    { id: 'riverlands', name: 'The Riverlands', region: 'The Riverlands', image: '/images/Maps/The Riverlands.jpg', lore: 'The central region of Westeros, the historic crossroads and frequent battleground of the Seven Kingdoms.' },
    { id: 'vale', name: 'Vale of Arryn', region: 'The Vale', image: '/images/Maps/Vale of Arryn.jpg', lore: 'Protected by the Mountains of the Moon, the Vale is ruled by House Arryn from the impregnable Eyrie.' },
    { id: 'westerlands', name: 'The Westerlands', region: 'The Westerlands', image: '/images/Maps/The Westerlands.jpg', lore: 'Rich in gold mines, ruled by House Lannister from Casterly Rock. The wealthiest region in Westeros.' },
    { id: 'crownlands', name: 'The Crownlands', region: 'The Crownlands', image: '/images/Maps/The Crownlands.jpg', lore: `The lands surrounding King's Landing, seat of the Iron Throne.` },
    { id: 'stormlands', name: 'The Stormlands', region: 'The Stormlands', image: '/images/Maps/The Stormlands.jpg', lore: `A rugged land of storms and fierce warriors, ruled by House Baratheon from Storm's End.` },
    { id: 'reach', name: 'The Reach', region: 'The Reach', image: '/images/Maps/The Reach.jpg', lore: 'The most fertile and populous region, ruled by House Tyrell from Highgarden.' },
    { id: 'dorne', name: 'Dorne', region: 'Dorne', image: '/images/Maps/Dorne.jpg', lore: 'The southernmost kingdom, hot and arid, ruled by House Martell from Sunspear.' }
];

export function MapPage() {
    const [sel, setSel] = useState(MAPS[0]);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const panStart = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Reset pan and zoom when changing maps
    useEffect(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, [sel]);

    const handleWheel = (e) => {
        e.preventDefault();
        setZoom(z => Math.max(1, Math.min(5, z + (e.deltaY > 0 ? -0.2 : 0.2))));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        panStart.current = { ...pan };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({
            x: panStart.current.x + (e.clientX - dragStart.current.x),
            y: panStart.current.y + (e.clientY - dragStart.current.y),
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const el = containerRef.current;
        if (el) el.addEventListener('wheel', handleWheel, { passive: false });
        return () => { if (el) el.removeEventListener('wheel', handleWheel); };
    }, []);

    const selectedRegionData = sel.region !== 'Global' ? LOCATIONS[sel.region] : null;

    const { scrollYProgress } = useScroll();
    const mapY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const galleryY = useTransform(scrollYProgress, [0, 1], [0, 80]);

    return (
        <div style={{ minHeight: '100vh', padding: '7rem 0 5rem', position: "relative", overflow: "hidden" }}>
            <Title main="The Atlas of Ice and Fire" sub="High-Resolution Cartography of the Known World" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>

                {/* Horizontal Map Selector Gallery */}
                <motion.div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.4) transparent', y: galleryY }}>
                    {MAPS.map(m => (
                        <button key={m.id} onClick={() => setSel(m)} style={{
                            flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            background: 'transparent', border: 'none', cursor: 'pointer', transition: 'transform 0.2s',
                            transform: sel.id === m.id ? 'translateY(-4px)' : 'none',
                        }}>
                            <div style={{
                                width: '140px', height: '85px', borderRadius: '8px', overflow: 'hidden',
                                border: sel.id === m.id ? '2px solid #d4af37' : '1px solid rgba(255,255,255,0.15)',
                                boxShadow: sel.id === m.id ? '0 8px 24px rgba(212,175,55,0.3)' : '0 4px 12px rgba(0,0,0,0.5)',
                            }}>
                                <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ fontFamily: '"Cinzel",serif', fontSize: '0.65rem', color: sel.id === m.id ? '#d4af37' : 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
                                {m.name}
                            </div>
                        </button>
                    ))}
                </motion.div>

                {/* Main View Area */}
                <motion.div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', y: mapY }}>

                    {/* Map Viewer */}
                    <div
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                            flex: '1 1 800px', position: 'relative', overflow: 'hidden',
                            borderRadius: '12px', border: '1px solid rgba(212,175,55,0.25)',
                            background: '#040408', cursor: isDragging ? 'grabbing' : 'grab',
                            height: '70vh', minHeight: '600px',
                            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9), 0 20px 60px rgba(0,0,0,0.6)',
                        }}
                    >
                        <div style={{
                            position: 'relative', width: '100%', height: '100%',
                            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                            transition: isDragging ? 'none' : 'transform 0.15s ease',
                            transformOrigin: 'center center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <img
                                src={sel.image}
                                alt={sel.name}
                                style={{
                                    maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                                    pointerEvents: 'none', userSelect: 'none',
                                    filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.8))'
                                }}
                                draggable="false"
                            />
                        </div>

                        {/* Map Gradient Overlays */}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,15,0.5) 100%)' }} />

                        {/* Zoom controls */}
                        <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 30 }}>
                            <button onClick={() => setZoom(z => Math.min(5, z + 0.4))} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(10,10,18,0.85)', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>+</button>
                            <button onClick={() => setZoom(z => Math.max(1, z - 0.4))} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(10,10,18,0.85)', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>−</button>
                            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(10,10,18,0.85)', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', fontFamily: '"Cinzel",serif', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>⊞</button>
                        </div>
                        <div style={{ position: 'absolute', left: '1.5rem', bottom: '1.5rem', pointerEvents: 'none' }}>
                            <div style={{ fontFamily: '"Cinzel",serif', color: 'rgba(212,175,55,0.8)', fontSize: '0.65rem', letterSpacing: '0.2em', textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>SCROLL TO ZOOM · DRAG TO PAN</div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div style={{ flex: '1 1 320px', maxWidth: '400px' }}>
                        <FadeIn key={sel.id}>
                            <Glass style={{ padding: '2rem', height: '100%', position: 'relative', overflow: 'hidden' }} accent="rgba(212,175,55,0.25)">
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />

                                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selectedRegionData && <div style={{ fontSize: '2.5rem', filter: `drop-shadow(0 0 15px ${selectedRegionData.color}80)` }}>{selectedRegionData.icon}</div>}
                                    <div>
                                        <div style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: '1.6rem', color: selectedRegionData ? selectedRegionData.color : '#d4af37', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{sel.name}</div>
                                        {sel.region !== 'Global' && <div style={{ fontFamily: '"Crimson Text",serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>Region of Westeros</div>}
                                    </div>
                                </div>

                                <p style={{ fontFamily: '"Crimson Text",serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '2rem', padding: '1rem', background: "url('/images/parchment-texture.png') repeat, rgba(200, 180, 130, 0.05)", backgroundBlendMode: 'overlay', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '6px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)' }}>
                                    {sel.lore}
                                </p>

                                {selectedRegionData && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <div style={{ fontFamily: '"Cinzel",serif', fontSize: '0.65rem', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Notable Places
                                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.2), transparent)' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {selectedRegionData.places.slice(0, 20).map(p => (
                                                <span key={p} style={{
                                                    padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem',
                                                    fontFamily: '"Crimson Text",serif',
                                                    background: `${selectedRegionData.color}15`, border: `1px solid ${selectedRegionData.color}30`,
                                                    color: 'rgba(255,255,255,0.7)',
                                                }}>{p}</span>
                                            ))}
                                            {selectedRegionData.places.length > 20 && (
                                                <span style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: '"Crimson Text",serif' }}>+{selectedRegionData.places.length - 20} more points of interest</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Glass>
                        </FadeIn>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
