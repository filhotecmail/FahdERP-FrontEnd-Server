# Pipeline CI/CD - FAHD ERP

Este projeto utiliza GitHub Actions para implementar um pipeline completo de Integração Contínua (CI) e Deploy Contínuo (CD).

## 🚀 Workflows Configurados

### 1. Continuous Integration (`ci.yml`)
Executado em:
- Push para branches: `master`, `main`, `develop`
- Pull Requests para: `master`, `main`, `develop`

#### Jobs Incluídos:

**Code Quality Checks**
- ✅ ESLint (verificação de qualidade de código)
- ✅ TypeScript type checking
- ✅ Build da aplicação
- ✅ Execução de testes unitários
- ✅ Geração de relatórios de cobertura
- ✅ Testa em Node.js 18.x e 20.x

**Security Audit**
- 🔒 npm audit (vulnerabilidades de segurança)
- 🔒 audit-ci (verificação adicional de vulnerabilidades)

**Dependency Check**
- 📦 Verificação de dependências desatualizadas
- ⚠️ Detecção de pacotes depreciados

### 2. Deploy to Fly.io (`deploy.yml`)

Executado em:
- Push para branches: `master`, `main`
- Após conclusão bem-sucedida do workflow de CI

#### Verificações Pré-Deploy:
- 🔒 Auditoria de segurança (nível alto)
- ✅ Linting
- ✅ Type checking
- 🏗️ Build da aplicação
- ✅ Verificação de artefatos de build

## 📊 Cobertura de Código

O projeto está configurado para gerar relatórios de cobertura com:
- **Provider**: V8
- **Formatos**: Text, JSON, HTML, LCOV
- **Thresholds mínimos**: 80% (branches, functions, lines, statements)
- **Upload**: Codecov (opcional)

## 🛡️ Verificações de Segurança

- **npm audit**: Verifica vulnerabilidades conhecidas
- **audit-ci**: Verificação adicional com nível moderado
- **Pré-deploy**: Auditoria de alto nível antes do deploy

## 📋 Requisitos de Qualidade

Para que o código seja aceito, deve passar em:
1. ✅ Todos os testes unitários
2. ✅ Verificação de tipos TypeScript
3. ✅ Linting sem erros
4. ✅ Build bem-sucedido
5. 🔒 Auditoria de segurança
6. 📦 Verificação de dependências
7. 📊 Cobertura mínima de 80%

## 🚫 Bloqueios Automáticos

O pipeline irá **falhar** se:
- Houver erros de linting
- Houver erros de TypeScript
- Testes falharem
- Build falhar
- Vulnerabilidades de segurança (nível moderado+)
- Dependências muito desatualizadas
- Cobertura abaixo de 80%

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build

# Qualidade de Código
npm run lint         # ESLint
npm run type-check   # Verificação TypeScript

# Testes
npm run test         # Testes em modo watch
npm run test:run     # Execução única dos testes
npm run test:ui      # Interface gráfica dos testes
```

## 📈 Monitoramento

- **Status dos workflows**: Visível na aba Actions do GitHub
- **Cobertura**: Relatórios gerados em `./coverage/`
- **Logs**: Disponíveis em cada job do workflow

---

**Nota**: Este pipeline segue as melhores práticas para projetos Vue.js + TypeScript + Vite, garantindo código limpo, seguro e de alta qualidade.