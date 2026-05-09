'use client';

import { useEffect, useState, useMemo } from 'react';

export function ParticleBackground() {
  const [particles] = useState(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  });

  return (
    <div className="particle-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export function GridOverlay() {
  return <div className="grid-overlay" />;
}

export function ScanLine() {
  return <div className="scan-line" />;
}

export function CyberBackground() {
  return (
    <>
      <ParticleBackground />
      <GridOverlay />
      <ScanLine />
    </>
  );
}
