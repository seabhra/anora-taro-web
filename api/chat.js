export default async function handler(req, res) {
    // 1. Configuração de CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // 2. Resposta para Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Bloqueia métodos que não sejam POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { model, messages, temperature, max_tokens } = req.body;

        // Validação básica de entrada
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'O campo messages é obrigatório e deve ser um array.' });
        }

        // Verificação da Chave de API
        if (!process.env.GROQ_API_KEY) {
            console.error('❌ GROQ_API_KEY não configurada no Vercel');
            return res.status(500).json({ error: 'Configuração do servidor incompleta (API Key).' });
        }

        console.log('📥 Chamando Groq API para Anora Tarô...');

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${process.env.GROQ_API_KEY.trim()}` // trim() evita erros de espaço
            },
            body: JSON.stringify({
                model: model || 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: temperature ?? 0.7, // ?? garante que 0 seja aceito como valor
                max_tokens: max_tokens || 1024
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Erro na Groq API:', data);
            return res.status(response.status).json({
                error: 'Erro na API externa',
                details: data
            });
        }

        console.log('✅ Resposta da IA recebida');
        return res.status(200).json(data);

    } catch (error) {
        console.error('❌ Erro interno:', error.message);
        return res.status(500).json({ 
            error: 'Erro interno no servidor', 
            message: error.message 
        });
    }
} // <--- Chave extra removida aqui

