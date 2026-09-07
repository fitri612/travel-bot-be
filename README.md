# Travel Bot ✈️🤖

Travel Bot adalah AI-powered travel assistant yang membantu pengguna mendapatkan rekomendasi wisata dan tips liburan dengan bahasa yang santai.

## ✨ Features

* 🤖 AI Travel Assistant menggunakan **Google Gemini**
* 🌤️ Informasi cuaca real-time menggunakan **Open-Meteo**
* ⚡ Weather API timeout maksimal **1.5 detik**
* 🌐 REST API menggunakan **Express.js**
* 🔐 API key menggunakan environment variables

## 🛠️ Tech Stack

* Node.js
* Express.js
* Google Gemini API
* Open-Meteo API
* CORS
* dotenv

## 🚀 Setup

```bash
npm install
```

Buat file `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_URL=https://api.open-meteo.com/v1
PORT=3000
```

Jalankan:

```bash
npm start
```

Server berjalan di `http://localhost:3000`.

## 📡 API

### `POST /api/chat`

Request:

```json
{
  "message": "Rekomendasi wisata di Jakarta dong"
}
```

Response:

```json
{
  "reply": "Tentu! Kamu bisa mengunjungi Kota Tua..."
}
```

## 🔄 Flow

```text
User
 ↓
POST /api/chat
 ↓
Weather API
 ↓
Gemini AI
 ↓
Travel Recommendation
 ↓
User
```
