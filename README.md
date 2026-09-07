# Travel Bot ✈️🤖

Travel Bot adalah AI-powered travel assistant yang membantu pengguna mendapatkan rekomendasi wisata dan tips liburan dengan bahasa yang santai.
<img width="830" height="696" alt="Screenshot 2026-09-07 at 14 51 32" src="https://github.com/user-attachments/assets/91fa7487-7c4d-4495-8f7e-f0b374cb863b" />

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
