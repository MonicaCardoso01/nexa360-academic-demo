# Segurança — NEXA360 CRM Enterprise

## Estado desta versão

Esta aplicação publicada no GitHub Pages é uma demonstração académica e comercial. É uma aplicação estática executada no navegador e não possui servidor de autenticação, base de dados privada ou controlo de acesso confiável.

Utilize exclusivamente dados fictícios. Não introduza dados pessoais, credenciais reais, informação financeira, contratos ou informação confidencial.

## Proteções implementadas

- HTTPS fornecido pelo GitHub Pages;
- Política de Segurança de Conteúdo (CSP) compatível com a aplicação estática;
- encerramento da sessão demonstrativa após 15 minutos sem atividade;
- campos de acesso limitados e palavra-passe demonstrativa com mínimo de oito caracteres;
- auditoria de dependências durante o deploy;
- atualizações automáticas propostas pelo Dependabot;
- permissões mínimas no workflow de publicação;
- ficheiros de ambiente e dependências excluídos do Git.

## Limites conhecidos

- O seletor de perfil e a palavra-passe são demonstrativos e não constituem autenticação real.
- Os registos são guardados no `localStorage` do navegador e não são apropriados para dados reais.
- As permissões apresentadas na interface não substituem autorização validada num servidor.
- A CSP definida por `meta` é uma proteção parcial; cabeçalhos HTTP devem ser configurados na hospedagem profissional.

## Requisitos para produção

Antes de utilizar dados reais, migrar para uma arquitetura com:

1. backend e API autenticada;
2. base de dados privada com encriptação em repouso e cópias de segurança;
3. autenticação por fornecedor confiável, MFA e recuperação segura de conta;
4. autorização por função validada no servidor;
5. cookies de sessão `HttpOnly`, `Secure` e `SameSite`;
6. registos de auditoria, monitorização e alertas;
7. gestão de consentimento, retenção e eliminação em conformidade com o RGPD;
8. testes de segurança, revisão de código e plano de resposta a incidentes.

## Comunicação responsável

Não publique vulnerabilidades com dados sensíveis numa issue pública. Comunique o problema diretamente à responsável do projeto, indicando a versão, o impacto e os passos mínimos para reprodução, sem incluir credenciais ou dados pessoais.
