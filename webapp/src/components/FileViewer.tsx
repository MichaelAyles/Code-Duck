import React, { useState } from 'react';
import { aiService } from '../services/ai';

interface FileViewerProps {
  owner: string;
  repo: string;
  path: string;
  content: string;
  onBack: () => void;
  onShowAIChat: (code: string, language: string, context: string) => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ 
  owner, repo, path, content, onBack, onShowAIChat 
}) => {
  const [analyzing, setAnalyzing] = useState(false);

  const getLanguageFromPath = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cpp': case 'cc': case 'cxx': return 'cpp';
      case 'c': return 'cpp';
      case 'h': case 'hpp': return 'cpp';
      case 'go': return 'go';
      case 'rs': return 'rust';
      case 'php': return 'php';
      case 'rb': return 'ruby';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'xml': return 'xml';
      case 'yaml': case 'yml': return 'yaml';
      default: return 'other';
    }
  };

  const handleAnalyzeWithAI = async () => {
    const language = getLanguageFromPath(path);
    const context = `This is a file from the ${owner}/${repo} repository at path: ${path}`;
    
    setAnalyzing(true);
    try {
      const response = await aiService.explainCode({
        code: content,
        language,
        context
      });
      
      // Show results directly in the file viewer
      setAnalyzing(false);
      onShowAIChat(content, language, context);
    } catch (error) {
      setAnalyzing(false);
      // Fall back to opening AI chat with pre-filled content
      onShowAIChat(content, language, context);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (content: string) => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
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
      default: return '📄';
    }
  };

  const lines = content.split('\n');
  const language = getLanguageFromPath(path);

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
            onClick={onBack}
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
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>
                {getFileIcon(path)}
              </span>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                {path.split('/').pop()}
              </h1>
            </div>
            <p style={{ 
              color: '#666', 
              fontSize: '14px', 
              margin: 0
            }}>
              {owner}/{repo} • {path} • {formatFileSize(content)} • {lines.length} lines
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleAnalyzeWithAI}
            disabled={analyzing}
            style={{
              padding: '10px 16px',
              backgroundColor: analyzing ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: analyzing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {analyzing ? '⏳' : '🤖'} 
            {analyzing ? 'Analyzing...' : 'Explain with AI'}
          </button>
          
          <button
            onClick={copyToClipboard}
            style={{
              padding: '10px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📋 Copy
          </button>
          
          <button
            onClick={downloadFile}
            style={{
              padding: '10px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            💾 Download
          </button>
        </div>

        {/* File Info */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#586069',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Language: {language}</span>
          <span>{lines.length} lines</span>
        </div>

        {/* Code Content */}
        <div style={{
          backgroundColor: '#f6f8fa',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#24292e',
            color: 'white',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {path}
          </div>
          
          <div style={{
            maxHeight: '70vh',
            overflow: 'auto',
            backgroundColor: 'white'
          }}>
            <pre style={{
              margin: 0,
              padding: '16px',
              fontSize: '13px',
              lineHeight: '1.45',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              backgroundColor: 'white',
              color: '#24292e',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              <div style={{ display: 'flex' }}>
                {/* Line numbers */}
                <div style={{
                  color: '#959da5',
                  marginRight: '16px',
                  textAlign: 'right',
                  userSelect: 'none',
                  minWidth: '40px',
                  paddingRight: '8px'
                }}>
                  {lines.map((_, index) => (
                    <div key={index} style={{ height: '21px' }}>
                      {index + 1}
                    </div>
                  ))}
                </div>
                
                {/* Code content */}
                <div style={{ flex: 1 }}>
                  {lines.map((line, index) => (
                    <div key={index} style={{ 
                      height: '21px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {line || ' '}
                    </div>
                  ))}
                </div>
              </div>
            </pre>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#586069',
          textAlign: 'center'
        }}>
          Viewing file from GitHub repository. Use "Explain with AI" to get detailed code analysis.
        </div>
      </div>
    </div>
  );
};