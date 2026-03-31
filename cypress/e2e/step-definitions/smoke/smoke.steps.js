import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import loginPage from '../../../support/pages/loginPage'

let usuario

Given('que eu crio um novo usuário', () => {
  cy.criarUsuario().then((user) => {
    usuario = user
  })
})

When('faço login com esse usuário', () => {
  loginPage.login(usuario.email, usuario.password)
})

Then('devo ver o saldo disponível', () => {
  cy.contains(/saldo/i).should('be.visible')
})

When('acesso a tela de extrato', () => {
  cy.get('#btn-EXTRATO').click()
})

Then('devo ver o saldo disponível no extrato', () => {
  cy.contains(/R\$|saldo/i).should('be.visible')
})

When('navego para a home', () => {
  cy.visit('/home')
})

When('clico em sair', () => {
  cy.contains('Sair').click()
})

Then('devo ser redirecionado para o login', () => {
  cy.contains('button', 'Acessar').should('be.visible')
})

Then('devo ver a transferência no extrato', () => {
  cy.get('#textTypeTransaction').should('exist')
})