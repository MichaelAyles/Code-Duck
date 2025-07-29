import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { testApiConnection } from '../services/apiTest';
import { authService } from '../services/auth';
import { githubService } from '../services/github';

interface DashboardProps {
  onLogout: () => void;
  onShowAIChat: () => void;
  onShowGitHubBrowser: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, onShowAIChat, onShowGitHubBrowser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [stats, setStats] = useState({
    githubConnected: false,
    trelloConnected: false,
    aiRequestsToday: 5,
    dailyLimit: 15,
  });

  useEffect(() => {
    loadUserData();
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      const result = await testApiConnection();
      if (result.success && result.data) {
        setApiStatus(`✅ Backend Connected - ${result.data.message}`);
      } else {
        setApiStatus('❌ Backend Connection Failed');
        console.error('Backend connection failed:', result.error);
      }
    } catch (error) {
      setApiStatus('❌ Backend Connection Failed - Is Docker running?');
      console.error('Backend connection error:', error);
    }
  };

  const loadUserData = async () => {
    try {
      // First try to get user from localStorage
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }

      // Then fetch fresh data from API
      const response = await authService.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        
        // Update stats if we have count data
        if ('_count' in response.user) {
          const countData = (response.user as any)._count;
          setStats({
            githubConnected: countData.githubAccounts > 0,
            trelloConnected: countData.trelloAccounts > 0,
            aiRequestsToday: countData.aiRequests || 0,
            dailyLimit: response.user.tier === 'PRO' ? 200 : 15,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // If API fails, keep using stored user data
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const handleGitHubConnect = () => {
    if (stats.githubConnected) {
      onShowGitHubBrowser();
    } else {
      githubService.initiateOAuth();
    }
  };

  const handleUpgrade = () => {
    alert('Pro upgrade coming soon! This will unlock unlimited AI requests.');
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="greeting">Hello, {user?.name || user?.email}!</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <h2 className="card-title">Backend Status</h2>
        <div className={`api-status ${apiStatus.includes('✅') ? 'success' : 'error'}`}>
          {apiStatus}
        </div>
        {apiStatus.includes('❌') && (
          <button 
            className="btn btn-secondary" 
            style={{ marginTop: '12px', width: '100%' }}
            onClick={testBackendConnection}
          >
            Retry Connection
          </button>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Today's Usage</h2>
        <div className="stats-text">
          {stats.aiRequestsToday} / {stats.dailyLimit} AI requests
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(stats.aiRequestsToday / stats.dailyLimit) * 100}%` }}
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">AI Features</h2>
        
        <div
          className="integration-card ai-feature"
          onClick={onShowAIChat}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <div>
            <div className="integration-title" style={{ color: 'white' }}>
              🤖 Code Explain
            </div>
            <div className="integration-status" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Analyze and understand code
            </div>
          </div>
          <div style={{ fontSize: '24px' }}>→</div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Integrations</h2>
        
        <div
          className={`integration-card ${stats.githubConnected ? 'connected' : ''}`}
          onClick={handleGitHubConnect}
        >
          <div>
            <div className="integration-title">GitHub</div>
            <div className="integration-status">
              {stats.githubConnected ? 'Browse repositories →' : 'Tap to connect'}
            </div>
          </div>
        </div>

        <div className="integration-card">
          <div>
            <div className="integration-title">Trello</div>
            <div className="integration-status">Coming soon</div>
          </div>
        </div>
      </div>

      {user?.tier === 'FREE' && (
        <div className="upgrade-card" onClick={handleUpgrade}>
          <div className="upgrade-title">Upgrade to Pro</div>
          <div className="upgrade-text">
            Unlock unlimited AI requests and premium features
          </div>
        </div>
      )}
    </div>
  );
};