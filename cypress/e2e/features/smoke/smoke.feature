@smoke
Feature: Fluxo completo do usuário

  Scenario: Criar conta, logar e visualizar saldo
    Given que eu crio um novo usuário
    When faço login com esse usuário
    Then devo ver o saldo disponível

  Scenario: Acessar o extrato e visualizar saldo
    Given que eu crio um novo usuário
    When faço login com esse usuário
    And acesso a tela de extrato
    Then devo ver o saldo disponível no extrato

  Scenario: Cadastro com sucesso exibe mensagem de confirmação
    Given que estou na tela de cadastro
    When preencho dados válidos
    And envio o cadastro
    Then devo ver mensagem de sucesso

  Scenario: Campos obrigatórios bloqueiam o acesso
    Given que estou na página de login do BugBank
    When clico em Acessar sem preencher os campos
    Then devo ver mensagem de campo obrigatório no login

  Scenario: Login com credenciais válidas redireciona para a home
    Given que tenho um usuário cadastrado
    When realizo login com as credenciais válidas
    Then devo ser redirecionado para a home

  Scenario: Transferência realizada com sucesso exibe confirmação
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para a conta destino com valor "100" e descrição "Pagamento teste"
    Then devo ver mensagem de sucesso na transferência

  Scenario: Transferência com saldo insuficiente exibe mensagem de erro
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para a conta destino com valor "999999" e descrição "Smoke teste"
    Then devo ver mensagem de saldo insuficiente

  Scenario: Login com credenciais inválidas bloqueia acesso
    Given que estou na página de login do BugBank
    When realizo login com e-mail "invalido@teste.com" e senha "senhaerrada"
    Then devo ver mensagem de erro no login

  Scenario: Logout encerra sessão e redireciona para o login
    Given que tenho um usuário cadastrado
    When realizo login com as credenciais válidas
    And clico em sair
    Then devo ser redirecionado para o login

  Scenario: Extrato exibe transferência realizada
    Given que estou logado com saldo e tenho uma conta de destino
    When realizo transferência para a conta destino com valor "100" e descrição "Smoke extrato"
    And fecho o modal de sucesso
    And navego para a home
    And acesso a tela de extrato
    Then devo ver a transferência no extrato

  Scenario: Cadastro com senhas diferentes bloqueia cadastro
    Given que estou na tela de cadastro
    When preencho senhas diferentes
    And envio o cadastro
    Then devo ver a mensagem "As senhas não são iguais"
