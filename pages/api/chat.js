// pages/api/chat.js - VERSÃO 5 Anora Tarô com Cors + reasoning oculto
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'O campo "messages" é obrigatório e deve ser um array.' });
    }

    console.log('📥 Requisição recebida da Groq API:', messages.length, 'mensagens');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        reasoning_format: 'hidden'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API da Groq:', errorData);
      return res.status(response.status).json({
        error: `Erro Groq: ${errorData.error?.message || response.statusText}`
      });
    }

    const data = await response.json();
    console.log('✅ Resposta enviada com sucesso');
    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Erro interno no servidor:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
