<div align="center">

 ![Cypress](https://img.shields.io/badge/Cypress-17202C?style=flat-square&logo=cypress&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=flat-square&logo=cucumber&logoColor=white) ![VS Code](https://img.shields.io/badge/VSCode-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white) ![BDD](https://img.shields.io/badge/BDD-Gherkin-4EAA25?style=flat-square) ![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

  <img width="200%" src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnF2ZmY0ajZiOWI3bzE5OGJ4cXIzaXhud2dnNDJlaG1lOHlkYTdvdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0K4n42JVSqqUvAQg/giphy.gif" />

# 🐞 BugBank — Automação de Testes E2E

Projeto de automação de testes end-to-end para a aplicação [BugBank](https://bugbank.netlify.app), cobrindo os principais fluxos com rastreabilidade por IDs de casos de teste, documentação de bugs e evidências, com foco em qualidade e boas práticas de QA.

</div>

---



## Arquitetura

```
cypress/
├── e2e/
│   ├── features/              # Cenários em Gherkin (.feature)
│   │   ├── cadastro/
│   │   ├── login/
│   │   ├── transferencia/
│   │   ├── extrato/
│   │   └── smoke/
│   └── step-definitions/      # Implementação dos steps por domínio
├── support/
│   ├── commands/              # Comandos customizados Cypress
│   ├── pages/                 # Page Objects (login, cadastro, transferência, extrato)
│   └── utils/                 # dataFactory — geração de dados com Faker
docs/
├── fuxograma/                 # Mapa visual dos testes (fluxograma.md)
├── bugs/                      # Bugs documentados (BUG-{MODULO}-{NUM}.md)
├── evidencias/                # Prints por módulo e CT
├── historico.csv              # Histórico de execuções via n8n
└── relatorios/                # Relatório HTML e messages.ndjson (gerado pelo Cucumber)
n8n-workflow.json              # Workflow importável do n8n
test-server.js                 # Servidor HTTP que executa os testes via n8n
docker-compose.yml             # Sobe o n8n localmente
```

---

## Como Executar

### Pré-requisitos

- Node.js instalado
- `npm install`

### Scripts disponíveis

```bash
# Abre a interface interativa do Cypress
npm run cy:open

# Executa todos os testes em modo headless
npm run cy:run

# Executa apenas cenários marcados com @run
npm run cy:focus

# Executa suíte de smoke
npm run cy:smoke

# Executa suíte de regressão
npm run cy:regression
```

---

## Módulos e Cobertura

```mermaid
flowchart TD
classDef default fill:transparent,stroke:#333;
    A["🐞 BugBank — Automação de Testes E2E"]

    A --> B["🔐 Login\n4 CTs | 1 bug"]
    A --> C["📝 Cadastro\n10 CTs | 3 bugs"]
    A --> D["💸 Transferência\n8 CTs | 4 bugs"]
    A --> E["📊 Extrato\n5 CTs"]
    A --> F["🔥 Smoke\n11 cenários"]
    A --> G["⚙️ Pipeline n8n\n4 CTs"]
```

### Casos de Teste

| Módulo | Total CTs | Passando ✅ | Com Bug 🐞 |
|---|---|---|---|
| Login | 4 | 3 | 1 |
| Cadastro | 10 | 7 | 3 |
| Transferência | 8 | 4 | 4 |
| Extrato | 5 | 5 | 0 |
| Pipeline n8n | 4 | 4 | 0 |
| **Total** | **31** | **23** | **8** |

---

## Tags BDD

| Tag | Uso |
|---|---|
| `@regression` | Suíte de regressão completa |
| `@smoke` | Cenários críticos de fumaça |
| `@bug` | Cenários que expõem bugs conhecidos |
| `@run` | Cenários focados para execução rápida |

---

## Pipeline n8n

Automação do disparo e monitoramento dos testes via [n8n](https://n8n.io).

**Pré-requisitos:** Docker Desktop + Node.js instalados.

### Subindo o ambiente

```bash
# 1. Sobe o n8n
docker-compose up

# 2. Em outro terminal, sobe o servidor de testes
node test-server.js
```

Acessa `http://localhost:5678` e importe o `n8n-workflow.json`.

### Disparo manual

```powershell
Invoke-WebRequest -Uri "http://localhost:5678/webhook/run-tests" -Method POST -ContentType "application/json" -Body '{"tags":"@smoke"}' -UseBasicParsing
```

### Fluxo

```
Webhook / Schedule Trigger (13h)
  → HTTP Request (test-server.js:3333)
  → Formatar Resultado
  → Send an Email (Gmail)
  → docs/historico.csv
```

### CTs do Pipeline

| ID | Descrição | Prioridade |
|---|---|---|
| CT-N8N-01 | Webhook dispara execução dos testes | 🔴 Alto |
| CT-N8N-02 | Schedule Trigger executa no horário configurado | 🔴 Alto |
| CT-N8N-03 | Email enviado com resultado correto após execução | 🟡 Médio |
| CT-N8N-04 | Histórico gravado em docs/historico.csv | 🟡 Médio |

---

## Bugs Documentados

Os bugs ficam em `docs/bugs/` no padrão `BUG-{MODULO}-{NUM}.md`.

| ID | Módulo | Descrição | Severidade |
|---|---|---|---|
| [BUG-LOGIN-01](docs/bugs/BUG-LOGIN-01.md) | Login | Mensagem de erro incorreta ao logar sem credenciais | Baixa |
| [BUG-CADASTRO-01](docs/bugs/BUG-CADASTRO-01.md) | Cadastro | Mensagem incorreta ao cadastrar sem e-mail | Alto |
| [BUG-CADASTRO-02](docs/bugs/BUG-CADASTRO-02.md) | Cadastro | Mensagem incorreta ao cadastrar sem senha | Alto |
| [BUG-CADASTRO-03](docs/bugs/BUG-CADASTRO-03.md) | Cadastro | Mensagem incorreta ao cadastrar sem confirmação de senha | Alto |
| [BUG-TRANSFER-01](docs/bugs/BUG-TRANSFER-01.md) | Transferência | Campo numérico não deve aceitar letras | Alto |
| [BUG-TRANSFER-02](docs/bugs/BUG-TRANSFER-02.md) | Transferência | Não redireciona para extrato após transferência | Baixo |
| [BUG-TRANSFER-03](docs/bugs/BUG-TRANSFER-03.md) | Transferência | Sistema permite transferência sem descrição | Médio |

---

## Relatórios

Ao executar `npm run cy:run`, os relatórios são gerados automaticamente em:

```
docs/relatorios/
├── report.html        # Relatório visual HTML
└── messages.ndjson    # Dados brutos dos cenários
```

---

## Padrões do Projeto

- **CTs:** `CT-{MODULO}-{NUM}` (ex: `CT-LOGIN-01`)
- **Bugs:** `BUG-{MODULO}-{NUM}` (ex: `BUG-CADASTRO-01`)
- **Evidências:** screenshots em `docs/evidencias/{modulo}/`
- **Fluxograma:** atualizado em [`docs/fuxograma/fluxograma.md`](docs/fuxograma/fluxograma.md)
