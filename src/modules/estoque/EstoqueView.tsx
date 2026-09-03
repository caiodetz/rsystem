'use client';

import React, { useState, useEffect } from 'react';
import { ItemEstoque, EstoqueLocal, MovimentacaoEstoque } from '@/core/types';
import { EstoqueService } from '@/core/services/estoqueService';
import { getUrlParam, updateUrlParams } from '@/core/utils/urlParams';
import {
  Boxes,
  ArrowLeftRight,
  Plus,
  Search,
  Save,
  Printer,
  FileCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const EstoqueView: React.FC = () => {
  const [locais, setLocais] = useState<EstoqueLocal[]>([]);
  const [localSelecionadoId, setLocalSelecionadoId] = useState<string>(() => getUrlParam('local') || '');
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [busca, setBusca] = useState<string>(() => getUrlParam('busca') || '');
  const [filtroTipo, setFiltroTipo] = useState<string>(() => getUrlParam('tipo') || 'todos');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRowClick = (it: ItemEstoque) => {
    if (selectedRowId === it.id) {
      setTransfPecaCodigo(it.codigo);
      setModalTransferencia(true);
    } else {
      setSelectedRowId(it.id);
    }
  };

  // Modais
  const [modalTransferencia, setModalTransferencia] = useState(false);
  const [modalContagem, setModalContagem] = useState(false);

  // Form State Transferência (Baseado na imagem real)
  const [transfMovto, setTransfMovto] = useState('3.1.03 - Transferência de Local de Est. (FISICO/FISCAL)');
  const [transfOrigem, setTransfOrigem] = useState('est-tec-itamar');
  const [transfDestino, setTransfDestino] = useState('est-tec-caio');
  const [transfPecaCodigo, setTransfPecaCodigo] = useState('005196');
  const [transfQtd, setTransfQtd] = useState(2);
  const [transfFuncionario, setTransfFuncionario] = useState('038 - Janaína Sousa');

  // Form Contagem de Estoque (Baseado na imagem real)
  const [contagemSaldoUsado, setContagemSaldoUsado] = useState('Saldo Físico');
  const [contagemNaoListarNaoEstocaveis, setContagemNaoListarNaoEstocaveis] = useState(true);
  const [contagemNaoMostrarSaldo, setContagemNaoMostrarSaldo] = useState(false);
  const [contagemNaoListarFracionados, setContagemNaoListarFracionados] = useState(false);

  useEffect(() => {
    carregarLocais();
  }, []);

  useEffect(() => {
    carregarItens();
  }, [localSelecionadoId, busca, filtroTipo]);

  const carregarLocais = async () => {
    const locs = await EstoqueService.listarLocais();
    setLocais(locs);
    const paramLocal = getUrlParam('local');
    if (paramLocal && locs.some((l) => l.id === paramLocal)) {
      setLocalSelecionadoId(paramLocal);
    } else if (locs.length > 0 && !localSelecionadoId) {
      setLocalSelecionadoId(locs[0].id);
    }
  };

  const carregarItens = async () => {
    const res = await EstoqueService.listarItens({
      localId: localSelecionadoId || undefined,
      busca: busca || undefined,
      tipoItem: filtroTipo !== 'todos' ? (filtroTipo as any) : undefined,
    });
    setItens(res);
  };

  const handleExecutarTransferencia = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await EstoqueService.transferirPecas({
      origemLocalId: transfOrigem,
      destinoLocalId: transfDestino,
      itemCodigo: transfPecaCodigo,
      quantidade: transfQtd,
      responsavelNome: transfFuncionario,
      motivo: 'Transferência de estoque para atendimento em campo',
    });

    if (res.sucesso) {
      alert(`Transferência concluída com sucesso!\n${res.mensagem}`);
      setModalTransferencia(false);
      carregarItens();
    } else {
      alert(`Bloqueio de Estoque: ${res.mensagem}`);
    }
  };

  const localAtual = locais.find((l) => l.id === localSelecionadoId) || locais[0];

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Gestão de Estoque Multi-Local & Peças</h1>
          <p>
            Almoxarifado Central e veículos de técnicos em campo • Controle de Saldo Físico vs. Saldo Fiscal
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setModalContagem(true)} type="button">
            <Printer size={15} />
            <span>Contagem de Estoque</span>
          </button>
          <button className="btn btn-primary" onClick={() => setModalTransferencia(true)} type="button">
            <ArrowLeftRight size={15} />
            <span>Nova Transferência</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Locais de Estoque Ativos</span>
            <div className="rarus-kpi-icon-box">
              <Building size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{locais.length}</div>
          <span className="rarus-kpi-trend trend-neutral">1 Matriz Central + 2 Técnicos</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Itens no Local Selecionado</span>
            <div className="rarus-kpi-icon-box">
              <Boxes size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{itens.length}</div>
          <span className="rarus-kpi-trend trend-up">Linha GEHAKA & Peças de Balança</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Saldo Físico Total</span>
            <div className="rarus-kpi-icon-box">
              <Layers size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            {itens.reduce((sum, i) => sum + (i.saldosPorLocal[localSelecionadoId] || 0), 0)} un.
          </div>
          <span className="rarus-kpi-trend trend-up">Disponível para montagem/OS</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Saldo Fiscal Consolidado</span>
            <div className="rarus-kpi-icon-box">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            {itens.reduce((sum, i) => sum + i.saldoFiscal, 0)} un.
          </div>
          <span className="rarus-kpi-trend trend-neutral">Aguardando baixa de faturamento</span>
        </div>
      </div>

      {/* Seletor de Locais de Estoque (Padrão Abas) */}
      <div className="rarus-datagrid-container">
        <div className="rarus-grid-header-tabs">
          {locais.map((loc) => {
            const isSelected = loc.id === localSelecionadoId;
            return (
              <button
                key={loc.id}
                className={`rarus-filter-tab-pill ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setLocalSelecionadoId(loc.id);
                  updateUrlParams({ local: loc.id });
                }}
              >
                <span>{loc.nome}</span>
                <span className="count">
                  {loc.tipo === 'Central' ? 'Central' : 'Veículo / Campo'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--color-text-muted)" />
            <input
              placeholder="Buscar por código, descrição ou modelo de peça..."
              value={busca}
              onChange={(e) => {
                const val = e.target.value;
                setBusca(val);
                updateUrlParams({ busca: val || null });
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filtroTipo}
              onChange={(e) => {
                const val = e.target.value;
                setFiltroTipo(val);
                updateUrlParams({ tipo: val !== 'todos' ? val : null });
              }}
            >
              <option value="todos">Todos os Tipos de Item</option>
              <option value="ProdutoPeca">Peça Física (NF-e)</option>
              <option value="PecaServico">Peça de Serviço (NFS-e)</option>
            </select>
          </div>
        </div>

        {/* Tabela de Peças com os Nomes e Códigos Reais da Imagem forumalãrio de tranferencia de estoque.jpeg */}
        <div className="rarus-table-container">
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição do Item / Peça</th>
                <th>Unidade</th>
                <th>Tipo Fiscal</th>
                <th>Saldo Físico</th>
                <th>Saldo Fiscal</th>
                <th>Preço Unitário</th>
                <th>Status Estoque</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((it) => {
                const saldoFis = it.saldosPorLocal[localSelecionadoId] || 0;
                const isSelected = selectedRowId === it.id;
                return (
                  <tr
                    key={it.id}
                    className={isSelected ? 'rarus-row-selected' : ''}
                    onClick={() => handleRowClick(it)}
                    title={isSelected ? 'Clique novamente para abrir transferência deste item' : 'Clique para selecionar o item'}
                  >
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary-500)' }}>
                        {it.codigo}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{it.descricao}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Compatível GEHAKA G650i / G810 / BG1000
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'monospace' }}>{it.unidadeMedida || 'UN'}</span></td>
                    <td>
                      <span className={`status-badge ${it.tipoItem === 'ProdutoPeca' ? 'neutro' : 'ativo'}`}>
                        {it.tipoItem === 'ProdutoPeca' ? 'NF-e (Produto)' : 'NFS-e (Serviço)'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '13.5px', color: saldoFis > 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)' }}>
                        {saldoFis.toFixed(4)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ color: 'var(--color-text-muted)' }}>{it.saldoFiscal.toFixed(4)}</span>
                    </td>
                    <td>R$ {it.precoVenda.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${saldoFis > 0 ? 'ativo' : 'inativo'}`}>
                        <span className="rarus-status-dot" />
                        {saldoFis > 0 ? 'Disponível' : 'Esgotado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE TRANSFERÊNCIA (BASEADO EM FORUMALÃRIO DE TRANFERENCIA DE ESTOQUE.JPEG) */}
      {modalTransferencia && (
        <div className="rarus-modal-backdrop" onClick={() => setModalTransferencia(false)}>
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px' }}>
            <div className="card-header">
              <h3 className="card-title">
                Movimento 3.1.03 — Transferência de Local de Estoque (FÍSICO/FISCAL)
              </h3>
            </div>
            <form onSubmit={handleExecutarTransferencia}>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group col-3">
                    <label className="form-label">Identificador</label>
                    <input className="form-input" value="168543" readOnly />
                  </div>
                  <div className="form-group col-3">
                    <label className="form-label">Status</label>
                    <input className="form-input" value="Normal" readOnly />
                  </div>
                  <div className="form-group col-3">
                    <label className="form-label">Série / Nº Movimento</label>
                    <input className="form-input" value="TF - 0000689" readOnly />
                  </div>
                  <div className="form-group col-3">
                    <label className="form-label">Data de Emissão</label>
                    <input className="form-input" value="19/08/2026" readOnly />
                  </div>

                  <div className="form-group col-6">
                    <label className="form-label">Local de Estoque Origem *</label>
                    <select
                      className="form-select"
                      value={transfOrigem}
                      onChange={(e) => setTransfOrigem(e.target.value)}
                    >
                      <option value="est-central">001 - Almoxarifado Central (Matriz)</option>
                      <option value="est-tec-itamar">006 - Estoque Vinicius / Itamar - Rarus</option>
                      <option value="est-tec-caio">015 - Estoque Caio Detz - Rarus</option>
                    </select>
                  </div>

                  <div className="form-group col-6">
                    <label className="form-label">Local de Estoque Destino *</label>
                    <select
                      className="form-select"
                      value={transfDestino}
                      onChange={(e) => setTransfDestino(e.target.value)}
                    >
                      <option value="est-tec-caio">015 - Estoque Caio Detz - Rarus</option>
                      <option value="est-central">001 - Almoxarifado Central (Matriz)</option>
                      <option value="est-tec-itamar">006 - Estoque Vinicius / Itamar - Rarus</option>
                    </select>
                  </div>

                  <div className="form-group col-8">
                    <label className="form-label">Peça a Transferir *</label>
                    <select
                      className="form-select"
                      value={transfPecaCodigo}
                      onChange={(e) => setTransfPecaCodigo(e.target.value)}
                    >
                      <option value="005196">[005196] PCI PRINCIPAL G610I/G650I VERSAO 2.0</option>
                      <option value="004674">[004674] CHICOTE SERIAL E FONTE BK REV.1.00</option>
                      <option value="003957">[003957] CELULA DE CARGA ZEMIG MED BANCADA</option>
                      <option value="005202">[005202] PCI PRINCIPAL G1000</option>
                      <option value="004633">[004633] CONECTOR DC P2 DJK-01 G600/G650</option>
                    </select>
                  </div>

                  <div className="form-group col-4">
                    <label className="form-label">Quantidade *</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={transfQtd}
                      onChange={(e) => setTransfQtd(parseInt(e.target.value, 10) || 1)}
                      required
                    />
                  </div>

                  <div className="form-group col-12">
                    <label className="form-label">Funcionário Solicitante / Responsável</label>
                    <input
                      className="form-input"
                      value={transfFuncionario}
                      onChange={(e) => setTransfFuncionario(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="card-footer" style={{ justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalTransferencia(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONTAGEM DE ESTOQUE (BASEADO EM FORMULÃRIO DE CONTAGEM DE ESTOQUE.JPEG) */}
      {modalContagem && (
        <div className="rarus-modal-backdrop" onClick={() => setModalContagem(false)}>
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="card-header">
              <h3 className="card-title">Contagem de Estoque Físico & Fiscal</h3>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group col-6">
                  <label className="form-label">Filial Até</label>
                  <input className="form-input" defaultValue="1 - RARUS TECNOLOGIA" />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Local de Estoque</label>
                  <select className="form-select">
                    <option>Todos os Locais (Consolidado)</option>
                    <option>001 - Almoxarifado Central (Matriz)</option>
                    <option>015 - Estoque Caio Detz</option>
                  </select>
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Saldo Usado</label>
                  <select
                    className="form-select"
                    value={contagemSaldoUsado}
                    onChange={(e) => setContagemSaldoUsado(e.target.value)}
                  >
                    <option value="Saldo Físico">Saldo Físico</option>
                    <option value="Saldo Fiscal">Saldo Fiscal</option>
                  </select>
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Tipo Item (SPED)</label>
                  <select className="form-select">
                    <option>Todos</option>
                    <option>00 - Mercadoria para Revenda</option>
                    <option>01 - Matéria-Prima</option>
                    <option>09 - Serviços</option>
                  </select>
                </div>

                <div className="form-group col-12">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="chk-nao-estocaveis"
                      checked={contagemNaoListarNaoEstocaveis}
                      onChange={(e) => setContagemNaoListarNaoEstocaveis(e.target.checked)}
                    />
                    <label htmlFor="chk-nao-estocaveis">Não Listar Produtos Não Estocáveis</label>
                  </div>
                  <div className="checkbox-group" style={{ marginTop: 6 }}>
                    <input
                      type="checkbox"
                      id="chk-nao-fracionados"
                      checked={contagemNaoListarFracionados}
                      onChange={(e) => setContagemNaoListarFracionados(e.target.checked)}
                    />
                    <label htmlFor="chk-nao-fracionados">Não Listar Fracionados</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer" style={{ justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalContagem(false)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={14} />
                <span>Imprimir Relatório de Contagem</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
