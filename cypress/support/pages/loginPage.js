class LoginPage {
  elements = {
    emailInput: () => cy.get('input[name="email"]').first(),
    passwordInput: () => cy.get('input[name="password"]').first(),
    loginButton: () => cy.contains('button', 'Acessar'),
    registerButton: () => cy.contains('button', 'Registrar')
  }

  login(email, senha) {
    this.elements.emailInput().clear().type(email)
    this.elements.passwordInput().clear().type(senha)
    this.elements.loginButton().click()
  }

  acessarSemCredenciais() {
    this.elements.loginButton().click()
  }

  validarLoginSucesso() {
    cy.contains(/bem.vindo/i).should('be.visible')
  }

  validarErroLogin() {
    cy.contains(/acesso negado|inválido|não encontrado|campo obrigatório/i).should('exist')
  }

  validarCampoObrigatorio() {
    cy.contains('É campo obrigatório').should('exist')
  }
}

export default new LoginPage()
