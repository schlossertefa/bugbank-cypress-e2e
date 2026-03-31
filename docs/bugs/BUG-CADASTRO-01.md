# 🐞 BUG-CADASTRO-01 — Mensagem incorreta ao cadastrar sem e-mail

## 📊 Detalhes
| Campo | Valor |
|------|------|
| **CT** | CT-CADASTRO-03 |
| **Severidade** | Média |
| **Prioridade** | Média |
| **Status** | Aberto |
| **Ambiente** | https://bugbank.netlify.app |
| **Data** | 2026-03-28 |

---

## 📌 Descrição
Ao tentar cadastrar sem preencher o campo **E-mail**, o sistema não exibe a mensagem específica definida no requisito.

---

## 🔁 Passos
1. Acessar https://bugbank.netlify.app
2. Clicar em **Registrar**
3. Preencher todos os campos exceto **E-mail**
4. Clicar em **Cadastrar**

---

## ✅ Esperado
`"Email não pode ser vazio"`

## ❌ Obtido
`"É campo obrigatório"`

---

## 📸 Evidência
![BUG-CADASTRO-01](../evidencias/BUG-CADASTRO-01.png)
