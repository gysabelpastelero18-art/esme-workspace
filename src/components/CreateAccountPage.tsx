'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CreateAccountPageProps {
  onBack: () => void;
  onAccountCreated: () => void;
}

export default function CreateAccountPage({ onBack, onAccountCreated }: CreateAccountPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    branch: '',
    position: '',
    permissions: [] as string[]
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!formData.username.trim()) {
      setErrorMessage('Username is required');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    setShowError(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email || undefined,
          firstName: formData.firstName,
          lastName: formData.lastName,
          branch: formData.branch,
          position: formData.position,
          permissions: formData.permissions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onAccountCreated();
        }, 2000);
      } else {
        setErrorMessage(result.message || 'Failed to create account');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Network error. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundImage: 'url(/images/login-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '500px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(45deg, rgba(156,175,136,0.8), rgba(74,103,65,0.8), rgba(0,100,0,0.8))',
              borderRadius: '20px',
              zIndex: -1,
              filter: 'blur(4px)'
            }}
          />
          
          <div 
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✅</div>
            <h2 
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#256029',
                marginBottom: '16px',
                fontFamily: 'Georgia, serif'
              }}
            >
              Account Created Successfully!
            </h2>
            <p 
              style={{
                color: '#256029',
                marginBottom: '24px',
                fontSize: '1.1rem'
              }}
            >
              You can now login with your credentials.
            </p>
            <div 
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #9CAF88, #4A6741)',
                height: '8px',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundImage: 'url(/images/login-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        flexDirection: 'column',
      }}
    >
      {/* Create Account Container */}
      <div 
        style={{
          width: '100%',
          maxWidth: '800px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, rgba(156,175,136,0.8), rgba(74,103,65,0.8), rgba(0,100,0,0.8))',
            borderRadius: '20px',
            zIndex: -1,
            filter: 'blur(4px)'
          }}
        />
        
        <div 
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '40px'
          }}
        >
          {/* Header */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px'
            }}
          >
            <button 
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#9CAF88',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#4A6741';
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 8px 20px rgba(74,103,65,0.4)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#9CAF88';
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              ← Back to Login
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <h1 
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#256029',
                  margin: '0 0 8px 0',
                  fontFamily: 'Georgia, serif'
                }}
              >
                Create Account
              </h1>
              <p 
                style={{
                  color: '#256029',
                  margin: 0,
                  fontSize: '1.1rem',
                  fontFamily: 'Georgia, serif'
                }}
              >
                ESMERALDA Finance
              </p>
            </div>
            
            <div style={{ width: '160px' }}></div> {/* Spacer for centering */}
          </div>

          {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            {/* Personal Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', width: '100%' }}>
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#256029',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1rem'
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent',
                    color: '#256029'
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
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#256029',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1rem'
                  }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent',
                    color: '#256029'
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
            </div>

            {/* Email */}
            <div>
              <label 
                style={{
                  display: 'block',
                  color: '#4A6741',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #9CAF88',
                  borderRadius: '8px',
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

            {/* Username and Position */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', width: '100%' }}>
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#4A6741',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1rem'
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
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
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#4A6741',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1rem'
                  }}
                >
                  Position
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent',
                    color: '#9CAF88'
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLSelectElement;
                    target.style.backgroundColor = 'white';
                    target.style.color = '#333';
                    target.style.borderColor = '#9CAF88';
                    target.style.boxShadow = '0 0 15px rgba(156,175,136,0.8)';
                    target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLSelectElement;
                    target.style.backgroundColor = 'transparent';
                    target.style.color = '#9CAF88';
                    target.style.borderColor = '#9CAF88';
                    target.style.boxShadow = 'none';
                    target.style.transform = 'translateY(0)';
                  }}
                >
                  <option value="">Select Position</option>
                  <option value="administrator">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                  <option value="kitchen-staff">Kitchen Staff</option>
                  <option value="inventory-clerk">Inventory Clerk</option>
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', width: '100%' }}>
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#4A6741',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1rem'
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
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
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#4A6741',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1rem'
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #9CAF88',
                    borderRadius: '8px',
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
            </div>

            {/* Branch Assignment */}
            <div>
              <label 
                style={{
                  display: 'block',
                  color: '#4A6741',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}
              >
                Branch Assignment
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #9CAF88',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  color: '#9CAF88'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLSelectElement;
                  target.style.backgroundColor = 'white';
                  target.style.color = '#333';
                  target.style.borderColor = '#9CAF88';
                  target.style.boxShadow = '0 0 15px rgba(156,175,136,0.8)';
                  target.style.transform = 'translateY(-1px)';
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLSelectElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = '#9CAF88';
                  target.style.borderColor = '#9CAF88';
                  target.style.boxShadow = 'none';
                  target.style.transform = 'translateY(0)';
                }}
              >
                <option value="">Select Branch</option>
                <option value="mayon">🌋 Mayon Branch</option>
                <option value="one-balete">🌳 One Balete Branch</option>
                <option value="both">🏢 Both Branches</option>
              </select>
            </div>

            {/* Permissions */}
            <div>
              <label 
                style={{
                  display: 'block',
                  color: '#4A6741',
                  fontWeight: '600',
                  marginBottom: '16px',
                  fontSize: '1rem'
                }}
              >
                Access Permissions
              </label>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}
              >
                {[
                  { id: 'sales', label: '💰 Sales', icon: '💰' },
                  { id: 'inventory', label: '📦 Inventory', icon: '📦' },
                  { id: 'production', label: '🍳 Production', icon: '🍳' },
                  { id: 'purchases', label: '🛒 Purchases', icon: '🛒' },
                  { id: 'transfers', label: '🔄 Transfers', icon: '🔄' },
                  { id: 'reports', label: '📊 Reports', icon: '📊' },
                  { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
                ].map(permission => (
                  <label 
                    key={permission.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: 'rgba(156, 175, 136, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(156, 175, 136, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLLabelElement;
                      target.style.backgroundColor = 'rgba(156, 175, 136, 0.2)';
                      target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLLabelElement;
                      target.style.backgroundColor = 'rgba(156, 175, 136, 0.1)';
                      target.style.transform = 'translateY(0)';
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.id)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#9CAF88',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '1.2rem' }}>{permission.icon}</span>
                    <span 
                      style={{
                        color: '#4A6741',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}
                    >
                      {permission.label.replace(/.*\s/, '')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {showError && (
              <div 
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  borderRadius: '8px',
                  color: '#D32F2F',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: isLoading ? '#ccc' : '#9CAF88',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '12px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#4A6741';
                  target.style.transform = 'translateY(-3px)';
                  target.style.boxShadow = '0 12px 25px rgba(74,103,65,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#9CAF88';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }
              }}
            >
              <span style={{ position: 'relative', zIndex: 10 }}>
                {isLoading ? '⏳ Creating Account...' : '🎉 Create Account'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
