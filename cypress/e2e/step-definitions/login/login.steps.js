import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import loginPage from '../../../support/pages/loginPage'

let usuario

Given('que estou na página de login do BugBank', () => {
  cy.visit('/')
})

Given('que tenho um usuário cadastrado', () => {
  cy.criarUsuario().then((user) => {
    usuario = user
  })
})

When('clico em Acessar sem preencher os campos', () => {
  loginPage.acessarSemCredenciais()
})

When('clico em Acessar sem preencher o campo {string}', (campo) => {
  if (campo !== 'email') loginPage.elements.emailInput().type('usuario@teste.com')
  if (campo !== 'senha') loginPage.elements.passwordInput().type('123456')
  loginPage.acessarSemCredenciais()
})

When('realizo login com as credenciais válidas', () => {
  loginPage.login(usuario.email, usuario.password)
})

When('realizo login com e-mail {string} e senha {string}', (email, senha) => {
  loginPage.login(email, senha)
})

When('realizo login com o e-mail do usuário e senha incorreta', () => {
  loginPage.login(usuario.email, 'senhaerrada123')
})

Then('devo ver mensagem de campo obrigatório no login', () => {
  loginPage.validarCampoObrigatorio()
})

Then('devo ser redirecionado para a home', () => {
  loginPage.validarLoginSucesso()
})

Then('devo ver mensagem de erro no login', () => {
  loginPage.validarErroLogin()
})
