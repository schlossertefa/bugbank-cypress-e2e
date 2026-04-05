@regression-suite
Feature: Regressão Completa — BugBank

  # ─────────────────────────────────────────
  # LOGIN
  # ─────────────────────────────────────────

  @CT-LOGIN-01 @regression-suite
  Scenario Outline: Campo "<campo>" obrigatório bloqueia o acesso
    Given que estou na página de login do BugBank
    When clico em Acessar sem preencher o campo "<campo>"
    Then devo ver mensagem de campo obrigatório no login

    Examples:
      | campo |
      | email |
      | senha |

  @CT-LOGIN-03 @regression-suite
  Scenario: Login com usuário não cadastrado exibe erro
    Given que estou na página de login do BugBank
    When realizo login com e-mail "usuario.invalido@teste.com" e senha "123456"
    Then devo ver mensagem de erro no login

  @CT-LOGIN-04 @regression-suite
  Scenario: Login com credenciais válidas redireciona para a home
    Given que estou na página de login do BugBank
    And que tenho um usuário cadastrado
    When realizo login com as credenciais válidas
    Then devo ser redirecionado para a home

  # ─────────────────────────────────────────
  # CADASTRO
  # ─────────────────────────────────────────

  @CT-CADASTRO-01 @regression-suite
  Scenario Outline: Campo "<campo>" obrigatório bloqueia o cadastro
    Given que estou na tela de cadastro
    When envio o cadastro sem preencher o campo "<campo>"
    Then devo ver mensagem de campo obrigatório

    Examples:
      | campo       |
      | nome        |
      | email       |
      | senha       |
      | confirmacao |

  @CT-CADASTRO-02 @regression-suite
  Scenario: Cadastro sem nome exibe mensagem específica
    Given que estou na tela de cadastro
    When envio o cadastro sem preencher o campo "nome"
    Then devo ver a mensagem "Nome não pode ser vazio"

  # BUG-CADASTRO-01: mensagem diverge do requisito — docs/bugs/BUG-CADASTRO-01.md
  @CT-CADASTRO-03 @regression-suite @bug
  Scenario: Cadastro sem e-mail exibe mensagem específica
    Given que estou na tela de cadastro
    When envio o cadastro sem preencher o campo "email"
    Then devo ver a mensagem "Email não pode ser vazio"

  @CT-CADASTRO-06 @regression-suite
  Scenario: Criar conta com saldo cria conta com R$ 1.000,00
    Given que estou na tela de cadastro
    When preencho dados válidos
    And envio o cadastro
    Then devo ver mensagem de sucesso

  @CT-CADASTRO-07 @regression-suite
  Scenario: Cadastro sem saldo cria conta com saldo zero
    Given que estou na tela de cadastro
    When preencho dados válidos sem ativar saldo
    And envio o cadastro
    Then devo ver mensagem de sucesso

  @CT-CADASTRO-08 @regression-suite
  Scenario: Senhas divergentes bloqueiam o cadastro
    Given que estou na tela de cadastro
    When preencho senhas diferentes
    And envio o cadastro
    Then devo ver a mensagem "As senhas não são iguais."

  @CT-CADASTRO-09 @regression-suite
  Scenario: Cadastro com sucesso exibe número da conta
    Given que estou na tela de cadastro
    When preencho dados válidos
    And envio o cadastro
    Then devo ver o número da conta criada

  # ─────────────────────────────────────────
  # TRANSFERÊNCIA
  # ─────────────────────────────────────────

  @CT-TRANSFER-01 @regression-suite
  Scenario: Transferência para conta válida é permitida
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para a conta destino com valor "100" e descrição "Teste"
    Then devo ver mensagem de sucesso na transferência

  @CT-TRANSFER-02 @regression-suite
  Scenario: Transferência com saldo insuficiente é bloqueada
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para a conta destino com valor "9999" e descrição "Teste"
    Then devo ver mensagem de saldo insuficiente

  @CT-TRANSFER-03 @regression-suite
  Scenario: Transferência para conta inválida exibe erro
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para conta "999-9" valor "100" e descrição "Teste"
    Then devo ver mensagem de conta inválida

  @CT-TRANSFER-06 @regression-suite
  Scenario Outline: Transferência com valor "<valor>" é bloqueada
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para a conta destino com valor "<valor>" e descrição "Teste"
    Then devo ver mensagem de valor inválido

    Examples:
      | valor |
      | 0     |
      | -1    |

  @CT-TRANSFER-07 @regression-suite
  Scenario: Transferência realizada com sucesso exibe confirmação
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para a conta destino com valor "100" e descrição "Pagamento teste"
    Then devo ver mensagem de sucesso na transferência

  # ─────────────────────────────────────────
  # EXTRATO
  # ─────────────────────────────────────────

  @CT-EXTRATO-01 @regression-suite
  Scenario: Exibição do saldo no extrato
    Given que estou logado com conta com saldo e transferência realizada
    When navego para a tela de extrato
    Then devo ver o saldo disponível da conta

  @CT-EXTRATO-02 @regression-suite
  Scenario Outline: Transação "<tipo>" exibe data e formatação correta
    Given que estou logado com conta com saldo e transferência realizada
    When navego para a tela de extrato
    Then a transação "<tipo>" deve exibir data e estar formatada como "<formatacao>"

    Examples:
      | tipo                    | formatacao |
      | Abertura de conta       | entrada    |
      | Transferência recebida  | entrada    |
      | Transferência enviada   | saída      |

  @CT-EXTRATO-03 @regression-suite
  Scenario: Valores de entrada em verde
    Given que estou logado com conta com saldo e transferência realizada
    When navego para a tela de extrato
    Then as transações de "Abertura de conta" e "Transferência recebida" devem exibir valor em verde

  @CT-EXTRATO-04 @regression-suite
  Scenario: Hífen para transações sem comentário
    Given que estou logado com conta com saldo e transferência realizada
    When navego para a tela de extrato
    Then transações sem comentário devem exibir hífen na descrição

  @CT-EXTRATO-05 @regression-suite
  Scenario: Extrato exibe saldo zero para conta recém criada sem saldo
    Given que estou logado com conta sem saldo
    When navego para a tela de extrato
    Then o saldo deve ser exibido como zero
