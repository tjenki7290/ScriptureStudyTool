# 📖 Scripture Study Tool

A full-stack Bible study application that provides AI-powered analysis, historical context, cross-references, and original language translations.

## ✨ Features

- **Explain Tab**: AI-generated 5-point explanations of verses
- **Context Tab**: Historical, cultural, and literary background
- **Cross References Tab**: Related verses and thematic connections
- **Videos Tab**: Curated YouTube sermons and Bible studies
- **Translate Tab**: Word-by-word Greek/Hebrew analysis with Strong's numbers

## 🚀 Live Demo

https://scripturestudytool.onrender.com

## 🛠️ Tech Stack

**Frontend:**
- React with Vite
- Custom CSS (warm color palette using 60-30-10 rule)
- Responsive design

**Backend:**
- Node.js + Express
- OpenAI GPT-4 for AI analysis
- ESV Bible API for verse text
- YouTube Data API v3 for videos
- In-memory caching for performance

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/scripture-study.git
cd scripture-study
```

2. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Set up environment variables

Create `server/.env`:
```
OPENAI_API_KEY=your_key_here
ESV_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
PORT=3001
```

4. Run the application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🎨 Design Decisions

- **Color Palette**: Warm, earthy tones (cream, terracotta, burgundy) for a contemplative reading experience
- **Tab Navigation**: Single-page interface for quick switching between analysis types
- **Caching Strategy**: In-memory cache reduces API costs and improves response times
- **AI Prompting**: Structured prompts ensure consistent, parseable output from GPT-4

## 📝 API Usage

This project uses several APIs:
- **OpenAI API** - GPT-4 for explanations, context, translations (~$0.03 per verse)
- **ESV Bible API** - Free for non-commercial use
- **YouTube Data API v3** - Free (10,000 units/day quota)

## 🔮 Future Enhancements

- [ ] User accounts to save favorite verses
- [ ] Compare multiple translations side-by-side
- [ ] Audio Bible integration
- [ ] Study plan creation
- [ ] Share verse insights on social media

## 📄 License

MIT

---

Built with ❤️ for Bible study enthusiasts
