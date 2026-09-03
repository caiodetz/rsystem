/**
 * RSYSTEM - RARUS Tecnologia & Serviços
 * Tipos Fundamentais de Domínio, Metrologia e Gestão Operacional
 * Arquitetura Limpa e Modular
 */

// ==========================================
// 1. CLIENTES & PLANTAS INDUSTRIAIS
// ==========================================
export interface ContatoCliente {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  whatsapp?: string;
}

export interface Cliente {
  id: string;
  codigo: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie?: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  contatos: ContatoCliente[];
  contatoResponsavel: string;
  segmento: string; // ex: 'Agronegócio / Grãos', 'Farmacêutico', 'Químico', 'Metalúrgico'
  observacoesAvulsas?: string;
  status: 'Ativo' | 'Inativo';
}

// ==========================================
// 2. EQUIPAMENTOS & INSTRUMENTOS (GEHAKA & DEMAIS)
// ==========================================
export type StatusEquipamento =
  | 'Calibrado'
  | 'Vencido'
  | 'Em Calibração'
  | 'Em Manutenção'
  | 'Crítico';

export interface PontoMedicao {
  pontoNominal: string;
  valorPadrao: number;
  valorIndicado: number;
  erro: number;
  incerteza: number;
}

export interface Calibracao {
  id: string;
  numeroCertificado: string;
  ordemServicoId?: string;
  equipamentoId: string;
  equipamentoTag: string;
  equipamentoDescricao: string;
  clienteId: string;
  clienteNome: string;
  padraoUtilizadoId: string;
  padraoUtilizadoDesc: string;
  padraoCertificadoRBC: string;
  temperaturaAmbiente: number;
  umidadeRelativa: number;
  pontosMedicao: PontoMedicao[];
  resultado: 'Conforme' | 'Não Conforme';
  declaracaoConformidade: string;
  dataCalibracao: string;
  dataProximaCalibracao: string;
  tecnicoResponsavel: string;
  observacoes?: string;
  qrCodeHash: string;
}

export interface PadraoReferencia {
  id: string;
  codigo: string;
  descricao: string;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  grandeza: 'Pressão' | 'Temperatura' | 'Dimensional' | 'Massa' | 'Elétrica';
  certificadoRBC: string;
  laboratorioRBC: string;
  validadeCalibracao: string;
  incertezaPadrao: string;
  fatorK: number;
  status: 'Válido' | 'Vencido' | 'Em Calibração';
}

export interface Equipamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  numeroSerie: string;
  fabricante: string;
  modelo: string;
  tipoEquipamento: string; // ex: 'Medidor de Umidade GEHAKA', 'Balança de Precisão', 'Multigás', 'pHmetro'
  faixaMedicao: string;
  resolucao: string;
  patrimonio?: string;
  servicoAnterior?: string;
  historicoOsIds?: string[];
  lacreAnterior?: string;
  seloAnterior?: string;
  lacreNovo?: string;
  seloNovo?: string;
  anoFabricacao?: string;
  dataServicoAnterior?: string;
  portariaInmetro?: string;
  temEtiquetaAnterior?: string;
  dataUltimaCalibracao: string;
  dataProximaCalibracao: string;
  status: StatusEquipamento;
  observacoes?: string;
}

// ==========================================
// 3. PADRÕES BASAIS DE REFERÊNCIA (LABORATÓRIO RARUS)
// ==========================================
export type StatusPadraoBasal =
  | 'Valido'
  | 'Alerta90d'
  | 'Alerta60d'
  | 'Alerta30dCritico'
  | 'VencidoBloqueado';

export interface HistoricoCalibracaoPadrao {
  data: string;
  certificadoRBC: string;
  orgaoCalibrador: string;
  validade: string;
}

export interface PadraoBasal {
  id: string;
  codigoIdentificador: string; // ex: 'TH-01', 'BAL-01', 'PESO-F1-02'
  descricao: string;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  grandeza: string;
  orgaoCalibrador: string; // ex: 'IPT', 'Inmetro', 'LabMetrol RBC #0112'
  certificadoRBC: string;
  dataCalibracao: string;
  dataValidade: string;
  incertezaPadrao: string;
  fatorK: number;
  status: StatusPadraoBasal;
  historicoCalibracoes: HistoricoCalibracaoPadrao[];
}

// ==========================================
// 4. ORDENS DE SERVIÇO (14 STATUS OFICIAIS & ITENS)
// ==========================================
export type StatusOS =
  | 'Aberta'
  | 'Em Serviço'
  | 'Em Bancada'
  | 'Aguardando Peças'
  | 'Enviado para Fábrica'
  | 'Sem Conserto'
  | 'Orçamento Pronto'
  | 'Aprovada'
  | 'Aprovada Faturar'
  | 'Equipamento Pronto'
  | 'Entregue ao Cliente'
  | 'Faturada'
  | 'Encerrada'
  | 'Cancelada';

export type TipoOS =
  | 'Calibração em Laboratório'
  | 'Calibração em Campo'
  | 'Manutenção Preventiva'
  | 'Manutenção Corretiva'
  | 'Ensaio Técnico'
  | 'Laboratório e Vendas';

export type PrioridadeOS = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface OrdemServicoItemEquipamento {
  equipamentoId: string;
  numeroSerie: string;
  modelo: string;
  numeroSequencial: number; // 1, 2, 3...
  certificadoNumero?: string; // ex: '1045-1/25'
  statusItem: string;
  observacoes?: string;
}

export interface OrdemServicoItemPeca {
  pecaId: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorDesconto?: number;
  percentualDesconto?: number;
  valorTotal?: number;
  tipoItem?: 'Peca' | 'Servico';
  estoqueOrigemId?: string;
  numeroSeriePeca?: string;
  seriaisOuIds?: string[];
}

export interface OrdemServico {
  id: string;
  numero: string; // ex: '1045'
  clienteId: string;
  clienteNome: string;
  tipo: TipoOS;
  prioridade: PrioridadeOS;
  status: StatusOS;
  equipamentos: OrdemServicoItemEquipamento[];
  pecas: OrdemServicoItemPeca[];
  tecnicoId: string;
  tecnicoNome: string;
  dataAbertura: string;
  dataPrevisao?: string;
  dataConclusao?: string;
  descricaoProblema: string;
  laudoTecnico?: string;
  valorTotalServicos: number;
  valorTotalPecas: number;
  valorTotalGeral: number;
  faturada: boolean;
}

// ==========================================
// 5. ESTOQUE & MOVIMENTAÇÕES (DUAL FÍSICO/FISCAL)
// ==========================================
export interface EstoqueLocal {
  id: string;
  codigo?: string;
  tipo: 'Central' | 'Tecnico';
  nome: string; // ex: 'Estoque Central - Matriz', 'Estoque Veículo - Técnico Itamar'
  tecnicoResponsavelId?: string;
  tecnicoResponsavelNome?: string;
  ativo: boolean;
}

export interface ItemEstoque {
  id: string;
  codigo: string;
  descricao: string;
  tipoItem: 'ProdutoPeca' | 'Servico'; // Peças abatem estoque físico/fiscal; Serviços compõem valor
  requerNumeroSerie: boolean;
  saldosPorLocal: Record<string, number>; // localId -> saldo físico atual
  saldoFiscal: number;
  precoVenda: number;
  custoMedio: number;
  unidadeMedida: string;
}

export interface MovimentacaoEstoque {
  id: string;
  dataHora: string;
  tipo: 'Entrada' | 'SaidaOS' | 'Transferencia' | 'Ajuste';
  origemLocalId?: string;
  destinoLocalId?: string;
  itemCodigo: string;
  itemDescricao: string;
  quantidade: number;
  numeroSerie?: string;
  osNumero?: string;
  responsavelNome: string;
  status: 'PendenteAprovacao' | 'Concluida' | 'Cancelada';
  motivo?: string;
}

export interface ItemTransferenciaEstoque {
  seq: string;
  itemCodigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  saldoFisicoOrigem: number;
  precoUnitario: number;
  valorItem: number;
  valorDesconto?: number;
  percentualDesconto?: number;
  func1?: string;
  func2?: string;
  func3?: string;
}

export interface TransferenciaEstoque {
  id: string;
  identificador: string;
  numeroMovimento: string;
  serie: string;
  tipoMovimento: string;
  status: 'Normal' | 'Pendente' | 'Concluido' | 'Cancelado';
  horaEmissao: string;
  dataEmissao: string;
  usuarioInclusao: string;
  filialOrigem: string;
  origemLocalId: string;
  origemLocalNome: string;
  filialDestino: string;
  destinoLocalId: string;
  destinoLocalNome: string;
  funcionarioCodigo: string;
  funcionarioNome: string;
  observacoes?: string;
  itens: ItemTransferenciaEstoque[];
  quantidadeTotal: number;
  pesoTotal: number;
  valorBruto: number;
  subTotal: number;
  valorLiquido: number;
}


// ==========================================
// 6. MOTOR DE CALIBRAÇÕES POR RELATOS & TEMPLATES HTML
// ==========================================
export interface TipoCalibracao {
  id: string;
  nome: string; // ex: 'Calibração Rastreável RARUS', 'Calibração RBC Inmetro'
  sigla: string;
  ativo: boolean;
}

export interface CampoColetaRelato {
  id: string;
  label: string;
  tipo: 'numero' | 'texto' | 'tabela';
  unidade?: string;
  valorPadrao?: number | string;
}

export interface RelatoCalibracao {
  id: string;
  tipoCalibracaoId: string;
  tipoCalibracaoNome: string;
  tipoEquipamento: string; // ex: 'Medidor de Umidade GEHAKA'
  tituloRelato: string;
  padroesObrigatorios: string[]; // ex: ['TH-01']
  camposColeta: CampoColetaRelato[];
  formulasCalculo: string; // expressões ou regras de cálculo
  templateHtmlCertificado: string; // HTML com variáveis {{cliente.nome}}, {{equipamento.serie}}, etc.
}

export interface CertificadoCalibracao {
  id: string;
  numero: string; // Formato oficial: 0000-0/AA, ex: '1045-1/25'
  osId: string;
  osNumero: string;
  equipamentoId: string;
  equipamentoSerie: string;
  equipamentoModelo: string;
  clienteId: string;
  clienteNome: string;
  relatoId: string;
  tipoCalibracaoNome: string;
  tecnicoId: string;
  tecnicoNome: string;
  assinaturaTecnicoUrl?: string;
  dataEmissao: string;
  dataValidade: string;
  padroesUtilizados: {
    identificador: string;
    descricao: string;
    certificado: string;
    validade: string;
  }[];
  dadosColetados: Record<string, unknown>;
  calculosResultados: Record<string, number | string | boolean>;
  htmlCertificadoGerado: string;
  hashAutenticidade: string;
  status: 'Válido' | 'Cancelado';
}

// ==========================================
// 7. FUNCIONÁRIOS & MATRIZ DE COMPETÊNCIA RH
// ==========================================
export interface PermissaoCalibracaoTecnico {
  tipoCalibracaoId: string;
  tipoCalibracaoNome: string;
  tipoEquipamento: string;
}

export interface UsuarioFuncionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  perfil: 'Administrador' | 'ResponsavelTecnico' | 'Tecnico' | 'Comercial' | 'RH' | 'Cliente';
  telefone: string;
  assinaturaDigitalUrl?: string; // imagem transparente .png
  permissoesCalibracao: PermissaoCalibracaoTecnico[];
  estoqueLocalId?: string;
  ativo: boolean;
}

// ==========================================
// 8. RELATÓRIOS & CONSULTAS
// ==========================================
export interface FiltroRelatorio {
  tipo:
    | 'orcamento'
    | 'etiquetas'
    | 'estoque'
    | 'vencimentos-anual'
    | 'certificados'
    | 'sla-os'
    | 'pecas-servicos'
    | 'customizado';
  dataInicio?: string;
  dataFim?: string;
  clienteId?: string;
  estoqueLocalId?: string;
  filtroSaldo?: 'todos' | 'saldo-zero' | 'saldo-positivo' | 'saldo-negativo';
}

export interface ResultadoRelatorio {
  id: string;
  titulo: string;
  geradoEm: string;
  periodo: string;
  totalRegistros: number;
  indicadores: Record<string, string | number>;
  itens: Record<string, unknown>[];
}

export interface ItemBuscaGlobal {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: 'equipamento' | 'cliente' | 'os' | 'calibracao' | 'padrao' | 'estoque' | 'relatorio';
  tagBadge: string;
  moduloAlvo: string;
  rota: string;
  comandoAcao?: string; // ação direta disparada ao dar enter
  detalhes?: Record<string, string>;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  dados: T;
  mensagem?: string;
  meta?: {
    total: number;
    pagina?: number;
    limite?: number;
  };
}

// ==========================================
// 8.1 MODELOS DE RELATÓRIOS E DOCUMENTOS A4 (TEMPLATES)
// ==========================================
export type CategoriaModeloDocumento =
  | 'Ordem de Serviço'
  | 'Etiquetas'
  | 'Certificados'
  | 'Estoque'
  | 'Fiscal';

export type FormatoPapelDocumento =
  | 'A4 Retrato'
  | 'A4 Paisagem'
  | 'Etiqueta Lab'
  | 'Etiqueta Térmica';

export interface ModeloDocumentoRelatorio {
  id: string;
  codigo?: string;
  nome: string;
  descricao: string;
  categoria: CategoriaModeloDocumento;
  tipoMovimentoVinculado: string;
  disponivelNaImpressaoOS: boolean;
  formatoPapel: FormatoPapelDocumento;
  templateHtml: string;
  versao: string;
  dataAtualizacao: string;
  ativo: boolean;
  variaveisDisponiveis?: string[];
}
