import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

const BASE_SYSTEM_INSTRUCTION = `
Kamu adalah seorang Travel Assistant yang ramah dan membantu.
Berikan rekomendasi tempat wisata dan tips liburan dengan bahasa santai.
`;

// Helper untuk fetch cuaca dengan TIMEOUT maksimal 1.5 detik
async function fetchWeatherWithTimeout() {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 1500); // Batas waktu 1.5 detik

	try {
		const baseUrl = process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1';
		const weatherRes = await fetch(`${baseUrl}/forecast?latitude=-6.2088&longitude=106.8456&current_weather=true`, { signal: controller.signal });
		clearTimeout(timeoutId);

		const weatherData = await weatherRes.json();
		const temp = weatherData.current_weather?.temperature;

		if (temp !== undefined) {
			return `Suhu terkini di area tujuan utama (Jakarta & sekitarnya) adalah ${temp}°C.`;
		}
	} catch (err) {
		console.warn('Weather API timeout atau gagal, dilewati...');
	} finally {
		clearTimeout(timeoutId);
	}

	return 'Data cuaca tidak tersedia saat ini.';
}

app.post('/api/chat', async (req, res) => {
	try {
		const { message } = req.body;

		if (!message || typeof message !== 'string') {
			return res.status(400).json({
				error: 'Message is required.',
			});
		}

		// 1. Ambil data cuaca (maksimal ditunggu 1.5 detik)
		const weatherInfo = await fetchWeatherWithTimeout();

		// 2. Gabungkan System Instruction
		const dynamicSystemInstruction = `
            ${BASE_SYSTEM_INSTRUCTION}
            
            [Informasi Real-time Eksternal]
            ${weatherInfo}
            Gunakan data suhu di atas jika pengguna bertanya tentang kondisi cuaca atau tips liburan hari ini.
        `;

		// 3. Panggil Gemini dengan model cepat & resmi
		const response = await ai.models.generateContent({
			model: 'gemini-3.6-flash',
			contents: message,
			config: {
				systemInstruction: dynamicSystemInstruction,
			},
		});

		res.json({
			reply: response.text,
		});
	} catch (error) {
		console.error('Gemini API Error:', error);

		res.status(500).json({
			error: 'Gagal memproses permintaan.',
		});
	}
});

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});

server.on('error', (error) => {
	console.error('SERVER ERROR:', error);
});

server.on('close', () => {
	console.log('SERVER CLOSED');
});
