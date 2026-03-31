class ExtratoPage {
  elements = {
    btnExtrato: () => cy.get('#btn-EXTRATO'),
    tiposTransacao: () => cy.get('#textTypeTransaction'),
    valores: () => cy.get('#textTransferValue'),
    datas: () => cy.get('#textDateTransaction'),
    descricoes: () => cy.get('#textDescription'),
    btnVoltar: () => cy.get('#btnBack'),
  }

  navegarParaExtrato() {
    this.elements.btnExtrato().click()
  }

  validarSaldoVisivel() {
    cy.get('#textBalanceAvailable').should('be.visible')
  }

  validarTransacaoComFormatacao(tipo, formatacao) {
    cy.contains('#textTypeTransaction', tipo).should('exist')
    cy.get('#textDateTransaction').first().invoke('text').should('match', /\d{2}\/\d{2}\/\d{4}/)
    if (formatacao === 'saída') {
      cy.get('#textTransferValue[type="withdrawal"]').invoke('text').should('match', /^-/)
    }
  }

  validarValoresPositivosEmVerde() {
    cy.get('#textTransferValue[type="input"], #textTransferValue[type="Abertura de conta"]').should('exist')
  }

  validarHifenParaSemComentario() {
    cy.contains('#textDescription', '-').should('exist')
  }
}

export default new ExtratoPage()
