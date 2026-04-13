// Arquivo: cypress/e2e/festival_admin.cy.js

describe('Fluxos Principais - Painel Administrativo do Festival', () => {
  const baseUrl = 'https://desafio-feng-qa-ab3c59.gitlab.io';
  
  Cypress.Commands.add('fazerLogin', () => {
    cy.visit(baseUrl);
    cy.get('#email').type('admin@festival.com');
    cy.get('#password').type('123456');
    cy.get('#login-submit').click();
});

  context('1. Login', () => {
    beforeEach(() => {
      cy.visit(baseUrl);
    });

    it('Deve realizar login com sucesso', () => {
      cy.get('#email').type('admin@festival.com');
      cy.get('#password').type('123456');
      cy.get('#login-submit').click();

      cy.contains('Visão Pedidos').should('be.visible');
    });

    it('Deve exibir erro ao tentar login com credenciais inválidas', () => {
      cy.get('#email').type('admin@festival.com');
      cy.get('#password').type('SenhaIncorreta');
      cy.get('#login-submit').click();

      cy.contains('E-mail ou senha inválidos.').should('be.visible');
    });
  });

  context('2. Cadastro de Pessoa', () => {
    beforeEach(() => {
     cy.fazerLogin();
      
      cy.get('#btn-novo-pedido').click();
      cy.get('#btn-add-cliente').click();
    });

    it('Deve cadastrar uma pessoa com sucesso', () => {
      const nomeUnico = 'Cliente Teste ' + new Date().getTime(); 

      cy.get('#nc-nome').type(nomeUnico);
      cy.get('#nc-email').type('joao.silva@email.com');
      cy.get('#nc-telefone').type('11999999999');
      
      cy.get('#btn-save-cliente').click();

      cy.get('#new-order-cliente').should('contain', nomeUnico);
    });

    it('Deve não permitir o cadastro ao omitir campo obrigatório', () => {
      cy.get('#nc-nome').type('Maria Souza');
      
      cy.get('#btn-save-cliente').click();

      cy.get('#nc-nome').should('be.visible'); 
    });
  });

  context('3. Cadastro de Produtos', () => {
    beforeEach(() => {
      cy.fazerLogin();
      
      cy.contains('Produtos').click({ force: true });
    });

    it('Deve cadastrar um produto com sucesso', () => {
      const nomeProd = 'Produto Teste ' + new Date().getTime();

      cy.get('#prod-nome').type(nomeProd);
      cy.get('#prod-descricao').type('Descrição automática de teste');
      cy.get('#prod-valor').type('15.50');
      
      cy.contains('Cadastrar').click();

      cy.get('table').should('contain', nomeProd);
    });

    it('Deve exibir erro ao tentar cadastrar produto sem valor', () => {
      const nomeProdInvalido = 'Produto Sem Preço';

      cy.get('#prod-nome').type(nomeProdInvalido);
      
      cy.contains('Cadastrar').click();

      cy.get('table').should('not.contain', nomeProdInvalido);
      
      cy.get('#prod-valor').then(($input) => {
        expect($input[0].validationMessage).to.contain('Preencha este campo');
      });
    });
  });

  context('4. Criação de Pedido', () => {
    beforeEach(() => {
      cy.fazerLogin();
      
      cy.get('#btn-novo-pedido').click();
    });

    it('Deve criar um pedido com sucesso', () => {
      cy.get('#new-order-cliente').select(1); 
      
      cy.get('#new-order-item-select').select(1);
      cy.get('#new-order-item-qty').clear().type('2');
      cy.get('#btn-add-item').click();
      
      cy.contains('Confirmar pedido').click();

      cy.get('#new-order-cliente').should('not.exist');
    });

    it('Deve exibir alerta ao tentar criar pedido sem itens', () => {
      cy.get('#new-order-cliente').select(1);
      
      cy.on('window:alert', (textoDoAlerta) => {
        expect(textoDoAlerta).to.contains('Adicione pelo menos um item ao pedido.');
      });

      cy.contains('Confirmar pedido').click();
    });

    it('Deve exigir a seleção de um cliente', () => {
      cy.get('#new-order-item-select').select(1);
      cy.get('#new-order-item-qty').clear().type('1');
      cy.get('#btn-add-item').click();
      
      cy.contains('Confirmar pedido').click();

      cy.get('#new-order-cliente').should('be.visible');
      
      cy.get('#new-order-cliente').then(($select) => {
        expect($select[0].validationMessage).to.contain('Selecione um item da lista');
      });
    });
  });
});