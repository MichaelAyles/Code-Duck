import React, { useState, useEffect } from 'react';
import { aiService, ExplainRequest, ExplainResponse, UsageStats } from '../services/ai';

interface AIChatProps {
  onBack: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ onBack }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState<UsageStats | null>(null);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      const stats = await aiService.getUsage();
      setUsage(stats);
    } catch (err) {
      console.error('Failed to load usage stats:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const request: ExplainRequest = {
        code: code.trim(),
        language,
        context: context.trim() || undefined
      };

      const result = await aiService.explainCode(request);
      setResponse(result);
      
      // Update usage stats
      if (usage) {
        setUsage({
          ...usage,
          requestsToday: usage.requestsToday + 1,
          remainingRequests: result.remainingRequests
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to analyze code. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#666';
    }
  };

  const clearAll = () => {
    setCode('');
    setContext('');
    setResponse(null);
    setError('');
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
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              AI Code Explain
            </h1>
            {usage && (
              <p style={{ 
                color: '#666', 
                fontSize: '14px', 
                margin: '5px 0 0 0'
              }}>
                {usage.remainingRequests} / {usage.dailyLimit} requests remaining today
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              fontSize: '16px'
            }}>
              Code to Analyze
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              required
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px', 
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500'
              }}>
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500'
            }}>
              Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., This is part of a React component..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

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
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '30px'
          }}>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Analyzing...' : 'Explain Code'}
            </button>
            
            {(code || response) && (
              <button
                type="button"
                onClick={clearAll}
                className="btn btn-secondary"
                style={{
                  padding: '14px 20px',
                  fontSize: '16px'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Response */}
        {response && (
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                margin: 0,
                flex: 1
              }}>
                Analysis Result
              </h3>
              <span style={{
                backgroundColor: getComplexityColor(response.complexity),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}>
                {response.complexity} complexity
              </span>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '15px',
              border: '1px solid #e9ecef'
            }}>
              <p style={{ 
                margin: 0, 
                lineHeight: '1.6',
                color: '#333'
              }}>
                {response.explanation}
              </p>
            </div>

            {response.suggestions && response.suggestions.length > 0 && (
              <div>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '10px',
                  color: '#333'
                }}>
                  Suggestions:
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  color: '#555'
                }}>
                  {response.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};