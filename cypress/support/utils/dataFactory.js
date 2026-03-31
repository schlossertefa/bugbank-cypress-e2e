import { faker } from '@faker-js/faker';

export function criarUsuario({ senha = '123456' } = {}) {
  return {
    email: faker.internet.email(),
    nome: faker.person.fullName(),
    password: senha,
  };
}

export function criarTransferencia({ valor = '100', descricao = 'Transferência teste' } = {}) {
  return {
    valor,
    descricao,
  };
}