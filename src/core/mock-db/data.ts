import {
  Cliente,
  Equipamento,
  PadraoBasal,
  OrdemServico,
  EstoqueLocal,
  ItemEstoque,
  MovimentacaoEstoque,
  TipoCalibracao,
  RelatoCalibracao,
  CertificadoCalibracao,
  UsuarioFuncionario,
} from '../types';

// ==========================================
// 1. CLIENTES REAIS (AGRO, INDÚSTRIA & QUÍMICA)
// ==========================================
export const MOCK_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    codigo: 'CLI-001',
    razaoSocial: 'Cooperativa Agroindustrial Grãos do Vale',
    nomeFantasia: 'AgroGrãos Cooperativa',
    cnpj: '14.288.910/0001-44',
    ie: '109.845.210.112',
    email: 'qualidade.graos@agrovale.com.br',
    telefone: '(19) 3521-4400',
    endereco: 'Rodovia SP-340, Km 142 - Setor Industrial',
    cidade: 'Mogi Mirim',
    estado: 'SP',
    cep: '13800-970',
    contatos: [
      {
        id: 'cnt-1',
        nome: 'Eng. Ricardo Silveira',
        cargo: 'Gerente de Controle de Qualidade',
        email: 'ricardo@agrovale.com.br',
        telefone: '(19) 99812-3344',
        whatsapp: '(19) 99812-3344',
      },
      {
        id: 'cnt-2',
        nome: 'Daniele Rossi',
        cargo: 'Supervisora de Armazenamento de Grãos',
        email: 'daniele.rossi@agrovale.com.br',
        telefone: '(19) 98110-5522',
      },
    ],
    contatoResponsavel: 'Eng. Ricardo Silveira',
    segmento: 'Agronegócio / Grãos',
    observacoesAvulsas:
      'Cliente prioritário de safra. Possui 8 medidores de umidade Gehaka na planta central e 4 balanças.',
    status: 'Ativo',
  },
  {
    id: 'cli-2',
    codigo: 'CLI-002',
    razaoSocial: 'BioFarma Laboratórios & Princípios Ativos Ltda',
    nomeFantasia: 'BioFarma do Brasil',
    cnpj: '22.334.556/0001-89',
    ie: '244.112.980.001',
    email: 'metrologia@biofarma.com.br',
    telefone: '(11) 4560-8800',
    endereco: 'Av. das Nações Tecnológicas, 800 - Polo Farma',
    cidade: 'Campinas',
    estado: 'SP',
    cep: '13083-880',
    contatos: [
      {
        id: 'cnt-3',
        nome: 'Dra. Helena Vasconcelos',
        cargo: 'Responsável Garantia da Qualidade',
        email: 'helena.v@biofarma.com.br',
        telefone: '(19) 99123-4567',
        whatsapp: '(19) 99123-4567',
      },
    ],
    contatoResponsavel: 'Dra. Helena Vasconcelos',
    segmento: 'Farmacêutico / Laboratório',
    observacoesAvulsas: 'Exige calibração acreditada RBC em balanças analíticas semestralmente.',
    status: 'Ativo',
  },
  {
    id: 'cli-3',
    codigo: 'CLI-003',
    razaoSocial: 'Moinho de Cereais & Rações Triângulo S/A',
    nomeFantasia: 'Moinho Triângulo',
    cnpj: '03.771.882/0002-33',
    ie: '001.445.981.234',
    email: 'manutencao@moinhotriangulo.com.br',
    telefone: '(34) 3219-0010',
    endereco: 'Av. dos Silos, 2100 - Distrito Industrial',
    cidade: 'Uberlândia',
    estado: 'MG',
    cep: '38402-340',
    contatos: [
      {
        id: 'cnt-4',
        nome: 'Carlos Eduardo Mendes',
        cargo: 'Encarregado de Manutenção Industrial',
        email: 'carlos.mendes@moinhotriangulo.com.br',
        telefone: '(34) 98844-1122',
        whatsapp: '(34) 98844-1122',
      },
    ],
    contatoResponsavel: 'Carlos Eduardo Mendes',
    segmento: 'Alimentos / Moagem',
    observacoesAvulsas: 'Calibração periódica em campo com padrões portáteis.',
    status: 'Ativo',
  },
];

// ==========================================
// 2. EQUIPAMENTOS (COM FOCO EM GEHAKA E CAMPOS TÉCNICOS)
// ==========================================
export const MOCK_EQUIPAMENTOS: Equipamento[] = [
  {
    id: 'eq-1',
    clienteId: 'cli-1',
    clienteNome: 'AgroGrãos Cooperativa',
    numeroSerie: 'GEH-2023-90812',
    fabricante: 'GEHAKA',
    modelo: 'G650i',
    tipoEquipamento: 'Medidor de Umidade GEHAKA',
    faixaMedicao: '8 a 50 % Umidade',
    resolucao: '0,1 %',
    patrimonio: 'PAT-AGRO-401',
    servicoAnterior: 'Calibração Rastreável RARUS e Limpeza de Câmara',
    historicoOsIds: ['1041', '1045'],
    lacreAnterior: 'LAC-2024-0891',
    seloAnterior: 'SELO-INM-44910',
    lacreNovo: 'LAC-2025-1022',
    seloNovo: 'SELO-INM-55201',
    dataUltimaCalibracao: '2025-02-15',
    dataProximaCalibracao: '2026-02-15',
    status: 'Calibrado',
    observacoes: 'Utilizado no recebimento de soja e milho na moega 01.',
  },
  {
    id: 'eq-2',
    clienteId: 'cli-1',
    clienteNome: 'AgroGrãos Cooperativa',
    numeroSerie: 'GEH-2022-77140',
    fabricante: 'GEHAKA',
    modelo: 'G810',
    tipoEquipamento: 'Medidor de Umidade GEHAKA',
    faixaMedicao: '5 a 45 % Umidade',
    resolucao: '0,1 %',
    patrimonio: 'PAT-AGRO-402',
    servicoAnterior: 'Substituição de célula de medição e ajuste de curva',
    historicoOsIds: ['1045'],
    lacreAnterior: 'LAC-2024-0411',
    seloAnterior: 'SELO-INM-39801',
    lacreNovo: 'LAC-2025-1023',
    seloNovo: 'SELO-INM-55202',
    dataUltimaCalibracao: '2025-03-01',
    dataProximaCalibracao: '2026-03-01',
    status: 'Calibrado',
    observacoes: 'Bancada do laboratório de recepção de sementes.',
  },
  {
    id: 'eq-3',
    clienteId: 'cli-1',
    clienteNome: 'AgroGrãos Cooperativa',
    numeroSerie: 'GEH-BAL-44102',
    fabricante: 'GEHAKA',
    modelo: 'BG 1000',
    tipoEquipamento: 'Balança de Precisão',
    faixaMedicao: '0 a 1000 g',
    resolucao: '0,01 g',
    patrimonio: 'PAT-AGRO-209',
    servicoAnterior: 'Calibração com Pesos-Padrão Classe F1',
    historicoOsIds: ['1045'],
    lacreAnterior: 'LAC-2024-0105',
    seloAnterior: 'SELO-INM-12904',
    lacreNovo: 'LAC-2025-1024',
    seloNovo: 'SELO-INM-55203',
    dataUltimaCalibracao: '2025-02-15',
    dataProximaCalibracao: '2026-02-15',
    status: 'Calibrado',
  },
  {
    id: 'eq-4',
    clienteId: 'cli-2',
    clienteNome: 'BioFarma do Brasil',
    numeroSerie: 'SAR-2024-0012',
    fabricante: 'Sartorius',
    modelo: 'Secura 225D',
    tipoEquipamento: 'Balança de Precisão',
    faixaMedicao: '0 a 220 g',
    resolucao: '0,01 mg',
    patrimonio: 'BIO-LAB-01',
    servicoAnterior: 'Calibração RBC Inmetro',
    historicoOsIds: ['1042'],
    lacreAnterior: 'LAC-2024-8891',
    seloAnterior: 'SELO-INM-99120',
    dataUltimaCalibracao: '2025-06-20',
    dataProximaCalibracao: '2026-06-20',
    status: 'Calibrado',
  },
  {
    id: 'eq-5',
    clienteId: 'cli-3',
    clienteNome: 'Moinho Triângulo',
    numeroSerie: 'GEH-2021-33190',
    fabricante: 'GEHAKA',
    modelo: 'G933',
    tipoEquipamento: 'Medidor de Umidade GEHAKA',
    faixaMedicao: '8 a 40 %',
    resolucao: '0,1 %',
    patrimonio: 'PAT-MOI-104',
    servicoAnterior: 'Limpeza e recalibração',
    historicoOsIds: ['1043'],
    dataUltimaCalibracao: '2024-09-10',
    dataProximaCalibracao: '2025-09-10', // Vencido para teste comercial
    status: 'Vencido',
  },
];

// ==========================================
// 3. PADRÕES BASAIS (REFERÊNCIAS COM ALERTAS 90d/60d/30d)
// ==========================================
export const MOCK_PADROES_BASAIS: PadraoBasal[] = [
  {
    id: 'pad-1',
    codigoIdentificador: 'TH-01',
    descricao: 'Termohigrômetro Digital Padrão de Alta Precisão',
    fabricante: 'Testo',
    modelo: 'Testo 625 Reference',
    numeroSerie: 'TST-881290',
    grandeza: 'Temperatura / Umidade',
    orgaoCalibrador: 'LabMetrol Inmetro Acreditado #0112',
    certificadoRBC: 'LT-457 607',
    dataCalibracao: '2025-09-01',
    dataValidade: '2028-09-01',
    incertezaPadrao: '± 0,2 °C / ± 1,5 %UR',
    fatorK: 2.0,
    status: 'Valido',
    historicoCalibracoes: [
      {
        data: '2025-09-01',
        certificadoRBC: 'LT-457 607',
        orgaoCalibrador: 'LabMetrol RBC #0112',
        validade: '2028-09-01',
      },
    ],
  },
  {
    id: 'pad-2',
    codigoIdentificador: 'BAL-01',
    descricao: 'Balança Analítica Padrão de Classe I',
    fabricante: 'Mettler Toledo',
    modelo: 'XPR205',
    numeroSerie: 'MT-992144',
    grandeza: 'Massa',
    orgaoCalibrador: 'IPT - Instituto de Pesquisas Tecnológicas',
    certificadoRBC: 'RBC-MAS-2025-0911',
    dataCalibracao: '2025-05-10',
    dataValidade: '2027-05-10',
    incertezaPadrao: '± 0,02 mg',
    fatorK: 2.0,
    status: 'Valido',
    historicoCalibracoes: [
      {
        data: '2025-05-10',
        certificadoRBC: 'RBC-MAS-2025-0911',
        orgaoCalibrador: 'IPT',
        validade: '2027-05-10',
      },
    ],
  },
  {
    id: 'pad-3',
    codigoIdentificador: 'PESO-F1-01',
    descricao: 'Estojo de Pesos-Padrão Classe F1 (1 mg a 1 kg)',
    fabricante: 'Häfner Weight',
    modelo: 'Classe F1 Inox',
    numeroSerie: 'HAF-5501',
    grandeza: 'Massa',
    orgaoCalibrador: 'CaliBras Metrologia RBC #0245',
    certificadoRBC: 'RBC-F1-2025-3310',
    dataCalibracao: '2025-04-12',
    dataValidade: '2026-10-15', // Alerta 90d warning
    incertezaPadrao: 'Conforme Portaria Inmetro 233/94',
    fatorK: 2.0,
    status: 'Alerta90d',
    historicoCalibracoes: [
      {
        data: '2025-04-12',
        certificadoRBC: 'RBC-F1-2025-3310',
        orgaoCalibrador: 'CaliBras RBC',
        validade: '2026-10-15',
      },
    ],
  },
  {
    id: 'pad-4',
    codigoIdentificador: 'PAD-PRESS-02',
    descricao: 'Calibrador de Pressão Digital Deadweight Tester',
    fabricante: 'Fluke Calibration',
    modelo: '700G31',
    numeroSerie: 'FLK-771239',
    grandeza: 'Pressão',
    orgaoCalibrador: 'LabPress RBC #0088',
    certificadoRBC: 'RBC-PRE-2024-1102',
    dataCalibracao: '2024-04-01',
    dataValidade: '2026-04-01', // Próximo de vencer (Atenção 60d)
    incertezaPadrao: '± 0,01% FE',
    fatorK: 2.0,
    status: 'Alerta60d',
    historicoCalibracoes: [
      {
        data: '2024-04-01',
        certificadoRBC: 'RBC-PRE-2024-1102',
        orgaoCalibrador: 'LabPress',
        validade: '2026-04-01',
      },
    ],
  },
  {
    id: 'pad-5',
    codigoIdentificador: 'PAD-TEMP-03',
    descricao: 'Calibrador Térmico de Bloco Seco',
    fabricante: 'Jofra',
    modelo: 'RTC-157',
    numeroSerie: 'JOF-1192',
    grandeza: 'Temperatura',
    orgaoCalibrador: 'IPT',
    certificadoRBC: 'RBC-TEM-2023-9901',
    dataCalibracao: '2023-01-10',
    dataValidade: '2025-01-10', // Vencido: Bloqueado para uso!
    incertezaPadrao: '± 0,05 °C',
    fatorK: 2.0,
    status: 'VencidoBloqueado',
    historicoCalibracoes: [
      {
        data: '2023-01-10',
        certificadoRBC: 'RBC-TEM-2023-9901',
        orgaoCalibrador: 'IPT',
        validade: '2025-01-10',
      },
    ],
  },
];

// ==========================================
// 4. LOCAIS DE ESTOQUE (CENTRAL & TÉCNICOS)
// ==========================================
export const MOCK_ESTOQUES: EstoqueLocal[] = [
  {
    id: 'est-central',
    tipo: 'Central',
    nome: 'Estoque Central - Matriz RARUS',
    tecnicoResponsavelNome: 'Almoxarife Central',
    ativo: true,
  },
  {
    id: 'est-tec-itamar',
    tipo: 'Tecnico',
    nome: 'Estoque Móvel - Técnico Itamar (Veículo 01)',
    tecnicoResponsavelId: 'usr-tec-itamar',
    tecnicoResponsavelNome: 'Técnico Itamar Soares',
    ativo: true,
  },
  {
    id: 'est-tec-marcos',
    tipo: 'Tecnico',
    nome: 'Estoque Móvel - Técnico Marcos (Veículo 02)',
    tecnicoResponsavelId: 'usr-tec-marcos',
    tecnicoResponsavelNome: 'Técnico Marcos Vinicius',
    ativo: true,
  },
];

// ==========================================
// 5. ITENS DE ESTOQUE (PEÇAS & SERVIÇOS)
// ==========================================
export const MOCK_ITENS_ESTOQUE: ItemEstoque[] = [
  {
    id: 'it-1',
    codigo: 'PEC-GEH-01',
    descricao: 'Célula de Medição de Umidade Original Gehaka G650i',
    tipoItem: 'ProdutoPeca',
    requerNumeroSerie: true,
    saldosPorLocal: {
      'est-central': 12,
      'est-tec-itamar': 2,
      'est-tec-marcos': 1,
    },
    saldoFiscal: 15,
    precoVenda: 1450.0,
    custoMedio: 820.0,
    unidadeMedida: 'UN',
  },
  {
    id: 'it-2',
    codigo: 'PEC-GEH-02',
    descricao: 'Sensor de Temperatura PT-100 para Câmara de Medidor',
    tipoItem: 'ProdutoPeca',
    requerNumeroSerie: false,
    saldosPorLocal: {
      'est-central': 35,
      'est-tec-itamar': 5,
      'est-tec-marcos': 3,
    },
    saldoFiscal: 43,
    precoVenda: 280.0,
    custoMedio: 120.0,
    unidadeMedida: 'UN',
  },
  {
    id: 'it-3',
    codigo: 'PEC-VED-03',
    descricao: 'Kit de Anéis O-ring de Vedação de Silicone',
    tipoItem: 'ProdutoPeca',
    requerNumeroSerie: false,
    saldosPorLocal: {
      'est-central': 80,
      'est-tec-itamar': 15,
      'est-tec-marcos': 10,
    },
    saldoFiscal: 105,
    precoVenda: 45.0,
    custoMedio: 12.0,
    unidadeMedida: 'KT',
  },
  {
    id: 'it-4',
    codigo: 'SRV-CAL-UMID',
    descricao: 'Serviço de Calibração Rastreável RARUS em Medidor de Umidade',
    tipoItem: 'Servico',
    requerNumeroSerie: false,
    saldosPorLocal: {
      'est-central': 9999,
      'est-tec-itamar': 9999,
      'est-tec-marcos': 9999,
    },
    saldoFiscal: 9999,
    precoVenda: 580.0,
    custoMedio: 0.0,
    unidadeMedida: 'SV',
  },
  {
    id: 'it-5',
    codigo: 'SRV-CAL-BAL',
    descricao: 'Serviço de Calibração Rastreável RARUS em Balança de Precisão',
    tipoItem: 'Servico',
    requerNumeroSerie: false,
    saldosPorLocal: {
      'est-central': 9999,
      'est-tec-itamar': 9999,
      'est-tec-marcos': 9999,
    },
    saldoFiscal: 9999,
    precoVenda: 420.0,
    custoMedio: 0.0,
    unidadeMedida: 'SV',
  },
  {
    id: 'it-6',
    codigo: 'SRV-MAN-LIMPEZA',
    descricao: 'Peça/Serviço: Higienização Química e Ajuste Mecânico da Balança',
    tipoItem: 'Servico', // Peça lançada como serviço que compõe a OS sem gerar NF de produto
    requerNumeroSerie: false,
    saldosPorLocal: {
      'est-central': 9999,
      'est-tec-itamar': 9999,
      'est-tec-marcos': 9999,
    },
    saldoFiscal: 9999,
    precoVenda: 180.0,
    custoMedio: 35.0,
    unidadeMedida: 'UN',
  },
];

// ==========================================
// 6. MOVIMENTAÇÕES DE ESTOQUE & REQUISIÇÕES
// ==========================================
export const MOCK_MOVIMENTACOES: MovimentacaoEstoque[] = [
  {
    id: 'mov-1',
    dataHora: '01/09/2026 09:30',
    tipo: 'Transferencia',
    origemLocalId: 'est-central',
    destinoLocalId: 'est-tec-itamar',
    itemCodigo: 'PEC-GEH-01',
    itemDescricao: 'Célula de Medição de Umidade Original Gehaka G650i',
    quantidade: 2,
    numeroSerie: 'CEL-9921, CEL-9922',
    responsavelNome: 'Almoxarife Central',
    status: 'Concluida',
    motivo: 'Abastecimento da maleta técnica para atendimento em campo',
  },
  {
    id: 'mov-2',
    dataHora: '01/09/2026 14:15',
    tipo: 'Transferencia',
    origemLocalId: 'est-central',
    destinoLocalId: 'est-tec-itamar',
    itemCodigo: 'PEC-GEH-02',
    itemDescricao: 'Sensor de Temperatura PT-100',
    quantidade: 3,
    responsavelNome: 'Técnico Itamar Soares',
    status: 'PendenteAprovacao',
    motivo: 'Requisição de peças para OS 1045',
  },
  {
    id: 'mov-3',
    dataHora: '01/09/2026 16:40',
    tipo: 'SaidaOS',
    origemLocalId: 'est-tec-itamar',
    itemCodigo: 'PEC-VED-03',
    itemDescricao: 'Kit de Anéis O-ring de Vedação',
    quantidade: 1,
    osNumero: '1045',
    responsavelNome: 'Técnico Itamar Soares',
    status: 'Concluida',
    motivo: 'Substituição na manutenção preventiva da OS 1045',
  },
];

// ==========================================
// 7. TIPOS DE CALIBRAÇÃO & RELATOS (TEMPLATES HTML)
// ==========================================
export const MOCK_TIPOS_CALIBRACAO: TipoCalibracao[] = [
  {
    id: 'tp-cal-rarus',
    nome: 'Calibração Rastreável RARUS',
    sigla: 'CRR',
    ativo: true,
  },
  {
    id: 'tp-cal-rbc',
    nome: 'Calibração RBC Inmetro',
    sigla: 'RBC',
    ativo: true,
  },
  {
    id: 'tp-cal-campo',
    nome: 'Calibração em Campo com Padrão Portátil',
    sigla: 'CCP',
    ativo: true,
  },
];

export const MOCK_RELATOS: RelatoCalibracao[] = [
  {
    id: 'rel-umidade-gehaka',
    tipoCalibracaoId: 'tp-cal-rarus',
    tipoCalibracaoNome: 'Calibração Rastreável RARUS',
    tipoEquipamento: 'Medidor de Umidade GEHAKA',
    tituloRelato: 'Ensaio de Conformidade para Medidores de Umidade de Grãos',
    padroesObrigatorios: ['TH-01'],
    camposColeta: [
      { id: 'temperaturaAmbiente', label: 'Temperatura Ambiente (°C)', tipo: 'numero', unidade: '°C' },
      { id: 'umidadeAmbiente', label: 'Umidade Relativa do Ar (%UR)', tipo: 'numero', unidade: '%UR' },
      { id: 'leituraPadrao13', label: 'Ponto 13,0% - Leitura Observada', tipo: 'numero', unidade: '%' },
      { id: 'leituraPadrao20', label: 'Ponto 20,0% - Leitura Observada', tipo: 'numero', unidade: '%' },
      { id: 'leituraPadrao28', label: 'Ponto 28,0% - Leitura Observada', tipo: 'numero', unidade: '%' },
    ],
    formulasCalculo:
      'Erro = Leitura - ValorPadrao; IncertezaExpandida = 0.15; Conforme = abs(Erro) <= 0.3',
    templateHtmlCertificado: `
<div style="font-family: Arial, sans-serif; padding: 24px; color: #0a2240; max-width: 800px; margin: 0 auto; border: 1px solid #cbd5e1;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0a2240; padding-bottom: 12px;">
    <div>
      <h2 style="margin: 0; color: #0a2240; font-size: 20px;">RARUS TECNOLOGIA E SERVIÇOS</h2>
      <div style="font-size: 11px; color: #1d82cd; font-weight: bold;">LABORATÓRIO DE METROLOGIA E ASSISTÊNCIA TÉCNICA</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 10px; color: #64748b;">CERTIFICADO Nº</div>
      <div style="font-size: 16px; font-weight: bold; color: #0a2240;">{{certificado.numero}}</div>
    </div>
  </div>

  <div style="margin-top: 16px; font-size: 12px; line-height: 1.6;">
    <p><strong>Cliente:</strong> {{cliente.razaoSocial}} (CNPJ: {{cliente.cnpj}})</p>
    <p><strong>Equipamento:</strong> {{equipamento.modelo}} - Nº Série: {{equipamento.numeroSerie}} - Patrimônio: {{equipamento.patrimonio}}</p>
    <p><strong>Lacre Novo:</strong> {{equipamento.lacreNovo}} | <strong>Selo Novo:</strong> {{equipamento.seloNovo}}</p>
    <p><strong>Padrão de Referência Utilizado:</strong> {{padrao.identificador}} - {{padrao.descricao}} (Certificado RBC: {{padrao.certificado}})</p>
    <p><strong>Condições Ambientais:</strong> Temperatura: {{ensaio.temperaturaAmbiente}} °C | Umidade: {{ensaio.umidadeAmbiente}} %UR</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11.5px; text-align: center;">
    <thead>
      <tr style="background: #0a2240; color: white;">
        <th style="padding: 6px;">Ponto Padrão</th>
        <th style="padding: 6px;">Leitura Instrumento</th>
        <th style="padding: 6px;">Erro Sistemático</th>
        <th style="padding: 6px;">Incerteza U (k=2)</th>
        <th style="padding: 6px;">Situação</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="border: 1px solid #cbd5e1; padding: 6px;">13,0 %</td><td style="border: 1px solid #cbd5e1; padding: 6px;">{{ensaio.leituraPadrao13}} %</td><td style="border: 1px solid #cbd5e1; padding: 6px;">+0,1 %</td><td style="border: 1px solid #cbd5e1; padding: 6px;">± 0,15 %</td><td style="border: 1px solid #cbd5e1; padding: 6px; color: #059669; font-weight: bold;">CONFORME</td></tr>
      <tr><td style="border: 1px solid #cbd5e1; padding: 6px;">20,0 %</td><td style="border: 1px solid #cbd5e1; padding: 6px;">{{ensaio.leituraPadrao20}} %</td><td style="border: 1px solid #cbd5e1; padding: 6px;">-0,1 %</td><td style="border: 1px solid #cbd5e1; padding: 6px;">± 0,15 %</td><td style="border: 1px solid #cbd5e1; padding: 6px; color: #059669; font-weight: bold;">CONFORME</td></tr>
    </tbody>
  </table>

  <div style="margin-top: 24px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 11px;">
    <strong>Declaração de Conformidade:</strong> O instrumento foi ensaiado e calibrado atendendo aos critérios de aceitação metrológica da RARUS Tecnologia e especificações do fabricante GEHAKA.
  </div>

  <div style="margin-top: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
    <div>
      <div style="font-size: 11px; color: #64748b;">Técnico Executor:</div>
      <div style="font-weight: bold; font-size: 13px;">{{tecnico.nome}}</div>
      <div style="font-size: 10px; color: #64748b;">RARUS Metrologia e Serviços</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 10px; color: #64748b;">Chave Digital:</div>
      <div style="font-family: monospace; font-size: 11px; color: #1d82cd; font-weight: bold;">{{certificado.hash}}</div>
    </div>
  </div>
</div>
`,
  },
  {
    id: 'rel-balanca-precisao',
    tipoCalibracaoId: 'tp-cal-rarus',
    tipoCalibracaoNome: 'Calibração Rastreável RARUS',
    tipoEquipamento: 'Balança de Precisão',
    tituloRelato: 'Calibração de Balanças com Pesos-Padrão Classe F1',
    padroesObrigatorios: ['TH-01', 'PESO-F1-01'],
    camposColeta: [
      { id: 'temperatura', label: 'Temperatura (°C)', tipo: 'numero', unidade: '°C' },
      { id: 'cargaCero', label: 'Indicação em Zero (0,00 g)', tipo: 'numero', unidade: 'g' },
      { id: 'cargaMeia', label: 'Indicação em 500,00 g', tipo: 'numero', unidade: 'g' },
      { id: 'cargaTotal', label: 'Indicação em 1000,00 g', tipo: 'numero', unidade: 'g' },
    ],
    formulasCalculo: 'Erro = Leitura - CargaNominal; Incerteza = 0.02 g',
    templateHtmlCertificado: `
<div style="font-family: Arial, sans-serif; padding: 24px; color: #0a2240; max-width: 800px; margin: 0 auto; border: 1px solid #cbd5e1;">
  <h2 style="margin: 0; color: #0a2240;">RARUS TECNOLOGIA E SERVIÇOS</h2>
  <p>Certificado de Calibração de Balança: {{certificado.numero}}</p>
  <p>Cliente: {{cliente.razaoSocial}} | Série: {{equipamento.numeroSerie}}</p>
</div>
`,
  },
];

// ==========================================
// 8. ORDENS DE SERVIÇO (MÚLTIPLOS EQUIPAMENTOS & 14 STATUS)
// ==========================================
export const MOCK_ORDENS_SERVICO: OrdemServico[] = [
  {
    id: 'os-1045',
    numero: '1045',
    clienteId: 'cli-1',
    clienteNome: 'AgroGrãos Cooperativa',
    tipo: 'Calibração em Campo',
    prioridade: 'Alta',
    status: 'Em Serviço',
    equipamentos: [
      {
        equipamentoId: 'eq-1',
        numeroSerie: 'GEH-2023-90812',
        modelo: 'GEHAKA G650i',
        numeroSequencial: 1,
        certificadoNumero: '1045-1/25',
        statusItem: 'Em Calibração',
        observacoes: 'Medidor Moega 01',
      },
      {
        equipamentoId: 'eq-2',
        numeroSerie: 'GEH-2022-77140',
        modelo: 'GEHAKA G810',
        numeroSequencial: 2,
        certificadoNumero: '1045-2/25',
        statusItem: 'Aguardando Ensaio',
        observacoes: 'Medidor Sementes',
      },
      {
        equipamentoId: 'eq-3',
        numeroSerie: 'GEH-BAL-44102',
        modelo: 'GEHAKA BG 1000',
        numeroSequencial: 3,
        certificadoNumero: '1045-3/25',
        statusItem: 'Aguardando Ensaio',
        observacoes: 'Balança de Precisão',
      },
    ],
    pecas: [
      {
        pecaId: 'it-4',
        codigo: 'SRV-CAL-UMID',
        descricao: 'Serviço de Calibração Rastreável RARUS em Medidor de Umidade (2 aparelhos)',
        quantidade: 2,
        valorUnitario: 580.0,
        tipoItem: 'Servico',
        estoqueOrigemId: 'est-tec-itamar',
      },
      {
        pecaId: 'it-5',
        codigo: 'SRV-CAL-BAL',
        descricao: 'Serviço de Calibração Rastreável RARUS em Balança de Precisão',
        quantidade: 1,
        valorUnitario: 420.0,
        tipoItem: 'Servico',
        estoqueOrigemId: 'est-tec-itamar',
      },
      {
        pecaId: 'it-3',
        codigo: 'PEC-VED-03',
        descricao: 'Kit de Anéis O-ring de Vedação (Peça)',
        quantidade: 1,
        valorUnitario: 45.0,
        tipoItem: 'Peca',
        estoqueOrigemId: 'est-tec-itamar',
      },
    ],
    tecnicoId: 'usr-tec-itamar',
    tecnicoNome: 'Técnico Itamar Soares',
    dataAbertura: '01/09/2026',
    dataPrevisao: '04/09/2026',
    descricaoProblema:
      'Calibração periódica em campo na planta central de grãos de 2 medidores e 1 balança.',
    laudoTecnico: 'Ensaio realizado com padrão TH-01 e estojo de pesos F1.',
    valorTotalServicos: 1580.0,
    valorTotalPecas: 45.0,
    valorTotalGeral: 1625.0,
    faturada: false,
  },
  {
    id: 'os-1044',
    numero: '1044',
    clienteId: 'cli-2',
    clienteNome: 'BioFarma do Brasil',
    tipo: 'Calibração em Laboratório',
    prioridade: 'Urgente',
    status: 'Equipamento Pronto',
    equipamentos: [
      {
        equipamentoId: 'eq-4',
        numeroSerie: 'SAR-2024-0012',
        modelo: 'Sartorius Secura 225D',
        numeroSequencial: 1,
        certificadoNumero: '1044-1/25',
        statusItem: 'Calibrado',
      },
    ],
    pecas: [
      {
        pecaId: 'it-5',
        codigo: 'SRV-CAL-BAL',
        descricao: 'Serviço de Calibração Acreditada em Balança Analítica',
        quantidade: 1,
        valorUnitario: 650.0,
        tipoItem: 'Servico',
        estoqueOrigemId: 'est-central',
      },
    ],
    tecnicoId: 'usr-tec-marcos',
    tecnicoNome: 'Técnico Marcos Vinicius',
    dataAbertura: '28/08/2026',
    dataPrevisao: '02/09/2026',
    dataConclusao: '01/09/2026',
    descricaoProblema: 'Calibração de balança analítica semestral para auditoria da Anvisa.',
    valorTotalServicos: 650.0,
    valorTotalPecas: 0.0,
    valorTotalGeral: 650.0,
    faturada: false,
  },
  {
    id: 'os-1043',
    numero: '1043',
    clienteId: 'cli-3',
    clienteNome: 'Moinho Triângulo',
    tipo: 'Manutenção Corretiva',
    prioridade: 'Média',
    status: 'Aguardando Peças',
    equipamentos: [
      {
        equipamentoId: 'eq-5',
        numeroSerie: 'GEH-2021-33190',
        modelo: 'GEHAKA G933',
        numeroSequencial: 1,
        statusItem: 'Aguardando Peça',
      },
    ],
    pecas: [
      {
        pecaId: 'it-1',
        codigo: 'PEC-GEH-01',
        descricao: 'Célula de Medição de Umidade Original Gehaka G650i',
        quantidade: 1,
        valorUnitario: 1450.0,
        tipoItem: 'Peca',
        estoqueOrigemId: 'est-central',
      },
    ],
    tecnicoId: 'usr-tec-itamar',
    tecnicoNome: 'Técnico Itamar Soares',
    dataAbertura: '25/08/2026',
    dataPrevisao: '05/09/2026',
    descricaoProblema: 'Equipamento não estabiliza leitura de umidade. Célula interna danificada.',
    valorTotalServicos: 350.0,
    valorTotalPecas: 1450.0,
    valorTotalGeral: 1800.0,
    faturada: false,
  },
];

// ==========================================
// 9. CERTIFICADOS EMITIDOS (NUMERAÇÃO 0000-X/AA)
// ==========================================
export const MOCK_CERTIFICADOS: CertificadoCalibracao[] = [
  {
    id: 'cert-1041-1',
    numero: '1041-1/25',
    osId: 'os-1041',
    osNumero: '1041',
    equipamentoId: 'eq-1',
    equipamentoSerie: 'GEH-2023-90812',
    equipamentoModelo: 'GEHAKA G650i',
    clienteId: 'cli-1',
    clienteNome: 'AgroGrãos Cooperativa',
    relatoId: 'rel-umidade-gehaka',
    tipoCalibracaoNome: 'Calibração Rastreável RARUS',
    tecnicoId: 'usr-tec-itamar',
    tecnicoNome: 'Técnico Itamar Soares',
    dataEmissao: '15/02/2025',
    dataValidade: '15/02/2026',
    padroesUtilizados: [
      {
        identificador: 'TH-01',
        descricao: 'Termohigrômetro Digital Testo 625',
        certificado: 'LT-457 607',
        validade: '01/09/2028',
      },
    ],
    dadosColetados: {
      temperaturaAmbiente: 21.2,
      umidadeAmbiente: 52.4,
      leituraPadrao13: 13.1,
      leituraPadrao20: 19.9,
    },
    calculosResultados: {
      erroMedio: 0.1,
      incertezaExpandida: 0.15,
      resultadoFinal: 'CONFORME',
    },
    htmlCertificadoGerado: '<div>Certificado 1041-1/25 Emitido com Sucesso</div>',
    hashAutenticidade: 'RARUS-AUTH-7A8B9C10',
    status: 'Válido',
  },
];

// ==========================================
// 10. FUNCIONÁRIOS & MATRIZ DE COMPETÊNCIA RH
// ==========================================
export const MOCK_FUNCIONARIOS: UsuarioFuncionario[] = [
  {
    id: 'usr-resp-tecnico',
    nome: 'Eng. Caio Detz',
    email: 'caio.detz@rarus.com.br',
    cargo: 'Responsável Técnico / Metrologista Chefe',
    perfil: 'ResponsavelTecnico',
    telefone: '(19) 98765-4321',
    assinaturaDigitalUrl: '/assinaturas/resp-tecnico.png',
    permissoesCalibracao: [
      { tipoCalibracaoId: 'tp-cal-rarus', tipoCalibracaoNome: 'Calibração Rastreável RARUS', tipoEquipamento: 'Medidor de Umidade GEHAKA' },
      { tipoCalibracaoId: 'tp-cal-rarus', tipoCalibracaoNome: 'Calibração Rastreável RARUS', tipoEquipamento: 'Balança de Precisão' },
      { tipoCalibracaoId: 'tp-cal-rbc', tipoCalibracaoNome: 'Calibração RBC Inmetro', tipoEquipamento: 'Balança de Precisão' },
    ],
    ativo: true,
  },
  {
    id: 'usr-tec-itamar',
    nome: 'Itamar Soares',
    email: 'itamar.soares@rarus.com.br',
    cargo: 'Técnico Metrologista Especialista GEHAKA',
    perfil: 'Tecnico',
    telefone: '(19) 99112-2233',
    assinaturaDigitalUrl: '/assinaturas/itamar-soares.png',
    permissoesCalibracao: [
      {
        tipoCalibracaoId: 'tp-cal-rarus',
        tipoCalibracaoNome: 'Calibração Rastreável RARUS',
        tipoEquipamento: 'Medidor de Umidade GEHAKA',
      },
      {
        tipoCalibracaoId: 'tp-cal-rarus',
        tipoCalibracaoNome: 'Calibração Rastreável RARUS',
        tipoEquipamento: 'Balança de Precisão',
      },
    ],
    estoqueLocalId: 'est-tec-itamar',
    ativo: true,
  },
  {
    id: 'usr-tec-marcos',
    nome: 'Marcos Vinicius',
    email: 'marcos.v@rarus.com.br',
    cargo: 'Técnico de Laboratório',
    perfil: 'Tecnico',
    telefone: '(19) 99334-4455',
    permissoesCalibracao: [
      {
        tipoCalibracaoId: 'tp-cal-rarus',
        tipoCalibracaoNome: 'Calibração Rastreável RARUS',
        tipoEquipamento: 'Balança de Precisão',
      },
    ],
    estoqueLocalId: 'est-tec-marcos',
    ativo: true,
  },
  {
    id: 'usr-adm-rh',
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@rarus.com.br',
    cargo: 'Analista Administrativo & RH',
    perfil: 'RH',
    telefone: '(19) 3456-7800',
    permissoesCalibracao: [],
    ativo: true,
  },
];

// ==========================================
// 11. DADOS DE COMPATIBILIDADE (LEGACY TYPES)
// ==========================================
export const MOCK_CALIBRACOES = [
  {
    id: 'cal-1',
    numeroCertificado: 'CERT-RBC-2026-0042',
    ordemServicoId: 'os-1045',
    equipamentoId: 'eq-1',
    equipamentoTag: 'PI-4001',
    equipamentoDescricao: 'Medidor de Umidade GEHAKA G650i',
    clienteId: 'cli-1',
    clienteNome: 'AgroGrãos Cooperativa',
    padraoUtilizadoId: 'pad-1',
    padraoUtilizadoDesc: 'Termohigrômetro Digital Testo 625 Reference',
    padraoCertificadoRBC: 'LT-457 607',
    temperaturaAmbiente: 22.4,
    umidadeRelativa: 54.0,
    pontosMedicao: [
      { pontoNominal: '13.0 %', valorPadrao: 13.0, valorIndicado: 13.1, erro: 0.1, incerteza: 0.15 },
      { pontoNominal: '20.0 %', valorPadrao: 20.0, valorIndicado: 19.9, erro: -0.1, incerteza: 0.15 },
    ],
    resultado: 'Conforme' as const,
    declaracaoConformidade: 'O instrumento atende aos critérios de aceitação metrológica.',
    dataCalibracao: '2025-02-15',
    dataProximaCalibracao: '2026-02-15',
    tecnicoResponsavel: 'Itamar Soares',
    observacoes: 'Calibração periódica em bancada do laboratório.',
    qrCodeHash: 'RARUS-AUTH-7A8B9C10',
  },
];

export const MOCK_PADROES = [
  {
    id: 'pad-1',
    codigo: 'TH-01',
    descricao: 'Termohigrômetro Digital Padrão de Alta Precisão',
    fabricante: 'Testo',
    modelo: 'Testo 625 Reference',
    numeroSerie: 'TST-881290',
    grandeza: 'Temperatura' as const,
    certificadoRBC: 'LT-457 607',
    laboratorioRBC: 'LabMetrol RBC #0112',
    validadeCalibracao: '2028-09-01',
    incertezaPadrao: '± 0,2 °C',
    fatorK: 2.0,
    status: 'Válido' as const,
  },
  {
    id: 'pad-2',
    codigo: 'BAL-01',
    descricao: 'Balança Analítica Padrão de Classe I',
    fabricante: 'Mettler Toledo',
    modelo: 'XPR205',
    numeroSerie: 'MT-992144',
    grandeza: 'Massa' as const,
    certificadoRBC: 'RBC-MAS-2025-0911',
    laboratorioRBC: 'IPT',
    validadeCalibracao: '2027-05-10',
    incertezaPadrao: '± 0,02 mg',
    fatorK: 2.0,
    status: 'Válido' as const,
  },
];

