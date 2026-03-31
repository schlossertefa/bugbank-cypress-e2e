@regression
Feature: Extrato 

  Background:
    Given que estou logado com conta com saldo e transferência realizada

  @CT-EXTRATO-01 
  Scenario: Exibição do saldo no extrato
    When navego para a tela de extrato
    Then devo ver o saldo disponível da conta

  @CT-EXTRATO-02
  Scenario Outline: Transação "<tipo>" exibe data e formatação correta
    When navego para a tela de extrato
    Then a transação "<tipo>" deve exibir data e estar formatada como "<formatacao>"

    Examples:
      | tipo                    | formatacao |
      | Abertura de conta       | entrada    |
      | Transferência recebida  | entrada    |
      | Transferência enviada   | saída      |

  @CT-EXTRATO-03 
  Scenario: Valores de entrada em verde
    When navego para a tela de extrato
    Then as transações de "Abertura de conta" e "Transferência recebida" devem exibir valor em verde

  @CT-EXTRATO-04 
  Scenario: Hífen para transações sem comentário
    When navego para a tela de extrato
    Then transações sem comentário devem exibir hífen na descrição
