'use client';

import React, { useState, useEffect } from 'react';
import {
  OrdemServico,
  StatusOS,
  TipoOS,
  PrioridadeOS,
  OrdemServicoItemEquipamento,
  OrdemServicoItemPeca,
} from '@/core/types';
import { OrdensServicoService } from '@/core/services/ordensServicoService';
import { ClientesService } from '@/core/services/clientesService';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { EstoqueService } from '@/core/services/estoqueService';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Wrench,
  ChevronRight,
  Boxes,
  Layers,
  FileCheck,
  Building,
  User,
  Calendar,
} from 'lucide-react';

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

export const OrdensServicoView: React.FC = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');
  const [busca, setBusca] = useState('');
  const [osSelecionada, setOsSelecionada] = useState<OrdemServico | null>(null);

  // Modal Nova OS
  const [modalNovaOS, setModalNovaOS] = useState(false);
  const [abaModal, setAbaModal] = useState<'geral' | 'equipamentos' | 'pecas' | 'resumo'>('geral');

  // Form State Nova OS
  const [clienteId, setClienteId] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [tipoOS, setTipoOS] = useState<TipoOS>('Calibração em Campo');
  const [prioridade, setPrioridade] = useState<PrioridadeOS>('Alta');
  const [tecnicoNome, setTecnicoNome] = useState('Técnico Itamar Soares');
  const [descricaoProblema, setDescricaoProblema] = useState('');

  // Equipamentos da OS
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState<any[]>([]);
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState<OrdemServicoItemEquipamento[]>([]);

  // Peças & Serviços lançados
  const [itensEstoqueDisponiveis, setItensEstoqueDisponiveis] = useState<any[]>([]);
  const [pecasLancadas, setPecasLancadas] = useState<OrdemServicoItemPeca[]>([]);

  useEffect(() => {
    carregarOrdens();
  }, [statusFiltro, busca]);

  useEffect(() => {
    carregarCatalogos();
  }, []);

  const carregarOrdens = async () => {
    const list = await OrdensServicoService.listar({
      status: statusFiltro !== 'Todos' ? statusFiltro : undefined,
      busca: busca || undefined,
    });
    setOrdens(list);
    if (list.length > 0 && !osSelecionada) {
      setOsSelecionada(list[0]);
    }
  };

  const carregarCatalogos = async () => {
    const eqs = await EquipamentosService.listar();
    setEquipamentosDisponiveis(eqs);
    const its = await EstoqueService.listarItens();
    setItensEstoqueDisponiveis(its);
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
        certificadoNumero: `1046-${seq}/${anoAtual}`,
        statusItem: 'Aguardando Ensaio',
      },
    ]);
  };

  const handleAddPeca = (itemCodigo: string) => {
    const item = itensEstoqueDisponiveis.find((i) => i.codigo === itemCodigo);
    if (!item) return;

    setPecasLancadas([
      ...pecasLancadas,
      {
        pecaId: item.id,
        codigo: item.codigo,
        descricao: item.descricao,
        quantidade: 1,
        valorUnitario: item.precoVenda,
        tipoItem: item.tipoItem === 'ProdutoPeca' ? 'Peca' : 'Servico',
        estoqueOrigemId: 'est-tec-itamar',
      },
    ]);
  };

  const handleSalvarOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNome || equipamentosSelecionados.length === 0) {
      alert('Selecione ao menos um cliente e um equipamento para a OS.');
      return;
    }

    await OrdensServicoService.criar({
      clienteId: clienteId || 'cli-1',
      clienteNome,
      tipo: tipoOS,
      prioridade,
      status: 'Aberta',
      equipamentos: equipamentosSelecionados,
      pecas: pecasLancadas,
      tecnicoId: 'usr-tec-itamar',
      tecnicoNome,
      dataAbertura: new Date().toLocaleDateString('pt-BR'),
      dataPrevisao: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      descricaoProblema,
    });

    setModalNovaOS(false);
    setEquipamentosSelecionados([]);
    setPecasLancadas([]);
    carregarOrdens();
  };

  const handleMudarStatus = async (novoStatus: StatusOS) => {
    if (!osSelecionada) return;
    const atualizada = await OrdensServicoService.atualizarStatus(osSelecionada.id, novoStatus);
    if (atualizada) {
      setOsSelecionada({ ...atualizada });
      carregarOrdens();
    }
  };

  const totalServicos = pecasLancadas
    .filter((p) => p.tipoItem === 'Servico')
    .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

  const totalPecas = pecasLancadas
    .filter((p) => p.tipoItem === 'Peca')
    .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

  return (
    <div className="rarus-content-scroll">
      {/* Header do Módulo */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Ordens de Serviço (Manutenção & Calibração)</h1>
          <p>
            Workflow metrológico em 14 etapas, múltiplos equipamentos por chamado e numeração de certificados 0000-X/AA
          </p>
        </div>
        <button className="btn-primary-rarus" onClick={() => setModalNovaOS(true)} type="button">
          <Plus size={15} />
          <span>Abrir Nova OS</span>
        </button>
      </div>

      {/* Cards de Métricas Superiores */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Ordens de Serviço Ativas</span>
            <div className="rarus-kpi-icon-box">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{ordens.length}</div>
          <span className="rarus-kpi-trend trend-up">1045 em andamento no cliente</span>
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
          <span className="rarus-kpi-trend trend-neutral">Média de 2,3 aparelhos por OS</span>
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
          <span className="rarus-kpi-trend trend-up">Serviços (NFS-e) + Peças (NF-e)</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">SLA Médio de Conclusão</span>
            <div className="rarus-kpi-icon-box">
              <Clock size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">2,8 dias</div>
          <span className="rarus-kpi-trend trend-up">Dentro da meta de safra</span>
        </div>
      </div>

      {/* Layout Duas Colunas (DataGrid na Esquerda + Detalhes da OS na Direita) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>
        {/* Tabela de OS */}
        <div className="rarus-datagrid-container">
          {/* Abas com Contadores de Status */}
          <div className="rarus-grid-header-tabs">
            <button
              className={`rarus-filter-tab-pill ${statusFiltro === 'Todos' ? 'active' : ''}`}
              onClick={() => setStatusFiltro('Todos')}
            >
              <span>Todas as OS</span>
              <span className="count">{ordens.length}</span>
            </button>
            <button
              className={`rarus-filter-tab-pill ${statusFiltro === 'Em Serviço' ? 'active' : ''}`}
              onClick={() => setStatusFiltro('Em Serviço')}
            >
              <span>Em Serviço</span>
              <span className="count">1</span>
            </button>
            <button
              className={`rarus-filter-tab-pill ${statusFiltro === 'Aguardando Peças' ? 'active' : ''}`}
              onClick={() => setStatusFiltro('Aguardando Peças')}
            >
              <span>Aguardando Peças</span>
              <span className="count">1</span>
            </button>
            <button
              className={`rarus-filter-tab-pill ${statusFiltro === 'Equipamento Pronto' ? 'active' : ''}`}
              onClick={() => setStatusFiltro('Equipamento Pronto')}
            >
              <span>Prontas</span>
              <span className="count">1</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="rarus-grid-toolbar">
            <div className="rarus-inline-search">
              <Search size={15} color="var(--text-muted)" />
              <input
                placeholder="Buscar por Nº da OS, Cliente, Técnico, Modelo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="rarus-grid-actions-right">
              <select
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                }}
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
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

          {/* Tabela de Ordens */}
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Nº OS</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Equipamentos</th>
                <th>Técnico</th>
                <th>Previsão</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ordens.map((os) => {
                const isSelected = osSelecionada?.id === os.id;
                return (
                  <tr
                    key={os.id}
                    onClick={() => setOsSelecionada(os)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--rarus-cyan-light)' : undefined,
                    }}
                  >
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--rarus-navy)', fontSize: '13.5px' }}>
                        #{os.numero}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{os.clienteNome}</div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{os.tipo}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '11.5px',
                          background: 'var(--bg-app)',
                          padding: '2px 7px',
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        {os.equipamentos.length} aparelho(s)
                      </span>
                    </td>
                    <td style={{ fontSize: '12px' }}>{os.tecnicoNome}</td>
                    <td style={{ fontSize: '12px' }}>{os.dataPrevisao}</td>
                    <td>
                      <span
                        className={`rarus-status-pill ${
                          os.status === 'Equipamento Pronto' || os.status === 'Faturada'
                            ? 'status-calibrado'
                            : os.status === 'Aguardando Peças'
                            ? 'status-vencido'
                            : 'status-alerta'
                        }`}
                      >
                        <span className="rarus-status-dot" />
                        {os.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Coluna Direita: Painel de Detalhes da OS Selecionada */}
        {osSelecionada && (
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header da OS */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ORDEM DE SERVIÇO</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--rarus-navy)' }}>
                  #{osSelecionada.numero}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)', marginTop: 4 }}>
                {osSelecionada.clienteNome}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {osSelecionada.tipo} • Técnico: {osSelecionada.tecnicoNome}
              </div>
            </div>

            {/* Controle dos 14 Status */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                Alterar Status Operacional:
              </label>
              <select
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '12.5px',
                }}
                value={osSelecionada.status}
                onChange={(e) => handleMudarStatus(e.target.value as StatusOS)}
              >
                {STATUS_OS_LISTA.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Múltiplos Equipamentos Vinculados */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: 6 }}>
                Equipamentos a Atender ({osSelecionada.equipamentos.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {osSelecionada.equipamentos.map((eq) => (
                  <div
                    key={eq.equipamentoId}
                    style={{
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 6,
                      padding: '8px 10px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{eq.modelo}</span>
                      <span style={{ color: 'var(--rarus-cyan)', fontWeight: 700 }}>
                        Cert: {eq.certificadoNumero}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
                      Série: {eq.numeroSerie} • Status: {eq.statusItem}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peças & Serviços Utilizados */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: 6 }}>
                Composição de Custos (Peças & Serviços):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {osSelecionada.pecas.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11.5px',
                      padding: '4px 0',
                    }}
                  >
                    <span>
                      {p.quantidade}x {p.descricao} ({p.tipoItem === 'Peca' ? 'NF-e' : 'NFS-e'})
                    </span>
                    <strong>R$ {(p.quantidade * p.valorUnitario).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Total da OS:</span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--rarus-navy)' }}>
                  R$ {osSelecionada.valorTotalGeral.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nova OS com Múltiplos Equipamentos e Abas */}
      {modalNovaOS && (
        <div className="rarus-modal-backdrop" onClick={() => setModalNovaOS(false)}>
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
            <div className="rarus-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                Abertura de Nova Ordem de Serviço
              </h3>
            </div>

            {/* Abas do Modal */}
            <div className="rarus-modal-tabs">
              <button
                type="button"
                className={`rarus-client-tab-btn ${abaModal === 'geral' ? 'active' : ''}`}
                onClick={() => setAbaModal('geral')}
              >
                1. Dados Gerais
              </button>
              <button
                type="button"
                className={`rarus-client-tab-btn ${abaModal === 'equipamentos' ? 'active' : ''}`}
                onClick={() => setAbaModal('equipamentos')}
              >
                2. Equipamentos ({equipamentosSelecionados.length})
              </button>
              <button
                type="button"
                className={`rarus-client-tab-btn ${abaModal === 'pecas' ? 'active' : ''}`}
                onClick={() => setAbaModal('pecas')}
              >
                3. Peças & Serviços ({pecasLancadas.length})
              </button>
              <button
                type="button"
                className={`rarus-client-tab-btn ${abaModal === 'resumo' ? 'active' : ''}`}
                onClick={() => setAbaModal('resumo')}
              >
                4. Resumo & Totais
              </button>
            </div>

            <form onSubmit={handleSalvarOS}>
              <div className="rarus-modal-body">
                {abaModal === 'geral' && (
                  <>
                    <div className="rarus-form-row">
                      <div className="rarus-form-group">
                        <label>Cliente:</label>
                        <select
                          value={clienteNome}
                          onChange={(e) => {
                            setClienteNome(e.target.value);
                            setClienteId(e.target.value === 'AgroGrãos Cooperativa' ? 'cli-1' : 'cli-2');
                          }}
                          required
                        >
                          <option value="">Selecione o cliente...</option>
                          <option value="AgroGrãos Cooperativa">AgroGrãos Cooperativa</option>
                          <option value="BioFarma do Brasil">BioFarma do Brasil</option>
                          <option value="Moinho Triângulo">Moinho Triângulo</option>
                        </select>
                      </div>

                      <div className="rarus-form-group">
                        <label>Tipo de OS:</label>
                        <select value={tipoOS} onChange={(e) => setTipoOS(e.target.value as any)}>
                          <option value="Calibração em Campo">Calibração em Campo (In Loco)</option>
                          <option value="Calibração em Laboratório">Calibração em Laboratório</option>
                          <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                          <option value="Manutenção Corretiva">Manutenção Corretiva</option>
                          <option value="Ensaio Técnico">Ensaio Técnico / Qualificação</option>
                        </select>
                      </div>
                    </div>

                    <div className="rarus-form-row">
                      <div className="rarus-form-group">
                        <label>Técnico Responsável:</label>
                        <select value={tecnicoNome} onChange={(e) => setTecnicoNome(e.target.value)}>
                          <option value="Técnico Itamar Soares">Técnico Itamar Soares (GEHAKA)</option>
                          <option value="Técnico Marcos Vinicius">Técnico Marcos Vinicius</option>
                        </select>
                      </div>

                      <div className="rarus-form-group">
                        <label>Prioridade:</label>
                        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as any)}>
                          <option value="Normal">Normal</option>
                          <option value="Alta">Alta</option>
                          <option value="Urgente">Urgente (Parada de Fábrica)</option>
                        </select>
                      </div>
                    </div>

                    <div className="rarus-form-group">
                      <label>Descrição do Atendimento / Problema Relatado:</label>
                      <textarea
                        rows={3}
                        placeholder="Descreva as instruções de atendimento, calibrações solicitadas ou avarias..."
                        value={descricaoProblema}
                        onChange={(e) => setDescricaoProblema(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {abaModal === 'equipamentos' && (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>
                        Selecione os equipamentos do cliente para adicionar à OS:
                      </label>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <select
                          id="select-add-eq"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            fontSize: '13px',
                          }}
                        >
                          {equipamentosDisponiveis.map((e) => (
                            <option key={e.id} value={e.id}>
                              [{e.modelo}] Nº Série: {e.numeroSerie} • {e.clienteNome}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn-primary-rarus"
                          onClick={() => {
                            const sel = document.getElementById('select-add-eq') as HTMLSelectElement;
                            if (sel) handleAddEquipamento(sel.value);
                          }}
                        >
                          Adicionar Equipamento
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Equipamentos Incluídos nesta OS ({equipamentosSelecionados.length}):
                    </div>

                    {equipamentosSelecionados.length === 0 ? (
                      <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                        Nenhum equipamento adicionado ainda.
                      </div>
                    ) : (
                      <table className="rarus-table">
                        <thead>
                          <tr>
                            <th>Seq.</th>
                            <th>Modelo</th>
                            <th>Nº Série</th>
                            <th>Nº Certificado Previsto</th>
                            <th>Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {equipamentosSelecionados.map((eq, idx) => (
                            <tr key={idx}>
                              <td>{eq.numeroSequencial}</td>
                              <td>{eq.modelo}</td>
                              <td>{eq.numeroSerie}</td>
                              <td>
                                <strong style={{ color: 'var(--rarus-cyan)' }}>{eq.certificadoNumero}</strong>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEquipamentosSelecionados(
                                      equipamentosSelecionados.filter((_, i) => i !== idx)
                                    )
                                  }
                                  style={{ background: 'none', border: 'none', color: 'var(--rarus-danger)', cursor: 'pointer' }}
                                >
                                  Remover
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {abaModal === 'pecas' && (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>
                        Lançar Peças do Estoque ou Serviços:
                      </label>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <select
                          id="select-add-peca"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            fontSize: '13px',
                          }}
                        >
                          {itensEstoqueDisponiveis.map((item) => (
                            <option key={item.codigo} value={item.codigo}>
                              [{item.codigo}] {item.descricao} - R$ {item.precoVenda.toFixed(2)} (
                              {item.tipoItem === 'ProdutoPeca' ? 'Peça' : 'Serviço'})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn-primary-rarus"
                          onClick={() => {
                            const sel = document.getElementById('select-add-peca') as HTMLSelectElement;
                            if (sel) handleAddPeca(sel.value);
                          }}
                        >
                          Lançar Item
                        </button>
                      </div>
                    </div>

                    <table className="rarus-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Tipo</th>
                          <th>Quantidade</th>
                          <th>Valor Unitário</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pecasLancadas.map((p, idx) => (
                          <tr key={idx}>
                            <td>{p.descricao}</td>
                            <td>{p.tipoItem === 'Peca' ? 'Peça Física (NF-e)' : 'Serviço (NFS-e)'}</td>
                            <td>{p.quantidade}</td>
                            <td>R$ {p.valorUnitario.toFixed(2)}</td>
                            <td>R$ {(p.quantidade * p.valorUnitario).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {abaModal === 'resumo' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px 0' }}>Resumo da Ordem de Serviço</h4>
                    <p><strong>Cliente:</strong> {clienteNome}</p>
                    <p><strong>Tipo:</strong> {tipoOS}</p>
                    <p><strong>Técnico:</strong> {tecnicoNome}</p>
                    <p><strong>Equipamentos a Calibrar:</strong> {equipamentosSelecionados.length}</p>
                    <hr style={{ borderColor: 'var(--border-subtle)', margin: '14px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>Subtotal Serviços (NFS-e):</span>
                      <strong>R$ {totalServicos.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: 4 }}>
                      <span>Subtotal Peças (NF-e):</span>
                      <strong>R$ {totalPecas.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, marginTop: 8, color: 'var(--rarus-navy)' }}>
                      <span>Valor Total Geral:</span>
                      <span>R$ {(totalServicos + totalPecas).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rarus-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-rarus"
                  onClick={() => setModalNovaOS(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-rarus">
                  Criar Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
