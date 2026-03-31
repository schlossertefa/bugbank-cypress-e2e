@regression
Feature: Cadastro de usuário

  Background:
    Given que estou na tela de cadastro

  @CT-CADASTRO-01 
  Scenario Outline: Campo "<campo>" obrigatório bloqueia o cadastro
    When envio o cadastro sem preencher o campo "<campo>"
    Then devo ver mensagem de campo obrigatório

    Examples:
      | campo       |
      | nome        |
      | email       |
      | senha       |
      | confirmacao |

  @CT-CADASTRO-02
  Scenario: Cadastro sem nome exibe mensagem específica
    When envio o cadastro sem preencher o campo "nome"
    Then devo ver a mensagem "Nome não pode ser vazio"

  # BUG-CADASTRO-01: mensagem diverge do requisito — docs/bugs/BUG-CADASTRO-01.md
  @CT-CADASTRO-03 @bug
  Scenario: Cadastro sem e-mail exibe mensagem específica
    When envio o cadastro sem preencher o campo "email"
    Then devo ver a mensagem "Email não pode ser vazio"

  # BUG-CADASTRO-02: mensagem diverge do requisito — docs/bugs/BUG-CADASTRO-02.md
  @CT-CADASTRO-04 @bug
  Scenario: Cadastro sem senha exibe mensagem específica
    When envio o cadastro sem preencher o campo "senha"
    Then devo ver a mensagem "Senha não pode ser vazio"

  # BUG-CADASTRO-03: mensagem diverge do requisito — docs/bugs/BUG-CADASTRO-03.md
  @CT-CADASTRO-05 @bug
  Scenario: Cadastro sem confirmação de senha exibe mensagem específica
    When envio o cadastro sem preencher o campo "confirmacao"
    Then devo ver a mensagem "Confirmar senha não pode ser vazio"

  @CT-CADASTRO-06
  Scenario: Criar conta com saldo cria conta com R$ 1.000,00
    When preencho dados válidos
    And envio o cadastro
    Then devo ver mensagem de sucesso

  @CT-CADASTRO-07
  Scenario: Cadastro sem saldo cria conta com saldo zero
    When preencho dados válidos sem ativar saldo
    And envio o cadastro
    Then devo ver mensagem de sucesso

  @CT-CADASTRO-08 
  Scenario: Senhas divergentes bloqueiam o cadastro
    When preencho senhas diferentes
    And envio o cadastro
    Then devo ver a mensagem "As senhas não são iguais."

  @CT-CADASTRO-09
  Scenario: Cadastro com sucesso exibe número da conta
    When preencho dados válidos
    And envio o cadastro
    Then devo ver o número da conta criada

  @CT-CADASTRO-10
  Scenario: Cadastro com e-mail já existente exibe mensagem de erro
    When tento cadastrar com o mesmo e-mail duas vezes
    Then devo ver a mensagem "Email já cadastrado!"
