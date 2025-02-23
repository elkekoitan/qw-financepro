'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

const LandingPage = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{
      background: 'var(--gradient-dark, #0A0A0A)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-primary, #FFFFFF)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '4.5rem',
        fontWeight: '700',
        background: 'var(--gradient-primary, linear-gradient(135deg, #FFD700 0%, #BFA46F 100%))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        FinancePro
      </h1>
      <p style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: '1.5rem',
        marginBottom: '2rem'
      }}>
        Finansal Geleceğinizi Şekillendirin
      </p>
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button onClick={() => setIsLogin(true)} style={{
          padding: '0.75rem 2rem',
          background: isLogin ? 'var(--gradient-primary, linear-gradient(135deg, #FFD700 0%, #BFA46F 100%))' : 'transparent',
          border: '1px solid var(--color-gold-main, #BFA46F)',
          color: isLogin ? 'var(--color-dark-bg, #0A0A0A)' : 'var(--color-gold-main, #BFA46F)',
          borderRadius: 'var(--radius-sm, 4px)',
          cursor: 'pointer',
          transition: 'var(--transition-default, all 0.3s ease)'
        }}>
          Giriş Yap
        </button>
        <button onClick={() => setIsLogin(false)} style={{
          padding: '0.75rem 2rem',
          background: !isLogin ? 'var(--gradient-primary, linear-gradient(135deg, #FFD700 0%, #BFA46F 100%))' : 'transparent',
          border: '1px solid var(--color-gold-main, #BFA46F)',
          color: !isLogin ? 'var(--color-dark-bg, #0A0A0A)' : 'var(--color-gold-main, #BFA46F)',
          borderRadius: 'var(--radius-sm, 4px)',
          cursor: 'pointer',
          transition: 'var(--transition-default, all 0.3s ease)'
        }}>
          Kayıt Ol
        </button>
      </div>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(26,26,26,0.7)',
        padding: '2rem',
        borderRadius: 'var(--radius-lg, 8px)',
        boxShadow: 'var(--shadow-md, 0 4px 8px rgba(0,0,0,0.2))'
      }}>
        {isLogin ? (
          <LoginForm onLogin={onLogin} />
        ) : (
          <RegistrationForm onRegister={onRegister} />
        )}
      </div>
    </div>
  );
};

export default LandingPage; 