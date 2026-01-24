// Função para buscar dados da API de Anora Tarô - Versão 5

// FORÇAR URL DA VERCEL PARA TESTES
// Enquanto você estiver tendo erro 404, use a URL absoluta para garantir
const API_URL = 'https://anora-taro-web.vercel.app/api/chat';

// Função para limpar cache e registrar o que está acontecendo
console.log("[Verificação] API_URL configurada para:", API_URL);

async function askAnora(userMessage) {
  const resultElement = document.getElementById('result');
  if (!resultElement) return;

  resultElement.innerText = "Consultando os astros...";
  resultElement.style.opacity = "0.7";

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: userMessage || "Leitura de tarô",
        messages: [{ role: "user", content: userMessage || "Leitura de tarô" }]
      }),
    });

    // Se não for OK, vamos ver EXATAMENTE o que é (HTML ou texto de erro)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERRO ${response.status}] Conteúdo:`, errorText);
      
      if (errorText.includes("<!DOCTYPE")) {
        throw new Error("O servidor retornou HTML (Página de erro) em vez de JSON.");
      }
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const replyText = data.reply || data.message || data.content || JSON.stringify(data);
    
    resultElement.innerText = replyText;
    resultElement.style.opacity = "1";

  } catch (error) {
    console.error('Erro detalhado:', error);
    resultElement.innerText = "Erro na conexão. Verifique o console do navegador.";
    resultElement.style.opacity = "1";
  }
}
