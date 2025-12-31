import { useState } from 'react';
import { validateVerse } from '../utils/api';

export default function VerseInput({ onVerseSubmit }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await validateVerse(input);
      
      if (data.valid) {
        // Pass the complete verse data up to parent
        onVerseSubmit(data);
        console.log('✅ Verse validated:', data);
        setInput(''); // Clear input after successful submission
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to validate verse');
      console.error('❌ Validation error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      border: '2px solid #D4A574' // 30% - Terracotta border
    }}>
      <h2 style={{ 
        marginTop: 0,
        marginBottom: '1.5rem',
        color: '#8B4545', // Burgundy
        fontSize: '1.5rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span style={{
          backgroundColor: '#F5F1E8',
          padding: '0.5rem',
          borderRadius: '8px',
          fontSize: '1.5rem'
        }}>🔍</span>
        Enter a Bible Verse
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g., "John 3:16" or "Romans 8:28-30"'
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1.1rem',
              border: error ? '2px solid #D4756B' : '2px solid #D4A574',
              borderRadius: '8px',
              outline: 'none',
              backgroundColor: loading ? '#F5F5F5' : '#FEFEFE',
              color: '#3D3D3D',
              fontFamily: '"Georgia", serif',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = '#8B4545';
              e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 69, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? '#D4756B' : '#D4A574';
              e.target.style.boxShadow = 'none';
            }}
          />
          {error && (
            <p style={{
              color: '#8B4545',
              fontSize: '0.95rem',
              marginTop: '0.75rem',
              marginBottom: 0,
              padding: '0.75rem',
              backgroundColor: '#FFF5F5',
              borderRadius: '6px',
              borderLeft: '4px solid #D4756B'
            }}>
              ⚠️ {error}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: loading || !input.trim() ? '#D4D4D4' : '#8B4545',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontFamily: '"Georgia", serif',
            transition: 'background-color 0.2s, transform 0.1s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            alignSelf: 'flex-start'
          }}
          onMouseOver={(e) => {
            if (!loading && input.trim()) {
              e.target.style.backgroundColor = '#6D3535';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading && input.trim()) {
              e.target.style.backgroundColor = '#8B4545';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }
          }}
        >
          {loading ? (
            <>⏳ Loading...</>
          ) : (
            <>📖 Study This Verse</>
          )}
        </button>
      </form>
      
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#F5F1E8',
        borderRadius: '8px',
        borderLeft: '4px solid #9CAF88' // Sage green accent
      }}>
        <p style={{
          fontSize: '0.95rem',
          color: '#5D5D5D',
          margin: 0,
          lineHeight: '1.6'
        }}>
          <strong style={{ color: '#8B4545' }}>Examples:</strong> John 3:16 · Psalm 23:1 · Romans 8:28-30 · Genesis 1:1-3
        </p>
      </div>
    </div>
  );
}