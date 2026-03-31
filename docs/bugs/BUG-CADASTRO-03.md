# 🐞 BUG-CADASTRO-03 — Mensagem incorreta ao cadastrar sem confirmação de senha

## 📊 Detalhes
| Campo | Valor |
|------|------|
| **CT** | CT-CADASTRO-05 |
| **Severidade** | Média |
| **Prioridade** | Média |
| **Status** | Aberto |
| **Ambiente** | https://bugbank.netlify.app |
| **Data** | 2026-03-28 |

---

## 📌 Descrição
Ao tentar cadastrar sem preencher o campo **Confirmação de senha**, o sistema não exibe a mensagem específica definida no requisito.

---

## 🔁 Passos
1. Acessar https://bugbank.netlify.app
2. Clicar em **Registrar**
3. Preencher todos os campos exceto **Confirmação de senha**
4. Clicar em **Cadastrar**

---

## ✅ Esperado
`"Confirmar senha não pode ser vazio"`

## ❌ Obtido
`"É campo obrigatório"`

---

## 📸 Evidência
![BUG-CADASTRO-03](../evidencias/BUG-CADASTRO-03.png)
