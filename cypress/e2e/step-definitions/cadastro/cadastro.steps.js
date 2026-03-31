import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import registerPage from '../../../support/pages/registerPage'
import loginPage from '../../../support/pages/loginPage'
import { criarUsuario } from '../../../support/utils/dataFactory'

let usuario

Given('que estou na tela de cadastro', () => {
  cy.visit('/')
  loginPage.elements.registerButton().click()
})

When('preencho dados válidos', () => {
  usuario = criarUsuario()
  registerPage.preencherCadastro(usuario)
  registerPage.ativarSaldo()
})

When('preencho dados válidos sem ativar saldo', () => {
  usuario = criarUsuario()
  registerPage.preencherCadastro(usuario)
})

When('preencho senhas diferentes', () => {
  usuario = criarUsuario()
  registerPage.preencherSenhaDiferente(usuario, '123456', '654321')
})

When('envio o cadastro', () => {
  registerPage.cadastrar()
})

When('envio o cadastro sem preencher nenhum campo', () => {
  registerPage.esperarModalCadastro()
  registerPage.cadastrar()
})

When('envio o cadastro sem preencher o campo {string}', (campo) => {
  usuario = criarUsuario()
  registerPage.preencherCadastroSemCampo(usuario, campo)
  registerPage.cadastrar()
})

Then('devo ver mensagem de sucesso', () => {
  registerPage.validarCadastroSucesso()
})

Then('devo ver o número da conta criada', () => {
  registerPage.validarNumeroConta()
})

Then('devo ver mensagem de campo obrigatório', () => {
  cy.contains(/É campo obrigatório|não pode ser vazio/i).should('exist')
})

Then('devo ver a mensagem {string}', (mensagem) => {
  cy.contains(mensagem).should('exist')
})

When('tento cadastrar com o mesmo e-mail duas vezes', () => {
  usuario = criarUsuario()

  registerPage.preencherCadastro(usuario)
  registerPage.ativarSaldo()
  registerPage.cadastrar()
  registerPage.validarCadastroSucesso()
  cy.get('#btnCloseModal').click({ force: true })

  loginPage.elements.registerButton().click()
  registerPage.preencherCadastro(usuario)
  registerPage.ativarSaldo()
  registerPage.cadastrar()
})
