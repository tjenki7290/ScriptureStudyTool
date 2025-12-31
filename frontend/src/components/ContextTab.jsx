import { useState, useEffect } from 'react';
import { getContext } from '../utils/api';

export default function ContextTab({ verseText, reference }) {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContext();
  }, [verseText, reference]);

  async function loadContext() {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getContext(verseText, reference);
      setContext(data.context);
      console.log('✅ Context loaded:', data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Context error:', err);
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
          Loading historical context...
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
          onClick={loadContext}
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

  if (!context) {
    return (
      <div style={{ 
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        color: '#8B7355'
      }}>
        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>
          No context available.
        </p>
      </div>
    );
  }

  const sections = [
    { title: 'Author', content: context.author, icon: '✍️' },
    { title: 'Audience', content: context.audience, icon: '👥' },
    { title: 'Date Written', content: context.dateWritten, icon: '📅' },
    { title: 'Geographical Context', content: context.geographicalContext, icon: '🗺️' },
    { title: 'Political Context', content: context.politicalContext, icon: '⚖️' },
    { title: 'Cultural Context', content: context.culturalContext, icon: '🏛️' },
    { title: 'Literary Context', content: context.literaryContext, icon: '📚' }
  ];

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
          }}>📜</span>
          <span style={{ wordBreak: 'break-word' }}>
            Historical Context of {reference}
          </span>
        </h3>
      </div>

      {/* Context Sections */}
      <div style={{
        display: 'grid',
        gap: 'clamp(1.25rem, 3vw, 1.5rem)'
      }}>
        {sections.map((section, index) => (
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
              margin: '0 0 0.75rem 0',
              color: '#8B4545',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)' }}>
                {section.icon}
              </span>
              {section.title}
            </h4>
            <p style={{
              margin: 0,
              color: '#3D3D3D',
              fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
              lineHeight: '1.7',
              fontFamily: '"Lora", "Georgia", serif',
              wordBreak: 'break-word'
            }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}