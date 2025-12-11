// Serviço de integração com IA (OpenAI)
export class AIService {
	private apiKey: string;
	private desktopAgentUrl: string;

	constructor(apiKey: string, desktopAgentUrl: string) {
		this.apiKey = apiKey;
		this.desktopAgentUrl = desktopAgentUrl;
	}

	async sendMessage(messages: Array<{role: string, content: string}>): Promise<string> {
		if (!this.apiKey) {
			return "Por favor, configure sua API Key do OpenAI nas configurações do plugin.";
		}

		try {
			const response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiKey}`
				},
				body: JSON.stringify({
					model: 'gpt-4',
					messages: [
						{
							role: 'system',
							content: this.getSystemPrompt()
						},
						...messages
					],
					temperature: 0.7,
					max_tokens: 1000
				})
			});

			if (!response.ok) {
				throw new Error(`OpenAI API error: ${response.statusText}`);
			}

			const data = await response.json();
			return data.choices[0].message.content;
		} catch (error) {
			console.error('Error calling OpenAI:', error);
			throw error;
		}
	}

	private getSystemPrompt(): string {
		return `Você é um assistente de IA integrado ao Obsidian, um aplicativo de anotações e gerenciamento de conhecimento.

Você tem acesso às seguintes funcionalidades através do Desktop Agent:

1. **Criar notas**: Você pode criar novas notas no vault do Obsidian
2. **Buscar notas**: Você pode buscar e listar notas existentes
3. **Ler arquivos**: Você pode ler o conteúdo de arquivos
4. **Escrever arquivos**: Você pode criar ou modificar arquivos
5. **Executar comandos**: Você pode executar comandos do sistema

Quando o usuário pedir para realizar uma ação, você deve:
1. Entender a intenção do usuário
2. Determinar qual ação executar
3. Fornecer uma resposta clara e útil

Seja conciso, prestativo e proativo. Se não tiver certeza sobre algo, pergunte ao usuário.

Exemplos de comandos que você pode executar:
- "Crie uma nota sobre [tema]"
- "Busque todas as notas com a tag #importante"
- "Organize minhas notas da pasta Projetos"
- "Crie um template de daily note"
- "Liste todas as notas modificadas hoje"

Sempre confirme as ações executadas e forneça feedback claro ao usuário.`;
	}

	async executeAction(action: string, params: any): Promise<any> {
		try {
			const response = await fetch(`${this.desktopAgentUrl}${action}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(params)
			});

			if (!response.ok) {
				throw new Error(`Desktop Agent error: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error calling Desktop Agent:', error);
			throw error;
		}
	}
}
