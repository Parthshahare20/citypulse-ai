# CityPulse AI 🏙️✨

> **Spatial City Navigation, Cultural Landmarks, Temples, Mega Malls & Citizen Hazard Radar**

CityPulse AI is a modern urban intelligence platform built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Leaflet**, and **Google Gemini AI**. It provides rich cultural and commercial discovery across Pune (including Talegaon Dabhade & Maval), Mumbai, Tokyo, London, and San Francisco.

---

## 🌟 Key Features

- **Temples & Spiritual Sanctuaries**:
  - Detailed guides, darshan timings, peak hours, and architectural history for iconic temples like *Dagdusheth Halwai Ganpati*, *Kasba Ganpati*, *Sarasbaug*, *Parvati Temple*, and *Birla Ganpati Somatane*.
- **Mega Malls & Retail Hubs**:
  - Footfalls, store counts, entertainment options, and parking for *Phoenix Marketcity Viman Nagar*, *Phoenix Mall of the Millennium Wakad*, *Amanora Mall*, *Seasons Mall*, and *The Pavilion*.
- **Talegaon & Maval Exploration**:
  - Dedicated spotlight on *Induri Fort (1720 CE)*, *MCA International Cricket Stadium (Gahunje)*, *Japalouppe Equestrian Centre*, and the scenic Urse/Somatane corridor.
- **Interactive Spatial Map (Leaflet + OpenStreetMap & CARTO)**:
  - 100% free with zero API key requirements.
  - Interactive landmark pins, category filtering, citizen hazard radar, and safe corridor vs direct transit overlays.
- **AI City Copilot (Google Gemini)**:
  - Powered by `@google/genai` (`gemini-3.8-flash`) to answer real-time questions regarding traffic, accessibility, itineraries, and local trivia.
- **Atmosphere Visual Customizer**:
  - Switch dynamically between *Sunset Dunes (Warm Amber)* and *Cosmic Aurora (Cyan Neon)* glassmorphism themes.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Lucide React, Motion
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), CSS Glassmorphism
- **Maps**: Leaflet + OpenStreetMap & CARTO Voyager Tiles
- **Backend / API**: Node.js, Express, tsx (`server.ts`)
- **AI / LLM**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`)
- **Bundler**: Vite 8

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Parthshahare20/citypulse-ai.git
cd citypulse-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
*(Optional: Add your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) to enable live AI responses).*

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📄 License
MIT License.
