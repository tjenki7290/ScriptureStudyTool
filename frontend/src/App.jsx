import { useState } from 'react';
import VerseInput from './components/VerseInput';
import TabNavigation from './components/TabNavigation';
import ExplainTab from './components/ExplainTab';
import ContextTab from './components/ContextTab';
import CrossRefTab from './components/CrossRefTab';
import YoutubeTab from './components/YoutubeTab';
import TranslateTab from './components/TranslateTab';

function App() {
  const [verseData, setVerseData] = useState(null);
  const [activeTab, setActiveTab] = useState('explain');

  function handleVerseSubmit(data) {
    setVerseData(data);
    setActiveTab('explain');
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',          // ✅ full viewport background
      overflowX: 'hidden',     // ✅ no horizontal scroll
      backgroundColor: '#F5F1E8',
      fontFamily: '"Georgia", "Garamond", serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#8B4545',
        color: '#F5F1E8',
        padding: '2rem 1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', // ← Added max-width
          margin: '0 auto', // ← Centers the header
          textAlign: 'center',
          padding: '0 1rem'
        }}>
          <h1 style={{ 
            margin: 0,
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            📖 Scripture Study
          </h1>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            opacity: 0.9,
            fontStyle: 'italic'
          }}>
            Explore the deeper meaning of God's Word
          </p>
        </div>
      </header>

      {/* Main Content - Centered Container */}
      <main style={{ 
        maxWidth: '1200px', // ← Max width for content
        width: '100%',
        margin: '0 auto', // ← Centers the content
        padding: '0 clamp(1rem, 3vw, 3rem) 3rem clamp(1rem, 3vw, 3rem)'
      }}>
        {/* Verse Input */}
        <VerseInput onVerseSubmit={handleVerseSubmit} />
        
        {/* Display verse and tabs if verse is loaded */}
        {verseData && (
          <>
            {/* Verse Display Card */}
            <div style={{
              padding: '2rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              marginBottom: '2rem',
              borderLeft: '6px solid #C9A961',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
            }}>
              <h2 style={{ 
                marginTop: 0,
                color: '#8B4545',
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                fontWeight: '600'
              }}>
                {verseData.reference}
              </h2>
              <p style={{ 
                fontStyle: 'italic', 
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                lineHeight: '1.8',
                color: '#3D3D3D',
                margin: '1rem 0',
                fontFamily: '"Crimson Text", "Georgia", serif'
              }}>
                "{verseData.verseText}"
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#8B8B8B',
                margin: '1rem 0 0 0',
                borderTop: '1px solid #E5E5E5',
                paddingTop: '1rem'
              }}>
                {verseData.copyright}
              </p>
            </div>

            {/* Tab Navigation */}
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div>
              {activeTab === 'explain' && (
                <ExplainTab 
                  verseText={verseData.verseText}
                  reference={verseData.reference}
                />
              )}
              
              {activeTab === 'context' && (
              <ContextTab 
              verseText={verseData.verseText}
              reference={verseData.reference}
              />
              )}
              
              {activeTab === 'crossref' && (
              <CrossRefTab 
              verseText={verseData.verseText}
              reference={verseData.reference}
              />
              )}
              
              {activeTab === 'youtube' && (
              <YoutubeTab 
              reference={verseData.reference}
              />
              )}
              
              {activeTab === 'translate' && (
               <TranslateTab
               verseText={verseData.verseText}
               reference={verseData.reference}
               testament={verseData.testament}               />
              )}
            </div>
          </>
        )}
        
        {/* Welcome Message */}
        {!verseData && (
        <div style={{
        width: '100%',              // ← key fix
        padding: '4rem 2rem',
        textAlign: 'center',
        color: '#8B7355',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '2px dashed #D4A574'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
            <p style={{ 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              margin: 0,
              color: '#5D5D5D'
            }}>
              Enter a Bible verse above to begin your study
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;