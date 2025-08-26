# GitHub Actions - Deploy Automático para Fly.io

Este repositório está configurado com um pipeline de CI/CD que faz deploy automático para o Fly.io sempre que há push na branch `master` ou `main`.

## Configuração Necessária

### 1. Configurar o Token do Fly.io

Para que o pipeline funcione, você precisa adicionar o token de API do Fly.io nos secrets do repositório GitHub:

1. **Obter o token do Fly.io:**
   ```bash
   flyctl auth token
   ```

2. **Adicionar o token nos GitHub Secrets:**
   - Vá para o seu repositório no GitHub
   - Clique em `Settings` > `Secrets and variables` > `Actions`
   - Clique em `New repository secret`
   - Nome: `FLY_API_TOKEN`
   - Valor: Cole o token obtido no passo 1
   - Clique em `Add secret`

### 2. Estrutura do Pipeline

O pipeline (`deploy.yml`) executa os seguintes passos:

1. **Checkout do código** - Baixa o código do repositório
2. **Setup Node.js** - Configura o ambiente Node.js 18 com cache npm
3. **Install dependencies** - Instala as dependências com `npm ci`
4. **Build application** - Compila a aplicação com `npm run build`
5. **Setup Fly.io CLI** - Instala a CLI do Fly.io
6. **Deploy to Fly.io** - Faz o deploy usando `flyctl deploy --remote-only`

### 3. Branches Monitoradas

O pipeline é acionado automaticamente quando há push nas seguintes branches:
- `master`
- `main`

### 4. Verificação do Deploy

Após o push, você pode:
- Acompanhar o progresso na aba `Actions` do GitHub
- Verificar o status do deploy no dashboard do Fly.io
- Acessar a aplicação em: https://fahd-erp.fly.dev/

## Troubleshooting

### Erro de Token
Se o deploy falhar com erro de autenticação:
- Verifique se o secret `FLY_API_TOKEN` está configurado corretamente
- Gere um novo token com `flyctl auth token` se necessário

### Erro de Build
Se o build falhar:
- Verifique se todas as dependências estão no `package.json`
- Teste o build localmente com `npm run build`

### Erro de Deploy
Se o deploy falhar:
- Verifique se o arquivo `fly.toml` está presente e configurado corretamente
- Verifique se a aplicação está configurada no Fly.io