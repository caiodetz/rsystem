# Documentação do Design System & Guia de Componentes

Este documento estabelece as diretrizes de design, tokens visuais, tipografia e padrões de componentes para o sistema, baseando-se no layout limpo, moderno e funcional das interfaces analisas (modal de configurações e dashboard/gestão).

O objetivo principal é garantir uma experiência do usuário consistente, escalável e acessível, adotando uma paleta de cores baseada em **tons neutros e azul vibrante como cor primária**.

---

## 1. Princípios de Design

1. **Clareza e Mapeamento Visual:** Hierarquia clara com suporte de dados estatísticos (KPI Cards) e tabelas bem espaçadas.
2. **Minimalismo Funcional:** Uso eficiente de sombras suaves, bordas arredondadas e divisores sutis para delimitar blocos de informação sem sobrecarregar a vista.
3. **Modularidade:** Componentes reutilizáveis (modais, tabelas, abas, badges, botões, campos de busca) projetados para fácil expansão em módulos como Ordens de Serviço (OS), Gestão de Clientes, Configurações, entre outros.
4. **Respiro e Espaçamento (Whitespace):** Espaçamento generoso para facilitar a leitura rápida de grandes volumes de informação.

---

## 2. Paleta de Cores (Tokens de Cor)

A paleta foi padronizada utilizando neutros elegantes e variações de azul para estados de foco, ação e destaque.

### 2.1 Cores Primárias e de Ação
| Nome Token | HEX / Valor | Uso Recomendado |
| :--- | :--- | :--- |
| `--color-primary-500` | `#3B82F6` / `#2563EB` | Botões primários, abas ativas, bordas de seleção ativas, ícones de destaque. |
| `--color-primary-600` | `#1D4ED8` | Estado de *hover* para botões primários. |
| `--color-primary-100` | `#EFF6FF` | Fundo de itens selecionados, badges informativas, contornador suave. |
| `--color-primary-50` | `#F8FAFC` | Fundo leve para destaque de blocos ativados. |

### 2.2 Cores Neutras (Superfície e Texto)
| Nome Token | HEX / Valor | Uso Recomendado |
| :--- | :--- | :--- |
| `--color-bg-app` | `#F4F5F7` | Fundo geral da aplicação / Workspace. |
| `--color-bg-surface` | `#FFFFFF` | Fundo de cards, modais, sidebar e tabelas. |
| `--color-text-main` | `#0F172A` | Títulos principais, dados numéricos de alto valor, nomes de clientes. |
| `--color-text-muted` | `#64748B` | Subtítulos, rótulos de campos, metadados, links secundários. |
| `--color-border-subtle`| `#E2E8F0` | Linhas de tabela, divisores de seção, bordas de inputs e modais. |

### 2.3 Cores de Status e Contexto (Badges / Tags)
| Status | Background | Texto / Ícone | Uso |
| :--- | :--- | :--- | :--- |
| **Ativo / Concluído** | `#DCFCE7` | `#15803D` | Clientes ativos, OS finalizadas, pagamentos confirmados. |
| **Pendente / Em Risco**| `#FEF3C7` | `#B45309` | OS em andamento, alertas de expiração, clientes aguardando ação. |
| **Atenção / Inativo** | `#FEE2E2` | `#B91C1C` | OS canceladas, inadimplência, erros de validação. |
| **Neutro / Categoria** | `#F1F5F9` | `#475569` | Tipos de conta, segmentos, tags informativas gerais. |

---

## 3. Tipografia e Escala de Texto

O sistema utiliza uma fonte Sans-Serf moderna e limpa (ex: *Inter*, *Plus Jakarta Sans* ou *SF Pro Display*).

| Nível | Tamanho | Peso | Line Height | Aplicação |
| :--- | :--- | :--- | :--- | :--- |
| **Display / KPI** | `28px` - `32px` | Bold (`700`) | 1.2 | Valores numéricos principais de KPI Cards (`1,246`, `884`). |
| **H1 (Título de Página)** | `22px` - `24px` | SemiBold (`600`) | 1.3 | Título de seções principais ("Donors", "Clientes", "Ordens de Serviço"). |
| **H2 (Modal / Card)** | `18px` - `20px` | SemiBold (`600`) | 1.3 | Títulos de Modais ("Settings"), títulos de seções ("Interface theme"). |
| **H3 / Label Forte** | `14px` - `15px` | Medium (`500`) | 1.4 | Nomes em tabelas, labels de inputs ("Language"), abas. |
| **Body (Texto Padrão)** | `13px` - `14px` | Regular (`400`) | 1.5 | Descrições secundárias, e-mails, textos explicativos. |
| **Caption / Helper** | `11px` - `12px` | Regular (`400`) | 1.4 | Dicas de campos, metadados de tabelas, porcentagens de variação. |

---

## 4. Estrutura Visual e Componentes Base

### 4.1 Barra Lateral (Sidebar)
- **Estrutura:** Dividida em seções rotuladas em caixa alta e fonte reduzida (`OVERVIEW`, `FUNDRAISING`, `OPERATIONS`).
- **Item de Menu:**
  - **Inativo:** Texto `--color-text-muted` com ícone proporcional de 18px.
  - **Ativo:** Fundo suave `--color-primary-100`, texto `--color-primary-500`, pino/indicador lateral ou texto em negrito.
  - **Badges de Contagem:** Pílulas sutis à direita do item (ex: `1,246`, `LIVE`, `318`).

### 4.2 Cabeçalho Superior (Top Header / Navbar)
- **Campo de Busca Global:** Input largo com ícone de lupa à esquerda e atalho de teclado à direita (ex: `⌘K`).
- **Ações Rápidas:** Botões de ação secundária ("Export") e ação primária ("+ New Gift" / "+ Nova OS").
- **Perfil do Usuário:** Avatar circular, nome e cargo/função.

### 4.3 Cards de Indicadores (KPI Cards)
- **Container:** Fundo branco (`#FFFFFF`), borda sutil de 1px (`#E2E8F0`), cantos arredondados (`border-radius: 12px`).
- **Conteúdo:**
  - Ícone de contexto em container circular/quadrado suave no canto superior esquerdo.
  - Label do indicador em cor de texto secundária.
  - Valor principal em tamanho Display (`28px`).
  - Indicador de tendência no rodapé (ex: `↑ 3.2% vs last quarter` em verde/azul).

### 4.4 Navegação por Abas (Tabs)
- **Estilo:** Linha limpa sem bordas externas pesadas.
- **Aba Ativa:** Texto em cor escura/primária com uma barra inferior (underline) em `--color-primary-500` (ex: `Appearence`, `All donors`).
- **Contadores de Aba:** Pílulas numéricas neutras ou primárias ao lado do texto da aba.

### 4.5 Seletores Visuais (Theme / Card Option Selectors)
- **Estrutura:** Cards clicáveis representando opções (ex: *System*, *Light*, *Dark*).
- **Estado Selecionado:** Borda contínua de 2px em `--color-primary-500`, com um ícone de verificação (*check badge*) sobreposto no canto superior direito do card.

### 4.6 Tabelas de Dados (Data Tables)
- **Cabeçalho (TH):** Fundo limpo, texto em caixa alta ou capitalizado suave em `--color-text-muted`, tamanho `11px`-`12px`, alinhamento vertical centralizado.
- **Linhas (TR):**
  - Hover com alteração leve do fundo (`#F8FAFC`).
  - Separadores horizontais de 1px (`#E2E8F0`).
- **Elementos Internos:**
  - **Checkboxes:** Para seleção em massa no canto esquerdo.
  - **Badges de Categoria/Status:** Cantos arredondados (`border-radius: 9999px` / estilo pílula).
  - **Ações por Linha:** Ícones discretos (visualizar, enviar, opções) no canto direito da linha.

### 4.7 Modais e Diálogos de Configuração
- **Fundo / Overlay:** Backdrop semi-transparente escurecido suavemente (`rgba(0, 0, 0, 0.4)`).
- **Container:** Centralizado, `border-radius: 16px`, sombra projetada profunda mas suave (`box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)`).
- **Rodapé do Modal:**
  - Alinhamento à direita para botões de confirmação/cancelamento.
  - Botão secundário: Neutro ("Cancel").
  - Botão primário: Azul vibrante ("Save preferences").
  - Botão de reset no canto esquerdo ("Reset to defaults").

---

## 5. Exemplo de Implementação CSS (Design Tokens)

```css
:root {
  /* Cores Neutras */
  --bg-app: #F4F5F7;
  --bg-surface: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --border-color: #E2E8F0;

  /* Brand / Primary (Azul) */
  --primary-50: #EFF6FF;
  --primary-500: #2563EB;
  --primary-600: #1D4ED8;

  /* Status */
  --status-success-bg: #DCFCE7;
  --status-success-text: #15803D;
  --status-warning-bg: #FEF3C7;
  --status-warning-text: #B45309;
  --status-danger-bg: #FEE2E2;
  --status-danger-text: #B91C1C;

  /* Tipografia */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Bordas e Sombras */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  --shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  --shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```
