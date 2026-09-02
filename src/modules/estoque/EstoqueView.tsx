'use client';

import React, { useState, useEffect } from 'react';
import { EstoqueService } from '@/core/services/estoqueService';
import { EstoqueLocal, ItemEstoque, MovimentacaoEstoque } from '@/core/types';
import {
  Boxes,
  ArrowLeftRight,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Check,
  Building2,
  Truck,
} from 'lucide-react';

export function EstoqueView() {
  const [locais, setLocais] = useState<EstoqueLocal[]>([]);
  const [localSelecionado, setLocalSelecionado] = useState<string>('todos');
  const [itens, setItens] = useState<(ItemEstoque & { saldoLocalAtual?: number })[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'catalogo' | 'transferencias' | 'requisicoes'>('catalogo');
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ProdutoPeca' | 'Servico'>('todos');
  const [modalTransferenciaAberto, setModalTransferenciaAberto] = useState(false);

  // Form de Transferência
  const [transfItemCodigo, setTransfItemCodigo] = useState('');
  const [transfOrigem, setTransfOrigem] = useState('est-central');
  const [transfDestino, setTransfDestino] = useState('est-tec-itamar');
  const [transfQtd, setTransfQtd] = useState(1);
  const [transfMotivo, setTransfMotivo] = useState('');
  const [msgFeedback, setMsgFeedback] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, [localSelecionado, busca, filtroTipo]);

  const carregarDados = async () => {
    const locs = await EstoqueService.listarLocais();
    setLocais(locs);

    const its = await EstoqueService.listarItens({
      localId: localSelecionado !== 'todos' ? localSelecionado : undefined,
      tipoItem: filtroTipo !== 'todos' ? filtroTipo : undefined,
      busca: busca || undefined,
    });
    setItens(its);

    const movs = await EstoqueService.listarMovimentacoes();
    setMovimentacoes(movs);
  };

  const handleTransferir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transfItemCodigo) return;

    const res = await EstoqueService.transferirPecas({
      origemLocalId: transfOrigem,
      destinoLocalId: transfDestino,
      itemCodigo: transfItemCodigo,
      quantidade: Number(transfQtd),
      responsavelNome: 'Almoxarife Central',
      motivo: transfMotivo || 'Transferência entre estoques',
    });

    setMsgFeedback(res.mensagem);
    if (res.sucesso) {
      setTimeout(() => {
        setModalTransferenciaAberto(false);
        setMsgFeedback(null);
        carregarDados();
      }, 1200);
    }
  };

  const handleAprovarRequisicao = async (movId: string) => {
    await EstoqueService.aprovarRequisicao(movId, 'Almoxarife Central');
    carregarDados();
  };

  const requisicoesPendentes = movimentacoes.filter((m) => m.status === 'PendenteAprovacao');

  return (
    <div className="rarus-content-scroll">
      {/* Header do Módulo */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Estoque Multi-Local & Suprimentos</h1>
          <p>Controle de Estoque Central (Matriz) e Estoques Móveis dos Veículos dos Técnicos</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn-primary-rarus"
            onClick={() => setModalTransferenciaAberto(true)}
            type="button"
          >
            <ArrowLeftRight size={15} />
            <span>Nova Transferência</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Superiores */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Itens no Catálogo</span>
            <div className="rarus-kpi-icon-box">
              <Boxes size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{itens.length}</div>
          <span className="rarus-kpi-trend trend-neutral">Peças Físicas e Peças de Serviço</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Locais de Estoque</span>
            <div className="rarus-kpi-icon-box">
              <Building2 size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{locais.length}</div>
          <span className="rarus-kpi-trend trend-up">1 Central + 2 Técnicos em Campo</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Requisições Pendentes</span>
            <div
              className="rarus-kpi-icon-box"
              style={{
                backgroundColor: requisicoesPendentes.length > 0 ? 'var(--rarus-warning-bg)' : undefined,
                color: requisicoesPendentes.length > 0 ? 'var(--rarus-warning)' : undefined,
              }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{requisicoesPendentes.length}</div>
          <span className="rarus-kpi-trend trend-down">
            {requisicoesPendentes.length > 0 ? 'Aguardando aprovação do almoxarifado' : 'Todas aprovadas'}
          </span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Diferença Físico / Fiscal</span>
            <div className="rarus-kpi-icon-box">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">R$ 0,00</div>
          <span className="rarus-kpi-trend trend-up">Conforme (Após faturamento de OS)</span>
        </div>
      </div>

      {/* Navegação do Módulo de Estoque */}
      <div className="rarus-datagrid-container">
        <div className="rarus-grid-header-tabs">
          <button
            className={`rarus-filter-tab-pill ${abaAtiva === 'catalogo' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('catalogo')}
          >
            <Boxes size={14} />
            <span>Catálogo de Peças & Saldos</span>
            <span className="count">{itens.length}</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${abaAtiva === 'transferencias' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('transferencias')}
          >
            <ArrowLeftRight size={14} />
            <span>Histórico de Transferências</span>
            <span className="count">{movimentacoes.length}</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${abaAtiva === 'requisicoes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('requisicoes')}
          >
            <Clock size={14} />
            <span>Requisições de Campo</span>
            {requisicoesPendentes.length > 0 && (
              <span className="count" style={{ background: 'var(--rarus-danger)', color: '#fff' }}>
                {requisicoesPendentes.length}
              </span>
            )}
          </button>
        </div>

        {/* Toolbar com Filtros */}
        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--text-muted)" />
            <input
              placeholder="Buscar por código ou descrição da peça..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="rarus-grid-actions-right">
            {/* Seletor de Local */}
            <select
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '13px',
              }}
              value={localSelecionado}
              onChange={(e) => setLocalSelecionado(e.target.value)}
            >
              <option value="todos">Todos os Estoques (Consolidado)</option>
              {locais.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.tipo === 'Central' ? '🏢 ' : '🚗 '} {loc.nome}
                </option>
              ))}
            </select>

            {/* Filtro de Tipo */}
            <select
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '13px',
              }}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
            >
              <option value="todos">Todos os Tipos</option>
              <option value="ProdutoPeca">Apenas Peças Físicas (NF-e)</option>
              <option value="Servico">Peças de Serviço (NFS-e)</option>
            </select>
          </div>
        </div>

        {/* Conteúdo da Aba Catálogo */}
        {abaAtiva === 'catalogo' && (
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição Técnica</th>
                <th>Tipo Fiscal</th>
                <th>Rastreabilidade</th>
                <th>Saldo Físico</th>
                <th>Saldo Fiscal</th>
                <th>Preço Unitário</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => {
                const saldoAtual =
                  localSelecionado !== 'todos'
                    ? item.saldoLocalAtual ?? 0
                    : Object.values(item.saldosPorLocal).reduce((a, b) => a + b, 0);

                return (
                  <tr key={item.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'var(--rarus-cyan)',
                          background: 'var(--bg-app)',
                          padding: '3px 7px',
                          borderRadius: 4,
                          fontSize: '12px',
                        }}
                      >
                        {item.codigo}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.descricao}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Unidade: {item.unidadeMedida}
                      </div>
                    </td>
                    <td>
                      {item.tipoItem === 'ProdutoPeca' ? (
                        <span className="rarus-status-pill status-calibrado">
                          <span className="rarus-status-dot" />
                          Peça (NF-e)
                        </span>
                      ) : (
                        <span className="rarus-status-pill status-alerta">
                          <span className="rarus-status-dot" />
                          Peça de Serviço (NFS-e)
                        </span>
                      )}
                    </td>
                    <td>
                      {item.requerNumeroSerie ? (
                        <span style={{ fontSize: '11.5px', color: 'var(--rarus-navy)', fontWeight: 600 }}>
                          Obrigatório Nº Série
                        </span>
                      ) : (
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Por Quantidade</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '14px',
                          color: saldoAtual <= 2 ? 'var(--rarus-danger)' : 'var(--text-main)',
                        }}
                      >
                        {saldoAtual} {item.unidadeMedida}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                        {item.saldoFiscal} {item.unidadeMedida}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>R$ {item.precoVenda.toFixed(2)}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--rarus-navy)' }}>
                        R$ {(saldoAtual * item.precoVenda).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Conteúdo da Aba Histórico de Transferências */}
        {abaAtiva === 'transferencias' && (
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Tipo</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Item Movimentado</th>
                <th>Quantidade</th>
                <th>Responsável</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((mov) => {
                const origem = locais.find((l) => l.id === mov.origemLocalId)?.nome || mov.origemLocalId;
                const destino = locais.find((l) => l.id === mov.destinoLocalId)?.nome || mov.destinoLocalId;

                return (
                  <tr key={mov.id}>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{mov.dataHora}</td>
                    <td>
                      <span className="rarus-status-pill status-alerta">
                        <ArrowLeftRight size={12} />
                        {mov.tipo}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px' }}>{origem}</td>
                    <td style={{ fontSize: '12px', fontWeight: 600 }}>{destino}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>[{mov.itemCodigo}]</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mov.itemDescricao}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{mov.quantidade} un.</span>
                    </td>
                    <td style={{ fontSize: '12px' }}>{mov.responsavelNome}</td>
                    <td>
                      <span
                        className={`rarus-status-pill ${
                          mov.status === 'Concluida' ? 'status-calibrado' : 'status-alerta'
                        }`}
                      >
                        <span className="rarus-status-dot" />
                        {mov.status === 'Concluida' ? 'Concluída' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Conteúdo da Aba Requisições de Campo */}
        {abaAtiva === 'requisicoes' && (
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Técnico Solicitante</th>
                <th>Estoque Destino</th>
                <th>Item Solicitado</th>
                <th>Quantidade</th>
                <th>Motivo da Requisição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {requisicoesPendentes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Nenhuma requisição de peças pendente de aprovação.
                  </td>
                </tr>
              ) : (
                requisicoesPendentes.map((req) => (
                  <tr key={req.id}>
                    <td>{req.dataHora}</td>
                    <td style={{ fontWeight: 600 }}>{req.responsavelNome}</td>
                    <td>{locais.find((l) => l.id === req.destinoLocalId)?.nome}</td>
                    <td>
                      <strong>[{req.itemCodigo}]</strong> {req.itemDescricao}
                    </td>
                    <td>
                      <span style={{ fontWeight: 800 }}>{req.quantidade} un.</span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{req.motivo}</td>
                    <td>
                      <button
                        className="btn-primary-rarus"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleAprovarRequisicao(req.id)}
                      >
                        <Check size={13} />
                        <span>Aprovar & Transferir</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Nova Transferência */}
      {modalTransferenciaAberto && (
        <div className="rarus-modal-backdrop" onClick={() => setModalTransferenciaAberto(false)}>
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="rarus-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                Transferência de Peças Entre Estoques
              </h3>
            </div>
            <form onSubmit={handleTransferir}>
              <div className="rarus-modal-body">
                {msgFeedback && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 6,
                      marginBottom: 16,
                      backgroundColor: 'var(--rarus-cyan-light)',
                      color: 'var(--rarus-navy)',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {msgFeedback}
                  </div>
                )}

                <div className="rarus-form-group">
                  <label>Item / Peça para Transferir:</label>
                  <select
                    value={transfItemCodigo}
                    onChange={(e) => setTransfItemCodigo(e.target.value)}
                    required
                  >
                    <option value="">Selecione a peça...</option>
                    {itens
                      .filter((i) => i.tipoItem === 'ProdutoPeca')
                      .map((i) => (
                        <option key={i.codigo} value={i.codigo}>
                          [{i.codigo}] {i.descricao}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Estoque Origem:</label>
                    <select
                      value={transfOrigem}
                      onChange={(e) => setTransfOrigem(e.target.value)}
                    >
                      {locais.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rarus-form-group">
                    <label>Estoque Destino:</label>
                    <select
                      value={transfDestino}
                      onChange={(e) => setTransfDestino(e.target.value)}
                    >
                      {locais.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Quantidade a Transferir:</label>
                    <input
                      type="number"
                      min={1}
                      value={transfQtd}
                      onChange={(e) => setTransfQtd(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="rarus-form-group">
                    <label>Motivo / Observação:</label>
                    <input
                      placeholder="Ex: Abastecimento de veículo"
                      value={transfMotivo}
                      onChange={(e) => setTransfMotivo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rarus-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-rarus"
                  onClick={() => setModalTransferenciaAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-rarus">
                  Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
