

// pages/api/chat.js



// pages/api/chat.js


export default async function handler(req, res) {
  // 1. Configuração de CORS (Necessário para o localhost funcionar)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Libera acesso de qualquer lugar
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Responder imediatamente se for apenas uma verificação (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Tratamento do POST (Onde acontece a mágica)
  if (req.method === 'POST') {
    try {
      // Verificação de segurança básica
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Por favor, envie uma mensagem.' });
      }

      // --- AQUI VAI A LÓGICA DA SUA IA ---
      // NOTA IMPORTANTE:
      // Se você não configurou a chave da API da OpenAI nas Variáveis de Ambiente da Vercel,
      // o código vai quebrar aqui. Para evitar o erro 503 enquanto testa,
      // vamos simular uma resposta abaixo.
      
      console.log("Mensagem recebida:", message);

      // Descomente o código abaixo quando tiver a API Key configurada na Vercel:
      /*
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("API Key não encontrada na Vercel");
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: message }]
          })
      });
      const data = await response.json();
      const reply = data.choices[0].message.content;
      */

      // RESPOSTA SIMULADA (Para funcionar agora mesmo sem quebrar):
      const reply = `🔮 Anora Tarô diz: Recebi sua mensagem "${message}". (Nota: Esta é uma resposta simulada porque a API Key real provavelmente não está configurada no painel da Vercel ou o código anterior quebrou. O servidor não travou mais!)`;

      return res.status(200).json({ reply: reply });

    } catch (error) {
      console.error('Erro capturado no servidor:', error);
      // Em vez de travar (503), enviamos um JSON com o erro detalhado
      return res.status(500).json({ 
        error: 'Erro interno no servidor (tratado)', 
        details: error.message 
      });
    }
  } else {
    // Se não for POST nem OPTIONS
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
