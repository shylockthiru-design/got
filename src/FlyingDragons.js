import React, { useEffect, useState } from 'react';

const FlyingDragons = () => {
    const [dragons, setDragons] = useState([]);

    useEffect(() => {
        let timeoutId;

        const spawnDragon = () => {
            // Spawn a dragon every 15-30 seconds
            const delay = Math.random() * 15000 + 15000;

            const isRightToLeft = Math.random() > 0.5;
            const startY = Math.random() * (window.innerHeight * 0.4); // Top 40% of screen
            const endY = startY + (Math.random() - 0.5) * 200; // Drift up or down

            const duration = Math.random() * 20000 + 30000; // 30-50 seconds to cross screen
            const scale = Math.random() * 0.4 + 0.3; // Very far away (small)

            const newDragon = {
                id: Date.now(),
                isRightToLeft,
                startY,
                endY,
                duration,
                scale,
            };

            setDragons(prev => [...prev.slice(-2), newDragon]); // Keep max 3 dragons

            // Remove dragon after animation + small buffer
            setTimeout(() => {
                setDragons(prev => prev.filter(d => d.id !== newDragon.id));
            }, duration + 5000);

            timeoutId = setTimeout(spawnDragon, delay);
        };

        // Initial spawn after a few seconds
        timeoutId = setTimeout(spawnDragon, 5000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            <style>{`
        @keyframes flapWings {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(-0.3) translateY(20px); }
        }
        @keyframes dragonFlight {
          0% { 
            transform: translate(var(--startX), var(--startY)) scale(var(--scale)) scaleX(var(--facing)); 
            opacity: 0;
          }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { 
            transform: translate(var(--endX), var(--endY)) scale(var(--scale)) scaleX(var(--facing)); 
            opacity: 0;
          }
        }
      `}</style>

            {dragons.map(d => (
                <div
                    key={d.id}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100px',
                        height: '100px',
                        '--startX': d.isRightToLeft ? '110vw' : '-10vw',
                        '--endX': d.isRightToLeft ? '-10vw' : '110vw',
                        '--startY': `${d.startY}px`,
                        '--endY': `${d.endY}px`,
                        '--scale': d.scale,
                        '--facing': d.isRightToLeft ? '-1' : '1',
                        animation: `dragonFlight ${d.duration}ms linear forwards`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: 'blur(1px)',
                        opacity: 0, // Handled by keyframes
                    }}
                >
                    <div style={{ fontSize: '3rem', color: '#000', animation: 'flapWings 2s ease-in-out infinite' }}>
                        🐉
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FlyingDragons;
