# NEXA360 CRM Enterprise — v1.11.1

Demonstração académica e comercial de um CRM multilingue orientado à gestão de relações, oportunidades e decisões comerciais.

## Módulos funcionais

- Centro de Comando com prioridades, métricas, meta comercial e inteligência executiva;
- gestão de leads, parceiros, oportunidades, contactos e tarefas;
- termómetro e histórico de relacionamento editáveis;
- relatórios executivos, exportação CSV e impressão em PDF;
- contactos profissionais por Outlook, WhatsApp e telefone;
- definições, perfil persistente e cópia de segurança JSON;
- interface em português, inglês, espanhol e chinês;
- identidade visual, favicon e avatares fictícios da equipa;
- persistência demonstrativa no `localStorage` do navegador.

## Matriz de prioridades e delegação v1.11.1

- matriz de Eisenhower reservada ao perfil de administração;
- classificação editável por urgência, importância e possibilidade de delegação;
- quadrantes Fazer agora, Planear, Delegar e Reavaliar/Arquivar;
- colaboradores limitados às tarefas atribuídas ao respetivo nome;
- migração automática dos registos anteriores e persistência no navegador;
- experiência integral em português, inglês, espanhol e chinês.
- cartões da matriz com edição direta e instruções de utilização;
- criação de tarefas diretamente em cada quadrante, com classificação pré-preenchida.

## Otimização v1.10.6

As páginas são carregadas sob demanda com `React.lazy` e `Suspense`. Os gráficos e a respetiva biblioteca deixam de integrar o ficheiro JavaScript inicial, reduzindo o primeiro carregamento e eliminando o aviso de blocos superiores a 500 kB.

## Responsividade e acessibilidade v1.10.7

- ligação para saltar diretamente ao conteúdo principal;
- foco de teclado visível e alvos tácteis reforçados em ecrãs pequenos;
- navegação e seleção de idioma com estados acessíveis;
- diálogos identificados, com foco contido, fecho pela tecla `Escape` e reposição do foco;
- compatibilidade com preferência por movimento reduzido e modo de alto contraste;
- melhorias de leitura de tabelas, textos longos e ações em telemóvel.

## Executar localmente

Requisitos: Node.js 20 ou superior e npm 10 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço indicado pelo Vite. Esta versão utiliza acesso exclusivamente demonstrativo.

## Validar e criar a versão de produção

```bash
npm audit --audit-level=high
npm run build
npm run preview
```

A configuração utiliza caminhos relativos, compatíveis com execução local, Vercel e GitHub Pages.

## Segurança e dados

Esta é uma aplicação estática sem autenticação real, servidor privado ou base de dados. Utilize exclusivamente dados fictícios. Consulte [SECURITY.md](SECURITY.md) antes de publicar ou adaptar o projeto.
