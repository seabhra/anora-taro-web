// api/index.js
export default function handler(req, res) {
	res.json({ 
	  message: 'API Anora Tarô funcionando!',
	  endpoints: {
		chat: '/api/chat'
	  }
	});
  }