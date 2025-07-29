import React, { useState, useEffect } from 'react';
import { githubService, GitHubRepo } from '../services/github';

interface GitHubBrowserProps {
  onBack: () => void;
  onOpenFile: (owner: string, repo: string, path: string, content: string) => void;
}

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  download_url?: string;
}

export const GitHubBrowser: React.FC<GitHubBrowserProps> = ({ onBack, onOpenFile }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const loadRepositoryContents = async (repo: GitHubRepo, path: string = '') => {
    setLoading(true);
    setError('');
    try {
      const contents = await githubService.getRepositoryContents(
        repo.fullName.split('/')[0], 
        repo.fullName.split('/')[1], 
        path
      );
      
      // Handle both single file and directory contents
      const fileList = Array.isArray(contents) ? contents : [contents];
      setFiles(fileList.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type === 'dir' ? 'dir' : 'file',
        size: item.size,
        download_url: item.download_url
      })));
      
      setSelectedRepo(repo);
      setCurrentPath(path);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load repository contents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (file: FileItem) => {
    if (file.type === 'dir') {
      loadRepositoryContents(selectedRepo!, file.path);
    } else {
      // Load file content
      if (file.download_url && file.size && file.size < 100000) { // Limit to 100KB files
        try {
          setLoading(true);
          const response = await fetch(file.download_url);
          const content = await response.text();
          onOpenFile(
            selectedRepo!.fullName.split('/')[0],
            selectedRepo!.fullName.split('/')[1], 
            file.path,
            content
          );
        } catch (err) {
          setError('Failed to load file content');
        } finally {
          setLoading(false);
        }
      } else {
        setError('File too large or unavailable for viewing');
      }
    }
  };

  const navigateUp = () => {
    if (currentPath) {
      const parentPath = currentPath.split('/').slice(0, -1).join('/');
      loadRepositoryContents(selectedRepo!, parentPath);
    }
  };

  const goBackToRepos = () => {
    setSelectedRepo(null);
    setCurrentPath('');
    setFiles([]);
    setError('');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'dir') return '📁';
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': return '📄';
      case 'ts': case 'tsx': return '📘';
      case 'py': return '🐍';
      case 'java': return '☕';
      case 'cpp': case 'c': case 'h': return '⚙️';
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'json': return '📋';
      case 'md': return '📝';
      case 'png': case 'jpg': case 'gif': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="container">
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #eee'
        }}>
          <button
            onClick={selectedRepo ? goBackToRepos : onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              marginRight: '15px',
              color: '#007AFF'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {selectedRepo ? selectedRepo.name : 'GitHub Repositories'}
            </h1>
            {selectedRepo && (
              <p style={{ 
                color: '#666', 
                fontSize: '14px', 
                margin: '5px 0 0 0'
              }}>
                {currentPath || 'Root directory'}
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666' 
          }}>
            <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
            Loading...
          </div>
        )}

        {/* Error */}
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
            <button
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#c62828',
                cursor: 'pointer',
                float: 'right',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Repository List */}
        {!selectedRepo && !loading && (
          <div>
            {repos.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666' 
              }}>
                No repositories found. Make sure you have GitHub connected.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => loadRepositoryContents(repo)}
                    style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      border: '1px solid #e1e5e9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '18px', marginRight: '10px' }}>
                        📁
                      </span>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        margin: 0,
                        color: '#24292e'
                      }}>
                        {repo.name}
                      </h3>
                      {repo.private && (
                        <span style={{
                          backgroundColor: '#ffd33d',
                          color: '#735c0f',
                          padding: '2px 6px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                          marginLeft: '10px'
                        }}>
                          Private
                        </span>
                      )}
                    </div>
                    
                    {repo.description && (
                      <p style={{ 
                        color: '#586069', 
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                        lineHeight: '1.4'
                      }}>
                        {repo.description}
                      </p>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#586069',
                      gap: '15px'
                    }}>
                      {repo.language && (
                        <span>🔵 {repo.language}</span>
                      )}
                      <span>⭐ {repo.stars}</span>
                      <span>🍴 {repo.forks}</span>
                      <span>{new Date(repo.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* File Browser */}
        {selectedRepo && !loading && (
          <div>
            {/* Navigation */}
            {currentPath && (
              <button
                onClick={navigateUp}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#f6f8fa',
                  border: '1px solid #d1d9e0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '15px',
                  fontSize: '14px',
                  color: '#24292e'
                }}
              >
                ← Back to parent directory
              </button>
            )}

            {/* File List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {files.map((file) => (
                <div
                  key={file.path}
                  onClick={() => handleFileClick(file)}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #e1e5e9',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f6f8fa'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', marginRight: '10px' }}>
                      {getFileIcon(file)}
                    </span>
                    <span style={{ 
                      fontSize: '14px',
                      color: file.type === 'dir' ? '#0366d6' : '#24292e',
                      fontWeight: file.type === 'dir' ? '500' : 'normal'
                    }}>
                      {file.name}
                    </span>
                  </div>
                  
                  {file.type === 'file' && (
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#586069'
                    }}>
                      {formatFileSize(file.size)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};