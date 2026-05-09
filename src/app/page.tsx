'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';
import { loginUser, registerUser } from '@/lib/auth';
import { CyberBackground } from '@/components/CyberBackground';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Shield, User, Lock, Eye, EyeOff, Zap, ChevronRight, GraduationCap, Rocket } from 'lucide-react';

export default function LoginPage() {
  const { setUser } = useApp();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePortal, setActivePortal] = useState<'admin' | 'student'>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin) {
      const result = await registerUser(name, email, password);
      if (result.success) {
        setIsLogin(true);
        setError('');
      } else {
        setError(result.message || 'Registration failed');
      }
      setLoading(false);
      return;
    }

    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  const quickLogin = async (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setEmail('Harry879@gmail.com');
      setPassword('Harry900090');
      setActivePortal('admin');
    } else {
      // For student demo, use generic
      setEmail('student@academy.com');
      setPassword('student123');
      setActivePortal('student');
    }
  };

  return (
    <div className="theme-neon cyber-bg" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <CyberBackground />
      <ThemeSelector />

      {/* Top bar branding */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          gap: '12px',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={20} color="var(--accent-primary)" />
        </motion.div>
        <h1 style={{
          fontFamily: 'var(--font-cyber)',
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--accent-primary)',
          textShadow: 'var(--glow-primary)',
          letterSpacing: '4px',
        }}>
          ACADEMY TSF
        </h1>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-secondary)',
            padding: '2px 10px',
            border: '1px solid var(--accent-secondary)',
            borderRadius: '12px',
          }}
        >
          v2.0.26
        </motion.span>
      </motion.div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '20px',
      }}>
        {/* Left: Branding */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              fontSize: '80px',
              marginBottom: '20px',
            }}
          >
            🎓
          </motion.div>
          <h2 style={{
            fontFamily: 'var(--font-cyber)',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            animation: 'shimmer 3s linear infinite',
            lineHeight: 1.2,
          }}>
            NEXT GEN LEARNING
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginTop: '12px',
            letterSpacing: '3px',
            opacity: 0.7,
          }}>
            // ACCESS PORTAL SYSTEM
          </p>
        </motion.div>

        {/* Right: Login Form */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            width: '100%',
            maxWidth: '440px',
          }}
        >
          {/* Portal selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid var(--border-color)',
          }}>
            {[
              { id: 'student' as const, icon: <GraduationCap size={16} />, label: 'Student Portal' },
              { id: 'admin' as const, icon: <Shield size={16} />, label: 'Admin Portal' },
            ].map(portal => (
              <button
                key={portal.id}
                onClick={() => setActivePortal(portal.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activePortal === portal.id ? 'var(--gradient-primary)' : 'transparent',
                  color: activePortal === portal.id ? '#000' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-cyber)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {portal.icon}
                {portal.label}
              </button>
            ))}
          </div>

          {/* Login/Register toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsLogin(true); setError(''); }}
              style={{
                background: isLogin ? 'var(--gradient-primary)' : 'transparent',
                color: isLogin ? '#000' : 'var(--text-secondary)',
                border: isLogin ? 'none' : '1px solid var(--border-color)',
                padding: '10px 28px',
                borderRadius: '8px',
                fontFamily: 'var(--font-cyber)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginRight: '4px',
              }}
            >
              SIGN IN
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsLogin(false); setError(''); }}
              style={{
                background: !isLogin ? 'var(--gradient-primary)' : 'transparent',
                color: !isLogin ? '#000' : 'var(--text-secondary)',
                border: !isLogin ? 'none' : '1px solid var(--border-color)',
                padding: '10px 28px',
                borderRadius: '8px',
                fontFamily: 'var(--font-cyber)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              REGISTER
            </motion.button>
          </div>

          {/* Form Card */}
          <div className="cyber-card" style={{
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative corners */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid var(--accent-primary)', borderLeft: '2px solid var(--accent-primary)' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid var(--accent-primary)', borderRight: '2px solid var(--accent-primary)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--accent-primary)', borderLeft: '2px solid var(--accent-primary)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--accent-primary)', borderRight: '2px solid var(--accent-primary)' }} />

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginBottom: '20px' }}
                  >
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-cyber)',
                      fontSize: '10px',
                      letterSpacing: '2px',
                      color: 'var(--accent-primary)',
                      marginBottom: '8px',
                    }}>
                      FULL NAME
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="var(--accent-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="cyber-input"
                        placeholder="Enter your full name"
                        style={{ paddingLeft: '42px' }}
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-cyber)',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  color: 'var(--accent-primary)',
                  marginBottom: '8px',
                }}>
                  EMAIL ADDRESS
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--accent-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="cyber-input"
                    placeholder="Enter email address"
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-cyber)',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  color: 'var(--accent-primary)',
                  marginBottom: '8px',
                }}>
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--accent-primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="cyber-input"
                    placeholder="Enter password"
                    style={{ paddingLeft: '42px', paddingRight: '42px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--accent-primary)',
                      opacity: 0.6,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 0, 64, 0.15)',
                    border: '1px solid rgba(255, 0, 64, 0.3)',
                    color: '#ff0040',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  ⚠ {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cyber-btn"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '16px',
                  fontSize: '14px',
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '20px', height: '20px', border: '2px solid transparent', borderTop: '2px solid #000', borderRadius: '50%' }}
                  />
                ) : (
                  <>
                    {isLogin ? 'ACCESS PORTAL' : 'CREATE ACCOUNT'}
                    <ChevronRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Quick login buttons */}
          {isLogin && activePortal === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                opacity: 0.5,
                marginBottom: '12px',
              }}>
                QUICK ACCESS
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => quickLogin('admin')}
                style={{
                  background: 'rgba(0, 255, 255, 0.1)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                }}
              >
                <Rocket size={14} />
                Admin Quick Login
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            opacity: 0.4,
            letterSpacing: '2px',
          }}
        >
          © 2026 ACADEMY TSF // ALL SYSTEMS OPERATIONAL
        </motion.p>
      </div>
    </div>
  );
}
