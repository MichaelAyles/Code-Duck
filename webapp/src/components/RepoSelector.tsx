import React, { useState, useEffect } from 'react';
import { githubService, GitHubRepo } from '../services/github';

interface RepoSelectorProps {
  onSelectRepo: (repo: GitHubRepo) => void;
  onBack: () => void;
  currentRepo: GitHubRepo | null;
}

export const RepoSelector: React.FC<RepoSelectorProps> = ({ 
  onSelectRepo, 
  onBack, 
  currentRepo 
}) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    setLoading(true);
    setError('');
    try {
      const repoList = await githubService.getRepositories();
      setRepos(repoList);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'C++': '#f34b7d',
      'C': '#555555',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
    };
    return colors[language || ''] || '#8c8c8c';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Updated today';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Updated ${Math.ceil(diffDays / 30)} months ago`;
    return `Updated ${Math.ceil(diffDays / 365)} years ago`;
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div style={{ 
          padding: 'var(--space-4)',
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: 'var(--space-4)' 
          }}>
            <button
              onClick={onBack}
              className="btn btn-ghost btn-sm"
              style={{ marginRight: 'var(--space-2)' }}
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-semibold" style={{ margin: 0 }}>
                Select Repository
              </h1>
              <p className="text-sm text-gray" style={{ margin: 0 }}>
                Choose a repository to work with
              </p>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              left: 'var(--space-3)', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--gray-400)'
            }}>
              🔍
            </div>
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-10)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                background: 'var(--gray-50)'
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading repositories...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: 'var(--space-4)' }}>
            <div style={{
              padding: 'var(--space-4)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius)',
              color: '#dc2626'
            }}>
              <div style={{ fontWeight: '500', marginBottom: 'var(--space-2)' }}>
                Error loading repositories
              </div>
              <div style={{ fontSize: '0.875rem' }}>{error}</div>
              <button 
                onClick={loadRepositories}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'var(--space-3)' }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Repository List */}
        {!loading && !error && (
          <div style={{ padding: 'var(--space-4)' }}>
            {filteredRepos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📁</div>
                <h3 style={{ margin: '0 0 var(--space-2) 0' }}>
                  {searchTerm ? 'No repositories found' : 'No repositories'}
                </h3>
                <p style={{ margin: 0, color: 'var(--gray-500)' }}>
                  {searchTerm 
                    ? `No repositories match "${searchTerm}"`
                    : 'Connect your GitHub account to see repositories'
                  }
                </p>
              </div>
            ) : (
              <div className="list">
                {filteredRepos.map((repo) => (
                  <div 
                    key={repo.id}
                    className="card card-hover"
                    onClick={() => onSelectRepo(repo)}
                    style={{ 
                      marginBottom: 'var(--space-3)',
                      border: currentRepo?.id === repo.id ? '2px solid var(--primary)' : undefined
                    }}
                  >
                    <div className="card-padding">
                      {/* Repository Header */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-3)'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            marginBottom: 'var(--space-1)'
                          }}>
                            <span style={{ fontSize: '1.25rem' }}>📁</span>
                            <h3 className="text-base font-semibold" style={{ margin: 0 }}>
                              {repo.name}
                            </h3>
                            {repo.private && (
                              <span style={{
                                background: 'var(--warning)',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '12px',
                                fontSize: '0.625rem',
                                fontWeight: '500'
                              }}>
                                Private
                              </span>
                            )}
                            {currentRepo?.id === repo.id && (
                              <span style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '12px',
                                fontSize: '0.625rem',
                                fontWeight: '500'
                              }}>
                                Selected
                              </span>
                            )}
                          </div>
                          
                          {repo.description && (
                            <p className="text-sm text-gray" style={{ 
                              margin: 0,
                              lineHeight: 1.4
                            }}>
                              {repo.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Repository Stats */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        fontSize: '0.75rem',
                        color: 'var(--gray-500)'
                      }}>
                        {repo.language && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: getLanguageColor(repo.language)
                            }} />
                            {repo.language}
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          ⭐ {repo.stars}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          🍴 {repo.forks}
                        </div>
                        
                        <div>
                          {formatDate(repo.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};