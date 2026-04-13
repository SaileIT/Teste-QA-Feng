# Relatório de Testes - Desafio QA Feng

## 1. Testes Exploratórios (Bugs Encontrados)

Abaixo estão listados os bugs identificados durante a execução dos testes manuais e automatizados, organizados por criticidade:

### 🔥 Alta Prioridade (Vulnerabilidades de Segurança Critical)

**Bug 1: Bypass de Autenticação via Modal Persistente**
* **Onde:** Fluxo de Logout / Tela de Login.
* **Comportamento atual:** Se o usuário estiver com o modal "+ Novo pedido" aberto e clicar no botão "Sair" no cabeçalho, o sistema redireciona para a tela de login, porém o modal de pedido **permanece visível e ativo sobre a tela de login**. É possível preencher os dados do pedido e clicar em "Confirmar pedido", e o pedido **é criado com sucesso** na listagem interna, mesmo o usuário estando teoricamente deslogado. 
* **Comportamento esperado:** Ao efetuar o logout, todas as sessões ativas e elementos de interface (modals, formulários) associados à sessão autenticada devem ser destruídos/encerrados imediatamente. O usuário deve ser redirecionado para a tela de login sem acesso a nenhuma funcionalidade do painel.

**Bug 2: Falha Crítica na Gestão de Sessão (Ausência de Invalidação de Cookie/Session)**
* **Onde:** Navegador (Fluxo de reinicialização).
* **Comportamento atual:** Ao fazer login no painel administrativo e, em seguida, fechar a janela ou aba do navegador, ao reabrir o navegador e acessar a URL do site (especialmente se o navegador estiver configurado para restaurar guias anteriores), o sistema carrega o painel **já autenticado**, sem solicitar as credenciais novamente.
* **Comportamento esperado:** Por se tratar de um painel administrativo que lida com dados financeiros e de clientes, fechar o navegador (ou uma sessão de inatividade) deve invalidar o token/cookie de sessão. O sistema deve obrigar o usuário a realizar login novamente para garantir a segurança.

---

### ⚠️ Média/Baixa Prioridade (Regras de Negócio e UI/UX)

**Bug 3: Ausência de feedback de sucesso (Cadastro de Pessoa, Produto e Criação de Pedido)**
* **Comportamento atual:** Ao concluir o cadastro de um cliente, produto ou finalizar um pedido, o sistema não exibe nenhuma notificação (alerta verde ou toast). O usuário só descobre que a ação funcionou se procurar o item nas listas inferiores.
* **Comportamento esperado:** Exibir uma notificação visual clara e temporária indicando o sucesso da ação.

**Bug 4: Falha na tratativa de erro visual (Campos Obrigatórios no Cadastro de Pessoa)**
* **Comportamento atual:** Ao tentar salvar um cliente sem preencher todos os campos, a tela congela. Nenhuma mensagem de erro é exibida e os campos vazios não ficam destacados.
* **Comportamento esperado:** Impedir a submissão e destacar visualmente os campos obrigatórios não preenchidos.

**Bug 5: Violação de Regra de Negócio (Campo Telefone Opcional)**
* **Comportamento atual:** Apesar das regras exigirem que todos os campos do cadastro de pessoa sejam obrigatórios, o sistema permite salvar o cliente preenchendo apenas Nome e E-mail, ignorando o Telefone.
* **Comportamento esperado:** O sistema deve bloquear o cadastro e exigir o preenchimento do campo Telefone.

**Bug 6: Violação de Regra de Negócio (Valor Mínimo do Pedido)**
* **Comportamento atual:** O sistema permite a criação e confirmação de pedidos com valor total inferior a R$ 5,00.
* **Comportamento esperado:** O sistema deve bloquear a confirmação do pedido se o total for menor que R$ 5,00, exibindo um alerta sobre o valor mínimo.

**Bug 7: Acúmulo de Modais e Sobreposição de Camadas (Stacking)**
* **Comportamento atual:** Na tela de Visão Pedidos, ao clicar repetidas vezes no botão "+ Novo pedido", o sistema abre múltiplas instâncias do modal sobrepostas. Isso escurece a tela progressivamente devido ao acúmulo das camadas de fundo escuro (*backdrop*).
* **Comportamento esperado:** O sistema deve gerenciar o estado do modal para abrir apenas uma única instância por vez.

**Bug 8: Barra de Busca Inoperante**
* **Comportamento atual:** A barra lateral de busca não possui funcionalidade. Ao digitar qualquer termo e pressionar Enter, nada acontece.
* **Comportamento esperado:** A busca deve filtrar a lista de itens da tela ativa ou funcionar como navegação rápida.

**Bug 9: Falha de Contraste na Busca (Modo Noturno)**
* **Comportamento atual:** No Modo Noturno, o estilo do campo de busca não é ajustado. O fundo da barra e a fonte digitada ficam com cores claras, tornando o texto invisível (legível apenas ao selecionar o texto).
* **Comportamento esperado:** Ajustar a cor da fonte para escura no input contra o fundo claro do input no tema escuro.

**Bug 10: Inconsistência de UI e Padronização nas Validações**
* **Comportamento atual:** O sistema utiliza múltiplos métodos para comunicar erros: ausência de aviso (Pessoa), validação nativa HTML5 (Produto), e alertas de sistema `window.alert` (Pedidos).
* **Comportamento esperado:** Criar um componente padronizado de notificação de erros para toda a aplicação.

**Bug 11: Ausência de indicação visual de campos obrigatórios**
* **Onde:** Formulário de Cadastro de Pessoa.
* **Comportamento atual:** Não há asteriscos (`*`) ou qualquer indicativo visual na interface sinalizando ao usuário quais campos são de preenchimento obrigatório.
* **Comportamento esperado:** Campos obrigatórios devem estar explicitamente marcados na interface (ex: `Nome *`) para orientar o usuário antes da submissão do formulário.

**Bug 12: Falha na validação de formato e limite de dados (Inputs de Pessoa)**
* **Onde:** Formulário de Cadastro de Pessoa.
* **Comportamento atual:** O sistema apresenta múltiplas falhas de validação de dados:
    * Os campos Nome, E-mail e Telefone não possuem restrição de limite mínimo ou máximo de caracteres.
    * O campo Telefone aceita a inserção de letras e caracteres especiais, em vez de restringir apenas a números.
    * O campo E-mail aceita qualquer texto inserido sem exigir a formatação padrão com domínio válido (ausência de validação da presença do `@` e `.com`).
* **Comportamento esperado:** Implementar validações de *front-end* e tipagem correta dos inputs: exigir formato válido de e-mail, aplicar máscara ou bloqueio numérico no telefone e definir limites razoáveis de caracteres (ex: min 3, max 100) para todos os campos.

---

## 2. Visão Analítica

**O que você melhoraria no sistema?**
* **Correção Urgente das Falhas de Segurança:** Os Bugs 1 e 2 devem ser prioridade zero, pois expõem o sistema a fraudes e acessos não autorizados.
* **Atributos para Automação:** Adicionar atributos `id` ou `data-cy` específicos em botões e campos cruciais para facilitar e estabilizar os scripts de teste automatizado (Cypress).
* **Tratamento de Erros e UX:** Padronizar todos os alertas do sistema e aplicar feedbacks visuais unificados (toasts/snackbars) para sucessos e erros.
* **Paginação de Dados:** Implementar paginação nas listagens para evitar sobrecarga de tela quando houver alto volume de produtos e pedidos.

**Quais novas funcionalidades você priorizaria?**
* **CRUD Completo (Edição e Exclusão):** Implementar as funções de editar (Update) e excluir (Delete). Atualmente, dados inseridos incorretamente não podem ser corrigidos.
* **Gestão de Status do Pedido:** Incluir um ciclo de vida para o pedido (Ex: "Aguardando Pagamento", "Em Preparo", "Entregue") para controle operacional real.
* **Dashboard Gerencial:** Criar uma tela "Home" exibindo as principais métricas do festival em tempo real (Faturamento total, total de pedidos).