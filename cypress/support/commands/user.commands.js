import registerPage from '../pages/registerPage'
import loginPage from '../pages/loginPage'
import { criarUsuario } from '../utils/dataFactory'

Cypress.Commands.add('criarUsuario', () => {
  const usuario = criarUsuario()

  cy.visit('/')
  loginPage.elements.registerButton().click()

  registerPage.preencherCadastro(usuario)
  registerPage.ativarSaldo()
  registerPage.cadastrar()
  registerPage.validarCadastroSucesso()
  cy.get('#btnCloseModal').click({ force: true })

  return cy.wrap(usuario)
})

Cypress.Commands.add('criarUsuarioComConta', () => {
  const usuario = criarUsuario()

  cy.visit('/')
  loginPage.elements.registerButton().click()

  registerPage.preencherCadastro(usuario)
  registerPage.ativarSaldo()
  registerPage.cadastrar()
  registerPage.validarCadastroSucesso()

  cy.contains(/A conta \d+-\d+ foi criada com sucesso/)
    .invoke('text')
    .then((text) => {
      const match = text.match(/(\d+-\d+)/)
      cy.get('#btnCloseModal').click({ force: true })
      return cy.wrap({ ...usuario, numeroConta: match[1] })
    })
})

Cypress.Commands.add('criarContaDestino', () => {
  const usuario = criarUsuario()

  cy.visit('/')
  loginPage.elements.registerButton().click()

  registerPage.preencherCadastro(usuario)
  registerPage.cadastrar()
  registerPage.validarCadastroSucesso()

  cy.contains(/A conta \d+-\d+ foi criada com sucesso/)
    .invoke('text')
    .then((text) => {
      const match = text.match(/(\d+-\d+)/)
      cy.get('#btnCloseModal').click({ force: true })
      return cy.wrap({ numeroConta: match[1] })
    })
})

Cypress.Commands.add('criarUsuarioSemSaldo', () => {
  const usuario = criarUsuario()

  cy.visit('/')
  loginPage.elements.registerButton().click()

  registerPage.preencherCadastro(usuario)
  registerPage.cadastrar()
  registerPage.validarCadastroSucesso()
  cy.get('#btnCloseModal').click({ force: true })

  return cy.wrap(usuario)
})
