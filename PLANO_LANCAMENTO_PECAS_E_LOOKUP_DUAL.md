# Plano de Implementação: Lançamento de Peças na OS & Componente Universal Dual Lookup (Código / Descrição)

Documento técnico e funcional de especificação para reformulação da **Aba 3 (Produtos & Peças)** da Ordem de Serviço, implementação do mecanismo de seleção em lote (estilo Windows Explorer com Shift), formulário avançado de lançamento de peças com rastreabilidade serial e criação do componente padronizado de **Input Dual (Código + Busca + Descrição)**.

---

## 📌 1. Visão Geral & Objetivos

A partir das análises das referências visuais:
- [form de peças os.png](file:///Users/caiodetz/Documents/Projetos/RSYSTEM/exemplos/fix/form%20de%20pe%C3%A7as%20os.png) (Aba de Produtos & Peças da OS)
- [input code.png](file:///Users/caiodetz/Documents/Projetos/RSYSTEM/exemplos/exemplos%20imgs/input%20code.png) (Padrão clássico de entrada dupla Código ↔ Descrição com botão de busca central)

O objetivo é transformar a inclusão de itens da Ordem de Serviço em um fluxo profissional de ERP industrial, eliminando seletores simples e provendo:
1. **Seleção intuitiva de tabela com suporte a Shift e exclusão em lote**.
2. **Modal / Formulário especializado para lançamento de peça/serviço**.
3. **Padrão universal de Input Dual (`<DualLookupInput />`)**, reutilizável em todo o sistema (OS, Clientes, Equipamentos e Estoque).
4. **Rastreabilidade total de peças com IDs e Números de Série** provenientes das notas de entrada.

---

## 🖥️ 2. Arquitetura da Tabela de Peças na OS (Aba 3)

### 2.1 Novo Layout da Barra de Ações
Substituir o dropdown simples atual por uma barra de ferramentas contextual integrada:
- **Botão Principal:** `[+ Lançar Item / Peça]` (botão azul `.btn .btn-primary`) que aciona o formulário de lançamento.
- **Botão de Exclusão:** `[Remover Selecionado(s)]` (botão `.btn .btn-danger`, habilitado somente quando houver $\ge 1$ item selecionado).
- **Indicador de Seleção Contextual:** `X item(ns) selecionado(s) de Y`.
- **Botão de Atalho:** `[Limpar Seleção]`.

### 2.2 Mecanismo de Seleção Avançada (Estilo Windows Explorer)
- **Clique Simples:** Seleciona a linha única, aplicando a classe `.rarus-row-selected` (fundo azul suave `#EFF6FF` e borda esquerda `#2563EB`).
- **Ctrl / Cmd + Clique:** Adiciona ou remove linhas individuais da seleção existente, permitindo seleções disjuntas (ex: selecionar linha 1 e linha 3).
- **Shift + Clique (Intervalo Contíguo):** Seleciona todas as linhas entre o último item clicado e o item clicado com a tecla Shift pressionada (comportamento nativo do Windows Explorer e desktop forms).
- **Checkbox de Cabeçalho / Atalho Ctrl + A:** Seleciona todas as linhas da tabela de uma só vez.
- **Teclado:** Navegação por setas e tecla `Delete` com modal de confirmação.

### 2.3 Resumo Financeiro no Rodapé da Tabela
Painel inferior automático com cálculo instantâneo:
- **Total de Peças (NF-e):** Soma de todos os itens fiscais de produto.
- **Total de Serviços (NFS-e):** Soma de calibrações, mão de obra e higienização.
- **Desconto Global Aplicado:** Somatório dos descontos por item.
- **Valor Líquido Total da OS:** Valor final atualizado em tempo real.

---

## 📝 3. Formulário / Modal de Lançamento de Peça

Ao clicar em `[+ Lançar Item / Peça]`, abre-se um modal de diálogo estruturado em **duas abas**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Lançamento de Produto / Serviço na Ordem de Serviço #1045             [ X ] │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ 1. Dados do Item & Valores ]    [ 2. Rastreabilidade & Seriais (IDs) ]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Código do Item:           Busca:            Descrição da Peça:             │
│  ┌──────────────┐         ┌───────┐         ┌─────────────────────────────┐ │
│  │ 004674       │         │  🔍   │         │ CHICOTE SERIAL E FONTE BK   │ │
│  └──────────────┘         └───────┘         └─────────────────────────────┘ │
│                                                                             │
│  Tipo Fiscal:                               Estoque Origem (Local):         │
│  [ (o) NF-e (Produto)  ( ) NFS-e (Serviço) ] [ 001 - Almoxarifado Central ]│
│                                                                             │
│  Saldo Físico no Local: 14 PC                Saldo Fiscal Total: 42 PC      │
│                                                                             │
│  Quantidade:     Preço Unit. Tabela:   Preço Negociado:   Desconto (% / R$):│
│  ┌──────────┐    ┌─────────────────┐   ┌──────────────┐   ┌───────────────┐ │
│  │ 2,000    │    │ R$ 140,00       │   │ R$ 140,00    │   │ 5% (R$ 14,00) │ │
│  └──────────┘    └─────────────────┘   └──────────────┘   └───────────────┘ │
│                                                                             │
│  Técnico Aplicador:                          Total do Item:                 │
│  [ 058 - Caio Detz                       v ] R$ 266,00                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ Cancelar ]                                            [ + Inserir na OS ] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Aba 1: Dados do Item & Valores
1. **Componente Dual Lookup (`input code.png`):**
   - **Campo Código:** Permite digitação rápida do código numérico ou mnemônico (ex: `004674` ou `PEC-GEH-01`). Ao pressionar `Enter` ou `Tab`, dispara a busca instantânea e preenche automaticamente o campo Descrição, Unidade e Preço.
   - **Botão de Busca Central (`🔍`):** Ao clicar, abre o **Sub-modal de Consulta de Peças do Estoque**, onde o usuário pode filtrar por descrição, grupo de peças, fabricante e visualizar saldos por filial.
   - **Campo Descrição:** Exibe o nome da peça. Se o usuário digitar um texto e pressionar `Enter`, o sistema abre a consulta filtrada pelo termo digitado.
2. **Edição Comercial:**
   - `Quantidade`: campo numérico decimal com validação visual de saldo físico.
   - `Preço Unitário`: carrega o preço de tabela, permitindo ajuste autorizado.
   - `Desconto`: campos sincronizados de `%` e `R$`.
   - `Tipo Fiscal`: chaveamento automático (Produto ➔ NF-e de remessa/venda; Serviço ➔ NFS-e).

### 3.2 Aba 2: Rastreabilidade & Seriais / IDs de Entrada
Para peças que possuem controle unitário/serial (ex: células de carga, placas PCI, sensores digitais):
1. **Exigência Dinâmica:** A aba é destacada caso a peça selecionada possua o atributo `requerNumeroSerie: true`.
2. **Grade de Seriais Disponíveis:** O sistema exibe os números de série e IDs que deram entrada via Nota Fiscal no local de estoque selecionado.
3. **Leitura por Código de Barras / QR Code:** Campo para bipar o número de série da peça física que o técnico pegou na maleta.
4. **Validação de Quantidade:** Se a quantidade lançada for `2`, o usuário deve obrigatoriamente vincular `2` números de série válidos.

---

## 🧩 4. Padrão Universal do Componente `<DualLookupInput />`

Baseado na imagem oficial [input code.png](file:///Users/caiodetz/Documents/Projetos/RSYSTEM/exemplos/exemplos%20imgs/input%20code.png), este componente será reutilizável em todos os módulos onde houver relacionamento Código ↔ Descrição:

### 4.1 Locais de Aplicação no Sistema:
| Módulo | Campo Código (Esquerda) | Botão Busca | Campo Descrição (Direita) |
|---|---|---|---|
| **OS - Peças** | Código da Peça (`004674`) | Consulta Peças | Descrição do Item (`CHICOTE SERIAL...`) |
| **OS - Cabeçalho** | Código do Cliente (`CLI-001`) | Consulta Clientes | Razão Social / Fantasia (`Cooperativa Agro...`) |
| **OS - Equipamento** | Nº Série / Tag (`GEH-2023-90812`) | Consulta Equipamentos | Modelo e Fabricante (`G650i - GEHAKA`) |
| **OS - Técnico** | Código do Técnico (`058`) | Consulta Funcionários | Nome do Técnico (`Caio Detz`) |
| **Clientes - Equipamento** | Tag / Série do Instrumento | Consulta Parque | Descrição Técnica do Equipamento |
| **Transferências** | Código do Item | Consulta Estoque | Nome da Peça e Saldo Origem |
| **Calibrações - Padrão** | Identificador RBC (`TH-01`) | Consulta Padrões | Descrição do Padrão Metrológico |

### 4.2 Especificação da Interface TypeScript do Componente:
```typescript
export interface DualLookupInputProps<T> {
  label: string;
  codigoValue: string;
  descricaoValue: string;
  placeholderCodigo?: string;
  placeholderDescricao?: string;
  disabled?: boolean;
  required?: boolean;
  onCodigoBlur?: (codigo: string) => Promise<T | null>;
  onSelect: (item: T) => void;
  onOpenConsultaModal: () => void;
  widthCodigo?: string; // padrão: '130px'
}
```

---

## ❓ 5. DÚVIDAS E PONTOS DE DECISÃO NÃO RESPONDIDOS (PARA VALIDAÇÃO DO USUÁRIO)

Abaixo estão todas as perguntas e decisões de negócio levantadas para homologação antes do início da codificação:

> [!IMPORTANT]
> ### 1. Momento da Baixa Física do Estoque na OS
> - **Dúvida:** Ao lançar a peça na OS, o saldo em estoque deve ser **baixado imediatamente**, entrar em estado de **"Reserva Técnica"** ou ser baixado somente quando a OS for finalizada/concluída?
> - *Opção A (Recomendada):* Criar status "Reservado na OS #1045" imediatamente no lançamento; baixa definitiva ao concluir a OS.
> - *Opção B:* Baixa direta imediata no lançamento.
Resposta: Baixa direta no saldo fisico, e após faturamento e tals baixa do estoque fiscal 

> [!IMPORTANT]
> ### 2. Obrigatoriedade dos Números de Série / IDs na Aba 2
> - **Dúvida:** Se o técnico lançar uma peça que exige número de série (ex: placa PCI), o sistema deve **bloquear a inserção** caso ele não informe o número de série no momento, ou deve permitir lançar como "Serial a Informar" para preenchimento até o fechamento da OS?
> - *Opção A:* Bloqueio rígido no momento do lançamento (garante 100% de rastreabilidade).
> - *Opção B:* Permite lançar e exibe um alerta de pendência na OS até a conclusão.
Resposta: Opção A

> [!IMPORTANT]
> ### 3. Política de Permissões de Preço e Desconto
> - **Dúvida:** Qualquer usuário que opera a OS pode alterar o preço unitário e dar desconto na peça, ou deve haver validação de perfil (ex: apenas Administrador ou Supervisor Comercial pode aplicar desconto acima de 10%)?
> - *Opção A:* Campo livre com auditoria de alteração gravando o usuário que alterou.
> - *Opção B:* Bloqueio por senha de supervisor se o desconto ultrapassar X%.
Resposta: B

> [!IMPORTANT]
> ### 4. Comportamento da Tela de Consulta de Peças
> - **Dúvida:** Ao clicar no ícone de busca central do Input Dual, a consulta deve abrir como um **Modal Flutuante sobre a tela da OS** ou como uma **Nova Aba MDI no topo**?
> - *Opção A (Recomendada):* **Modal Flutuante de Consulta** (Modal Dialog). Evita alternância de abas e mantém o formulário da OS aberto e preenchido ao fundo.
> - *Opção B:* Nova aba MDI com botão de exportar seleção para a aba da OS.
Resposta: A
> [!IMPORTANT]
> ### 5. Exclusão em Lote com Shift e Estorno de Estoque
> - **Dúvida:** Quando o usuário selecionar 5 peças usando Shift e clicar em "Remover Selecionado(s)", o sistema deve solicitar uma justificativa do cancelamento das peças (ex: "Peça requisitada por engano") para auditoria?
> - *Opção A:* Sim, exige motivo de estorno para auditoria metrológica.
> - *Opção B:* Não, apenas confirmação padrão "Deseja remover as 5 peças selecionadas?".
Resposta: B

> [!IMPORTANT]
> ### 6. Filtro Cruzado Cliente ↔ Equipamentos no Cadastro da OS
> - **Dúvida:** Ao utilizar o Dual Lookup para selecionar o Cliente na OS, o Dual Lookup de Equipamentos deve restringir a busca **automaticamente e exclusivamente** aos equipamentos pertencentes àquele cliente?
> - *Opção A (Recomendada):* Sim, ao preencher o cliente, a busca de equipamentos exibe apenas o parque instalado daquele cliente, com opção de "Buscar em todo o acervo" se for um equipamento novo não cadastrado.
Resposta: A, sem a opção de buscar em todo o acervo. Porem ele abre a tela pra selecionar o equipamento e caso não tenha cadastrado o equipamento ele pode cadastrar um novo equipamento na mesma tela de selecionar o equipamento e ai ele abre um modal com o form do cadastro de equipamento já preenchido e travado o cliente selecionado na referencia.

---

## 🛠️ 6. Roteiro de Execução Técnica (Fases)

### Fase 1: Componente Base `DualLookupInput`
- Criar `src/core/components/common/DualLookupInput.tsx` com visual fiel ao [input code.png](file:///Users/caiodetz/Documents/Projetos/RSYSTEM/exemplos/exemplos%20imgs/input%20code.png).
- Sub-modal genérico de consulta em datagrid com paginação e duplo-clique.

### Fase 2: Modal de Lançamento de Peças na OS
- Criar `src/modules/ordens-servico/components/ModalLancamentoPecaOS.tsx`:
  - Aba 1: Dual Lookup da peça + campos de Qtd, Preço, Desconto e Total.
  - Aba 2: Seleção e bipagem de Seriais/IDs de estoque.

### Fase 3: Tabela com Seleção Múltipla com Shift
- Atualizar `OrdensServicoView.tsx` (Aba 3):
  - Lógica de índice para Shift+Click (seleção contígua de linhas).
  - Botão de remoção em lote com atualização financeira instantânea.

### Fase 4: Propagação para o Cadastro Geral da OS e Equipamentos
- Substituir campos de Cliente, Equipamento e Técnico no formulário da OS pelo `DualLookupInput`.
- Validação e testes de compilação de produção (`npm run build`).
