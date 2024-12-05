// pages/api/chatgpt.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        try {
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo', // Switch version here
                messages: [{ role: 'user', content: message }],
            });

            const reply = response.data.choices[0].message.content;
            res.status(200).json({ reply });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching response from OpenAI' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}