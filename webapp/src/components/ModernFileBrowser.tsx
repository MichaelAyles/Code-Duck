import React, { useState, useEffect } from 'react';
import { githubService } from '../services/github';

interface ModernFileBrowserProps {
  repo: any;
  onOpenFile: (owner: string, repo: string, path: string, content: string) => void;
  onBack: () => void;
}

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  download_url?: string;
}

export const ModernFileBrowser: React.FC<ModernFileBrowserProps> = ({ 
  repo, 
  onOpenFile, 
  onBack 
}) => {
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRepositoryContents('');
  }, [repo]);

  const loadRepositoryContents = async (path: string = '') => {
    setLoading(true);
    setError('');
    try {
      const contents = await githubService.getRepositoryContents(
        repo.fullName.split('/')[0], 
        repo.fullName.split('/')[1], 
        path
      );
      
      const fileList = Array.isArray(contents) ? contents : [contents];
      setFiles(fileList.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type === 'dir' ? 'dir' : 'file',
        size: item.size,
        download_url: item.download_url
      })));
      
      setCurrentPath(path);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load repository contents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (file: FileItem) => {
    if (file.type === 'dir') {
      loadRepositoryContents(file.path);
    } else {
      if (file.download_url && file.size && file.size < 100000) {
        try {
          setLoading(true);
          const response = await fetch(file.download_url);
          const content = await response.text();
          onOpenFile(
            repo.fullName.split('/')[0],
            repo.fullName.split('/')[1], 
            file.path,
            content
          );
        } catch (err) {
          setError('Failed to load file content');
        } finally {
          setLoading(false);
        }
      } else {
        setError('File too large or unavailable for viewing (max 100KB)');
      }
    }
  };

  const navigateUp = () => {
    if (currentPath) {
      const parentPath = currentPath.split('/').slice(0, -1).join('/');
      loadRepositoryContents(parentPath);
    }
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
      case 'pdf': return '📕';
      case 'zip': case 'tar': case 'gz': return '📦';
      default: return '📄';
    }
  };

  const getBreadcrumbs = () => {
    if (!currentPath) return ['Root'];
    return ['Root', ...currentPath.split('/')];
  };

  const canViewFile = (file: FileItem) => {
    if (file.type === 'dir') return true;
    if (!file.size) return false;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    const textFiles = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'html', 'css', 'json', 'md', 'txt', 'yml', 'yaml', 'xml', 'go', 'rs', 'php', 'rb'];
    
    return file.size < 100000 && textFiles.includes(ext || '');
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
            marginBottom: 'var(--space-3)' 
          }}>
            <button
              onClick={onBack}
              className="btn btn-ghost btn-sm"
              style={{ marginRight: 'var(--space-2)' }}
            >
              ← Dashboard
            </button>
            <div>
              <h1 className="text-xl font-semibold" style={{ margin: 0 }}>
                {repo.name}
              </h1>
              <p className="text-sm text-gray" style={{ margin: 0 }}>
                {repo.description || 'No description'}
              </p>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="breadcrumb">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                <span 
                  className={index === getBreadcrumbs().length - 1 ? '' : 'breadcrumb-item'}
                  onClick={() => {
                    if (index === 0) {
                      loadRepositoryContents('');
                    } else if (index < getBreadcrumbs().length - 1) {
                      const pathParts = currentPath.split('/').slice(0, index);
                      loadRepositoryContents(pathParts.join('/'));
                    }
                  }}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading files...</p>
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
                Error loading files
              </div>
              <div style={{ fontSize: '0.875rem' }}>{error}</div>
              <button 
                onClick={() => loadRepositoryContents(currentPath)}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'var(--space-3)' }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* File List */}
        {!loading && !error && (
          <div className="file-browser">
            {/* Back button for nested directories */}
            {currentPath && (
              <div className="file-item" onClick={navigateUp}>
                <div className="file-icon">↩️</div>
                <div className="file-details">
                  <div className="file-name">.. (Go back)</div>
                  <div className="file-meta">Parent directory</div>
                </div>
              </div>
            )}

            {/* Files and directories */}
            <div className="file-list">
              {files.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📁</div>
                  <h3 style={{ margin: '0 0 var(--space-2) 0' }}>
                    Empty directory
                  </h3>
                  <p style={{ margin: 0, color: 'var(--gray-500)' }}>
                    This directory contains no files
                  </p>
                </div>
              ) : (
                files.map((file) => (
                  <div 
                    key={file.path}
                    className={`file-item ${canViewFile(file) ? '' : 'opacity-50'}`}
                    onClick={() => canViewFile(file) && handleFileClick(file)}
                    style={{
                      cursor: canViewFile(file) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <div className="file-icon">{getFileIcon(file)}</div>
                    <div className="file-details">
                      <div className="file-name">
                        {file.name}
                        {!canViewFile(file) && file.type === 'file' && (
                          <span style={{ 
                            marginLeft: 'var(--space-2)',
                            fontSize: '0.75rem',
                            color: 'var(--gray-400)'
                          }}>
                            (Cannot preview)
                          </span>
                        )}
                      </div>
                      <div className="file-meta">
                        {file.type === 'file' ? formatFileSize(file.size) : 'Directory'}
                      </div>
                    </div>
                    
                    {canViewFile(file) && file.type === 'file' && (
                      <div style={{ 
                        color: 'var(--gray-400)',
                        fontSize: '1.25rem'
                      }}>
                        →
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};