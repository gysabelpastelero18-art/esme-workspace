'use client';

import { useState } from 'react';
import Image from 'next/image';
import CreateAccountPage from '../../components/CreateAccountPage';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // User session is now managed by HTTP-only cookies on server
        onLoginSuccess();
      } else {
        setErrorMessage(result.message || 'Login failed');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setShowCreateAccount(true);
  };

  const handleBackToLogin = () => {
    setShowCreateAccount(false);
  };

  const handleAccountCreated = () => {
    setShowCreateAccount(false);
    // You could show a success message here
  };

  if (showCreateAccount) {
    return (
      <CreateAccountPage 
        onBack={handleBackToLogin}
        onAccountCreated={handleAccountCreated}
      />
    );
  }

  return (
    <>
      <div 
        style={{
          minHeight: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          background: "url('images/login-bg.jpg') no-repeat center center",
          backgroundSize: 'cover',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div 
          style={{
            backgroundColor: 'white',
            padding: '2rem 1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',
            minWidth: '0',
            textAlign: 'center',
            margin: '2vh auto',
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-block',
                marginBottom: '1.5rem'
              }}
            >
              <Image 
                src="/images/logo.png" 
                alt="Esmeralda Logo" 
                width={120}
                height={120}
                style={{ 
                  borderRadius: '50%'
                }}
                priority
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p 
                style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#666', 
                  fontSize: '1.1rem',
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  letterSpacing: '1px'
                }}
              >
                Welcome To
              </p>
              <h2 
                style={{ 
                  margin: '0 0 0.3rem 0', 
                  color: '#006400',
                  fontSize: '1.8rem',
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontWeight: 'bold',
                  letterSpacing: '2px'
                }}
              >
                ESMERALDA
              </h2>
              <p 
                style={{ 
                  margin: 0, 
                  color: '#333', 
                  fontSize: '1rem',
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontWeight: '500',
                  letterSpacing: '1px'
                }}
              >
                Finance
              </p>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" 
                required 
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #9CAF88',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  color: '#9CAF88'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = 'white';
                  target.style.color = '#333';
                  target.style.borderColor = '#9CAF88';
                  target.style.boxShadow = '0 0 15px rgba(156,175,136,0.8)';
                  target.style.transform = 'translateY(-1px)';
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = '#9CAF88';
                  target.style.borderColor = '#9CAF88';
                  target.style.boxShadow = 'none';
                  target.style.transform = 'translateY(0)';
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                required 
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #9CAF88',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  color: '#9CAF88'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = 'white';
                  target.style.color = '#333';
                  target.style.borderColor = '#9CAF88';
                  target.style.boxShadow = '0 0 15px rgba(156,175,136,0.8)';
                  target.style.transform = 'translateY(-1px)';
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = '#9CAF88';
                  target.style.borderColor = '#9CAF88';
                  target.style.boxShadow = 'none';
                  target.style.transform = 'translateY(0)';
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: isLoading ? '#ccc' : '#228B22',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#1e7e1e';
                  target.style.boxShadow = '0 0 15px rgba(34,139,34,0.5), 0 4px 8px rgba(0,0,0,0.2)';
                  target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#228B22';
                  target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          {/* Create Account Button */}
          <button 
            type="button" 
            onClick={handleCreateAccount}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: '#9CAF88',
              border: '1px solid #9CAF88',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#9CAF88';
              target.style.color = 'white';
              target.style.boxShadow = '0 0 15px rgba(156,175,136,0.6)';
              target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = 'transparent';
              target.style.color = '#9CAF88';
              target.style.boxShadow = 'none';
              target.style.transform = 'translateY(0)';
            }}
          >
            Create Account
          </button>
          
          {/* Error Message */}
          {showError && (
            <div 
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                color: '#721c24'
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
