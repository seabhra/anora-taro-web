
// Função para buscar dados da API de Anora Tarô versão 3

// URL Relativa é mais segura para evitar erros de cabeçalho/CORS na Vercel
const API_URL = '/api/chat';

// Função unificada para buscar/enviar dados (Chat com a IA)
async function askAnora(userMessage) {
  const resultElement = document.getElementById('result');
  
  if (!resultElement) {
    console.error("Erro: Elemento com ID 'result' não encontrado no HTML.");
    return;
  }

  resultElement.innerText = "Consultando os astros e as cartas...";
  resultElement.style.opacity = "0.7";

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ajuste: Enviando um objeto que tenta cobrir as esperas comuns de APIs (message e messages)
      body: JSON.stringify({ 
        message: userMessage || "Faça uma leitura de tarô para mim.",
        // Caso sua API espere o formato de array (comum em IAs):
        messages: [{ role: "user", content: userMessage || "Faça uma leitura de tarô para mim." }]
      }),
    });

    // Se o erro for 400, vamos tentar ler o corpo do erro para saber o que a Vercel diz
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Detalhes do erro 400:', errorData);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    
    // Tenta encontrar a resposta em diferentes campos comuns
    const replyText = data.reply || data.message || data.content || (data.choices && data.choices[0].message.content) || JSON.stringify(data);
    
    resultElement.innerText = replyText;
    resultElement.style.opacity = "1";

  } catch (error) {
    console.error('Erro ao chamar Anora:', error);
    resultElement.innerText = "Erro: A Anora não pôde responder agora. Tente novamente.";
    resultElement.style.opacity = "1";
  }
}

// Funções de compatibilidade
async function fetchData() {
  askAnora("Olá, gostaria de uma leitura geral.");
}

async function sendData() {
  const inputElement = document.getElementById('userInput'); 
  const message = inputElement && inputElement.value ? inputElement.value : "Uma leitura rápida, por favor.";
  askAnora(message);
}
