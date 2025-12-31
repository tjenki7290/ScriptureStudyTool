export default function TabNavigation({ activeTab, onTabChange }) {
    const tabs = [
      { id: 'explain', label: '📖 Explain' },
      { id: 'context', label: '📜 Context' },
      { id: 'crossref', label: '🔗 Cross References' },
      { id: 'youtube', label: '🎥 Videos' },
      { id: 'translate', label: '🔤 Original Text' }
    ];
  
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center', // ← Centers the tabs
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #D4A574',
        overflowX: 'auto',
        paddingBottom: '0',
        flexWrap: 'wrap' // ← Allows tabs to wrap on small screens
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: activeTab === tab.id ? '#8B4545' : 'transparent',
              color: activeTab === tab.id ? '#F5F1E8' : '#8B4545',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #8B4545' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              fontWeight: activeTab === tab.id ? '600' : '500',
              fontFamily: '"Georgia", serif',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              borderRadius: '8px 8px 0 0'
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = '#F5F1E8';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }