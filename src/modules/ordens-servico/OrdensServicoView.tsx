'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  OrdemServico,
  StatusOS,
  PrioridadeOS,
  OrdemServicoItemEquipamento,
  OrdemServicoItemPeca,
  Cliente,
  ItemEstoque,
} from '@/core/types';
import { OrdensServicoService } from '@/core/services/ordensServicoService';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { EstoqueService } from '@/core/services/estoqueService';
import { ClientesService } from '@/core/services/clientesService';
import { DualLookupInput } from '@/core/components/common/DualLookupInput';
import { ModalConsultaGenerica, ColunaConsulta } from '@/core/components/common/ModalConsultaGenerica';
import { ModalLancamentoPecaOS, ItemLancadoOS } from './components/ModalLancamentoPecaOS';
import { ModalCadastroEquipamentoRapido } from '@/modules/equipamentos/components/ModalCadastroEquipamentoRapido';
import { getUrlParam, updateUrlParams, clearUrlParams } from '@/core/utils/urlParams';
import {
  ClipboardList,
  Plus,
  Search,
  Save,
  Printer,
  Trash2,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Wrench,
  Clock,
  Boxes,
  Layers,
  FileCheck,
  CheckCircle2,
  RotateCcw,
  Tag,
  CheckSquare,
  Square,
  Package,
} from 'lucide-react';
import { ModalImpressaoOS } from './components/ModalImpressaoOS';
import { useTableSortAndResize } from '@/core/hooks/useTableSortAndResize';

const STATUS_OS_LISTA: StatusOS[] = [
  'Aberta',
  'Em Serviço',
  'Em Bancada',
  'Aguardando Peças',
  'Enviado para Fábrica',
  'Sem Conserto',
  'Orçamento Pronto',
  'Aprovada',
  'Aprovada Faturar',
  'Equipamento Pronto',
  'Entregue ao Cliente',
  'Faturada',
  'Encerrada',
  'Cancelada',
];

const MENSAGENS_RAPIDAS = [
  { cod: 'MAN 1', titulo: 'MANUTENÇÃO DE EQUIPAMENTOS (qualquer modelo)', texto: 'Manutenção preventiva geral com limpeza interna, verificação de fontes e ajustes.' },
  { cod: 'PI', titulo: 'PROPOSTA DE SERVIÇO INDIVIDUAL IN LOCO', texto: 'Atendimento técnico presencial realizado nas instalações do cliente durante a safra.' },
  { cod: 'PS 19', titulo: 'PROPOSTA PERIODO SAFRA', texto: 'Contrato de assistência metrológica para medidores de umidade no período de colheita.' },
  { cod: 'LAU 1', titulo: 'LAUDO TECNICO - MANUTENÇÃO COM TROCA DE PEÇAS', texto: 'Substituição de placa principal e calibração de células de medição.' },
  { cod: 'CAL', titulo: 'SERV DE CALIBRAÇÃO RASTREAVEL', texto: 'Calibração rastreável à RBC com emissão de certificado e colocação de novos selos e lacres.' },
  { cod: 'GAR', titulo: 'TERMO DE GARANTIA (90 DIAS)', texto: 'Garantia de serviços e peças substituídas: 90 dias. A garantia não cobre mau uso ou violação de lacres.' },
];

export const OrdensServicoView: React.FC = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<string>(() => getUrlParam('status') || 'Todos');
  const [busca, setBusca] = useState<string>(() => getUrlParam('busca') || '');
  const [osSelecionada, setOsSelecionada] = useState<OrdemServico | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [modalImpressaoAberto, setModalImpressaoAberto] = useState(false);
  const [osParaImprimir, setOsParaImprimir] = useState<OrdemServico | null>(null);
  const urlRestauradaRef = React.useRef(false);

  // Hook de ordenação por clique no cabeçalho e redimensionamento de colunas por arrasto
  const {
    sortKey,
    sortDirection,
    handleSort,
    sortData,
    columnWidths,
    handleResizeStart,
  } = useTableSortAndResize<OrdemServico>({
    initialSortKey: 'numero',
    initialSortDirection: 'desc',
    defaultWidths: {
      numero: 110,
      status: 140,
      tipo: 65,
      dataAbertura: 105,
      clienteCodigo: 90,
      clienteNome: 280,
      valorTotalGeral: 130,
      faturamento: 115,
      acoes: 95,
    },
    minColumnWidth: 55,
  });


  // Aba ativa do formulário Card (inicializada via URL)
  const [abaForm, setAbaForm] = useState<
    'geral' | 'equipamentos' | 'produtos' | 'observacoes' | 'complementares' | 'finalizar'
  >(() => (getUrlParam('aba') as any) || 'geral');

  const handleMudarAba = (novaAba: typeof abaForm) => {
    setAbaForm(novaAba);
    updateUrlParams({ aba: novaAba });
  };

  const abrirOS = (os: OrdemServico, targetAba?: typeof abaForm) => {
    setOsSelecionada(os);
    preencherForm(os);
    const aba = targetAba || abaForm;
    if (targetAba) setAbaForm(targetAba);
    updateUrlParams({
      os: os.numero,
      osId: os.id,
      novaOS: null,
      aba,
    });
  };

  const handleRowClick = (os: OrdemServico) => {
    if (selectedRowId === os.id) {
      abrirOS(os);
    } else {
      setSelectedRowId(os.id);
    }
  };

  // Form State
  const [formIdentificador, setFormIdentificador] = useState('168816');
  const [formNumero, setFormNumero] = useState('0005307');
  const [formStatus, setFormStatus] = useState<StatusOS>('Em Serviço');
  const [formTipoMovto, setFormTipoMovto] = useState('2.4.15 - Ordem de Serviço - Téc. Caio Detz');
  const [formUsrInc, setFormUsrInc] = useState('CAIO DETZ');
  const [formDataEmissao, setFormDataEmissao] = useState('2026-09-02');
  const [formFilial, setFormFilial] = useState('1 - RARUS TECNOLOGIA E SERVICOS');
  const [formLocalEstoque, setFormLocalEstoque] = useState('015 - Estoque Caio Detz - Rarus');
  const [formClienteId, setFormClienteId] = useState('cli-1');
  const [formClienteCodigo, setFormClienteCodigo] = useState('C03709');
  const [formClienteNome, setFormClienteNome] = useState('AgroGrãos Cooperativa');
  const [formCondicaoPagto, setFormCondicaoPagto] = useState('28 DDL (Safra)');
  const [formTecnico, setFormTecnico] = useState('Caio Detz');
  const [formServicoInLoco, setFormServicoInLoco] = useState(true);
  const [formDataEntrega, setFormDataEntrega] = useState('2026-09-06');
  const [formGarantia, setFormGarantia] = useState('Garantia de serviços e peças substituídas: 90 dias');

  // Observações e laudo
  const [formObs, setFormObs] = useState('');
  const [formTransportadora, setFormTransportadora] = useState('');
  const [formNfEntrada, setFormNfEntrada] = useState('');
  const [formAcessorios, setFormAcessorios] = useState('Cabo de força, fonte original, termohigrômetro');

  // Itens vinculados
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState<any[]>([]);
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState<OrdemServicoItemEquipamento[]>([]);
  const [itensEstoqueDisponiveis, setItensEstoqueDisponiveis] = useState<ItemEstoque[]>([]);
  const [pecasLancadas, setPecasLancadas] = useState<OrdemServicoItemPeca[]>([]);

  // Estados da Aba 3 (Lançamento de Peças, Seleção com Shift e Modais)
  const [modalPecaAberto, setModalPecaAberto] = useState(false);
  const [selectedPecaIndices, setSelectedPecaIndices] = useState<number[]>([]);
  const [lastSelectedPecaIndex, setLastSelectedPecaIndex] = useState<number | null>(null);

  // Estados para o Dual Lookup de Clientes e Equipamentos Vinculados (Decisão 6)
  const [clientesLista, setClientesLista] = useState<Cliente[]>([]);
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [modalConsultaEquipamentoAberto, setModalConsultaEquipamentoAberto] = useState(false);
  const [modalCadastrarEquipamentoAberto, setModalCadastrarEquipamentoAberto] = useState(false);

  useEffect(() => {
    carregarOrdens();
    carregarCatalogos();
  }, [statusFiltro, busca]);

  useEffect(() => {
    if (osSelecionada) {
      preencherForm(osSelecionada);
    }
  }, [osSelecionada]);

  const carregarOrdens = async () => {
    const list = await OrdensServicoService.listar({
      status: statusFiltro !== 'Todos' ? statusFiltro : undefined,
      busca: busca || undefined,
    });
    setOrdens(list);

    // Restauração de formulário via URL (F5-Proof)
    if (!urlRestauradaRef.current) {
      urlRestauradaRef.current = true;
      const paramNovaOS = getUrlParam('novaOS');
      const paramOS = getUrlParam('os');
      const paramOSId = getUrlParam('osId');
      const paramAba = (getUrlParam('aba') as any) || 'geral';

      if (paramNovaOS === 'true') {
        handleAbrirNovaOS(paramAba);
      } else if (paramOS || paramOSId) {
        const termo = (paramOS || paramOSId)!.trim();
        const semZeros = termo.replace(/^0+/, '');
        const comZeros = termo.padStart(7, '0');

        let found = list.find(
          (o) =>
            o.id === termo ||
            o.numero === termo ||
            o.numero === semZeros ||
            o.numero === comZeros ||
            o.numero.padStart(7, '0') === comZeros ||
            (semZeros && o.numero.replace(/^0+/, '') === semZeros)
        );
        if (!found) {
          const todas = await OrdensServicoService.listar();
          found = todas.find(
            (o) =>
              o.id === termo ||
              o.numero === termo ||
              o.numero === semZeros ||
              o.numero === comZeros ||
              o.numero.padStart(7, '0') === comZeros ||
              (semZeros && o.numero.replace(/^0+/, '') === semZeros)
          );
        }
        if (found) {
          abrirOS(found, paramAba);
        } else {
          // Fallback inteligente: se digitou qualquer OS na URL que ainda não existia, cria e abre no formulário
          const osAuto: OrdemServico = {
            id: `os-${termo}`,
            numero: comZeros,
            clienteId: 'cli-fitolab',
            clienteNome: 'FITOLAB PESQUISA E CONSULTORIA AGRICOLA LTDA',
            tipo: 'Laboratório e Vendas',
            prioridade: 'Alta',
            status: 'Aguardando Peças',
            equipamentos: [
              {
                equipamentoId: 'eq-fitolab-1',
                numeroSerie: '16031014001017',
                modelo: 'G650I',
                numeroSequencial: 1,
                certificadoNumero: `${comZeros}-1/26`,
                statusItem: 'Em Manutenção',
                observacoes: 'Bolsa, Fonte, Cumbuca, Capa inclusos',
              },
            ],
            pecas: [],
            tecnicoId: 'usr-caio',
            tecnicoNome: 'Caio Detz',
            dataAbertura: '27/08/2026',
            descricaoProblema: 'Manutenção preventiva e calibração periódica.',
            laudoTecnico: 'Manutenção preventiva com verificação metrológica.',
            valorTotalServicos: 974.30,
            valorTotalPecas: 2200.40,
            valorTotalGeral: 3174.70,
            faturada: false,
          };
          abrirOS(osAuto, paramAba);
        }
      }
    }
  };

  const carregarCatalogos = async () => {
    const eqs = await EquipamentosService.listar();
    setEquipamentosDisponiveis(eqs);
    const its = await EstoqueService.listarItens();
    setItensEstoqueDisponiveis(its);
    const cls = await ClientesService.listar();
    setClientesLista(cls);
  };

  const preencherForm = (os: OrdemServico) => {
    setFormNumero(os.numero.padStart(7, '0'));
    setFormStatus(os.status);
    setFormClienteId(os.clienteId || 'cli-1');
    setFormClienteNome(os.clienteNome);
    setFormTecnico(os.tecnicoNome);
    setFormObs(os.descricaoProblema || '');
    setEquipamentosSelecionados(os.equipamentos || []);
    setPecasLancadas(os.pecas || []);
    setSelectedPecaIndices([]);
    setLastSelectedPecaIndex(null);
  };

  const handleAbrirNovaOS = (targetAba?: typeof abaForm) => {
    const maior = ordens.reduce((max, o) => {
      const n = parseInt(o.numero, 10);
      return !isNaN(n) && n > max ? n : max;
    }, 5307);
    const novoNum = String(maior + 1).padStart(7, '0');

    setFormIdentificador(String(168800 + Math.floor(Math.random() * 100)));
    setFormNumero(novoNum);
    setFormStatus('Aberta');
    setFormClienteId('cli-1');
    setFormClienteCodigo('C03709');
    setFormClienteNome('AgroGrãos Cooperativa');
    setFormObs('');
    setEquipamentosSelecionados([
      {
        equipamentoId: 'eq-1',
        numeroSerie: 'GEH-2023-90812',
        modelo: 'GEHAKA G650i',
        numeroSequencial: 1,
        certificadoNumero: `${novoNum}-1/26`,
        statusItem: 'Em Calibração',
      },
    ]);
    setPecasLancadas([]);
    setOsSelecionada({
      id: `os-${novoNum}`,
      numero: novoNum,
      clienteId: 'cli-1',
      clienteNome: 'AgroGrãos Cooperativa',
      tipo: 'Calibração em Campo',
      prioridade: 'Alta',
      status: 'Aberta',
      equipamentos: [],
      pecas: [],
      tecnicoId: 'usr-caio',
      tecnicoNome: 'Caio Detz',
      dataAbertura: new Date().toLocaleDateString('pt-BR'),
      dataPrevisao: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      descricaoProblema: '',
      valorTotalServicos: 0,
      valorTotalPecas: 0,
      valorTotalGeral: 0,
      faturada: false,
    });
    const aba = targetAba || 'geral';
    setAbaForm(aba);
    updateUrlParams({
      novaOS: 'true',
      os: null,
      osId: null,
      aba,
    });
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClienteNome) {
      alert('Selecione um cliente.');
      return;
    }

    await OrdensServicoService.criar({
      numeroManual: formNumero,
      clienteId: 'cli-1',
      clienteNome: formClienteNome,
      tipo: 'Calibração em Campo',
      prioridade: 'Alta',
      status: formStatus,
      equipamentos: equipamentosSelecionados,
      pecas: pecasLancadas,
      tecnicoId: 'usr-caio',
      tecnicoNome: formTecnico,
      dataAbertura: formDataEmissao,
      dataPrevisao: formDataEntrega,
      descricaoProblema: formObs,
    });

    alert('Ordem de Serviço salva com sucesso!');
    carregarOrdens();
  };

  const handleAddEquipamento = (eqId: string) => {
    const eq = equipamentosDisponiveis.find((e) => e.id === eqId);
    if (!eq) return;

    if (equipamentosSelecionados.some((item) => item.equipamentoId === eqId)) return;

    const seq = equipamentosSelecionados.length + 1;
    const anoAtual = new Date().getFullYear().toString().slice(-2);

    setEquipamentosSelecionados([
      ...equipamentosSelecionados,
      {
        equipamentoId: eq.id,
        numeroSerie: eq.numeroSerie,
        modelo: eq.modelo,
        numeroSequencial: seq,
        certificadoNumero: `${formNumero}-${seq}/${anoAtual}`,
        statusItem: 'Aguardando Ensaio',
      },
    ]);
  };

  // Lógica de Seleção Múltipla com Shift e Ctrl (Estilo Windows Explorer)
  const handlePecaClick = (index: number, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedPecaIndex !== null) {
      // Seleção contígua de intervalo
      const start = Math.min(lastSelectedPecaIndex, index);
      const end = Math.max(lastSelectedPecaIndex, index);
      const range: number[] = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      setSelectedPecaIndices(Array.from(new Set([...selectedPecaIndices, ...range])));
    } else if (e.ctrlKey || e.metaKey) {
      // Seleção alternada
      if (selectedPecaIndices.includes(index)) {
        setSelectedPecaIndices(selectedPecaIndices.filter((i) => i !== index));
      } else {
        setSelectedPecaIndices([...selectedPecaIndices, index]);
        setLastSelectedPecaIndex(index);
      }
    } else {
      // Seleção simples
      setSelectedPecaIndices([index]);
      setLastSelectedPecaIndex(index);
    }
  };

  const handleSelectAllPecas = () => {
    if (selectedPecaIndices.length === pecasLancadas.length) {
      setSelectedPecaIndices([]);
    } else {
      setSelectedPecaIndices(pecasLancadas.map((_, idx) => idx));
    }
  };

  const handleRemoverPecasSelecionadas = async () => {
    if (selectedPecaIndices.length === 0) return;
    if (
      confirm(
        `Deseja remover da OS os ${selectedPecaIndices.length} item(ns) selecionado(s)? O estoque físico será estornado automaticamente.`
      )
    ) {
      const itensARemover = pecasLancadas.filter((_, idx) => selectedPecaIndices.includes(idx));
      for (const it of itensARemover) {
        if (it.tipoItem === 'Peca') {
          await EstoqueService.estornarSaldoFisicoOS({
            itemCodigo: it.codigo,
            localId: it.estoqueOrigemId || 'est-central',
            quantidade: it.quantidade,
            osNumero: formNumero,
            responsavelNome: formTecnico,
          });
        }
      }
      const its = await EstoqueService.listarItens();
      setItensEstoqueDisponiveis(its);

      const novas = pecasLancadas.filter((_, idx) => !selectedPecaIndices.includes(idx));
      setPecasLancadas(novas);
      setSelectedPecaIndices([]);
      setLastSelectedPecaIndex(null);
    }
  };

  const handleRemoverPecaIndividual = async (idx: number) => {
    const item = pecasLancadas[idx];
    if (confirm(`Deseja remover "${item.descricao}" da OS? O estoque físico será estornado.`)) {
      if (item.tipoItem === 'Peca') {
        await EstoqueService.estornarSaldoFisicoOS({
          itemCodigo: item.codigo,
          localId: item.estoqueOrigemId || 'est-central',
          quantidade: item.quantidade,
          osNumero: formNumero,
          responsavelNome: formTecnico,
        });
        const its = await EstoqueService.listarItens();
        setItensEstoqueDisponiveis(its);
      }
      setPecasLancadas(pecasLancadas.filter((_, i) => i !== idx));
      setSelectedPecaIndices(selectedPecaIndices.filter((i) => i !== idx));
    }
  };

  const handleAdicionarPecaModal = async (item: ItemLancadoOS) => {
    const localId = formLocalEstoque.split(' - ')[0] || 'est-central';
    const nova: OrdemServicoItemPeca = {
      pecaId: `item-${Date.now()}`,
      codigo: item.codigo,
      descricao: item.descricao,
      quantidade: item.quantidade,
      valorUnitario: item.precoUnitario,
      tipoItem: item.tipoFiscal === 'NFS-e (Serviço)' ? 'Servico' : 'Peca',
      estoqueOrigemId: localId,
      valorDesconto: item.valorDesconto,
      percentualDesconto: item.percentualDesconto,
      valorTotal: item.valorTotal,
      seriaisOuIds: item.seriaisOuIds,
    };

    // Baixa física imediata no estoque (Decisão 1 do Usuário)
    if (nova.tipoItem === 'Peca') {
      await EstoqueService.baixarSaldoFisicoOS({
        itemCodigo: nova.codigo,
        localId: localId,
        quantidade: nova.quantidade,
        osNumero: formNumero,
        responsavelNome: formTecnico,
      });
      const its = await EstoqueService.listarItens();
      setItensEstoqueDisponiveis(its);
    }

    setPecasLancadas([...pecasLancadas, nova]);
  };

  const handleFaturarOS = async () => {
    const pecasFiscais = pecasLancadas
      .filter((p) => p.tipoItem === 'Peca')
      .map((p) => ({ itemCodigo: p.codigo, quantidade: p.quantidade }));

    if (pecasFiscais.length > 0) {
      await EstoqueService.baixarSaldoFiscalFaturamento({
        osNumero: formNumero,
        itensPecas: pecasFiscais,
      });
    }

    setFormStatus('Faturada');
    alert(`Ordem de Serviço #${formNumero} faturada com sucesso!\nBaixa no estoque fiscal concluída para ${pecasFiscais.length} produto(s).`);
  };

  const handleBuscarClienteCodigo = (cod: string) => {
    if (!cod.trim()) return;
    const cli = clientesLista.find((c) => c.codigo.toUpperCase() === cod.trim().toUpperCase());
    if (cli) {
      handleSelecionarCliente(cli);
    } else {
      setModalClienteAberto(true);
    }
  };

  const handleSelecionarCliente = (cli: Cliente) => {
    setFormClienteId(cli.id);
    setFormClienteCodigo(cli.codigo);
    setFormClienteNome(cli.nomeFantasia || cli.razaoSocial);
  };

  // Cálculos Financeiros Dinâmicos da OS
  const totalServicos = pecasLancadas
    .filter((p) => p.tipoItem === 'Servico')
    .reduce((sum, p) => sum + (p.valorTotal ?? p.quantidade * p.valorUnitario), 0);

  const totalPecas = pecasLancadas
    .filter((p) => p.tipoItem === 'Peca')
    .reduce((sum, p) => sum + (p.valorTotal ?? p.quantidade * p.valorUnitario), 0);

  const totalDescontos = pecasLancadas.reduce((sum, p) => sum + (p.valorDesconto ?? 0), 0);
  const totalGeralOS = totalServicos + totalPecas;

  // Filtro exclusivo de equipamentos pertencentes ao cliente selecionado (Decisão 6 do Usuário)
  const equipamentosDoCliente = useMemo(() => {
    return equipamentosDisponiveis.filter((e) => {
      if (formClienteId && e.clienteId === formClienteId) return true;
      if (formClienteNome && e.clienteNome) {
        const cNome = formClienteNome.toLowerCase();
        const eCli = e.clienteNome.toLowerCase();
        return cNome.includes(eCli) || eCli.includes(cNome);
      }
      return false;
    });
  }, [equipamentosDisponiveis, formClienteId, formClienteNome]);

  const colunasConsultaEquipamento: ColunaConsulta<any>[] = [
    { chave: 'modelo', titulo: 'Modelo do Instrumento', width: 150 },
    { chave: 'numeroSerie', titulo: 'Nº Série / Tag', width: 140 },
    { chave: 'tipoEquipamento', titulo: 'Tipo', width: 180 },
    { chave: 'patrimonio', titulo: 'Patrimônio', width: 100 },
    { chave: 'dataProximaCalibracao', titulo: 'Próx. Calibração', width: 120 },
  ];

  const ordensOrdenadas = useMemo(() => {
    return sortData(ordens, {
      numero: (o) => o.numero,
      status: (o) => o.status,
      tipo: () => 'OS',
      dataAbertura: (o) => o.dataAbertura,
      clienteCodigo: () => 'C01800',
      clienteNome: (o) => o.clienteNome,
      valorTotalGeral: (o) => o.valorTotalGeral,
      faturamento: (o) => (o.faturada ? 'Faturado-Atend.' : 'Normal-Pend.'),
    });
  }, [ordens, sortData]);

  const handleAbrirModalImpressao = (osAlvo?: OrdemServico | null) => {
    let osFinal: OrdemServico | null = null;
    if (osAlvo) {
      osFinal = osAlvo;
    } else if (osSelecionada) {
      osFinal = {
        ...osSelecionada,
        numero: formNumero || osSelecionada.numero,
        status: (formStatus as any) || osSelecionada.status,
        clienteNome: formClienteNome || osSelecionada.clienteNome,
        tecnicoNome: formTecnico || osSelecionada.tecnicoNome,
        equipamentos: equipamentosSelecionados.length > 0 ? equipamentosSelecionados : osSelecionada.equipamentos,
        pecas: pecasLancadas.length > 0 ? pecasLancadas : osSelecionada.pecas,
        valorTotalGeral: totalGeralOS || osSelecionada.valorTotalGeral,
        valorTotalServicos: totalServicos || osSelecionada.valorTotalServicos,
        valorTotalPecas: totalPecas || osSelecionada.valorTotalPecas,
      };
    } else if (ordens.length > 0) {
      osFinal = ordens[0];
    }

    if (osFinal) {
      setOsParaImprimir(osFinal);
      setModalImpressaoAberto(true);
    }
  };

  // SE UMA OS ESTÁ ABERTA PARA VISUALIZAÇÃO/EDIÇÃO:
  if (osSelecionada) {
    return (
      <div className="rarus-content-scroll rarus-fullscreen-view">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setOsSelecionada(null)} type="button">
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Movimentos (OS)</span>
          </button>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Visualização em Tela Cheia • Movimento OS {formNumero}
          </span>
        </div>

        {/* CONTAINER CARD FORMULÁRIO (PADRÃO ESPECIFICAÇÃO & GEMINI CODE) */}
        <div className="card-container">
          {/* Cabeçalho do Card */}
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 className="card-title">
                Vendas/Saídas — Ordem de Serviço Nº {formNumero}
              </h2>
              <span className="status-badge ativo">
                <span className="rarus-status-dot" />
                {formStatus}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Identificador: <strong>{formIdentificador}</strong> • Série: <strong>OS</strong>
              </div>
            </div>
          </div>

          {/* Barra de Ações (Action Bar) */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => handleAbrirNovaOS()} type="button">
              <Plus size={14} />
              <span>Novo</span>
            </button>
            <button className="btn btn-secondary" onClick={handleSalvar} type="button">
              <Save size={14} />
              <span>Salvar</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setOsSelecionada(null);
                clearUrlParams('os', 'osId', 'novaOS', 'aba');
              }}
              type="button"
            >
              <RotateCcw size={14} />
              <span>Desfazer / Voltar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setOsSelecionada(null)} type="button">
              <Search size={14} />
              <span>Buscar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => handleAbrirModalImpressao(osSelecionada)} type="button">
              <Printer size={14} />
              <span>Imprimir</span>
            </button>
            <button
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--status-success-text)' }}
              onClick={() => alert('Faturamento gerado com sucesso! NFS-e emitida.')}
              type="button"
            >
              <FileCheck size={14} />
              <span>Faturar OS</span>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirm('Deseja cancelar esta OS?')) {
                  setFormStatus('Cancelada');
                }
              }}
              type="button"
            >
              <Trash2 size={14} />
              <span>Cancelar OS</span>
            </button>
          </div>

          {/* Seção Fixa Geral (Header da OS na Imagem) */}
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: '#FAFAFA',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <div className="form-grid">
              <div className="form-group col-2">
                <label className="form-label">Identificador</label>
                <input className="form-input" value={formIdentificador} readOnly />
              </div>
              <div className="form-group col-2">
                <label className="form-label">Status</label>
                <input className="form-input" value="Normal-Pend." readOnly />
              </div>
              <div className="form-group col-3">
                <label className="form-label">Status O.S. *</label>
                <select
                  className="form-select"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as StatusOS)}
                >
                  {STATUS_OS_LISTA.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-3">
                <label className="form-label">Tipo do Movimento</label>
                <input className="form-input" value={formTipoMovto} readOnly />
              </div>
              <div className="form-group col-2">
                <label className="form-label">Data Emissão</label>
                <input
                  type="date"
                  className="form-input"
                  value={formDataEmissao}
                  onChange={(e) => setFormDataEmissao(e.target.value)}
                />
              </div>

              <div className="form-group col-4">
                <label className="form-label">Filial</label>
                <input className="form-input" value={formFilial} readOnly />
              </div>
              <div className="form-group col-4">
                <label className="form-label">Local de Estoque (Peças)</label>
                <select
                  className="form-select"
                  value={formLocalEstoque}
                  onChange={(e) => setFormLocalEstoque(e.target.value)}
                >
                  <option value="001 - Almoxarifado Central - Matriz">
                    001 - Almoxarifado Central - Matriz
                  </option>
                  <option value="015 - Estoque Caio Detz - Rarus">
                    015 - Estoque Caio Detz - Rarus (Van Técnica)
                  </option>
                  <option value="020 - Estoque Itamar - Rarus">
                    020 - Estoque Itamar - Rarus (Laboratório)
                  </option>
                </select>
              </div>

              {/* DUAL LOOKUP UNIVERSAL DE CLIENTES (LINHA COMPLETA) */}
              <div className="form-group col-12">
                <DualLookupInput
                  label="Cliente da Ordem de Serviço (Código e Nome Fantasia / Razão Social)"
                  codigoValue={formClienteCodigo}
                  descricaoValue={formClienteNome}
                  onCodigoChange={(cod) => {
                    setFormClienteCodigo(cod);
                    const encontrado = clientesLista.find(
                      (c) => c.codigo.toUpperCase() === cod.trim().toUpperCase()
                    );
                    if (encontrado) handleSelecionarCliente(encontrado);
                  }}
                  onDescricaoChange={(desc) => setFormClienteNome(desc)}
                  onOpenConsulta={() => setModalClienteAberto(true)}
                  onCodigoBlurOrEnter={(cod: string) => handleBuscarClienteCodigo(cod)}
                  placeholderCodigo="Ex: C03709"
                  placeholderDescricao="Razão Social ou Nome Fantasia do Cliente"
                />
              </div>

              <div className="form-group col-3">
                <label className="form-label">Condição de Pagamento</label>
                <input
                  className="form-input"
                  value={formCondicaoPagto}
                  onChange={(e) => setFormCondicaoPagto(e.target.value)}
                />
              </div>
              <div className="form-group col-3">
                <label className="form-label">Técnico Responsável</label>
                <input
                  className="form-input"
                  value={formTecnico}
                  onChange={(e) => setFormTecnico(e.target.value)}
                />
              </div>
              <div className="form-group col-3">
                <label className="form-label">Previsão de Entrega</label>
                <input
                  type="date"
                  className="form-input"
                  value={formDataEntrega}
                  onChange={(e) => setFormDataEntrega(e.target.value)}
                />
              </div>
              <div className="form-group col-3">
                <label className="form-label">Serviço In Loco</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', height: '36px' }}>
                  <input
                    type="checkbox"
                    id="chk-inloco"
                    checked={formServicoInLoco}
                    onChange={(e) => setFormServicoInLoco(e.target.checked)}
                  />
                  <label htmlFor="chk-inloco">Sim (Campo)</label>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação por Abas do Card */}
          <div className="tabs-navigation">
            <button
              className={`tab-button ${abaForm === 'geral' ? 'active' : ''}`}
              onClick={() => handleMudarAba('geral')}
              type="button"
            >
              1. Abertura / Encerramento
            </button>
            <button
              className={`tab-button ${abaForm === 'equipamentos' ? 'active' : ''}`}
              onClick={() => handleMudarAba('equipamentos')}
              type="button"
            >
              2. Equipamentos Vinculados ({equipamentosSelecionados.length})
            </button>
            <button
              className={`tab-button ${abaForm === 'produtos' ? 'active' : ''}`}
              onClick={() => handleMudarAba('produtos')}
              type="button"
            >
              3. Produtos & Peças ({pecasLancadas.length})
            </button>
            <button
              className={`tab-button ${abaForm === 'observacoes' ? 'active' : ''}`}
              onClick={() => handleMudarAba('observacoes')}
              type="button"
            >
              4. Observações
            </button>
            <button
              className={`tab-button ${abaForm === 'complementares' ? 'active' : ''}`}
              onClick={() => handleMudarAba('complementares')}
              type="button"
            >
              5. Campos Complementares (Garantia / NF)
            </button>
            <button
              className={`tab-button ${abaForm === 'finalizar' ? 'active' : ''}`}
              onClick={() => handleMudarAba('finalizar')}
              type="button"
            >
              6. Resumo Financeiro & Faturar
            </button>
          </div>

          {/* Corpo do Formulário */}
          <div className="card-body">
            {/* Aba 1: Abertura / Encerramento com Seletor de Mensagens Rápidas */}
            {abaForm === 'geral' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                <div className="form-grid">
                  <div className="form-group col-12">
                    <label className="form-label">Descrição do Atendimento / Problema Relatado</label>
                    <textarea
                      className="form-textarea"
                      rows={10}
                      placeholder="Descreva as instruções de calibração, medições de safra, falhas observadas..."
                      value={formObs}
                      onChange={(e) => setFormObs(e.target.value)}
                    />
                  </div>
                </div>

                {/* Painel Lateral de Mensagens Rápidas (Exato da Imagem aba 5) */}
                <div
                  style={{
                    backgroundColor: '#FAFAFA',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    Modelos Rápidos de Mensagem:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '280px', overflowY: 'auto' }}>
                    {MENSAGENS_RAPIDAS.map((m) => (
                      <button
                        key={m.cod}
                        type="button"
                        onClick={() => setFormObs((prev) => (prev ? `${prev}\n\n[${m.cod}] ${m.texto}` : `[${m.cod}] ${m.texto}`))}
                        style={{
                          textAlign: 'left',
                          padding: '6px 8px',
                          borderRadius: 4,
                          border: '1px solid var(--color-border-subtle)',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '11px',
                          color: 'var(--color-text-main)',
                        }}
                      >
                        <strong>{m.cod}:</strong> {m.titulo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Aba 2: Equipamentos Vinculados (Decisão 6 do Usuário) */}
            {abaForm === 'equipamentos' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-bg-base)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      Parque de Equipamentos: <strong style={{ color: 'var(--color-primary-600)' }}>{formClienteNome || 'Cliente não selecionado'}</strong>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      {equipamentosDoCliente.length} instrumento(s) localizado(s) no parque deste cliente (busca restrita exclusiva)
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModalConsultaEquipamentoAberto(true)}
                    >
                      <Search size={14} />
                      <span>Selecionar do Parque ({equipamentosDoCliente.length})</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setModalCadastrarEquipamentoAberto(true)}
                    >
                      <Plus size={14} />
                      <span>+ Cadastrar Novo Equipamento</span>
                    </button>
                  </div>
                </div>

                <div className="rarus-table-container">
                  <table className="rarus-table">
                    <thead>
                      <tr>
                        <th>Seq.</th>
                        <th>Modelo do Equipamento</th>
                        <th>Nº Série</th>
                        <th>Certificado Previsto (0000-X/AA)</th>
                        <th>Status Ensaio</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipamentosSelecionados.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                            Nenhum equipamento vinculado a esta OS. Clique em <strong>"Selecionar do Parque"</strong> ou <strong>"+ Cadastrar Novo Equipamento"</strong> acima para vincular.
                          </td>
                        </tr>
                      ) : (
                        equipamentosSelecionados.map((eq, idx) => (
                        <tr key={idx}>
                          <td><strong>{eq.numeroSequencial}</strong></td>
                          <td>{eq.modelo}</td>
                          <td><code>{eq.numeroSerie}</code></td>
                          <td><strong style={{ color: 'var(--color-primary-500)' }}>{eq.certificadoNumero}</strong></td>
                          <td>
                            <span className="status-badge pendente">
                              <span className="rarus-status-dot" />
                              {eq.statusItem}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: '3px 8px', fontSize: '11px' }}
                              onClick={() =>
                                setEquipamentosSelecionados(
                                  equipamentosSelecionados.filter((_, i) => i !== idx)
                                )
                              }
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba 3: Produtos & Peças (Layout Profissional com Seleção com Shift e Rastreabilidade) */}
            {abaForm === 'produtos' && (
              <div>
                {/* Barra de Ações da Tabela de Peças */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 14,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setModalPecaAberto(true)}
                    >
                      <Plus size={15} />
                      <span>Lançar Item / Peça</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={selectedPecaIndices.length === 0}
                      onClick={handleRemoverPecasSelecionadas}
                      title={
                        selectedPecaIndices.length === 0
                          ? 'Selecione uma ou mais peças para remover'
                          : `Remover ${selectedPecaIndices.length} peça(s) selecionada(s)`
                      }
                    >
                      <Trash2 size={14} />
                      <span>
                        Remover da OS {selectedPecaIndices.length > 0 ? `(${selectedPecaIndices.length})` : ''}
                      </span>
                    </button>

                    {selectedPecaIndices.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedPecaIndices([])}
                        style={{ fontSize: '12px' }}
                      >
                        Limpar Seleção
                      </button>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {selectedPecaIndices.length > 0 ? (
                      <span style={{ fontWeight: 600, color: 'var(--color-primary-500)' }}>
                        {selectedPecaIndices.length} de {pecasLancadas.length} item(ns) selecionado(s)
                      </span>
                    ) : (
                      <span>
                        Total de <strong>{pecasLancadas.length}</strong> item(ns) na OS • Segure{' '}
                        <kbd style={{ padding: '2px 4px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border-subtle)', borderRadius: 3 }}>Shift</kbd>{' '}
                        para seleção contígua
                      </span>
                    )}
                  </div>
                </div>

                {/* Tabela com Seleção Múltipla com Shift e Checkbox */}
                <div className="rarus-table-container">
                  <table className="rarus-table">
                    <thead>
                      <tr>
                        <th style={{ width: 44, textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={pecasLancadas.length > 0 && selectedPecaIndices.length === pecasLancadas.length}
                            onChange={handleSelectAllPecas}
                            title="Selecionar todos os itens da OS"
                          />
                        </th>
                        <th style={{ width: 100 }}>Código</th>
                        <th>Descrição do Item</th>
                        <th style={{ width: 130 }}>Tipo Fiscal</th>
                        <th style={{ width: 70, textAlign: 'center' }}>Qtd.</th>
                        <th style={{ width: 110, textAlign: 'right' }}>Preço Unit.</th>
                        <th style={{ width: 100, textAlign: 'right' }}>Desconto</th>
                        <th style={{ width: 120, textAlign: 'right' }}>Total</th>
                        <th style={{ width: 60, textAlign: 'center' }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pecasLancadas.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                            Nenhuma peça ou serviço lançado nesta OS. Clique no botão <strong>"+ Lançar Item / Peça"</strong> acima para adicionar.
                          </td>
                        </tr>
                      ) : (
                        pecasLancadas.map((p, idx) => {
                          const isSelected = selectedPecaIndices.includes(idx);
                          return (
                            <tr
                              key={p.pecaId || idx}
                              className={isSelected ? 'rarus-row-selected' : ''}
                              onClick={(e) => handlePecaClick(idx, e)}
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              title="Clique simples para selecionar, Shift+Clique para selecionar intervalo contíguo"
                            >
                              <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    if (isSelected) {
                                      setSelectedPecaIndices(selectedPecaIndices.filter((i) => i !== idx));
                                    } else {
                                      setSelectedPecaIndices([...selectedPecaIndices, idx]);
                                      setLastSelectedPecaIndex(idx);
                                    }
                                  }}
                                />
                              </td>
                              <td>
                                <code>{p.codigo}</code>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{p.descricao}</div>
                                {p.seriaisOuIds && p.seriaisOuIds.length > 0 && (
                                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                                    {p.seriaisOuIds.map((sn) => (
                                      <span
                                        key={sn}
                                        style={{
                                          fontSize: '10.5px',
                                          backgroundColor: 'var(--color-primary-50)',
                                          color: 'var(--color-primary-500)',
                                          padding: '1px 6px',
                                          borderRadius: 'var(--radius-sm)',
                                          border: '1px solid var(--color-border-subtle)',
                                          fontFamily: 'monospace',
                                        }}
                                      >
                                        SN: {sn}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className={`status-badge ${p.tipoItem === 'Peca' ? 'neutro' : 'ativo'}`}>
                                  {p.tipoItem === 'Peca' ? 'NF-e (Produto)' : 'NFS-e (Serviço)'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.quantidade}</td>
                              <td style={{ textAlign: 'right' }}>R$ {p.valorUnitario.toFixed(2)}</td>
                              <td style={{ textAlign: 'right', color: p.valorDesconto ? 'var(--status-danger-text)' : 'inherit' }}>
                                {p.valorDesconto ? `- R$ ${p.valorDesconto.toFixed(2)}` : '-'}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                R$ {(p.valorTotal ?? p.quantidade * p.valorUnitario).toFixed(2)}
                              </td>
                              <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  style={{ padding: '2px 6px', color: 'var(--status-danger-text)' }}
                                  onClick={() => handleRemoverPecaIndividual(idx)}
                                  title="Remover este item da OS"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Resumo Financeiro da Tabela de Peças */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 16,
                    padding: '14px 18px',
                    backgroundColor: 'var(--color-bg-base)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', gap: 20, fontSize: '13px', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Peças (NF-e): </span>
                      <strong>R$ {totalPecas.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Serviços (NFS-e): </span>
                      <strong>R$ {totalServicos.toFixed(2)}</strong>
                    </div>
                    {totalDescontos > 0 && (
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Desconto Concedido: </span>
                        <strong style={{ color: 'var(--status-danger-text)' }}>
                          - R$ {totalDescontos.toFixed(2)}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-500)' }}>
                    Total Geral da OS: R$ {totalGeralOS.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Aba 4: Observações */}
            {abaForm === 'observacoes' && (
              <div className="form-grid">
                <div className="form-group col-12">
                  <label className="form-label">Observações Internas de Bancada</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    placeholder="Instruções confidenciais, notas de entrega..."
                  />
                </div>
              </div>
            )}

            {/* Aba 5: Campos Complementares (Exata da Imagem aba 6) */}
            {abaForm === 'complementares' && (
              <div className="form-grid">
                <div className="form-group col-6">
                  <label className="form-label">Transportadora / Cliente</label>
                  <input
                    className="form-input"
                    value={formTransportadora}
                    onChange={(e) => setFormTransportadora(e.target.value)}
                    placeholder="Nome da transportadora ou motorista responsável"
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">NF de Entrada</label>
                  <input
                    className="form-input"
                    value={formNfEntrada}
                    onChange={(e) => setFormNfEntrada(e.target.value)}
                    placeholder="Número da nota fiscal de remessa para conserto"
                  />
                </div>
                <div className="form-group col-12">
                  <label className="form-label">Acessórios Enviados com o Instrumento</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={formAcessorios}
                    onChange={(e) => setFormAcessorios(e.target.value)}
                  />
                </div>
                <div className="form-group col-12">
                  <label className="form-label">Termo de Garantia</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={formGarantia}
                    onChange={(e) => setFormGarantia(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Aba 6: Resumo & Faturar */}
            {abaForm === 'finalizar' && (
              <div className="form-grid">
                <div className="col-12" style={{ backgroundColor: '#FAFAFA', padding: 24, borderRadius: 8, border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
                      Encerramento & Faturamento da Ordem de Serviço
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                      O faturamento oficializa a prestação metrológica e dispara a baixa definitiva no <strong>Estoque Fiscal</strong> (NF-e).
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 6, border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span>Subtotal Serviços (NFS-e):</span>
                      <strong>R$ {totalServicos.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span>Subtotal Peças Físicas (NF-e):</span>
                      <strong>R$ {totalPecas.toFixed(2)}</strong>
                    </div>
                    {totalDescontos > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--status-danger-text)' }}>
                        <span>Descontos Totais Aplicados:</span>
                        <strong>- R$ {totalDescontos.toFixed(2)}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-500)' }}>
                      <span>Valor Líquido Total da OS:</span>
                      <span>R$ {totalGeralOS.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Status Atual: <strong style={{ color: formStatus === 'Faturada' ? 'var(--status-success-text)' : 'inherit' }}>{formStatus}</strong>
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleFaturarOS}
                      disabled={formStatus === 'Faturada'}
                      style={{ padding: '10px 24px', fontSize: '13.5px', fontWeight: 600 }}
                    >
                      <FileCheck size={16} />
                      <span>{formStatus === 'Faturada' ? 'OS Já Faturada & Baixada' : 'Faturar OS & Baixar Estoque Fiscal'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé de Auditoria */}
          <div className="card-footer">
            <div>
              Filial: <strong>1 - RARUS TECNOLOGIA E SERVICOS</strong> • Usr Inc: <strong>{formUsrInc}</strong>
            </div>
            <div>
              Data Emissão: <strong>{formDataEmissao}</strong> • Movimento: <strong>OS {formNumero}</strong>
            </div>
          </div>
        </div>

        {/* Modal de Lançamento de Peças / Serviços na OS */}
        <ModalLancamentoPecaOS
          aberto={modalPecaAberto}
          onClose={() => setModalPecaAberto(false)}
          onAdicionar={handleAdicionarPecaModal}
          catalogoItens={itensEstoqueDisponiveis}
          localEstoqueId={formLocalEstoque.split(' - ')[0] || 'est-central'}
          localEstoqueNome={formLocalEstoque}
          tecnicoNomePadrao={formTecnico}
        />

        {/* Modal de Consulta Rápida de Clientes */}
        <ModalConsultaGenerica<Cliente>
          aberto={modalClienteAberto}
          titulo="Consulta de Clientes Cadastrados"
          subtitulo="Selecione um cliente para vincular à Ordem de Serviço"
          dados={clientesLista}
          colunas={[
            { chave: 'codigo', titulo: 'Código', width: 110 },
            { chave: 'nomeFantasia', titulo: 'Nome Fantasia / Razão Social' },
            { chave: 'cnpj', titulo: 'CNPJ', width: 160 },
            { chave: 'cidade', titulo: 'Cidade', width: 150 },
            { chave: 'uf', titulo: 'UF', width: 60, align: 'center' },
          ]}
          campoCodigo="codigo"
          campoDescricao="nomeFantasia"
          termoInicial={formClienteCodigo || formClienteNome}
          onSelect={(cli) => handleSelecionarCliente(cli)}
          onClose={() => setModalClienteAberto(false)}
        />

        {/* Modal de Consulta de Equipamentos do Parque do Cliente (Decisão 6 do Usuário) */}
        <ModalConsultaGenerica<any>
          aberto={modalConsultaEquipamentoAberto}
          titulo={`Parque de Equipamentos — ${formClienteNome}`}
          subtitulo="Busca restrita exclusivamente aos instrumentos pertencentes a este cliente"
          dados={equipamentosDoCliente}
          colunas={colunasConsultaEquipamento}
          campoCodigo="numeroSerie"
          campoDescricao="modelo"
          extraAction={{
            label: '+ Cadastrar Novo Equipamento',
            onClick: () => {
              setModalConsultaEquipamentoAberto(false);
              setModalCadastrarEquipamentoAberto(true);
            },
            icon: <Plus size={14} />,
          }}
          onSelect={(eq) => {
            handleAddEquipamento(eq.id);
            setModalConsultaEquipamentoAberto(false);
          }}
          onClose={() => setModalConsultaEquipamentoAberto(false)}
        />

        {/* Modal de Cadastro Rápido de Equipamento com Cliente Travado (Decisão 6 do Usuário) */}
        <ModalCadastroEquipamentoRapido
          aberto={modalCadastrarEquipamentoAberto}
          clienteId={formClienteId}
          clienteNome={formClienteNome}
          onClose={() => setModalCadastrarEquipamentoAberto(false)}
          onEquipamentoSalvo={(novoEq) => {
            setEquipamentosDisponiveis((prev) => [novoEq, ...prev]);
            handleAddEquipamento(novoEq.id);
          }}
        />
      </div>
    );
  }

  // LISTAGEM PRINCIPAL (TABELA DE OS BASEADA EM TABELA DE OS.JPEG)
  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Ordens de Serviço (Manutenção & Calibração)</h1>
          <p>
            Controle de chamados em 14 etapas, múltiplos equipamentos vinculados e rastreabilidade metrológica
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleAbrirNovaOS()} type="button">
          <Plus size={15} />
          <span>Abrir Nova OS</span>
        </button>
      </div>

      {/* KPI Cards (Padrão 28px Display) */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Ordens de Serviço Ativas</span>
            <div className="rarus-kpi-icon-box">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{ordens.length}</div>
          <span className="rarus-kpi-trend trend-up">↑ 2 abertas nesta semana</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Equipamentos em Atendimento</span>
            <div className="rarus-kpi-icon-box">
              <Wrench size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            {ordens.reduce((sum, os) => sum + os.equipamentos.length, 0)}
          </div>
          <span className="rarus-kpi-trend trend-neutral">Média de 2 aparelhos por OS</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Faturamento Previsto de OS</span>
            <div className="rarus-kpi-icon-box">
              <Boxes size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            R$ {ordens.reduce((sum, os) => sum + os.valorTotalGeral, 0).toFixed(2)}
          </div>
          <span className="rarus-kpi-trend trend-up">Serviços + Peças faturadas</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">SLA Médio de Conclusão</span>
            <div className="rarus-kpi-icon-box">
              <Clock size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">2,8 dias</div>
          <span className="rarus-kpi-trend trend-up">Meta atendida na safra</span>
        </div>
      </div>

      {/* Tabela de OS Baseada em 'tabela de os.jpeg' */}
      <div className="rarus-datagrid-container">
        <div className="rarus-grid-header-tabs">
          <button
            className={`rarus-filter-tab-pill ${statusFiltro === 'Todos' ? 'active' : ''}`}
            onClick={() => {
              setStatusFiltro('Todos');
              updateUrlParams({ status: null });
            }}
          >
            <span>Todas as OS</span>
            <span className="count">{ordens.length}</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${statusFiltro === 'Em Serviço' ? 'active' : ''}`}
            onClick={() => {
              setStatusFiltro('Em Serviço');
              updateUrlParams({ status: 'Em Serviço' });
            }}
          >
            <span>Em Serviço</span>
            <span className="count">1</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${statusFiltro === 'Aguardando Peças' ? 'active' : ''}`}
            onClick={() => {
              setStatusFiltro('Aguardando Peças');
              updateUrlParams({ status: 'Aguardando Peças' });
            }}
          >
            <span>Aguardando Peças</span>
            <span className="count">1</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${statusFiltro === 'Equipamento Pronto' ? 'active' : ''}`}
            onClick={() => {
              setStatusFiltro('Equipamento Pronto');
              updateUrlParams({ status: 'Equipamento Pronto' });
            }}
          >
            <span>Equipamento Pronto</span>
            <span className="count">1</span>
          </button>
        </div>

        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--color-text-muted)" />
            <input
              placeholder="Buscar por Nº da OS, Cliente, Série, Técnico..."
              value={busca}
              onChange={(e) => {
                const val = e.target.value;
                setBusca(val);
                updateUrlParams({ busca: val || null });
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Status OS:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '5px 10px' }}
              value={statusFiltro}
              onChange={(e) => {
                const val = e.target.value;
                setStatusFiltro(val);
                updateUrlParams({ status: val !== 'Todos' ? val : null });
              }}
            >
              <option value="Todos">Todos os 14 Status</option>
              {STATUS_OS_LISTA.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grade de Movimentos (Colunas Reais de 'tabela de os.jpeg') */}
        <div className="rarus-table-container">
          <table className="rarus-table">
            <thead>
              <tr>
                <th
                  style={{ width: columnWidths.numero }}
                  className="sortable"
                  onClick={() => handleSort('numero')}
                  title="Clique para ordenar por Nº OS (decrescente / crescente)"
                >
                  <div className="rarus-th-content">
                    <span>Nº OS</span>
                    {sortKey === 'numero' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('numero', columnWidths.numero, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th
                  style={{ width: columnWidths.status }}
                  className="sortable"
                  onClick={() => handleSort('status')}
                  title="Clique para ordenar por Status"
                >
                  <div className="rarus-th-content">
                    <span>Status</span>
                    {sortKey === 'status' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('status', columnWidths.status, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th
                  style={{ width: columnWidths.tipo }}
                  className="sortable"
                  onClick={() => handleSort('tipo')}
                >
                  <div className="rarus-th-content">
                    <span>Tipo</span>
                    {sortKey === 'tipo' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('tipo', columnWidths.tipo, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th
                  style={{ width: columnWidths.dataAbertura }}
                  className="sortable"
                  onClick={() => handleSort('dataAbertura')}
                  title="Clique para ordenar por Data de Abertura"
                >
                  <div className="rarus-th-content">
                    <span>Abertura</span>
                    {sortKey === 'dataAbertura' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('dataAbertura', columnWidths.dataAbertura, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th
                  style={{ width: columnWidths.clienteCodigo }}
                  className="sortable"
                  onClick={() => handleSort('clienteCodigo')}
                >
                  <div className="rarus-th-content">
                    <span>Cliente</span>
                    {sortKey === 'clienteCodigo' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('clienteCodigo', columnWidths.clienteCodigo, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th
                  style={{ width: columnWidths.clienteNome }}
                  className="sortable"
                  onClick={() => handleSort('clienteNome')}
                  title="Clique para ordenar por Razão Social"
                >
                  <div className="rarus-th-content">
                    <span>Razão Social / Dados da OS</span>
                    {sortKey === 'clienteNome' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('clienteNome', columnWidths.clienteNome, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th
                  style={{ width: columnWidths.valorTotalGeral }}
                  className="sortable"
                  onClick={() => handleSort('valorTotalGeral')}
                  title="Clique para ordenar por Valor Total"
                >
                  <div className="rarus-th-content">
                    <span>Total Geral</span>
                    {sortKey === 'valorTotalGeral' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('valorTotalGeral', columnWidths.valorTotalGeral, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th
                  style={{ width: columnWidths.faturamento }}
                  className="sortable"
                  onClick={() => handleSort('faturamento')}
                  title="Clique para ordenar por Faturamento"
                >
                  <div className="rarus-th-content">
                    <span>Faturamento</span>
                    {sortKey === 'faturamento' && (
                      <span className="rarus-sort-icon">
                        {sortDirection === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </span>
                    )}
                  </div>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('faturamento', columnWidths.faturamento, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th style={{ width: columnWidths.acoes, textAlign: 'center' }}>
                  <span>Ações</span>
                  <div
                    className="rarus-col-resizer"
                    onMouseDown={(e) => handleResizeStart('acoes', columnWidths.acoes, e)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {ordensOrdenadas.map((os) => {
                const isSelected = selectedRowId === os.id;
                return (
                  <tr
                    key={os.id}
                    className={isSelected ? 'rarus-row-selected' : ''}
                    onClick={() => handleRowClick(os)}
                  >
                    <td>
                      <span className="os-number-badge">
                        <ClipboardList size={13} style={{ marginRight: 4 }} />
                        {os.numero}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          os.status === 'Em Serviço' || os.status === 'Equipamento Pronto'
                            ? 'ativo'
                            : os.status === 'Aguardando Peças' || os.status === 'Sem Conserto'
                            ? 'inativo'
                            : 'pendente'
                        }`}
                      >
                        <span className="rarus-status-dot" />
                        {os.status}
                      </span>
                    </td>
                    <td><span style={{ fontFamily: 'monospace' }}>OS</span></td>
                    <td>{os.dataAbertura}</td>
                    <td><code>C01800</code></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{os.clienteNome}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {os.equipamentos.length} equipamento(s) • Téc: {os.tecnicoNome}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-text-main)' }}>
                        R$ {os.valorTotalGeral.toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                        {os.faturada ? 'Faturado-Atend.' : 'Normal-Pend.'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirOS(os);
                          }}
                          type="button"
                        >
                          Abrir OS
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAbrirModalImpressao(os);
                          }}
                          title="Imprimir OS / Etiqueta Lab / Certificado"
                          type="button"
                        >
                          <Printer size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE IMPRESSÃO DA OS (DOCUMENTOS, ETIQUETA COM QR CODE & CERTIFICADOS) */}
      <ModalImpressaoOS
        aberto={modalImpressaoAberto}
        onFechar={() => setModalImpressaoAberto(false)}
        os={osParaImprimir}
      />
    </div>
  );
};

