import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { testApiConnection } from '../services/apiTest';
import { authService } from '../services/auth';
import { aiService } from '../services/ai';

interface ModernDashboardProps {
  user: User | null;
  currentRepo: any | null;
  onNavigate: (screen: string) => void;
}

export const ModernDashboard: React.FC<ModernDashboardProps> = ({ 
  user, 
  currentRepo, 
  onNavigate 
}) => {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [stats, setStats] = useState({
    githubConnected: false,
    trelloConnected: false,
    aiRequestsToday: 0,
    dailyLimit: 15,
  });
  const [usageStats, setUsageStats] = useState<any>(null);

  useEffect(() => {
    testBackendConnection();
    loadUserData();
    loadUsageStats();
  }, []);

  const testBackendConnection = async () => {
    try {
      const result = await testApiConnection();
      if (result.success) {
        setApiStatus('✅ Backend connected');
      } else {
        setApiStatus('❌ Backend connection failed');
      }
    } catch (error) {
      setApiStatus('❌ Backend connection failed');
    }
  };

  const loadUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.user && '_count' in response.user) {
        const countData = (response.user as any)._count;
        setStats({
          githubConnected: countData.githubAccounts > 0,
          trelloConnected: countData.trelloAccounts > 0,
          aiRequestsToday: countData.aiRequests || 0,
          dailyLimit: response.user.tier === 'PRO' ? 200 : 15,
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadUsageStats = async () => {
    try {
      const usage = await aiService.getUsage();
      setUsageStats(usage);
      setStats(prev => ({
        ...prev,
        aiRequestsToday: usage.requestsToday,
        dailyLimit: usage.dailyLimit
      }));
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const quickActions = [
    {
      id: 'ai-chat',
      title: 'AI Code Explain',
      description: 'Analyze and understand code with AI',
      icon: '🤖',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => onNavigate('ai-chat')
    },
    {
      id: 'browse-files',
      title: currentRepo ? 'Browse Files' : 'Select Repository',
      description: currentRepo 
        ? `Browse ${currentRepo.name} repository files`
        : 'Choose a repository to work with',
      icon: '📁',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => currentRepo ? onNavigate('file-browser') : onNavigate('repo-select'),
      disabled: !stats.githubConnected
    }
  ];

  const getUsagePercentage = () => {
    return Math.min((stats.aiRequestsToday / stats.dailyLimit) * 100, 100);
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage < 50) return 'var(--success)';
    if (percentage < 80) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Welcome Section */}
        <div style={{ padding: 'var(--space-6) var(--space-4)' }}>
          <h1 className="text-2xl font-bold" style={{ 
            margin: '0 0 var(--space-2) 0',
            color: 'var(--gray-900)'
          }}>
            Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
          </h1>
          <p className="text-gray" style={{ margin: 0 }}>
            Ready to analyze some code with AI assistance?
          </p>
        </div>

        {/* Current Repository */}
        {currentRepo && (
          <div style={{ padding: '0 var(--space-4) var(--space-4) var(--space-4)' }}>
            <div className="card card-padding">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-2)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>📁</span>
                <div>
                  <h3 className="text-lg font-semibold" style={{ margin: 0 }}>
                    {currentRepo.name}
                  </h3>
                  <p className="text-sm text-gray" style={{ margin: 0 }}>
                    {currentRepo.description || 'No description'}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-4)',
                fontSize: '0.75rem',
                color: 'var(--gray-500)'
              }}>
                {currentRepo.language && (
                  <span>🔵 {currentRepo.language}</span>
                )}
                <span>⭐ {currentRepo.stars}</span>
                <span>🍴 {currentRepo.forks}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ padding: '0 var(--space-4) var(--space-4) var(--space-4)' }}>
          <h2 className="text-lg font-semibold" style={{ 
            margin: '0 0 var(--space-4) 0',
            color: 'var(--gray-900)'
          }}>
            Quick Actions
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gap: 'var(--space-3)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {quickActions.map((action) => (
              <div
                key={action.id}
                className={`card card-hover ${action.disabled ? '' : 'cursor-pointer'}`}
                onClick={action.disabled ? undefined : action.action}
                style={{
                  background: action.disabled ? 'var(--gray-100)' : action.color,
                  color: 'white',
                  border: 'none',
                  opacity: action.disabled ? 0.6 : 1,
                  cursor: action.disabled ? 'not-allowed' : 'pointer'
                }}
              >
                <div className="card-padding">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-3)'
                  }}>
                    <span style={{ fontSize: '2rem' }}>{action.icon}</span>
                    <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>→</span>
                  </div>
                  
                  <h3 className="text-base font-semibold" style={{ 
                    margin: '0 0 var(--space-1) 0',
                    color: 'white'
                  }}>
                    {action.title}
                  </h3>
                  
                  <p style={{ 
                    margin: 0,
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.4
                  }}>
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Stats */}
        <div style={{ padding: '0 var(--space-4) var(--space-4) var(--space-4)' }}>
          <div className="card card-padding">
            <h3 className="text-base font-semibold" style={{ 
              margin: '0 0 var(--space-4) 0',
              color: 'var(--gray-900)'
            }}>
              Today's AI Usage
            </h3>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)'
            }}>
              <span className="text-sm text-gray">
                {stats.aiRequestsToday} / {stats.dailyLimit} requests
              </span>
              <span className="text-sm" style={{ color: getUsageColor(), fontWeight: '500' }}>
                {Math.round(getUsagePercentage())}%
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--gray-200)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getUsagePercentage()}%`,
                height: '100%',
                background: getUsageColor(),
                transition: 'width 0.3s ease'
              }} />
            </div>
            
            {user?.tier === 'FREE' && stats.aiRequestsToday > stats.dailyLimit * 0.8 && (
              <div style={{
                marginTop: 'var(--space-3)',
                padding: 'var(--space-3)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                color: 'var(--gray-600)'
              }}>
                💡 Upgrade to Pro for unlimited AI requests and premium features
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div style={{ padding: '0 var(--space-4) var(--space-6) var(--space-4)' }}>
          <div className="card card-padding">
            <h3 className="text-base font-semibold" style={{ 
              margin: '0 0 var(--space-3) 0',
              color: 'var(--gray-900)'
            }}>
              System Status
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-sm">Backend API</span>
                <span className={`text-sm ${apiStatus.includes('✅') ? 'text-success' : 'text-danger'}`}>
                  {apiStatus}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-sm">GitHub Integration</span>
                <span className={`text-sm ${stats.githubConnected ? 'text-success' : 'text-gray'}`}>
                  {stats.githubConnected ? '✅ Connected' : '⚪ Not connected'}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-sm">AI Services</span>
                <span className="text-sm text-success">✅ Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};