import { Given, When, Then, Before } from "@badeball/cypress-cucumber-preprocessor"
import loginPage from '../../../support/pages/loginPage'
import transferPage from '../../../support/pages/transferPage'
import extratoPage from '../../../support/pages/extratoPage'

Before(function (scenario) {
  const tags = scenario.pickle.tags.map(t => t.name)
  const ctId = tags.find(t => /^@CT-/.test(t)) ?? 'SEM-ID'
  Cypress.env('currentScenarioId', ctId)
})

let usuarioPrincipal
let remetente

Given('que estou logado com conta sem saldo', () => {
  cy.criarUsuarioSemSaldo().then((u) => {
    loginPage.login(u.email, u.password)
  })
})

Given('que estou logado com conta com saldo e transferência realizada', () => {
  cy.criarUsuarioComConta().then((u) => { usuarioPrincipal = u })
  cy.criarUsuarioComConta().then((u) => { remetente = u })

  // remetente envia para o usuário principal → gera "Transferência recebida"
  cy.then(() => {
    loginPage.login(remetente.email, remetente.password)
  })

  transferPage.navegarParaTransferencia()

  cy.then(() => {
    transferPage.preencherTransferencia({ conta: usuarioPrincipal.numeroConta, valor: '100', descricao: null })
    transferPage.transferir()
  })

  cy.get('#btnCloseModal').click({ force: true })
  cy.get('#btnBack').click()
  cy.get('#btnExit').click()

  // usuário principal envia para remetente → gera "Transferência enviada"
  cy.then(() => {
    loginPage.login(usuarioPrincipal.email, usuarioPrincipal.password)
  })

  transferPage.navegarParaTransferencia()

  cy.then(() => {
    transferPage.preencherTransferencia({ conta: remetente.numeroConta, valor: '50', descricao: null })
    transferPage.transferir()
  })

  cy.get('#btnCloseModal').click({ force: true })
  cy.get('#btnBack').click()
})

When('navego para a tela de extrato', () => {
  extratoPage.navegarParaExtrato()
})

Then('devo ver o saldo disponível da conta', () => {
  extratoPage.validarSaldoVisivel()
})

Then('a transação {string} deve exibir data e estar formatada como {string}', (tipo, formatacao) => {
  extratoPage.validarTransacaoComFormatacao(tipo, formatacao)
})

Then('as transações de {string} e {string} devem exibir valor em verde', () => {
  extratoPage.validarValoresPositivosEmVerde()
})

Then('transações sem comentário devem exibir hífen na descrição', () => {
  extratoPage.validarHifenParaSemComentario()
})

Then('o saldo deve ser exibido como zero', () => {
  cy.get('#textBalanceAvailable').invoke('text').should('match', /0,00/)
})
