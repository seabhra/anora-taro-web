
// Função para buscar dados da API de Anora Tarô

// URL da sua API na Vercel (URL Absoluta para evitar CORS local)
const API_URL = 'https://anora-taro-web.vercel.app/api/chat';

// Função unificada para buscar/enviar dados (Chat com a IA)
async function askAnora(userMessage) {
  const resultElement = document.getElementById('result');
  
  // Verificação de segurança
  if (!resultElement) {
    console.error("Erro: Elemento com ID 'result' não encontrado no HTML.");
    return;
  }

  // Feedback visual de carregamento
  resultElement.innerText = "Consultando os astros e as cartas...";
  resultElement.style.opacity = "0.7";

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enviamos a mensagem do usuário. 
      // Nota: Se sua API esperar outra chave (ex: 'prompt' em vez de 'message'), ajuste aqui.
      body: JSON.stringify({ 
        message: userMessage || "Faça uma leitura de tarô para mim." 
      }),
    });

    // Verifica se a resposta da rede foi ok
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    
    // Atualiza a tela com a resposta.
    // Ajuste 'data.reply' conforme a estrutura exata que sua API retorna (ex: data.content, data.texto)
    const replyText = data.reply || data.message || data.content || JSON.stringify(data);
    
    resultElement.innerText = replyText;
    resultElement.style.opacity = "1";

  } catch (error) {
    console.error('Erro ao chamar Anora:', error);
    resultElement.innerText = "Erro: Não foi possível conectar com a Anora. Verifique sua conexão.";
    resultElement.style.opacity = "1";
  }
}

// Função wrapper antiga para manter compatibilidade se você chamar "fetchData" em algum lugar
// Mas agora ela usa a lógica correta de chat
async function fetchData() {
  askAnora("Olá, gostaria de uma leitura geral.");
}

// Função wrapper antiga para manter compatibilidade se você chamar "sendData"
async function sendData() {
  // Pega o valor de um input se existir, ou envia um padrão
  const inputElement = document.getElementById('userInput'); 
  const message = inputElement ? inputElement.value : "Uma leitura rápida, por favor.";
  askAnora(message);
}