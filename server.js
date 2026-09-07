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

app.post('/api/chat', async (req, res) => {
	try {
		const { message } = req.body;

		if (!message || typeof message !== 'string') {
			return res.status(400).json({
				error: 'Message is required.',
			});
		}

		// 1. Integrasi API Eksternal (Data Cuaca Real-Time)
		let weatherInfo = 'Data cuaca tidak tersedia saat ini.';
		try {
			const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current_weather=true');
			const weatherData = await weatherRes.json();
			const temp = weatherData.current_weather?.temperature;

			if (temp !== undefined) {
				weatherInfo = `Suhu terkini di area tujuan utama (Jakarta & sekitarnya) adalah ${temp}°C.`;
			}
		} catch (weatherErr) {
			console.warn('Gagal mengambil data cuaca eksternal:', weatherErr);
		}

		// 2. Gabungkan data cuaca eksternal ke System Instruction
		const dynamicSystemInstruction = `
            ${BASE_SYSTEM_INSTRUCTION}
            
            [Informasi Real-time Eksternal]
            ${weatherInfo}
            Gunakan data suhu di atas jika pengguna bertanya tentang kondisi cuaca atau tips liburan hari ini.
        `;

		// 3. Panggil API Gemini dengan model resmi
		const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
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
