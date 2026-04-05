---
title: BugBank - Mapa de Testes
markmap:
  colorFreezeLevel: 2
---

# 🐞 BugBank

## 🔐 Login
- ✅ CT-LOGIN-01 — Campos obrigatórios bloqueiam acesso 🔴 Alto
  - email | senha
- 🐞 CT-LOGIN-02 — Mensagem de erro incorreta no login 🔴 Alto
- ✅ CT-LOGIN-03 — Usuário inválido exibe erro 🟡 Médio
- ✅ CT-LOGIN-04 — Login válido redireciona para home 🔴 Alto

## 📝 Cadastro
- ✅ CT-CADASTRO-01 — Todos os campos obrigatórios bloqueiam cadastro 🔴 Alto
  - nome | email | senha | confirmação
- ✅ CT-CADASTRO-02 — Campo nome vazio exibe mensagem correta 🟡 Médio
- 🐞 CT-CADASTRO-03 — Mensagem incorreta ao cadastrar sem e-mail 🔴 Alto
- 🐞 CT-CADASTRO-04 — Mensagem incorreta ao cadastrar sem senha 🔴 Alto
- 🐞 CT-CADASTRO-05 — Mensagem incorreta ao cadastrar sem confirmação de senha 🔴 Alto
- ✅ CT-CADASTRO-06 — Conta criada com saldo de R$ 1.000,00 🟢 Baixo
- ✅ CT-CADASTRO-07 — Conta criada sem saldo R$ 0,00 🟢 Baixo
- ✅ CT-CADASTRO-08 — Senhas divergentes bloqueiam cadastro 🟡 Médio
- ✅ CT-CADASTRO-09 — Cadastro exibe número da conta criada 🟡 Médio
- ✅ CT-CADASTRO-10 — E-mail duplicado exibe mensagem de erro 🟡 Médio

## 💸 Transferência
- ✅ CT-TRANSFER-01 — Transferência para conta válida é permitida 🔴 Alto
- ✅ CT-TRANSFER-02 — Saldo insuficiente bloqueia transferência 🔴 Alto
- ✅ CT-TRANSFER-03 — Conta inválida exibe erro 🔴 Alto
- 🐞 CT-TRANSFER-04 — Campo numérico não deve aceitar letras 🔴 Alto
  - conta | digito | valor
- 🐞 CT-TRANSFER-05 — Sistema permite transferência sem descrição 🟡 Médio
- ✅ CT-TRANSFER-06 — Valor inválido é bloqueado 🔴 Alto
  - 0 | -1
- ✅ CT-TRANSFER-07 — Transferência exibe confirmação de sucesso 🟡 Médio
- 🐞 CT-TRANSFER-08 — Sistema não redireciona para extrato após transferência 🟢 Baixo

## 📊 Extrato — Conta com saldo
- ✅ CT-EXTRATO-01 — Saldo disponível exibido no extrato 🔴 Alto
- ✅ CT-EXTRATO-02 — Transações exibem data, tipo e formatação correta 🟡 Médio
  - Abertura de conta → entrada
  - Transferência recebida → entrada
  - Transferência enviada → saída (vermelho com -)
- ✅ CT-EXTRATO-03 — Transações de entrada exibidas em verde 🟢 Baixo
- ✅ CT-EXTRATO-04 — Transação sem comentário exibe hífen 🟢 Baixo

## 📊 Extrato — Conta sem saldo
- ✅ CT-EXTRATO-05 — Conta sem saldo exibe R$ 0,00 no extrato 🟢 Baixo

## 🔥 Smoke
- ✅ Criar conta, logar e visualizar saldo
- ✅ Acessar o extrato e visualizar saldo
- ✅ Cadastro com sucesso exibe mensagem de confirmação
- ✅ Campos obrigatórios bloqueiam o acesso
- ✅ Login com credenciais válidas redireciona para a home
- ✅ Transferência realizada com sucesso exibe confirmação
- ✅ Transferência com saldo insuficiente exibe mensagem de erro
- ✅ Login com credenciais inválidas bloqueia acesso
- ✅ Logout encerra sessão e redireciona para o login
- ✅ Extrato exibe transferência realizada
- ✅ Cadastro com senhas diferentes bloqueia cadastro

## ⚙️ Pipeline n8n — Automação de Execução
- ✅ CT-N8N-01 — Webhook dispara execução dos testes 🔴 Alto
- ✅ CT-N8N-02 — Schedule Trigger executa no horário configurado 🔴 Alto
  - Todo dia às 13h (NY) = 14h (Brasil)
- ✅ CT-N8N-03 — Email enviado com resultado correto após execução 🟡 Médio
  - status | testes | falhas | tags | data
- ✅ CT-N8N-04 — Histórico gravado em docs/historico.csv 🟡 Médio
- **Fluxo:** Trigger → HTTP Request → Formatar Resultado → Email
- **Execução:** test-server.js + Cypress (Docker)