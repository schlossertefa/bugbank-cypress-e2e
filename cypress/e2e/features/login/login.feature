@regression
Feature: Login

  Background:
    Given que estou na página de login do BugBank

  @CT-LOGIN-01
  Scenario Outline: Campo "<campo>" obrigatório bloqueia o acesso
    When clico em Acessar sem preencher o campo "<campo>"
    Then devo ver mensagem de campo obrigatório no login

    Examples:
      | campo |
      | email |
      | senha |

  # BUG-LOGIN-01: sistema exibe "É campo obrigatório" em vez de "Usuário e senha precisam ser preenchidos"
  # Documentação completa em: docs/bugs/BUG-LOGIN-01.md
  @CT-LOGIN-02 @bug
  Scenario: Login sem credenciais exibe mensagem específica do requisito
    When clico em Acessar sem preencher os campos
    Then devo ver a mensagem "Usuário e senha precisam ser preenchidos"

  @CT-LOGIN-03 
  Scenario: Login com usuário não cadastrado exibe erro
    When realizo login com e-mail "usuario.invalido@teste.com" e senha "123456"
    Then devo ver mensagem de erro no login

  @CT-LOGIN-04
  Scenario: Login com credenciais válidas redireciona para a home
    Given que tenho um usuário cadastrado
    When realizo login com as credenciais válidas
    Then devo ser redirecionado para a home
