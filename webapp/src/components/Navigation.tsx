import React, { useState } from 'react';
import { authService } from '../services/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  tier: string;
}

interface NavigationProps {
  user: User | null;
  currentRepo: any | null;
  onNavigate: (screen: string) => void;
  onSelectRepo: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  user,
  currentRepo,
  onNavigate,
  onSelectRepo,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    closeMenu();
  };

  const handleLogout = () => {
    onLogout();
    closeMenu();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'ai-chat', label: 'AI Code Explain', icon: '🤖' },
    { id: 'repo-select', label: 'Select Repository', icon: '📁' },
  ];

  return (
    <>
      {/* Header */}
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
          
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: 'var(--primary)'
            }}>
              CodeDuck
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {user && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--gray-600)',
              textAlign: 'right'
            }}>
              <div style={{ fontWeight: '500' }}>{user.name || user.email}</div>
              <div>{user.tier}</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Overlay */}
      <div 
        className={`nav-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Navigation Menu */}
      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        {/* Menu Header */}
        <div className="nav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🦆
            </div>
            <div>
              <div style={{ 
                fontWeight: '600', 
                color: 'var(--gray-900)',
                fontSize: '1rem'
              }}>
                CodeDuck
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--gray-500)'
              }}>
                AI Coding Assistant
              </div>
            </div>
          </div>
        </div>

        {/* Current Repository */}
        {currentRepo && (
          <div className="repo-selector">
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: '500', 
              color: 'var(--gray-600)',
              marginBottom: 'var(--space-2)'
            }}>
              Current Repository
            </div>
            <div className="repo-current" onClick={() => { onSelectRepo(); closeMenu(); }}>
              <div className="repo-info">
                <div className="repo-icon">📁</div>
                <div className="repo-details">
                  <h3>{currentRepo.name}</h3>
                  <p>{currentRepo.description || 'No description'}</p>
                </div>
              </div>
              <div style={{ color: 'var(--gray-400)' }}>→</div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="nav-items">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="nav-item"
              onClick={() => {
                if (item.id === 'repo-select') {
                  onSelectRepo();
                  closeMenu();
                } else {
                  handleNavigate(item.id);
                }
              }}
            >
              <div className="nav-item-icon">{item.icon}</div>
              <div>{item.label}</div>
            </div>
          ))}
          
          <div style={{ height: '1px', background: 'var(--gray-200)', margin: 'var(--space-4) 0' }} />
          
          {user && (
            <>
              <div className="nav-item">
                <div className="nav-item-icon">👤</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {user.name || 'User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="nav-item" onClick={handleLogout}>
                <div className="nav-item-icon">🚪</div>
                <div>Sign Out</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};