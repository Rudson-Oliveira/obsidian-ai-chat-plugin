# 🤖 AI Assistant for Obsidian

Plugin de assistente de IA integrado ao Obsidian com interface de chat para automação e assistência em linguagem natural.

## ✨ Funcionalidades

- 💬 **Chat com IA integrado** - Interface de chat dentro do Obsidian
- 🎯 **Comandos em linguagem natural** - Converse naturalmente com a IA
- 🔄 **Integração com Desktop Agent** - Automação completa do Obsidian
- 📝 **Criação automática de notas** - Crie notas com comandos de voz
- 🔍 **Busca inteligente** - Encontre notas rapidamente
- ⚙️ **Totalmente configurável** - Personalize conforme suas necessidades

## 📦 Instalação

### Método 1: Via BRAT (Recomendado)

1. Instale o plugin [BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. Abra as configurações do BRAT
3. Clique em "Add Beta Plugin"
4. Cole o link do repositório: `https://github.com/Rudson-Oliveira/obsidian-ai-assistant-plugin`
5. Ative o plugin em Settings → Community Plugins

### Método 2: Manual

1. Baixe os arquivos `main.js`, `manifest.json` e `styles.css` da última release
2. Crie uma pasta chamada `obsidian-ai-assistant` em `.obsidian/plugins/` do seu vault
3. Copie os arquivos baixados para essa pasta
4. Recarregue o Obsidian
5. Ative o plugin em Settings → Community Plugins

## ⚙️ Configuração

### Pré-requisitos

1. **Obsidian Desktop Agent** rodando (porta 5001)
   - [Instruções de instalação](https://github.com/Rudson-Oliveira/obsidian-desktop-agent)

2. **OpenAI API Key** (opcional, mas recomendado)
   - Obtenha em: https://platform.openai.com/api-keys

### Configurações do Plugin

1. Abra Settings → AI Assistant
2. Configure:
   - **URL do Desktop Agent**: `http://localhost:5001` (padrão)
   - **OpenAI API Key**: Sua chave de API
   - **Abrir automaticamente**: Ativar para abrir o chat ao iniciar

## 🚀 Uso

### Abrir o Chat

- **Clique no ícone** 💬 na barra lateral esquerda (ribbon)
- **Use o comando**: `Ctrl/Cmd + P` → "Abrir Chat com IA"

### Exemplos de Comandos

```
Usuário: Crie uma nota sobre reunião de hoje
IA: ✅ Nota "Reunião de hoje" criada com sucesso!

Usuário: Busque todas as notas com a tag #projeto
IA: 📁 Encontrei 15 notas com a tag #projeto

Usuário: Organize minhas notas da pasta Projetos por data
IA: ✅ Notas organizadas com sucesso!

Usuário: Crie um template de daily note
IA: ✅ Template criado em Templates/Daily Note.md
```

## 🎨 Interface

O plugin adiciona um painel lateral com:

- **Header** - Título e status da conexão
- **Área de mensagens** - Histórico de conversas
- **Campo de input** - Digite suas mensagens
- **Botão enviar** - Envie mensagens (ou pressione Enter)

## 🔧 Desenvolvimento

### Requisitos

- Node.js 16+
- pnpm (ou npm/yarn)

### Setup

```bash
# Clonar repositório
git clone https://github.com/Rudson-Oliveira/obsidian-ai-assistant-plugin.git
cd obsidian-ai-assistant-plugin

# Instalar dependências
pnpm install

# Desenvolvimento (watch mode)
pnpm run dev

# Build para produção
pnpm run build
```

### Estrutura do Projeto

```
obsidian-ai-assistant-plugin/
├── main.ts              # Código principal do plugin
├── ai-service.ts        # Serviço de integração com IA
├── styles.css           # Estilos do chat
├── manifest.json        # Metadados do plugin
├── package.json         # Dependências
├── tsconfig.json        # Configuração TypeScript
├── esbuild.config.mjs   # Configuração de build
└── README.md            # Documentação
```

## 🤝 Integração com Desktop Agent

O plugin se comunica com o [Obsidian Desktop Agent](https://github.com/Rudson-Oliveira/obsidian-desktop-agent) para executar ações no sistema:

| Endpoint | Descrição |
|----------|-----------|
| `/health` | Verificar status do agente |
| `/obsidian/open` | Abrir Obsidian |
| `/file/read` | Ler arquivos |
| `/file/write` | Escrever arquivos |
| `/shell/exec` | Executar comandos |

## 🐛 Solução de Problemas

### O chat não abre

1. Verifique se o plugin está ativado em Settings → Community Plugins
2. Tente recarregar o Obsidian (Ctrl/Cmd + R)
3. Verifique o console do desenvolvedor (Ctrl/Cmd + Shift + I)

### Erro de conexão com Desktop Agent

1. Verifique se o Desktop Agent está rodando:
   ```bash
   curl http://localhost:5001/health
   ```
2. Verifique a URL nas configurações do plugin
3. Reinicie o Desktop Agent

### IA não responde

1. Verifique se a API Key do OpenAI está configurada
2. Verifique sua conexão com a internet
3. Verifique o console para erros de API

## 📝 Roadmap

- [ ] Suporte a múltiplos modelos de IA (GPT-4, Claude, Gemini)
- [ ] Comandos personalizados
- [ ] Templates de prompts
- [ ] Histórico de conversas persistente
- [ ] Exportação de conversas
- [ ] Integração com plugins do Obsidian (Dataview, Templater)
- [ ] Suporte a arquivos anexados
- [ ] Modo de voz (speech-to-text)

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Obsidian](https://obsidian.md/) - O melhor app de notas
- [OpenAI](https://openai.com/) - API de IA
- Comunidade Obsidian

## 📧 Suporte

- **Issues**: [GitHub Issues](https://github.com/Rudson-Oliveira/obsidian-ai-assistant-plugin/issues)
- **Discussões**: [GitHub Discussions](https://github.com/Rudson-Oliveira/obsidian-ai-assistant-plugin/discussions)

---

**Desenvolvido com ❤️ por Manus AI**
