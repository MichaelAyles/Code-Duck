import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { GitHubCallback } from './components/GitHubCallback';
import { AIChat } from './components/AIChat';
import { authService } from './services/auth';
import './styles/mobile.css';

type Screen = 'login' | 'register' | 'dashboard' | 'github-callback' | 'ai-chat';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // Check if this is a GitHub OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const isGitHubCallback = urlParams.has('code') && window.location.pathname === '/auth/github/callback';
    
    if (isGitHubCallback) {
      setCurrentScreen('github-callback');
      setIsLoading(false);
      return;
    }
    
    // Check if user is already authenticated
    const isAuth = authService.isAuthenticated();
    
    setTimeout(() => {
      setCurrentScreen(isAuth ? 'dashboard' : 'login');
      setIsLoading(false);
    }, 500);
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentScreen('login');
  };

  const handleShowRegister = () => {
    setCurrentScreen('register');
  };

  const handleShowLogin = () => {
    setCurrentScreen('login');
  };

  const handleGitHubSuccess = () => {
    // Clear URL params and redirect to dashboard
    window.history.pushState({}, '', '/');
    setCurrentScreen('dashboard');
  };

  const handleGitHubError = (error: string) => {
    // Clear URL params and redirect to dashboard
    window.history.pushState({}, '', '/');
    setCurrentScreen('dashboard');
  };

  const handleShowAIChat = () => {
    setCurrentScreen('ai-chat');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentScreen === 'dashboard' && (
        <Dashboard 
          onLogout={handleLogout}
          onShowAIChat={handleShowAIChat}
        />
      )}
      
      {currentScreen === 'login' && (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess}
          onShowRegister={handleShowRegister}
        />
      )}
      
      {currentScreen === 'register' && (
        <RegisterScreen 
          onRegisterSuccess={handleRegisterSuccess}
          onShowLogin={handleShowLogin}
        />
      )}
      
      {currentScreen === 'github-callback' && (
        <GitHubCallback 
          onSuccess={handleGitHubSuccess}
          onError={handleGitHubError}
        />
      )}

      {currentScreen === 'ai-chat' && (
        <AIChat onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;
