class RegisterPage {
  elements = {
    emailInput: () => cy.get('input[placeholder="Informe seu e-mail"]').last(),
    nameInput: () => cy.get('input[placeholder="Informe seu Nome"]'),
    passwordInput: () => cy.get('input[placeholder="Informe sua senha"]').last(),
    confirmPasswordInput: () => cy.get('input[placeholder="Informe a confirmação da senha"]'),
    toggleBalance: () => cy.get('#toggleAddBalance'),
    submitButton: () => cy.contains('button', 'Cadastrar'),
    backToLogin: () => cy.get('#btnBackButton')
  }

  esperarModalCadastro() {
    cy.get('input[placeholder="Informe seu Nome"]').should('exist')
  }

  preencherCadastro(usuario) {
    this.esperarModalCadastro()

    this.elements.emailInput()
      .clear({ force: true })
      .type(usuario.email, { force: true })

    this.elements.nameInput()
      .clear({ force: true })
      .type(usuario.nome ?? 'Usuário Teste', { force: true })

    this.elements.passwordInput()
      .clear({ force: true })
      .type(usuario.password, { force: true })

    this.elements.confirmPasswordInput()
      .clear({ force: true })
      .type(usuario.password, { force: true })
  }

  preencherCadastroSemCampo(usuario, campo) {
    this.esperarModalCadastro()

    if (campo !== 'email') {
      this.elements.emailInput().clear({ force: true }).type(usuario.email, { force: true })
    }
    if (campo !== 'nome') {
      this.elements.nameInput().clear({ force: true }).type(usuario.nome, { force: true })
    }
    if (campo !== 'senha') {
      this.elements.passwordInput().clear({ force: true }).type(usuario.password, { force: true })
    }
    if (campo !== 'confirmacao') {
      this.elements.confirmPasswordInput().clear({ force: true }).type(usuario.password, { force: true })
    }
  }

  preencherSenhaDiferente(usuario, senha, confirmacao) {
    this.esperarModalCadastro()

    this.elements.emailInput().clear({ force: true }).type(usuario.email, { force: true })
    this.elements.nameInput().clear({ force: true }).type(usuario.nome ?? 'Usuário Teste', { force: true })
    this.elements.passwordInput().clear({ force: true }).type(senha, { force: true })
    this.elements.confirmPasswordInput().clear({ force: true }).type(confirmacao, { force: true })
  }

  ativarSaldo() {
    this.elements.toggleBalance().click({ force: true })
  }

  cadastrar() {
    this.elements.submitButton().click({ force: true })
  }

  voltarLogin() {
    this.elements.backToLogin()
      .should('be.visible')
      .click()
  }

  validarCadastroSucesso() {
    cy.contains(/sucesso/i).should('be.visible')
  }

  validarNumeroConta() {
    cy.contains(/A conta \d+-\d+ foi criada com sucesso/i).should('be.visible')
  }

  validarErroCadastro() {
    cy.contains(/erro|inválido|diferente/i).should('be.visible')
  }
}

export default new RegisterPage()
