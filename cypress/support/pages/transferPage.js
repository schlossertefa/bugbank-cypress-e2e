class TransferPage {
  elements = {
    accountInput: () => cy.get('input[name="accountNumber"]'),
    digitInput: () => cy.get('input[name="digit"]'),
    valueInput: () => cy.get('input[name="transferValue"]'),
    descriptionInput: () => cy.get('input[name="description"]'),
    transferButton: () => cy.contains('button', 'Transferir agora'),
  }

  navegarParaTransferencia() {
    cy.get('img[src*="transfer"]').click()
    this.elements.accountInput().should('not.be.disabled')
  }

  preencherTransferencia({ conta, valor, descricao }) {
    const [numero, digito] = conta.split('-')
    this.elements.accountInput().clear().type(numero)
    if (digito !== undefined) {
      this.elements.digitInput().clear().type(digito)
    }
    this.elements.valueInput().clear().type(valor)
    if (descricao) {
      this.elements.descriptionInput().clear().type(descricao)
    }
  }

  transferir() {
    this.elements.transferButton().click()
  }

  validarSucesso() {
    cy.contains(/transferência realizada|sucesso/i).should('exist')
  }

  validarErro(mensagem) {
    cy.contains(mensagem).should('exist')
  }

  validarRedirecionamentoExtrato() {
    cy.url().should('include', '/bank-statement')
  }
}

export default new TransferPage()
