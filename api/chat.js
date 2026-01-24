
// pages/api/chat.js versão 7


// Importar o 'response' do vercel/node é opcional, vamos usar o padrão ES6
export default async function handler(req, res) {
	// 1. Liberar CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
	// 2. Preflight (OPTIONS)
	if (req.method === 'OPTIONS') {
	  return res.status(200).end();
	}
  
	// 3. POST
	if (req.method === 'POST') {
	  try {
		const { message } = req.body;
		
		// Lógica Simples (Para testar)
		if (!message) return res.status(400).json({ error: 'Mensagem vazia' });
  
		// Simulação de resposta
		const reply = `🔮 Anora (Vercel Functions): Recebi "${message}"`;
  
		return res.status(200).json({ reply });
  
	  } catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erro no servidor' });
	  }
	}
  
	return res.status(405).json({ error: 'Método não permitido' });
  }