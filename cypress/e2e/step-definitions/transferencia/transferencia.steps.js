import { Given, When, Then, Before } from "@badeball/cypress-cucumber-preprocessor"
import loginPage from '../../../support/pages/loginPage'
import transferPage from '../../../support/pages/transferPage'

Before(function (scenario) {
  const tags = scenario.pickle.tags.map(t => t.name)
  const ctId = tags.find(t => /^@CT-/.test(t)) ?? 'SEM-ID'
  Cypress.env('currentScenarioId', ctId)
})

let contaDestino

Given('que estou logado com saldo e tenho uma conta de destino', () => {
  cy.criarContaDestino().then((destino) => {
    contaDestino = destino
  })

  cy.criarUsuario().then((usuario) => {
    loginPage.login(usuario.email, usuario.password)
  })

  transferPage.navegarParaTransferencia()
})

When('realizo transferência para a conta destino com valor {string} e descrição {string}', (valor, descricao) => {
  transferPage.preencherTransferencia({ conta: contaDestino.numeroConta, valor, descricao })
  transferPage.transferir()
})

When('realizo transferência para a conta destino com valor {string} sem descrição', (valor) => {
  transferPage.preencherTransferencia({ conta: contaDestino.numeroConta, valor, descricao: null })
  transferPage.transferir()
})

When('realizo transferência para conta {string} valor {string} e descrição {string}', (conta, valor, descricao) => {
  transferPage.preencherTransferencia({ conta, valor, descricao })
  transferPage.transferir()
})

When('preencho o campo {string} com {string} na transferência', (campo, valor) => {
  const campos = {
    conta: () => transferPage.elements.accountInput().clear().type(valor),
    digito: () => transferPage.elements.digitInput().clear().type(valor),
    valor: () => transferPage.elements.valueInput().clear().type(valor),
  }
  campos[campo]()
})

When('fecho o modal de sucesso', () => {
  cy.get('#btnCloseModal').click({ force: true })
})

Then('devo ver mensagem de sucesso na transferência', () => {
  transferPage.validarSucesso()
})

Then('devo ver mensagem de saldo insuficiente', () => {
  transferPage.validarErro(/saldo/i)
})

Then('devo ver mensagem de conta inválida', () => {
  transferPage.validarErro(/conta inválida|inexistente/i)
})

// BUG-TRANSFER-03: sistema permite transferência sem descrição
// Esperado: sistema deveria bloquear a transferência
// Obtido: sistema realiza a transferência normalmente (bug)
Then('a transferência deve ser bloqueada por descrição ausente', () => {
  cy.contains(/transferência realizada|sucesso/i).should('not.exist')
})

Then('devo ver mensagem de valor inválido', () => {
  transferPage.validarErro(/não pode ser 0 ou negativo/i)
})

Then('o campo {string} não deve aceitar letras', (campo) => {
  const elementos = {
    conta: () => transferPage.elements.accountInput(),
    digito: () => transferPage.elements.digitInput(),
    valor: () => transferPage.elements.valueInput(),
  }
  elementos[campo]().invoke('val').should('match', /^\d*$/)
})

Then('devo ser redirecionado para o extrato', () => {
  transferPage.validarRedirecionamentoExtrato()
})
