//const API_URL = 'http://localhost:3001/api'; --> dev only
const API_URL = '/api'; //production

export async function validateVerse(input) {
  const response = await fetch(`${API_URL}/validate-verse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
}

// explain verse
export async function explainVerse(verseText, reference) {
  const response = await fetch(`${API_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verseText, reference })
  });
  
  return response.json();
}

// Get historical context
export async function getContext(verseText, reference) {
  const response = await fetch(`${API_URL}/context`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verseText, reference })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Get cross references
export async function getCrossReferences(verseText, reference) {
  const response = await fetch(`${API_URL}/crossref`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verseText, reference })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Get YouTube videos
export async function getYoutubeVideos(reference) {
  const response = await fetch(`${API_URL}/youtube`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
  
}

// Get word-by-word translation
export async function getTranslation(verseText, reference, testament) {
  const response = await fetch(`${API_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verseText, reference, testament })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}