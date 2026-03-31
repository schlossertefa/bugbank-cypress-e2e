@regression
Feature: Transferência

  Background:
    Given que estou logado com saldo e tenho uma conta de destino

  @CT-TRANSFER-01
  Scenario: Transferência para conta válida é permitida
    When realizo transferência para a conta destino com valor "100" e descrição "Teste"
    Then devo ver mensagem de sucesso na transferência

  @CT-TRANSFER-02
  Scenario: Transferência com saldo insuficiente é bloqueada
    When realizo transferência para a conta destino com valor "9999" e descrição "Teste"
    Then devo ver mensagem de saldo insuficiente

  @CT-TRANSFER-03 
  Scenario: Transferência para conta inválida exibe erro
    When realizo transferência para conta "999-9" valor "100" e descrição "Teste"
    Then devo ver mensagem de conta inválida

  @CT-TRANSFER-04 @bug
  Scenario Outline: Campo "<campo>" não deve aceitar letras
    When preencho o campo "<campo>" com "<valor_invalido>" na transferência
    Then o campo "<campo>" não deve aceitar letras

    Examples:
      | campo  | valor_invalido |
      | conta  | ABC            |
      | digito | XYZ            |
      | valor  | ABC            |

  @CT-TRANSFER-05 @bug @BUG-TRANSFER-03
  Scenario: Transferência sem descrição deve ser bloqueada
    When realizo transferência para a conta destino com valor "100" sem descrição
    Then a transferência deve ser bloqueada por descrição ausente

  @CT-TRANSFER-06
  Scenario Outline: Transferência com valor "<valor>" é bloqueada
    When realizo transferência para a conta destino com valor "<valor>" e descrição "Teste"
    Then devo ver mensagem de valor inválido

    Examples:
      | valor |
      | 0     |
      | -1    |

  @CT-TRANSFER-07
  Scenario: Transferência realizada com sucesso exibe confirmação
    When realizo transferência para a conta destino com valor "100" e descrição "Pagamento teste"
    Then devo ver mensagem de sucesso na transferência

  @CT-TRANSFER-08 @bug
  # BUG-TRANSFER-02: sistema não redireciona para extrato após transferência — docs/bugs/BUG-TRANSFER-02.md
  Scenario: Após transferência deve redirecionar para extrato
    When realizo transferência para a conta destino com valor "100" e descrição "Pagamento teste"
    And fecho o modal de sucesso
    Then devo ser redirecionado para o extrato
