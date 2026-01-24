from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import time

class APIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Simular processamento
            time.sleep(1)
            
            # Resposta mockada
            response = {
                "message": "Esta é uma resposta mockada da API Aurora",
                "status": "success",
                "data": {
                    "response": "Olá! Eu sou Aurora, sua assistente virtual. Como posso ajudar você hoje?"
                }
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    server_address = ('', 3000)  # Porta 3000 para API
    httpd = HTTPServer(server_address, APIHandler)
    print('API Mock rodando em http://localhost:3000')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()