# Auditoria técnica — NEXA360 CRM Enterprise v1.10.6

Data: 8 de agosto de 2026

## Objetivo

Eliminar o aviso de JavaScript superior a 500 kB sem retirar funcionalidades, preservar a compatibilidade com GitHub Pages e rever a segurança básica da demonstração pública.

## Otimização implementada

- carregamento diferido das oito páginas autenticadas com `React.lazy`;
- transição acessível com `Suspense` durante a abertura de cada módulo;
- separação automática dos gráficos e dependências associadas;
- manutenção da página de acesso no bloco inicial para abertura imediata;
- preservação dos dados, permissões demonstrativas, idiomas e navegação existentes.

## Resultado da compilação

| Indicador | v1.10.5 | v1.10.6 |
| --- | ---: | ---: |
| Maior ficheiro JavaScript inicial | 845,26 kB | 264,02 kB |
| Maior bloco JavaScript | 845,26 kB | 322,39 kB |
| Blocos superiores a 500 kB | 1 | 0 |
| Aviso de tamanho do Vite | Sim | Não |

O bloco inicial diminuiu aproximadamente 68,8%. Os módulos mais pesados são transferidos apenas quando o utilizador abre uma página que necessita deles.

## Segurança e dependências

- `npm audit --audit-level=high`: 0 vulnerabilidades;
- PostCSS e Nano ID atualizados no ficheiro de dependências bloqueadas;
- CSP, política de referência e workflow de auditoria preservados;
- não foram encontrados segredos, chaves de API, `eval`, `document.write` ou HTML injetado;
- ligações externas do Outlook e WhatsApp mantêm `noopener,noreferrer`.

## Validações executadas

- instalação reprodutível com `npm ci`;
- compilação de produção com 648 módulos transformados;
- manifesto de produção gerado e conferido;
- 14 recursos JavaScript/CSS de produção verificados com resposta HTTP 200;
- todas as páginas autenticadas confirmadas como blocos dinâmicos independentes;
- comparação com a fonte v1.10.5 para confirmar o âmbito das alterações.

## Limite desta versão

O CRM continua a ser uma demonstração estática. A palavra-passe e os perfis não constituem autenticação real, e os dados permanecem no `localStorage` do navegador. Dados pessoais ou confidenciais exigem backend, base de dados privada, autenticação forte, autorização no servidor, auditoria e medidas RGPD adicionais.
