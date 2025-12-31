const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// POST /api/youtube
router.post('/youtube', async (req, res) => {
  try {
    const { reference } = req.body;
    
    // Validation
    if (!reference) {
      return res.status(400).json({ 
        error: 'Missing reference' 
      });
    }

    // Check if API key exists
    if (!process.env.YOUTUBE_API_KEY) {
      console.error('YOUTUBE_API_KEY not configured');
      return res.status(500).json({
        error: 'YouTube API key not configured'
      });
    }
    
    console.log(`🎥 Searching YouTube for ${reference}...`);
    
    // Search queries to try
    const queries = [
      `${reference} sermon`,
      `${reference} Bible study`,
      `${reference} explained`
    ];
    
    const allVideos = [];
    
    // Search for each query
    for (const query of queries) {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=4&` +
          `key=${process.env.YOUTUBE_API_KEY}`;
        
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          console.error(`YouTube API error: ${response.status}`);
          continue; // Try next query
        }
        
        const data = await response.json();
        
        if (data.items) {
          data.items.forEach(item => {
            // Check if video already exists (avoid duplicates)
            if (!allVideos.find(v => v.videoId === item.id.videoId)) {
              allVideos.push({
                videoId: item.id.videoId,
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                thumbnail: item.snippet.thumbnails.medium.url,
                publishedAt: item.snippet.publishedAt
              });
            }
          });
        }
      } catch (error) {
        console.error(`Error searching for "${query}":`, error.message);
        // Continue to next query even if this one fails
      }
    }
    
    // Limit to 9 videos total
    const videos = allVideos.slice(0, 9);
    
    console.log(`✅ Found ${videos.length} videos for ${reference}`);
    
    res.json({ 
      reference,
      videos
    });
    
  } catch (error) {
    console.error('YouTube route error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching videos' 
    });
  }
});

module.exports = router;