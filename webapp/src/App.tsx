import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { GitHubCallback } from './components/GitHubCallback';
import { AIChat } from './components/AIChat';
import { FileViewer } from './components/FileViewer';
import { Navigation } from './components/Navigation';
import { ModernDashboard } from './components/ModernDashboard';
import { RepoSelector } from './components/RepoSelector';
import { ModernFileBrowser } from './components/ModernFileBrowser';
import { authService } from './services/auth';
import { User } from './types';
import './styles/mobile.css';
import './styles/modern.css';

type Screen = 'login' | 'register' | 'dashboard' | 'github-callback' | 'ai-chat' | 'repo-select' | 'file-browser' | 'file-viewer';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentRepo, setCurrentRepo] = useState<any | null>(null);
  const [fileData, setFileData] = useState<{
    owner: string;
    repo: string;
    path: string;
    content: string;
  } | null>(null);
  const [aiChatData, setAiChatData] = useState<{
    code: string;
    language: string;
    context: string;
  } | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
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
    
    if (isAuth) {
      try {
        // Load user data
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
        
        // Try to fetch fresh user data
        const response = await authService.getCurrentUser();
        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    }
    
    setTimeout(() => {
      setCurrentScreen(isAuth ? 'dashboard' : 'login');
      setIsLoading(false);
    }, 500);
  };

  const handleLoginSuccess = async () => {
    // Reload user data after login
    await checkAuthStatus();
    setCurrentScreen('dashboard');
  };

  const handleRegisterSuccess = async () => {
    // Reload user data after registration
    await checkAuthStatus();
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentRepo(null);
    setCurrentScreen('login');
  };

  const handleShowRegister = () => {
    setCurrentScreen('register');
  };

  const handleShowLogin = () => {
    setCurrentScreen('login');
  };

  const handleGitHubSuccess = async () => {
    // Clear URL params and reload user data
    window.history.pushState({}, '', '/');
    await checkAuthStatus();
    setCurrentScreen('dashboard');
  };

  const handleGitHubError = (error: string) => {
    // Clear URL params and redirect to dashboard
    window.history.pushState({}, '', '/');
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    // Clear AI chat data when navigating from non-file sources
    if (screen === 'ai-chat') {
      setAiChatData(null);
    }
    setCurrentScreen(screen as Screen);
  };

  const handleSelectRepo = (repo: any) => {
    setCurrentRepo(repo);
    setCurrentScreen('dashboard');
  };

  const handleOpenFile = (owner: string, repo: string, path: string, content: string) => {
    setFileData({ owner, repo, path, content });
    setCurrentScreen('file-viewer');
  };

  const handleShowAIChatFromFile = (code: string, language: string, context: string) => {
    setAiChatData({ code, language, context });
    setCurrentScreen('ai-chat');
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const isAuthenticated = ['dashboard', 'ai-chat', 'repo-select', 'file-browser', 'file-viewer'].includes(currentScreen);

  return (
    <div className="app-container">
      {/* Navigation (only show when authenticated) */}
      {isAuthenticated && (
        <Navigation
          user={user}
          currentRepo={currentRepo}
          onNavigate={handleNavigate}
          onSelectRepo={() => handleNavigate('repo-select')}
          onLogout={handleLogout}
        />
      )}

      {/* Screen Content */}
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

      {currentScreen === 'dashboard' && (
        <ModernDashboard
          user={user}
          currentRepo={currentRepo}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'ai-chat' && (
        <AIChat 
          onBack={() => handleNavigate('dashboard')}
          initialCode={aiChatData?.code}
          initialLanguage={aiChatData?.language}
          initialContext={aiChatData?.context}
        />
      )}

      {currentScreen === 'repo-select' && (
        <RepoSelector
          onSelectRepo={handleSelectRepo}
          onBack={() => handleNavigate('dashboard')}
          currentRepo={currentRepo}
        />
      )}

      {currentScreen === 'file-browser' && currentRepo && (
        <ModernFileBrowser
          repo={currentRepo}
          onOpenFile={handleOpenFile}
          onBack={() => handleNavigate('dashboard')}
        />
      )}

      {currentScreen === 'file-viewer' && fileData && (
        <FileViewer 
          owner={fileData.owner}
          repo={fileData.repo}
          path={fileData.path}
          content={fileData.content}
          onBack={() => handleNavigate('file-browser')}
          onShowAIChat={handleShowAIChatFromFile}
        />
      )}
    </div>
  );
}

export default App;
