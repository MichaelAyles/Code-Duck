import React, { useEffect, useState } from 'react';
import { githubService } from '../services/github';
import { authService } from '../services/auth';

interface GitHubCallbackProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const GitHubCallback: React.FC<GitHubCallbackProps> = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState('Processing GitHub authentication...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get the code from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`GitHub OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received from GitHub');
      }

      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated) {
        // User is logged in - this is account linking
        setStatus('Linking GitHub account...');
        await githubService.handleCallback(code);
        setStatus('GitHub account linked successfully!');
      } else {
        // User is not logged in - this is login via GitHub
        setStatus('Signing in with GitHub...');
        const { user, token } = await githubService.handleLoginCallback(code);
        authService.saveAuthData({ user, token });
        setStatus('Successfully signed in with GitHub!');
      }
      
      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err: any) {
      console.error('GitHub OAuth callback error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to authenticate with GitHub';
      setStatus(`Error: ${errorMessage}`);
      onError(errorMessage);
    }
  };

  return (
    <div className="container">
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="spinner"></div>
        </div>
        
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '16px',
          color: '#333'
        }}>
          GitHub Integration
        </h2>
        
        <p style={{ 
          fontSize: '16px', 
          color: '#666',
          marginBottom: '20px'
        }}>
          {status}
        </p>

        {status.includes('Error:') && (
          <button
            className="btn btn-primary"
            onClick={() => onError('')}
            style={{ marginTop: '20px' }}
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};