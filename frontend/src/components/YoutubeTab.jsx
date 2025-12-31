import { useState, useEffect } from 'react';
import { getYoutubeVideos } from '../utils/api';

export default function YoutubeTab({ reference }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVideos();
  }, [reference]);

  async function loadVideos() {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getYoutubeVideos(reference);
      setVideos(data.videos);
      console.log('✅ Videos loaded:', data);
    } catch (err) {
      setError(err.message);
      console.error('❌ YouTube error:', err);
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
          Searching for videos...
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
          onClick={loadVideos}
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

  if (!videos || videos.length === 0) {
    return (
      <div style={{
        padding: 'clamp(2rem, 5vw, 3rem)',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        border: '2px dashed #D4A574'
      }}>
        <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          🎥
        </div>
        <p style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
          color: '#8B7355',
          margin: 0
        }}>
          No videos found for {reference}
        </p>
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          color: '#8B8B8B',
          marginTop: '0.5rem'
        }}>
          Try a different verse or check back later
        </p>
      </div>
    );
  }

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
          }}>🎥</span>
          <span style={{ wordBreak: 'break-word' }}>
            Videos about {reference}
          </span>
        </h3>
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
          color: '#8B7355',
          fontStyle: 'italic'
        }}>
          Found {videos.length} video{videos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Video Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'clamp(1rem, 2.5vw, 1.5rem)'
      }}>
        {videos.map((video) => (
          <div
            key={video.videoId}
            style={{
              backgroundColor: '#F5F1E8',
              borderRadius: 'clamp(8px, 2vw, 10px)',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            {/* Thumbnail */}
            <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#DDD' }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Play overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(139, 69, 69, 0.9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#FFFFFF'
              }}>
                ▶
              </div>
            </div>

            {/* Video Info */}
            <div style={{ padding: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
                fontWeight: '600',
                color: '#3D3D3D',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {video.title}
              </h4>
              
              <p style={{
                margin: '0 0 1rem 0',
                fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)',
                color: '#8B7355',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {video.channel}
              </p>

              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#8B4545',
                  color: '#F5F1E8',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#6D3535'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#8B4545'}
              >
                Watch on YouTube →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}