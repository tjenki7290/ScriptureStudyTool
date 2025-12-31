import { useState } from 'react';
import { validateVerse } from '../utils/api';

export default function TestConnection() {
  const [input, setInput] = useState('John 3:16');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await validateVerse(input);
      setResult(data);
      console.log('✅ Success:', data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Test Backend Connection</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter verse (e.g., John 3:16)"
          style={{
            padding: '10px',
            width: '300px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={handleTest}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {loading && (
        <div style={{ color: 'blue' }}>
          🔄 Loading...
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <h3>✅ Connection Successful!</h3>
          <div style={{ marginTop: '10px' }}>
            <strong>Reference:</strong> {result.reference}
          </div>
          <div style={{ marginTop: '10px' }}>
            <strong>Verse Text:</strong>
            <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
              "{result.verseText}"
            </p>
          </div>
          <div style={{ marginTop: '10px' }}>
            <strong>Book:</strong> {result.book} | 
            <strong> Chapter:</strong> {result.chapter} | 
            <strong> Verse:</strong> {result.verse}
          </div>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', color: '#1976d2' }}>
              Show full response (click to expand)
            </summary>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}