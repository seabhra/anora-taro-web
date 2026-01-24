// Função para buscar dados da API de Anora Tarô - Versão Sustentável 4.0

// 1. Detecção Inteligente de Ambiente
// Isso resolve o erro 404 no Localhost e o erro de CORS na Vercel
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_URL = isLocal 
  ? 'https://anora-taro-web.vercel.app/api/chat' 
  : '/api/chat';

// Função unificada para buscar/enviar dados (Chat com a IA)
async function askAnora(userMessage) {
  const resultElement = document.getElementById('result');
  
  if (!resultElement) {
    console.error("Erro: Elemento com ID 'result' não encontrado no HTML.");
    return;
  }

  // Feedback visual inicial
  resultElement.innerText = "Consultando os astros e as cartas...";
  resultElement.style.opacity = "0.7";

  try {
    console.log(`[App] Chamando API em: ${API_URL}`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enviamos múltiplos formatos para garantir compatibilidade com o backend
      body: JSON.stringify({ 
        message: userMessage || "Faça uma leitura de tarô para mim.",
        messages: [{ role: "user", content: userMessage || "Faça uma leitura de tarô para mim." }]
      }),
    });

    // 2. Tratamento de Erros de Resposta (Essencial para diagnosticar o erro 400)
    if (!response.ok) {
      // Tenta ler o texto bruto do erro para entender o que o servidor rejeitou
      const errorDetail = await response.text(); 
      console.error(`[Servidor] Erro ${response.status}:`, errorDetail);
      
      // Se o erro for 404 e estiver no localhost, o problema é o endpoint
      if (response.status === 404 && isLocal) {
        throw new Error("API não encontrada no localhost. Verifique se o backend está rodando.");
      }
      
      throw new Error(`Servidor respondeu com ${response.status}`);
    }

    // 3. Processamento do JSON
    const data = await response.json();
    console.log('[App] Sucesso:', data);
    
    // Mapeamento flexível de campos da resposta
    const replyText = data.reply || 
                      data.message || 
                      data.content || 
                      (data.choices && data.choices[0].message.content) || 
                      JSON.stringify(data);
    
    resultElement.innerText = replyText;
    resultElement.style.opacity = "1";

  } catch (error) {
    console.error('Erro ao chamar Anora:', error);
    
    // Diferencia erro de JSON (token <) de erro de conexão
    if (error.message.includes('Unexpected token')) {
      resultElement.innerText = "Erro: O servidor retornou HTML em vez de JSON (Erro 404/500).";
    } else {
      resultElement.innerText = `Erro: ${error.message}. Tente novamente.`;
    }
    
    resultElement.style.opacity = "1";
  }
}

// --- Funções de Compatibilidade ---

async function fetchData() {
  askAnora("Olá, gostaria de uma leitura geral.");
}

async function sendData() {
  const inputElement = document.getElementById('userInput'); 
  const message = inputElement && inputElement.value ? inputElement.value : "Uma leitura rápida, por favor.";
  askAnora(message);
}
