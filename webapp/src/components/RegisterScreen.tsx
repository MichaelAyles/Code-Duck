import React, { useState } from 'react';
import { authService, RegisterData } from '../services/auth';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onShowLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onShowLogin }) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      authService.saveAuthData(response);
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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

  return (
    <div className="container">
      <div style={{ padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#007AFF', marginBottom: '8px' }}>
            CodeDuck 🦆
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Create Your Account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Name (Optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Your name"
            />
          </div>

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
              placeholder="At least 8 characters"
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Password must be at least 8 characters long
            </div>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '12px' }}>
            Already have an account?
          </p>
          <button
            onClick={onShowLogin}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '12px' }}
          >
            Sign In Instead
          </button>
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#2e7d32'
        }}>
          <p style={{ fontWeight: '500', marginBottom: '8px' }}>🎉 Free Tier Includes:</p>
          <p>• 15 AI requests per day</p>
          <p>• GitHub integration</p>
          <p>• Mobile-optimized experience</p>
        </div>
      </div>
    </div>
  );
};