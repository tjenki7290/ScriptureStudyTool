import { useState, useEffect } from 'react';
import { getCrossReferences } from '../utils/api';

export default function CrossRefTab({ verseText, reference }) {
    const [crossref, setCrossref] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      loadCrossRefs();
    }, [verseText, reference]);
  
    async function loadCrossRefs() {
      setLoading(true);
      setError(null);
  
      try {
        const data = await getCrossReferences(verseText, reference);
        setCrossref(data.crossref);
        console.log('✅ Cross references loaded:', data);
      } catch (err) {
        setError(err.message);
        console.error('❌ CrossRef error:', err);
      } finally {
        setLoading(false);
      }
    }
  
    /* -------------------- Loading -------------------- */
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
            <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>🔗</span>
          </div>
          <p style={{
            color: '#8B7355',
            fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
            margin: 0
          }}>
            Gathering Scripture cross-references…
          </p>
        </div>
      );
    }
  
    /* -------------------- Error -------------------- */
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
            onClick={loadCrossRefs}
            style={{
              padding: 'clamp(0.65rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
              backgroundColor: '#8B4545',
              color: '#F5F1E8',
              border: 'none',
              borderRadius: 'clamp(4px, 1vw, 6px)',
              cursor: 'pointer',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              fontWeight: '500'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
  
    /* -------------------- Empty -------------------- */
    if (!crossref || !crossref.crossReferences?.length) {
      return (
        <div style={{
          padding: 'clamp(1.5rem, 4vw, 2rem)',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          color: '#8B7355'
        }}>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>
            No cross-references available.
          </p>
        </div>
      );
    }
  
    /* -------------------- Main Render -------------------- */
    return (
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
      }}>
        {/* Header */}
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
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)'
            }}>
              🔗
            </span>
            Scripture Cross-References for {reference}
          </h3>
  
          <p style={{
            marginTop: '0.75rem',
            color: '#3D3D3D',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
            fontStyle: 'italic'
          }}>
            Theme: {crossref.primaryTheme}
          </p>
        </div>
  
        {/* Cross-Reference Cards */}
        <div style={{
          display: 'grid',
          gap: 'clamp(1.25rem, 3vw, 1.5rem)'
        }}>
          {crossref.crossReferences.map((ref, index) => (
            <div
              key={index}
              style={{
                padding: 'clamp(1.25rem, 3vw, 1.5rem)',
                backgroundColor: '#F5F1E8',
                borderRadius: 'clamp(8px, 2vw, 10px)',
                borderLeft: `5px solid ${['#9CAF88', '#C9A961', '#D4A574'][index % 3]}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h4 style={{
                margin: '0 0 0.5rem 0',
                color: '#8B4545',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                fontWeight: '600'
              }}>
                📖 {ref.reference}
              </h4>
  
              <p style={{
                margin: '0 0 0.5rem 0',
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                color: '#6D5A3C',
                fontWeight: '500'
              }}>
                {ref.type}
              </p>
  
              <p style={{
                margin: 0,
                color: '#3D3D3D',
                fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
                lineHeight: '1.7',
                fontFamily: '"Lora", "Georgia", serif',
                wordBreak: 'break-word'
              }}>
                {ref.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  