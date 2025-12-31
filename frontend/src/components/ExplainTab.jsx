import { useState, useEffect } from 'react';
import { explainVerse } from '../utils/api';

export default function ExplainTab({ verseText, reference }) {
  const [bulletPoints, setBulletPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExplanation();
  }, [verseText, reference]); // Reload if verse changes

  async function loadExplanation() {
    setLoading(true);
    setError(null);
    
    try {
      const data = await explainVerse(verseText, reference);
      setBulletPoints(data.bulletPoints);
      console.log('✅ Explanation loaded:', data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Explanation error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>🔄 Generating explanation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#ffebee',
        color: '#c62828',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <strong>❌ Error:</strong> {error}
        <button 
          onClick={loadExplanation}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!bulletPoints || bulletPoints.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <p>No explanation available.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px', color: 'black'}}>📖 Explanation of {reference}</h3>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        lineHeight: '1.8',
        color: 'black',
      }}>
        {bulletPoints.map((point, index) => (
          <li 
            key={index}
            style={{
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              borderLeft: '4px solid #4CAF50'
            }}
          >
            <strong>{index + 1}.</strong> {point}
          </li>
        ))}
      </ul>
    </div>
  );
}