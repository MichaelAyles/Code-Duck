import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import './styles/mobile.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // For testing purposes, skip auth and go straight to dashboard
    // TODO: Re-enable auth check when authentication is implemented
    // const token = localStorage.getItem('authToken');
    // setIsAuthenticated(!!token);
    
    setTimeout(() => {
      setIsAuthenticated(true); // Skip auth for testing
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <div className="container">
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h1>CodeDuck</h1>
            <p>Mobile AI Coding Assistant</p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={() => setIsAuthenticated(true)}
            >
              Skip to Dashboard (Testing)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
