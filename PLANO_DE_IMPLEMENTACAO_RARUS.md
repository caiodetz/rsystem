# Plano Mestre de Implementação: RARUS Tecnologia & Serviços

Plano completo de engenharia e implementação para o sistema **RARUS Tecnologia & Serviços**, baseado na especificação aprovada em [REQUISITOS_E_DUVIDAS_RARUS.md](file:///Users/caiodetz/Documents/Projetos/RSYSTEM/REQUISITOS_E_DUVIDAS_RARUS.md) e nos mockups de referência (`cliente exemplo.webp`, `exemplo de desing textos e componentes .webp`, `exemplo para tela de OS e CLIENTES.webp`).

---

## 📊 Matriz de Tarefas & Status de Execução

### FASE 1: Core Domain, Tipagem Avançada & Mock Database
- [x] **Task 1.1:** Atualizar `src/core/types/index.ts` com todos os novos modelos de dados:
  - `Cliente` (múltiplos contatos, geolocalização, observações)
  - `Equipamento` (vinculado ao cliente, patrimônio, serviço anterior, lacre anterior/novo, selo anterior/novo, GEHAKA)
  - `OrdemServico` (14 status, múltiplos equipamentos vinculados com certificados `0000-X/AA`, peças e peças de serviço)
  - `EstoqueLocal`, `ItemEstoque`, `MovimentacaoEstoque` (Estoque Central vs. Estoques dos Técnicos, Físico vs. Fiscal)
  - `TipoCalibracao`, `RelatoCalibracao`, `CertificadoCalibracao` (Template HTML com variáveis `{{}}`, tabela de coleta personalizada, padrões basais)
  - `PadraoBasal` (identificador `TH-01`, escala de alertas 90d/60d/30d crítico e bloqueio por vencimento)
  - `UsuarioFuncionario` (matriz de permissão de calibração, assinatura digital em imagem `.png`, RH)
- [x] **Task 1.2:** Expandir `src/core/mock-db/data.ts` com dados semente realistas da RARUS (equipamentos GEHAKA, clientes com múltiplos equipamentos, estoque central e de técnicos, padrões basais com identificadores e relatos configurados).
- [x] **Task 1.3:** Criar/atualizar Domain Services:
  - `estoqueService.ts` (saldo físico vs. fiscal, transferências, requisições de técnicos)
  - `relatosService.ts` (gerenciamento de templates HTML com variáveis, fórmulas e validação de permissão do técnico)
  - `ordensServicoService.ts` (regras dos 14 status, múltiplos equipamentos, numeração `0000-X/AA`, baixa física e fiscal)
  - `padroesBasaisService.ts` (regras de alerta 90d/60d/30d e bloqueio)

---

### FASE 2: Design System RARUS & Novo Layout Workstation
- [x] **Task 2.1:** Atualizar o Design System (`src/styles/desktop.css` e `globals.css`) com as cores oficiais RARUS (`#0a2240` Navy, `#1d82cd` Electric Cyan), tema Claro/Escuro completo, tipografia refinada, cartões KPI com tendências e avatares de iniciais da tabela.
- [x] **Task 2.2:** Criar a nova **Sidebar Lateral Retrátil** inspirada em `exemplo para tela de OS e CLIENTES.webp`:
  - Logo RARUS no topo (`/logo-rarus.png`) + Seletor de Unidade
  - Seções agrupadas com badges dinâmicos de contagem
  - Widget de progresso operacional / meta no rodapé da sidebar
- [x] **Task 2.3:** Integrar com o **Modelo Híbrido de Abas MDI Superiores** (`DesktopTabs`), permitindo abrir e alternar simultaneamente telas sem perder contexto.
- [x] **Task 2.4:** Atualizar a **Top Bar** com busca global `⌘K`, alternador de tema Claro/Escuro, perfil do técnico e ações rápidas.
- [x] **Task 2.5:** Atualizar a **Paleta de Comandos (`⌘K`)** para executar comandos diretos (ex: digitar *"contagem de estoque"* e abrir a tela diretamente) além da busca em todas as entidades.

---

### FASE 3: Módulo de Clientes (Visão 360º & Gestão)
- [x] **Task 3.1:** Implementar a lista de Clientes com KPIs superiores, abas de contadores e DataGrid com avatares de iniciais e badges de status.
- [x] **Task 3.2:** Implementar a tela rica de **Perfil 360º do Cliente** inspirada em `cliente exemplo.webp`:
  - Card de Identidade com mapa, contatos rápidos e observações
  - Abas: `[Ordens de Serviço]`, `[Equipamentos]`, `[Certificados]`, `[Histórico & Interações]`, `[Faturamento]`
  - Botão `[+ Novo Equipamento]` com ID do cliente pré-vinculado
  - Painel lateral de **"Próximos Passos"** com checklist e alerta de calibração anual

---

### FASE 4: Módulo de Estoque (Central & Técnicos) & Peças de Serviço
- [x] **Task 4.1:** Criar a visão de **Estoque Central & Estoques por Técnico** com seleção de local de estoque.
- [x] **Task 4.2:** Cadastro de Peças e Peças de Serviço (identificação fiscal NFS-e vs. NF-e).
- [x] **Task 4.3:** Fluxo de Transferência e Requisição de Peças (técnico solicita ➔ almoxarifado aprova).
- [x] **Task 4.4:** Auditoria e rastreabilidade de peças por código e número de série/ID.

---

### FASE 5: Módulo de Ordens de Serviço (Workflow de 14 Status & Múltiplos Equipamentos)
- [x] **Task 5.1:** Tabela e quadro de OS com filtros pelos 14 status oficiais e visualização de múltiplos equipamentos vinculados.
- [x] **Task 5.2:** Formulário de Abertura de OS permitindo adicionar 1 ou mais equipamentos do cliente.
- [x] **Task 5.3:** Lançamento de peças e serviços na OS com abatimento físico imediato e fiscal no faturamento.
- [x] **Task 5.4:** Geração automática da numeração das OS (`1045`) e dos certificados (`1045-1/25`, `1045-2/25`).

---

### FASE 6: Motor de Calibração por Relatos & Editor de Templates HTML
- [x] **Task 6.1:** Criar a tela de **Cadastro de Tipos de Calibração & Relatos** vinculados ao Tipo de Equipamento (GEHAKA Umidade, Balanças, etc.).
- [x] **Task 6.2:** Desenvolver o **Editor de Templates HTML de Certificados** em Split-View (código HTML à esquerda, prévia em tempo real à direita, barra lateral de variáveis `{{}}` clicáveis).
- [x] **Task 6.3:** Tela de **Execução de Calibração pelo Técnico**:
  - Validação da matriz de permissão do técnico
  - Tabela de coleta do relato específico
  - Seleção de Padrões Basais vigentes (bloqueando vencidos)
  - Cálculo automático de erros, incertezas e prévia do certificado com a assinatura em `.png` do técnico executor.

---

### FASE 7: Padrões Basais, Etiquetas & Central de Relatórios
- [x] **Task 7.1:** Módulo de **Padrões Basais (RBC)** com identificador (`TH-01`), histórico e sistema de alertas em 3 níveis (90d warning, 60d atenção, 30d crítico popup e bloqueio se vencido).
- [x] **Task 7.2:** Central de Relatórios com os relatórios solicitados:
  - Orçamento / Proposta Comercial
  - Etiqueta de Identificação com QR Code para impressora térmica Elgin (*)
  - Contagem de Estoque com filtros de saldo
  - Relatório de Vencimento de Calibrações com horizonte de 1 ano
  - Criador de Relatórios Personalizados com vínculo de tela
- [x] **Task 7.3:** Gestão de RH / Usuários com upload de assinatura `.png` e matriz de permissões técnicas.

---

### FASE 8: Atualização dos Endpoints da API REST & Swagger
- [x] **Task 8.1:** Atualizar as rotas `/api/v1/*` para contemplar estoque, relatos, transferências e múltiplos equipamentos.
- [x] **Task 8.2:** Atualizar a especificação OpenAPI 3.0 no Swagger UI.
- [x] **Task 8.3:** Build de produção e validação de ponta a ponta.

---

### FASE 9: Re-Design Visual Completo (Design System & Telas Reais da Pasta Exemplos Imgs)
- [x] **Task 9.1:** Aplicar tokens oficiais de cor (`--color-primary-500: #2563EB;`, `--color-bg-app: #F4F5F7;`, `--color-bg-surface: #FFFFFF;`, etc.) e grid de 12 colunas conforme `exemplos/Design_System_Especificacao.md`.
- [x] **Task 9.2:** Implementar arquitetura de Card Form Modal com abas, action bar e footer de auditoria de `exemplos/gemini-code-1788366369820.html`.
- [x] **Task 9.3:** Corrigir overflow e rolagem dupla em toda a aplicação (`rarus-workstation-root` com `height: 100vh; overflow: hidden;` e `rarus-content-scroll` limpo).
- [x] **Task 9.4:** Re-desenhar Módulo de Clientes com abas (1-Identificação, 2-Endereço, 3-Observações, 4-Tributação, 5-Confidencial, 6-Equipamentos) de `formulário de cadastro de cliente.jpeg`.
- [x] **Task 9.5:** Re-desenhar Módulo de Ordens de Serviço com tabela de `tabela de os.jpeg`, 14 status oficiais e formulário de `aba 5 do formulario de abertuda de uma OS.jpeg` com painel de mensagens rápidas.
- [x] **Task 9.6:** Re-desenhar Módulo de Equipamentos com campos complementares (lacre anterior/novo, selo anterior/novo, portaria) de `aba 2 do formulário de cadastro de um equipamento.jpeg`.
- [x] **Task 9.7:** Re-desenhar Módulo de Estoque com ficha de transferência de `forumalãrio de tranferencia de estoque.jpeg` (peças reais: PCI G610i/G650i, células Zemig, cabos flat) e modal de contagem de `Formulãrio de contagem de estoque.jpeg`.
- [x] **Task 9.8:** Re-desenhar Módulo de Funcionários (Caio Detz - Auxiliar Técnico, código 058) de `exemplo de cadastro de funcionario preenchido.jpeg`.
- [x] **Task 9.9:** Ajustar KPI Cards com display 28px bold, TopBar com perfil Caio Detz e alternador claro/escuro.
- [x] **Task 9.10:** Validação de build com `npm run build` (código 0, 22 páginas estáticas e dinâmicas geradas com sucesso).
