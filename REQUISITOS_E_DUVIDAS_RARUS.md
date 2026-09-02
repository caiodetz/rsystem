# 📋 Levantamento de Requisitos, Arquitetura Visual & Questionário de Decisões
## Sistema RARUS - Metrologia, Calibração & Manutenção

> **Status do Documento:** ✅ **VALIDADO E ATUALIZADO COM AS RESPOSTAS DO CLIENTE**  
> **Nome Oficial do Sistema:** **RARUS Tecnologia & Serviços**  
> **Identidade Visual:** Baseada em [LOGO-RARUS.png](file:///Users/caiodetz/Documents/Projetos/RSYSTEM/exemplos/LOGO-RARUS.png)  
> **Estilo de Navegação:** **Modelo Híbrido** (Sidebar moderna colapsável estilo CRM + Abas MDI de trabalho no topo)  
> **Tema:** Suporte a **Ambos (Claro e Escuro)** configurável pelo usuário  

---

## PARTE 1: Especificação de Arquitetura Visual (Aprovada)

### 1.1 Identidade Visual & Branding
- **Azul Marinho Corporativo:** `#0a2240` (cor de base e cabeçalhos da marca)
- **Azul Elétrico / Ciano Metrológico:** `#1d82cd` (circuitos, realces ativos, botões primários)
- **Verde Esmeralda (Conformidade / Ativo):** `#059669` / `#d1fae5` (badges de status ativo, aprovado)
- **Âmbar / Laranja (Alerta / Atenção):** `#d97706` / `#fef3c7` (vencendo em breve, aguardando peças)
- **Vermelho Rubi (Crítico / Vencido):** `#dc2626` / `#fee2e2` (padrões vencidos, OS urgente)
- **Fundo Limpo / Superfície:** `#f8fafc` (fundo canvas) e `#ffffff` (cards com sombras sutis e bordas `#e2e8f0`)

---

### 1.2 Layout Base do Sistema (Workstation SaaS de Alta Produtividade)
1. **Sidebar Lateral (Esquerda - Retrátil):**
   - Topo: Logotipo RARUS aplicado + Seletor de Unidade/Laboratório.
   - Navegação Agrupada em Seções:
     - `VISÃO GERAL`: Dashboard (KPIs em tempo real), Atividades Recentes.
     - `METROLOGIA & OPERAÇÃO`:
       - **Clientes** (com badge contador dinâmico)
       - **Ordens de Serviço** (com status em tempo real)
       - **Equipamentos** (cadastrados e vinculados aos clientes)
       - **Calibrações & Certificados** (emissão por relato)
       - **Padrões Basais (RBC)** (padrões de referência do laboratório com alerta rigoroso)
     - `ESTOQUE & SUPRIMENTOS`:
       - **Estoque Central** (almoxarifado principal)
       - **Estoques dos Técnicos** (veículos/maletas de cada técnico)
       - **Transferências & Auditoria** (histórico por número de série/código)
       - **Peças & Serviços** (cadastro unificado com flag de tipo fiscal)
     - `RELATÓRIOS & GESTÃO`:
       - **Central de Relatórios** (Orçamentos, Etiquetas, Contagem de Estoque, Vencimentos, Modelos Dinâmicos)
       - **Consultas Globais** (busca unificada com atalho `⌘K`)
       - **Faturamento & Propostas**
     - `SISTEMA & RH`:
       - **Funcionários & Técnicos** (cadastro de equipe, horários e matriz de permissões de calibração)
       - **Modelos de Relato & Certificado** (editor de templates HTML com variáveis `{{}}`)
       - **Tipos de Calibração & Status de OS**
       - **Swagger API Explorer**
   - Rodapé da Sidebar: Widget de progresso operacional / SLA.
2. **Barra Superior (Top Bar):**
   - Busca Global inteligente com atalho `⌘K` / `Ctrl+K` (pesquisa instantânea em Clientes, Equipamentos, OS, Certificados, Peças, Padrões e atalho direto para relatórios).
   - Botões de Ação Rápida: `[↑ Exportar]` e `[+ Nova OS / Novo Cliente]`.
   - Alternador de Tema (Claro / Escuro), Notificações e Perfil do Usuário com crachá/função.

---

### 1.3 Visão 360º do Cliente (Perfil Completo)
- **Cabeçalho:** Identidade da empresa cliente, CNPJ, contatos rápidos em linha (E-mail, Telefone, WhatsApp, Responsável), mini mapa de geolocalização e observações avulsas.
- **Abas Internas do Cliente:**
  - `[Ordens de Serviço]`
  - `[Equipamentos]` (com botão `[+ Novo Equipamento]` que preenche automaticamente o ID do Cliente)
  - `[Certificados de Calibração]`
  - `[Histórico & Interações]` (Timeline cronológica de chamados e atendimentos)
  - `[Propostas & Faturamento]`
- **Painel Lateral "Próximos Passos":**
  - Ações pendentes (ex: *Revisar instrumentos vencendo no próximo 1 ano*, *Enviar orçamento*, etc.).
  - Botão de ação rápida (`[Abrir Nova OS]`).

---

## PARTE 2: Requisitos Validados & Regras de Negócio Confirmadas

### 2.1 Equipamentos & Instrumentos (Linha GEHAKA e Multigrandezas)
- **Grandezas Atendidas:** Medidores de Umidade de Grãos/Sólidos, Balanças de Precisão/Analíticas, Pressão, Temperatura, Dimensional, Massa, Multigás, pHmetros e toda a linha de instrumentos industriais **GEHAKA**.
- **Campos Obrigatórios do Equipamento:**
  - Número de Série do Fabricante
  - Fabricante e Modelo
  - Faixa de Medição e Resolução
  - Data da Última Calibração e Data da Próxima Calibração
  - **ID do Cliente** (preenchido automaticamente pelo sistema)
  - **Patrimônio**
  - **Serviço Anterior** e **Histórico de OS**
  - **Lacre Anterior** e **Selo Anterior**
  - **Lacre Novo** e **Selo Novo**
- **Regra de Alerta de Vencimento:**
  - Equipamentos de clientes **não geram alertas automáticos invasivos no painel geral**, exceto no relatório anual de contato comercial.
  - Alertas rigorosos no dashboard são reservados para os **Padrões Basais (Equipamentos de Referência do Laboratório)**.

---

### 2.2 Ordens de Serviço (Workflow & Status Dinâmicos)
- **Lista de Status Padrão do Fluxo:**
  1. `Aberta`
  2. `Em Serviço`
  3. `Em Bancada`
  4. `Aguardando Peças`
  5. `Enviado para Fábrica`
  6. `Sem Conserto`
  7. `Orçamento Pronto`
  8. `Aprovada`
  9. `Aprovada Faturar`
  10. `Equipamento Pronto`
  11. `Entregue ao Cliente`
  12. `Faturada`
  13. `Encerrada`
  14. `Cancelada`
  - **Recurso:** Cadastro e personalização de novos status pela administração.
- **Tipos de OS:** Calibração em Laboratório, Calibração em Campo (In Loco), Manutenção Preventiva, Manutenção Corretiva, Ensaio Técnico / Qualificação.

---

### 2.3 Módulo de Estoque Central e Estoques por Técnico (Físico vs. Fiscal)
- **Multi-Almoxarifado:**
  - **Estoque Central** (laboratório / matriz).
  - **Estoque do Técnico** (estoque móvel no veículo/maleta de cada profissional).
- **Transferência e Rastreabilidade:**
  - Movimentação de peças entre estoques (Central ⇄ Técnicos) com registro de data, responsável e motivo.
  - Auditoria completa por código da peça, número de série/ID único e histórico de uso.
- **Composição de Peças & Serviços na OS:**
  - Peças podem ter número de série próprio ou serem registradas sem número de série.
  - Serviços são cadastrados com identificação de tipo fiscal (**NFS-e** para serviço e **NF-e** para produtos/peças).
  - **Peça lançada como serviço:** automaticamente soma seu valor ao serviço principal da OS, compondo o serviço sem gerar item de produto avulso.
  - **Abatimento em duas etapas:**
    1. **Estoque Físico:** Subtrai no momento da execução/baixa da OS pelo técnico.
    2. **Estoque Fiscal:** Subtrai no momento do faturamento fiscal da OS.

---

### 2.4 Calibrações por "Relato" & Templates HTML Personalizados
- **Conceito de Relato:**
  - Cada **Tipo de Calibração** (ex: *Calibração Rastreável RARUS*, *Calibração RBC Inmetro*, *Calibração de Campo*) possui seus **Relatos** configurados por **Tipo de Equipamento** (ex: Relato para *Medidor de Umidade*, Relato para *Balança de Precisão*).
  - O Relato define:
    1. A tabela de coleta de dados de ensaio que o técnico deve preencher.
    2. As fórmulas matemáticas de cálculo automático (médias, erros, desvios, incertezas).
    3. Os padrões basais obrigatórios a serem informados (com código identificador, ex: `TH-01`, descrição, certificado e validade).
    4. O **Template HTML** do certificado de calibração com variáveis dinâmicas no formato `{{variavel}}`.
- **Matriz de Competência do Técnico:**
  - No cadastro de cada técnico, o Responsável Técnico define quais tipos de calibração e equipamentos ele está habilitado a executar (ex: *Técnico Itamar pode executar apenas Calibração Rastreável RARUS em Medidor de Umidade*).
  - Ao executar a calibração, o sistema valida a permissão do técnico e carrega a tabela do relato correto.
  - O **próprio técnico executor assina digitalmente** o certificado emitido.
  - O sistema exibe **prévia do certificado pronto** para conferência antes da finalização.

---

### 2.5 Padrões Basais de Referência (Laboratório RARUS)
- Identificador personalizado único (ex: `TH-01`, `BAL-01`, `PESO-M1-02`).
- Descrição técnica, fabricante, modelo e número de série.
- Órgão calibrador externo credenciado (IPT, Inmetro, RBC) e número do certificado.
- Data de calibração, validade da calibração e histórico completo de re-calibrações.
- **Bloqueio e Alerta:** Aviso antecipado de vencimento e bloqueio automático de uso caso esteja vencido.

---

### 2.6 Relatórios & Busca Universal (⌘K)
- **Relatórios Fixos e Customizáveis:**
  - Orçamento de Serviço / Manutenção
  - Etiqueta de Identificação de Equipamento (para fixação física com dados da calibração, OS, técnico, selo/lacre)
  - Contagem de Estoque (com filtros por local de estoque, saldo zero, saldo positivo, saldo negativo)
  - Relatório de Vencimento de Calibrações com horizonte de 1 ano
  - Relatório de Peças e Serviços cadastrados
  - Relatório de SLA e Desempenho por Técnico
  - Criador de Relatórios Customizáveis com vinculo dinâmico (onde ele deve aparecer: na OS, no Estoque, na Proposta, etc.)
- **Busca Global Rápida (⌘K / Ctrl+K):**
  - Abertura direta de telas por comando de texto (ex: digitar *"contagem de estoque"* e dar Enter abre diretamente a tela do relatório de estoque).
  - Busca universal por qualquer termo em Clientes, Equipamentos, OS, Certificados, Peças, Serviços e Padrões.

---

### 2.7 Gestão de Usuários & RH
- **Técnicos:** Executam OS, realizam medições, apontam peças de seus estoques e assinam os certificados.
- **Responsável Técnico:** Gestor metrológico, configura os Relatos/Templates, padrões RBC, auditorias e matriz de competência dos técnicos.
- **Administrativo / RH:** Cadastro de funcionários, controle de horários, emissão de propostas e faturamento.
- **Administrador Geral:** Acesso irrestrito ao sistema.
- **Portal do Cliente:** Acesso externo para consulta dos próprios equipamentos e certificados.

---

## PARTE 3: Perguntas Complementares para Alinhamento Fino

> 💡 **Para refinarmos os detalhes de implementação dessas novas funcionalidades, por favor responda às perguntas abaixo:**

---

### SEÇÃO 11: Perguntas Técnicas Detalhadas

#### 11.1 Módulo de Estoque (Central vs. Técnicos)
1. **Saldos Negativos:** Quando um técnico usa uma peça em campo mas esqueceu de registrar a transferência para sua maleta antes, o sistema deve permitir que o estoque dele fique temporariamente negativo com aviso, ou deve bloquear o lançamento até que a transferência seja feita?
   - [ ] Permitir saldo negativo temporário com alerta visual
   - [X] Bloquear lançamento exigindo que a transferência seja registrada primeiro
   - `Resposta:` _________________________________

2. **Requisição de Peças:** Deseja que o técnico possa solicitar peças do Estoque Central através de um pedido de requisição dentro do sistema para o almoxarife aprovar e transferir?
   - [X] Sim, com fluxo de solicitação e aprovação
   - [ ] Não, a transferência é feita diretamente de forma simples
   - `Resposta:` _________________________________

---

#### 11.2 Selos e Lacres de Segurança
1. **Controle de Numeração de Selos/Lacres:** O sistema deve ter um controle de estoque/faixa de numeração dos selos e lacres do Inmetro/RARUS entregues a cada técnico (ex: técnico recebeu lacres nº 1000 a 1050), ou basta ser um campo de texto livre no formulário do equipamento?
   - [X] Campo de texto livre (digitação direta do número do selo/lacre)
   - [ ] Controle por lote/faixa de numeração entregue ao técnico
   - `Resposta:` _________________________________

---

#### 11.3 Etiquetas de Equipamento
1. **Formato das Etiquetas de Calibração/Manutenção:** Como vocês costumam imprimir as etiquetas para colar nos equipamentos?
   - [X] Impressora térmica de etiquetas em rolo (ex: Zebra, Argox, Elgin - etiquetas tipo 50x30mm ou 100x50mm)
   - [ ] Folha A4 com etiquetas adesivas múltiplas (ex: Pimaco)
   - [ ] Ambas as opções
   - `Resposta: é um Elgin eu n lembro o tamanho do papel mas é um rolo e é termica`

2. **Código de Barras / QR Code na Etiqueta:** A etiqueta deve conter QR Code ou código de barras que, ao ser lido pelo celular ou leitor óptico, abre diretamente a ficha do equipamento no sistema?
   - [X] Sim, com QR Code para consulta rápida
   - [ ] Apenas dados em texto (Tag, Data, Próx. Calibração, Técnico, Lacre)
   - `Resposta: Eu já tenho um modelo de etiquta vou te enviar depois, por hora apenas deixe um asterisco nisso e vamos seguir com o resto`

---

#### 11.4 Assinatura Digital do Técnico nos Certificados
1. **Como o técnico assinará o certificado no sistema?**
   - [ ] Assinatura manuscrita desenhada na tela (touch / mouse / tablet) e salva no perfil do técnico
   - [X] Upload prévio da imagem da assinatura digitalizada (.png transparente) cadastrada no perfil dele
   - [ ] Assinatura por chave criptográfica digital com hash de autenticidade (com data, hora e CPF do técnico)
   - [ ] Combinação de imagem/rubrica + Hash digital verificador
   - `Resposta:`

---

#### 11.5 Alertas dos Padrões Basais (Equipamentos de Referência)
1. **Com quantos dias de antecedência o laboratório deve ser alertado sobre o vencimento de um Padrão Basal?**
   - [X] 30 dias de antecedência
   - [X] 60 dias de antecedência
   - [ ] 90 dias de antecedência (recomendado para padrões RBC devido ao prazo de calibração em órgãos externos)
   - `Resposta: Com 90 pode ser só um warning de alerta, sem popup sem nada, com 60 dias um aviso mais forte, e com 30 dias um aviso de alerta e um popup vermelho com alerta de que o equipamento está venendo e quando vencer o equipamento ébloqueado para uso`

---

#### 11.6 Emissão Fiscal (NF-e de Produto vs. NFS-e de Serviço)
1. **Nesta fase do projeto, como será tratado o faturamento fiscal?**
   - [ ] Controle gerencial interno (o sistema registra o que é serviço e o que é peça, gera o relatório de faturamento e o operador emite as notas no sistema emissor da prefeitura/SEFAZ)
   - [X] Preparar a arquitetura da API para futura integração direta com API de emissão fiscal (ex: Focus NFe / PlugNotas / Nuvem Fiscal)
   - `Resposta: Vamos começar com o controle gerencial interno, quando eu adquirir um sistema emissor de nota fiscal ai sim vamos fazer a integração direta com a API`

---

### SEÇÃO 12: Refinamentos Operacionais Finais (Última Rodada)

#### 12.1 Relação Ordem de Serviço ⇄ Equipamentos
1. **Uma Ordem de Serviço atende:**
   - [ ] **1 Equipamento por OS:** Cada equipamento tem sua própria OS individual (mais simples, rastreabilidade direta 1:1).
   - [X] **Múltiplos Equipamentos por OS:** Uma única OS de atendimento em campo pode conter uma lista de vários instrumentos do mesmo cliente (ex: calibrar 5 medidores de umidade na OS nº 1045, gerando 1 certificado para cada equipamento vinculado à mesma OS).
   - `Resposta: Atualmente o padrão para o numero de certificado é numero da OS 0000/AA exemplo: 1045/25, no sitema poderia ser OS: 1045, Cert: 1045-1/25, 1045-2/25, 1045-3/25 por equipamento.`

#### 12.2 Conectividade dos Técnicos em Campo
1. **Como os técnicos utilizarão o sistema em clientes externos?**
   - [X] **Sempre Conectado:** O técnico utiliza notebook/tablet conectado via 4G/5G ou Wi-Fi da fábrica do cliente (acesso web direto ao sistema).
   - [X] **Necessidade de Modo Offline Temporário:** Existem fazendas/usinas remotas onde o técnico fica totalmente sem sinal de internet e precisa preencher os dados para sincronizar depois ao voltar para o hotel/base.
   - `Resposta: Essa parte de Necessidade de Modo Offline Temporário, eu planejo adicioanr quando eu desenvolver o aplicativo do técnico para que ele não precise do notebook para realizar os serviços externos, porem ainda não vamos mecher com isso mas deixe um asterisco ai.`

#### 12.3 Padrão de Numeração de OS e Certificados
1. **Como você prefere o formato do número das Ordens de Serviço e Certificados?**
   - [ ] **Ano + Sequencial:** `OS-2026-0001` / `CERT-2026-0001` (reinicia o sequencial a cada ano).
   - [ ] **Sequencial Corrido Contínuo:** `OS-001001` / `CERT-005021` (numeração infinita independente do ano).
   - [ ] **Personalizado configurável:** `Resposta: OS:0000 Certificado: 0000-0/AA onde os 4 primeiros digitos são o numero da OS, o 0 após o - é o numero do equipamento na os e AA é o ano atual, Vamos seguir com isso.`

#### 12.4 Editor de Templates HTML dos Relatos/Certificados
1. **No cadastro dos modelos de certificados HTML com variáveis `{{}}`:**
   - [ ] **Editor de Código com Barra Lateral de Variáveis:** O Responsável Técnico edita o HTML/CSS com painel lateral contendo botões para clicar e inserir variáveis automaticamente (ex: clicar em `[+ Nome do Cliente]` insere `{{cliente.nome}}`, `[+ Padrão Utilizado]` insere `{{padrao.identificador}}`, `[+ Tabela de Ensaios]` insere `{{tabela_ensaios}}`).
   - [ ] **Visualizador Lado a Lado (Split View):** Código HTML na esquerda e prévia em tempo real na direita.
   - [X] **Ambos integrados (Recomendado)**.
   - `Resposta:`

---

*Arquivo salvo em:* `/Users/caiodetz/Documents/Projetos/RSYSTEM/REQUISITOS_E_DUVIDAS_RARUS.md`

