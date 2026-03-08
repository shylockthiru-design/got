import React, { useEffect, useState } from 'react';

const CursorSparkles = () => {
    const [sparks, setSparks] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            // Create 12 sparks in a circle
            const newSparks = Array.from({ length: 12 }).map((_, i) => {
                const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
                const velocity = 25 + Math.random() * 45;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;

                return {
                    id: Date.now() + i + Math.random(),
                    x: e.clientX,
                    y: e.clientY,
                    tx: `${tx}px`,
                    ty: `${ty}px`,
                    color: ['#fcd34d', '#facc15', '#fef08a', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 5)],
                    size: 3 + Math.random() * 4
                };
            });

            setSparks((prev) => [...prev, ...newSparks]);

            // Remove sparks after animation (400ms)
            setTimeout(() => {
                setSparks((prev) => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
            }, 400);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <>
            <style>{`
        /* Sword Cursor (Needle inspired) */
        body, a, button, [role="button"], input, select, textarea, .cursor-pointer {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M0 0L5 8L22 25L25 22L8 5Z" fill="%23cbd5e1" stroke="%2394a3b8" stroke-width="0.5"/><path d="M0 0L22 25" stroke="%23f8fafc" stroke-width="0.5"/><path d="M20 28L28 20" stroke="%2364748b" stroke-width="3" stroke-linecap="round"/><path d="M24 24L30 30" stroke="%230f172a" stroke-width="2.5"/><circle cx="30" cy="30" r="2" fill="%2364748b"/></svg>') 0 0, auto !important;
        }
        
        @keyframes sword-spark-anim {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
        }
      `}</style>
            {sparks.map(spark => (
                <div
                    key={spark.id}
                    style={{
                        position: 'fixed',
                        left: spark.x,
                        top: spark.y,
                        width: spark.size,
                        height: spark.size,
                        backgroundColor: spark.color,
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: 999999,
                        boxShadow: `0 0 ${spark.size + 2}px ${spark.color}`,
                        '--tx': spark.tx,
                        '--ty': spark.ty,
                        transform: 'translate(-50%, -50%)',
                        animation: 'sword-spark-anim 0.4s cubic-bezier(0, 0, 0.2, 1) forwards'
                    }}
                />
            ))}
        </>
    );
};

export default CursorSparkles;
