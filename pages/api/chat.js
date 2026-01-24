
// pages/api/chat.js versão 6

export default async function handler(req, res) {
  // 1. Libera CORS para qualquer origem (Resolve seu erro de bloqueio)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Se o navegador só estiver perguntando se pode acessar (Preflight), diz SIM
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Se for um pedido de POST (enviar mensagem)
  if (req.method === 'POST') {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Mensagem vazia' });
      }

      console.log("Recebido:", message);

      // --- SIMULAÇÃO DE RESPOSTA (Para garantir que o servidor não caia) ---
      // Quando sua API estiver pronta, substitua o trecho abaixo pela chamada real
      const respostaSimulada = `🔮 Anora: Sua mensagem foi "${message}". (Servidor funcionando!)`;

      return res.status(200).json({ reply: respostaSimulada });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }

  // Se tentar outro método que não seja POST
  return res.status(405).json({ error: 'Método não permitido' });
}
