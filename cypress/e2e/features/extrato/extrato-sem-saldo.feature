@regression
Feature: Extrato 

  Background:
    Given que estou logado com conta sem saldo

  @CT-EXTRATO-05
  Scenario: Extrato exibe saldo zero para conta recém criada sem saldo
    When navego para a tela de extrato
    Then o saldo deve ser exibido como zero
