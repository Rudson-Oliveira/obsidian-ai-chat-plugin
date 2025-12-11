import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, Notice } from 'obsidian';

// Constantes
const VIEW_TYPE_AI_CHAT = "ai-chat-view";
const DESKTOP_AGENT_URL = "http://localhost:5001";

// Interface de configurações
interface AIAssistantSettings {
	desktopAgentUrl: string;
	openaiApiKey: string;
	autoStart: boolean;
}

// Configurações padrão
const DEFAULT_SETTINGS: AIAssistantSettings = {
	desktopAgentUrl: DESKTOP_AGENT_URL,
	openaiApiKey: '',
	autoStart: true
}

// Classe principal do plugin
export default class AIAssistantPlugin extends Plugin {
	settings: AIAssistantSettings;

	async onload() {
		await this.loadSettings();

		// Registrar a view do chat
		this.registerView(
			VIEW_TYPE_AI_CHAT,
			(leaf) => new AIChatView(leaf, this)
		);

		// Adicionar ícone na ribbon (barra lateral esquerda)
		this.addRibbonIcon('message-square', 'AI Assistant', () => {
			this.activateView();
		});

		// Adicionar comando para abrir o chat
		this.addCommand({
			id: 'open-ai-chat',
			name: 'Abrir Chat com IA',
			callback: () => {
				this.activateView();
			}
		});

		// Adicionar tab de configurações
		this.addSettingTab(new AIAssistantSettingTab(this.app, this));

		// Auto-iniciar se configurado
		if (this.settings.autoStart) {
			this.app.workspace.onLayoutReady(() => {
				this.activateView();
			});
		}
	}

	onunload() {
		// Limpar views ao descarregar
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_AI_CHAT);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_AI_CHAT);

		if (leaves.length > 0) {
			// View já existe, apenas ativar
			leaf = leaves[0];
		} else {
			// Criar nova view no painel direito
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_AI_CHAT, active: true });
		}

		workspace.revealLeaf(leaf);
	}
}

// View do Chat com IA
class AIChatView extends ItemView {
	plugin: AIAssistantPlugin;
	chatContainer: HTMLElement;
	inputContainer: HTMLElement;
	messagesContainer: HTMLElement;
	inputField: HTMLTextAreaElement;
	sendButton: HTMLButtonElement;
	messages: Array<{role: string, content: string}> = [];

	constructor(leaf: WorkspaceLeaf, plugin: AIAssistantPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType() {
		return VIEW_TYPE_AI_CHAT;
	}

	getDisplayText() {
		return "AI Assistant";
	}

	getIcon() {
		return "message-square";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass('ai-chat-container');

		// Criar estrutura do chat
		this.chatContainer = container.createDiv({ cls: 'ai-chat-wrapper' });
		
		// Header
		const header = this.chatContainer.createDiv({ cls: 'ai-chat-header' });
		header.createEl('h4', { text: '🤖 AI Assistant' });
		header.createEl('p', { text: 'Converse em linguagem natural', cls: 'ai-chat-subtitle' });

		// Container de mensagens
		this.messagesContainer = this.chatContainer.createDiv({ cls: 'ai-chat-messages' });
		
		// Mensagem inicial
		this.addMessage('assistant', 'Olá! Sou seu assistente de IA para o Obsidian. Como posso ajudar você hoje?');

		// Container de input
		this.inputContainer = this.chatContainer.createDiv({ cls: 'ai-chat-input-container' });
		
		this.inputField = this.inputContainer.createEl('textarea', {
			cls: 'ai-chat-input',
			attr: {
				placeholder: 'Digite sua mensagem...',
				rows: '3'
			}
		});

		this.sendButton = this.inputContainer.createEl('button', {
			cls: 'ai-chat-send-button',
			text: 'Enviar'
		});

		// Event listeners
		this.sendButton.addEventListener('click', () => this.sendMessage());
		this.inputField.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				this.sendMessage();
			}
		});

		// Verificar conexão com Desktop Agent
		this.checkDesktopAgent();
	}

	async onClose() {
		// Cleanup se necessário
	}

	addMessage(role: string, content: string) {
		const messageDiv = this.messagesContainer.createDiv({ cls: `ai-message ai-message-${role}` });
		
		const avatar = messageDiv.createDiv({ cls: 'ai-message-avatar' });
		avatar.setText(role === 'user' ? '👤' : '🤖');
		
		const contentDiv = messageDiv.createDiv({ cls: 'ai-message-content' });
		contentDiv.setText(content);

		// Scroll para o final
		this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

		// Armazenar mensagem
		this.messages.push({ role, content });
	}

	async sendMessage() {
		const message = this.inputField.value.trim();
		if (!message) return;

		// Adicionar mensagem do usuário
		this.addMessage('user', message);
		this.inputField.value = '';

		// Mostrar indicador de digitação
		const typingDiv = this.messagesContainer.createDiv({ cls: 'ai-message ai-message-assistant ai-typing' });
		typingDiv.setText('🤖 Pensando...');

		try {
			// Enviar para a IA
			const response = await this.processMessage(message);
			
			// Remover indicador de digitação
			typingDiv.remove();
			
			// Adicionar resposta da IA
			this.addMessage('assistant', response);
		} catch (error) {
			typingDiv.remove();
			this.addMessage('assistant', `Erro: ${error.message}`);
			new Notice('Erro ao processar mensagem. Verifique a conexão com o Desktop Agent.');
		}
	}

	async processMessage(message: string): Promise<string> {
		// Aqui vamos integrar com OpenAI e Desktop Agent
		// Por enquanto, retornar resposta simulada
		
		// Verificar se é um comando específico
		if (message.toLowerCase().includes('criar nota')) {
			return await this.handleCreateNote(message);
		} else if (message.toLowerCase().includes('buscar')) {
			return await this.handleSearch(message);
		} else if (message.toLowerCase().includes('abrir obsidian')) {
			return await this.handleOpenObsidian();
		} else {
			// Resposta genérica da IA
			return await this.getAIResponse(message);
		}
	}

	async handleCreateNote(message: string): Promise<string> {
		try {
			// Extrair título da nota da mensagem
			const match = message.match(/criar nota (?:sobre |chamada )?["']?([^"']+)["']?/i);
			const title = match ? match[1] : 'Nova Nota';
			
			// Criar nota via Obsidian API
			const file = await this.app.vault.create(`${title}.md`, `# ${title}\n\nCriado via AI Assistant\n`);
			
			return `✅ Nota "${title}" criada com sucesso!`;
		} catch (error) {
			return `❌ Erro ao criar nota: ${error.message}`;
		}
	}

	async handleSearch(message: string): Promise<string> {
		// Implementar busca no vault
		const files = this.app.vault.getMarkdownFiles();
		return `📁 Encontrei ${files.length} notas no seu vault.`;
	}

	async handleOpenObsidian(): Promise<string> {
		try {
			const response = await fetch(`${this.plugin.settings.desktopAgentUrl}/obsidian/open`, {
				method: 'POST'
			});
			
			if (response.ok) {
				return '✅ Obsidian aberto com sucesso!';
			} else {
				return '❌ Erro ao abrir Obsidian.';
			}
		} catch (error) {
			return `❌ Erro de conexão: ${error.message}`;
		}
	}

	async getAIResponse(message: string): Promise<string> {
		// Integração com OpenAI (será implementada)
		// Por enquanto, resposta simulada
		return `Recebi sua mensagem: "${message}". A integração completa com IA está em desenvolvimento.`;
	}

	async checkDesktopAgent() {
		try {
			const response = await fetch(`${this.plugin.settings.desktopAgentUrl}/health`);
			if (response.ok) {
				new Notice('✅ Desktop Agent conectado!');
			}
		} catch (error) {
			new Notice('⚠️ Desktop Agent não está rodando. Inicie-o para usar todas as funcionalidades.');
		}
	}
}

// Tab de configurações
class AIAssistantSettingTab extends PluginSettingTab {
	plugin: AIAssistantPlugin;

	constructor(app: App, plugin: AIAssistantPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Configurações do AI Assistant'});

		new Setting(containerEl)
			.setName('URL do Desktop Agent')
			.setDesc('Endereço do Obsidian Desktop Agent')
			.addText(text => text
				.setPlaceholder('http://localhost:5001')
				.setValue(this.plugin.settings.desktopAgentUrl)
				.onChange(async (value) => {
					this.plugin.settings.desktopAgentUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('OpenAI API Key')
			.setDesc('Sua chave de API do OpenAI (opcional)')
			.addText(text => text
				.setPlaceholder('sk-...')
				.setValue(this.plugin.settings.openaiApiKey)
				.onChange(async (value) => {
					this.plugin.settings.openaiApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Abrir automaticamente')
			.setDesc('Abrir o chat automaticamente ao iniciar o Obsidian')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoStart)
				.onChange(async (value) => {
					this.plugin.settings.autoStart = value;
					await this.plugin.saveSettings();
				}));
	}
}
