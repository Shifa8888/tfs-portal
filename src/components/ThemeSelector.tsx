'use client';

import { useApp } from '@/lib/context';
import { themes, type ThemeName } from '@/lib/themes';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useState } from 'react';

export function ThemeSelector() {
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontFamily: 'var(--font-body)',
        }}
      >
        <Palette size={16} />
        <span style={{ display: 'inline' }}>Theme</span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
            zIndex: 1000,
            minWidth: '220px',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-cyber)',
            fontSize: '10px',
            color: 'var(--accent-primary)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Select Theme
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {themes.map(t => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setTheme(t.id as ThemeName); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: t.id === theme ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  background: t.id === theme ? 'rgba(0,255,255,0.1)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.secondary})`,
                  boxShadow: t.id === theme ? `0 0 12px ${t.colors.primary}` : 'none',
                  flexShrink: 0,
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 600 }}>{t.icon} {t.name}</span>
                </div>
                {t.id === theme && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      marginLeft: 'auto',
                      color: 'var(--accent-primary)',
                      fontSize: '16px',
                    }}
                  >✓</motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
