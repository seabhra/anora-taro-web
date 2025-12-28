// api/index.js
export default function handler(req, res) {
	res.json({ 
	  message: 'API Aurora funcionando!',
	  endpoints: {
		chat: '/api/chat'
	  }
	});
  }