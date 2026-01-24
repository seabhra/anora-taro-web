
// pages/api/chat.js versão 8


// api/chat.js

export default async function handler(req, res) {
  // 1. Libera CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. POST
  if (req.method === 'POST') {
    try {
      console.log("Corpo recebido do cliente:", req.body);

      // Tenta pegar o texto do campo 'message' OU do campo 'data'
      // Isso corrige o erro se o front-end estiver usando nomes diferentes
      const payload = req.body;
      const userMessage = payload.message || payload.data;

      // Se ainda assim estiver vazio
      if (!userMessage) {
        // Retorna 400 mas com uma mensagem útil
        return res.status(400).json({ 
          error: 'Não consegui achar a mensagem. Campos esperados: "message" ou "data"',
          receivedBody: payload 
        });
      }

      // --- SUCESSO ---
      console.log("Mensagem processada:", userMessage);

      const reply = `🔮 Anora (Conectada): Você disse "${userMessage}". Isso está funcionando!`;

      return res.status(200).json({ reply });

    } catch (error) {
      console.error("Erro no processamento:", error);
      return res.status(500).json({ error: 'Erro interno', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
