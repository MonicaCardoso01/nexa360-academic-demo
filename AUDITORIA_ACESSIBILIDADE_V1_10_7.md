# Auditoria de responsividade e acessibilidade — v1.10.7

## Âmbito

Revisão da navegação principal, autenticação demonstrativa, seletor de idiomas, diálogos, tabelas, estados de carregamento e comportamento em ecrãs pequenos.

## Melhorias implementadas

- Acesso direto ao conteúdo principal por teclado.
- Indicação semântica da página ativa e do idioma selecionado.
- Rótulos acessíveis em português, inglês, espanhol e chinês.
- Foco visível para ligações, botões e campos de formulário.
- Diálogos com `role="dialog"`, `aria-modal`, fecho por `Escape`, ciclo de foco e reposição do foco anterior.
- Mensagens de autenticação anunciadas por tecnologias de apoio.
- Alvos tácteis mínimos reforçados em dispositivos móveis.
- Respeito pela preferência do sistema por movimento reduzido.
- Apoio adicional a alto contraste e quebra segura de textos extensos.

## Validação técnica

- Compilação de produção com Vite.
- Auditoria de dependências com npm.
- Verificação estática das relações entre rótulos, estados ARIA, navegação e diálogos.

## Limite desta auditoria

Esta revisão melhora substancialmente a acessibilidade técnica da demonstração, mas não substitui testes formais com utilizadores, tecnologias de apoio e uma certificação WCAG completa.
