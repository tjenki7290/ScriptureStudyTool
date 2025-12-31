import { useState, useEffect } from 'react';
import { getTranslation } from '../utils/api';

export default function TranslateTab({ verseText, reference, testament }) {
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTranslation();
  }, [verseText, reference, testament]);

  async function loadTranslation() {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTranslation(verseText, reference, testament);
      setTranslation(data.translation);
      console.log('✅ Translation loaded:', data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Translation error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: 'clamp(2rem, 5vw, 3rem)',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
      }}>
        <div style={{
          display: 'inline-block',
          padding: 'clamp(1rem, 3vw, 1.5rem)',
          backgroundColor: '#F5F1E8',
          borderRadius: '50%',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>⏳</span>
        </div>
        <p style={{
          color: '#8B7355',
          fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
          margin: 0
        }}>
          Analyzing original text...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        backgroundColor: '#FFF5F5',
        color: '#8B4545',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        border: '2px solid #D4A574',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: 'clamp(1rem, 2.2vw, 1.1rem)' }}>⚠️ Error:</strong>
          <p style={{ 
            margin: '0.5rem 0 0 0',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            wordBreak: 'break-word'
          }}>
            {error}
          </p>
        </div>
        <button 
          onClick={loadTranslation}
          style={{
            padding: 'clamp(0.65rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
            backgroundColor: '#8B4545',
            color: '#F5F1E8',
            border: 'none',
            borderRadius: 'clamp(4px, 1vw, 6px)',
            cursor: 'pointer',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#6D3535'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#8B4545'}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!translation) {
    return (
      <div style={{ 
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        color: '#8B7355'
      }}>
        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>
          No translation available.
        </p>
      </div>
    );
  }

  const language = testament === 'NT' ? 'Greek' : 'Hebrew';

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(1.5rem, 4vw, 2rem)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
    }}>
      {/* Section Header */}
      <div style={{
        marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        paddingBottom: 'clamp(0.75rem, 2vw, 1rem)',
        borderBottom: '3px solid #D4A574'
      }}>
        <h3 style={{ 
          margin: 0,
          color: '#8B4545',
          fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 2vw, 0.75rem)',
          flexWrap: 'wrap'
        }}>
          <span style={{
            backgroundColor: '#F5F1E8',
            padding: 'clamp(0.4rem, 1.5vw, 0.5rem)',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            display: 'inline-flex',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)'
          }}>🔤</span>
          <span style={{ wordBreak: 'break-word' }}>
            Original Text - {reference}
          </span>
        </h3>
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
          color: '#8B7355',
          fontStyle: 'italic'
        }}>
          Word-by-word {language} analysis
        </p>
      </div>

      {/* Original Text Display */}
      <div style={{
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        backgroundColor: '#F5F1E8',
        borderRadius: 'clamp(8px, 2vw, 10px)',
        marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        borderLeft: '5px solid #C9A961'
      }}>
        <h4 style={{
          margin: '0 0 0.75rem 0',
          color: '#8B4545',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: '600'
        }}>
          Original {language} Text:
        </h4>
        <p style={{
          margin: 0,
          fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
          lineHeight: '1.8',
          fontFamily: 'serif',
          color: '#3D3D3D',
          direction: testament === 'OT' ? 'rtl' : 'ltr'
        }}>
          {translation.originalText}
        </p>
      </div>

      {/* Word-by-Word Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#8B4545', color: '#F5F1E8' }}>
              <th style={{
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                borderBottom: '2px solid #D4A574'
              }}>
                {language}
              </th>
              <th style={{
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                borderBottom: '2px solid #D4A574'
              }}>
                Transliteration
              </th>
              <th style={{
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                borderBottom: '2px solid #D4A574'
              }}>
                Strong's
              </th>
              <th style={{
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                borderBottom: '2px solid #D4A574'
              }}>
                Meaning
              </th>
              <th style={{
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                borderBottom: '2px solid #D4A574'
              }}>
                Grammar
              </th>
            </tr>
          </thead>
          <tbody>
            {translation.words.map((word, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F5F1E8',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF9E6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F5F1E8';
                }}
              >
                <td style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  borderBottom: '1px solid #E5E5E5',
                  fontFamily: 'serif',
                  fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                  color: '#3D3D3D'
                }}>
                  {word.original}
                </td>
                <td style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  borderBottom: '1px solid #E5E5E5',
                  fontStyle: 'italic',
                  color: '#5D5D5D'
                }}>
                  {word.transliteration}
                </td>
                <td style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  borderBottom: '1px solid #E5E5E5',
                  fontFamily: 'monospace',
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.85rem)',
                  color: '#8B4545',
                  fontWeight: '500'
                }}>
                  {word.strongs}
                </td>
                <td style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  borderBottom: '1px solid #E5E5E5',
                  color: '#3D3D3D',
                  fontWeight: '500'
                }}>
                  {word.meaning}
                </td>
                <td style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  borderBottom: '1px solid #E5E5E5',
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.85rem)',
                  color: '#8B7355'
                }}>
                  {word.grammar}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 'clamp(1.5rem, 3vw, 2rem)',
        padding: 'clamp(1rem, 2.5vw, 1.25rem)',
        backgroundColor: '#FFF9E6',
        borderRadius: 'clamp(6px, 1.5vw, 8px)',
        borderLeft: '4px solid #C9A961'
      }}>
        <p style={{
          margin: 0,
          fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)',
          color: '#8B7355',
          lineHeight: '1.6'
        }}>
          ⚠️ <strong>Note:</strong> Translation data is AI-generated and may contain inaccuracies. 
          For critical study, verify with scholarly resources like Blue Letter Bible, interlinear Bibles, 
          or lexicons.
        </p>
      </div>
    </div>
  );
}