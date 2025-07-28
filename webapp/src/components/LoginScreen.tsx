import React, { useState } from 'react';
import { authService, LoginData } from '../services/auth';
import { githubService } from '../services/github';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onShowRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onShowRegister }) => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      authService.saveAuthData(response);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGitHubLogin = () => {
    githubService.initiateLoginOAuth();
  };

  return (
    <div className="container">
      <div style={{ padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#007AFF', marginBottom: '8px' }}>
            CodeDuck 🦆
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            AI Coding Assistant
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          margin: '20px 0',
          position: 'relative'
        }}>
          <div style={{
            height: '1px',
            backgroundColor: '#ddd',
            position: 'relative'
          }}>
            <span style={{
              backgroundColor: 'white',
              padding: '0 15px',
              color: '#666',
              fontSize: '14px',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              OR
            </span>
          </div>
        </div>

        <button
          onClick={handleGitHubLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '20px',
            backgroundColor: '#24292e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '12px' }}>
            Don't have an account?
          </p>
          <button
            onClick={onShowRegister}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '12px' }}
          >
            Create Account
          </button>
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          <p style={{ marginBottom: '8px', fontWeight: '500' }}>Demo Credentials:</p>
          <p>Email: demo@codeduck.com</p>
          <p>Password: demo123456</p>
        </div>
      </div>
    </div>
  );
};