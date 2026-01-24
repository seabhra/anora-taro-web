// pages/api/chat.js

export default async function handler(req, res) {
  // 1. TRATAMENTO DO CORS (Preflight)
  // O navegador manda uma requisição OPTIONS antes para perguntar "Posso mandar um POST?"
	
  if (req.method === 'OPTIONS') {
    // Define quem pode acessar (qualquer origem *)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Define quais métodos são permitidos (GET, POST, OPTIONS)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // Define quais cabeçalhos o cliente pode enviar
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Retorna sucesso 200 para o navegador saber que pode prosseguir
    return res.status(200).end();
  }

  // 2. LÓGICA DO CHAT (Método POST)
  if (req.method === 'POST') {
    // Importante: Também precisamos do header na resposta real
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
      // Pega a mensagem que o front-end enviou
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Mensagem não enviada' });
      }

      // --- AQUI VAI A CHAMADA PARA SUA IA (OpenAI, etc) ---
      // Exemplo simulado:
      // const aiResponse = await fetchOpenAI(message); 
      const respostaDaIA = `A Anora Tarô respondeu para: ${message}`;

      // Retorna o JSON com a resposta
      res.status(200).json({ reply: respostaDaIA });

    } catch (error) {
      console.error('Erro no chat:', error);
      res.status(500).json({ error: 'Erro ao processar o pedido' });
    }
  } else {
    // Se tentar usar GET, PUT, DELETE...
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
