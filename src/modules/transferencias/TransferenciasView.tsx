'use client';

import React, { useState, useEffect } from 'react';
import { TransferenciaEstoque, ItemTransferenciaEstoque, ItemEstoque, EstoqueLocal } from '@/core/types';
import { EstoqueService } from '@/core/services/estoqueService';
import {
  ArrowLeftRight,
  Plus,
  Search,
  Save,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Check,
  Package,
  Layers,
  FileCheck2,
  Calendar,
  Clock,
  Building,
  AlertCircle,
} from 'lucide-react';

export const TransferenciasView: React.FC = () => {
  const [transferencias, setTransferencias] = useState<TransferenciaEstoque[]>([]);
  const [locais, setLocais] = useState<EstoqueLocal[]>([]);
  const [itensCatalogo, setItensCatalogo] = useState<ItemEstoque[]>([]);
  const [selecionado, setSelecionado] = useState<TransferenciaEstoque | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroLocalOrigem, setFiltroLocalOrigem] = useState('todos');

  // Form State do Movimento (Aberto ou Novo)
  const [abaForm, setAbaForm] = useState<'produtos' | 'observacoes' | 'finalizar'>('produtos');
  const [formIdentificador, setFormIdentificador] = useState('168543');
  const [formNumeroMovimento, setFormNumeroMovimento] = useState('0000689');
  const [formSerie, setFormSerie] = useState('TF');
  const [formTipoMovimento, setFormTipoMovimento] = useState('3.1.03 - Transferencia de Local de Est. (FISICO/FISCAL)');
  const [formStatus, setFormStatus] = useState<'Normal' | 'Pendente' | 'Concluido' | 'Cancelado'>('Normal');
  const [formHoraEmissao, setFormHoraEmissao] = useState('14:43:30');
  const [formDataEmissao, setFormDataEmissao] = useState('2026-08-19');
  const [formUsuarioInc, setFormUsuarioInc] = useState('JANAINA');
  const [formFilialOrigem, setFormFilialOrigem] = useState('1 - RARUS TECNOLOGIA E SERVICOS');
  const [formOrigemLocalId, setFormOrigemLocalId] = useState('est-tec-vinicius');
  const [formOrigemLocalNome, setFormOrigemLocalNome] = useState('006 - Estoque Vinicius - Rarus');
  const [formFilialDestino, setFormFilialDestino] = useState('1 - RARUS TECNOLOGIA E SERVICOS');
  const [formDestinoLocalId, setFormDestinoLocalId] = useState('est-tec-caio');
  const [formDestinoLocalNome, setFormDestinoLocalNome] = useState('015 - Estoque Caio Detz - Rarus');
  const [formFuncionarioCodigo, setFormFuncionarioCodigo] = useState('038');
  const [formFuncionarioNome, setFormFuncionarioNome] = useState('Janaína Sousa');
  const [formObservacoes, setFormObservacoes] = useState('');
  const [formItens, setFormItens] = useState<ItemTransferenciaEstoque[]>([]);

  // Novo Item Row State
  const [novoItemCodigo, setNovoItemCodigo] = useState('');
  const [novoItemQtd, setNovoItemQtd] = useState<number>(1);
  const [novoItemFunc1, setNovoItemFunc1] = useState('Caio Detz');

  useEffect(() => {
    carregarDados();
  }, [busca, filtroStatus, filtroLocalOrigem]);

  const carregarDados = async () => {
    const listTrf = await EstoqueService.listarTransferencias({
      busca: busca || undefined,
      status: filtroStatus !== 'todos' ? filtroStatus : undefined,
      origemLocalId: filtroLocalOrigem !== 'todos' ? filtroLocalOrigem : undefined,
    });
    setTransferencias(listTrf);

    const listLocs = await EstoqueService.listarLocais();
    setLocais(listLocs);

    const listItens = await EstoqueService.listarItens();
    setItensCatalogo(listItens);
  };

  const preencherFormulario = (trf: TransferenciaEstoque) => {
    setFormIdentificador(trf.identificador);
    setFormNumeroMovimento(trf.numeroMovimento);
    setFormSerie(trf.serie);
    setFormTipoMovimento(trf.tipoMovimento);
    setFormStatus(trf.status);
    setFormHoraEmissao(trf.horaEmissao);
    setFormDataEmissao(trf.dataEmissao);
    setFormUsuarioInc(trf.usuarioInclusao);
    setFormFilialOrigem(trf.filialOrigem);
    setFormOrigemLocalId(trf.origemLocalId);
    setFormOrigemLocalNome(trf.origemLocalNome);
    setFormFilialDestino(trf.filialDestino);
    setFormDestinoLocalId(trf.destinoLocalId);
    setFormDestinoLocalNome(trf.destinoLocalNome);
    setFormFuncionarioCodigo(trf.funcionarioCodigo);
    setFormFuncionarioNome(trf.funcionarioNome);
    setFormObservacoes(trf.observacoes || '');
    setFormItens(trf.itens);
    setAbaForm('produtos');
  };

  const handleRowClick = (trf: TransferenciaEstoque) => {
    if (selectedRowId === trf.id) {
      preencherFormulario(trf);
      setSelecionado(trf);
    } else {
      setSelectedRowId(trf.id);
    }
  };

  const handleAbrirNova = () => {
    const now = new Date();
    const hora = now.toTimeString().split(' ')[0];
    const data = now.toISOString().split('T')[0];
    const nextId = String(168540 + transferencias.length + 1);
    const nextNum = String(transferencias.length + 690).padStart(7, '0');

    setFormIdentificador(nextId);
    setFormNumeroMovimento(nextNum);
    setFormSerie('TF');
    setFormTipoMovimento('3.1.03 - Transferencia de Local de Est. (FISICO/FISCAL)');
    setFormStatus('Normal');
    setFormHoraEmissao(hora);
    setFormDataEmissao(data);
    setFormUsuarioInc('CAIO DETZ');
    setFormFilialOrigem('1 - RARUS TECNOLOGIA E SERVICOS');
    setFormOrigemLocalId(locais[0]?.id || 'est-central');
    setFormOrigemLocalNome(locais[0]?.nome || '001 - Almoxarifado Central - Matriz');
    setFormFilialDestino('1 - RARUS TECNOLOGIA E SERVICOS');
    setFormDestinoLocalId(locais[1]?.id || 'est-tec-itamar');
    setFormDestinoLocalNome(locais[1]?.nome || '002 - Estoque Itamar Soares - Rarus');
    setFormFuncionarioCodigo('058');
    setFormFuncionarioNome('Caio Detz');
    setFormObservacoes('');
    setFormItens([]);
    setAbaForm('produtos');

    const fakeNovo: TransferenciaEstoque = {
      id: `trf-${nextId}`,
      identificador: nextId,
      numeroMovimento: nextNum,
      serie: 'TF',
      tipoMovimento: '3.1.03 - Transferencia de Local de Est. (FISICO/FISCAL)',
      status: 'Normal',
      horaEmissao: hora,
      dataEmissao: data,
      usuarioInclusao: 'CAIO DETZ',
      filialOrigem: '1 - RARUS TECNOLOGIA E SERVICOS',
      origemLocalId: locais[0]?.id || 'est-central',
      origemLocalNome: locais[0]?.nome || '001 - Almoxarifado Central - Matriz',
      filialDestino: '1 - RARUS TECNOLOGIA E SERVICOS',
      destinoLocalId: locais[1]?.id || 'est-tec-itamar',
      destinoLocalNome: locais[1]?.nome || '002 - Estoque Itamar Soares - Rarus',
      funcionarioCodigo: '058',
      funcionarioNome: 'Caio Detz',
      observacoes: '',
      itens: [],
      quantidadeTotal: 0,
      pesoTotal: 0,
      valorBruto: 0,
      subTotal: 0,
      valorLiquido: 0,
    };
    setSelecionado(fakeNovo);
  };

  const handleAdicionarItem = () => {
    if (!novoItemCodigo) {
      alert('Selecione um produto / peça para inserir.');
      return;
    }
    const itemCatalogo = itensCatalogo.find((i) => i.codigo === novoItemCodigo);
    if (!itemCatalogo) return;

    const saldoOrigem = itemCatalogo.saldosPorLocal[formOrigemLocalId] ?? 0;
    const seq = String(formItens.length + 1).padStart(3, '0');
    const valorTot = (itemCatalogo.precoVenda || 0) * novoItemQtd;

    const novoItem: ItemTransferenciaEstoque = {
      seq,
      itemCodigo: itemCatalogo.codigo,
      descricao: itemCatalogo.descricao,
      unidade: itemCatalogo.unidadeMedida || 'PC',
      quantidade: novoItemQtd,
      saldoFisicoOrigem: saldoOrigem,
      precoUnitario: itemCatalogo.precoVenda || 0,
      valorItem: valorTot,
      valorDesconto: 0,
      percentualDesconto: 0,
      func1: novoItemFunc1,
    };

    setFormItens([...formItens, novoItem]);
    setNovoItemCodigo('');
    setNovoItemQtd(1);
  };

  const handleRemoverItem = (seq: string) => {
    setFormItens(formItens.filter((it) => it.seq !== seq));
  };

  // Cálculos de totais
  const totalQuantidade = formItens.reduce((acc, cur) => acc + cur.quantidade, 0);
  const totalValorBruto = formItens.reduce((acc, cur) => acc + cur.valorItem, 0);

  const handleSalvar = async () => {
    if (!selecionado) return;
    if (formItens.length === 0) {
      alert('Adicione ao menos um item à transferência antes de salvar.');
      return;
    }

    const trfAtualizada: TransferenciaEstoque = {
      ...selecionado,
      identificador: formIdentificador,
      numeroMovimento: formNumeroMovimento,
      serie: formSerie,
      tipoMovimento: formTipoMovimento,
      status: formStatus,
      horaEmissao: formHoraEmissao,
      dataEmissao: formDataEmissao,
      usuarioInclusao: formUsuarioInc,
      filialOrigem: formFilialOrigem,
      origemLocalId: formOrigemLocalId,
      origemLocalNome: locais.find((l) => l.id === formOrigemLocalId)?.nome || formOrigemLocalNome,
      filialDestino: formFilialDestino,
      destinoLocalId: formDestinoLocalId,
      destinoLocalNome: locais.find((l) => l.id === formDestinoLocalId)?.nome || formDestinoLocalNome,
      funcionarioCodigo: formFuncionarioCodigo,
      funcionarioNome: formFuncionarioNome,
      observacoes: formObservacoes,
      itens: formItens,
      quantidadeTotal: totalQuantidade,
      pesoTotal: 0,
      valorBruto: totalValorBruto,
      subTotal: totalValorBruto,
      valorLiquido: totalValorBruto,
    };

    await EstoqueService.salvarTransferencia(trfAtualizada);
    alert(`Transferência TF-${formNumeroMovimento} salva com sucesso!`);
    await carregarDados();
    setSelecionado(trfAtualizada);
  };

  const handleEfetivar = async () => {
    if (!selecionado) return;
    if (confirm(`Deseja efetivar a transferência TF-${formNumeroMovimento}? As peças serão abatidas de ${formOrigemLocalNome} e transferidas para ${formDestinoLocalNome}.`)) {
      const res = await EstoqueService.efetivarTransferencia(selecionado.id);
      alert(res.mensagem);
      setFormStatus('Concluido');
      await carregarDados();
    }
  };

  const handleCancelarMovimento = async () => {
    if (!selecionado) return;
    if (confirm(`Deseja cancelar o movimento TF-${formNumeroMovimento}?`)) {
      const res = await EstoqueService.cancelarTransferencia(selecionado.id);
      alert(res.mensagem);
      setFormStatus('Cancelado');
      await carregarDados();
    }
  };

  // =========================================================================
  // MODO 1: TELA CHEIA (VISUALIZANDO / EDITANDO MOVIMENTO DE TRANSFERÊNCIA)
  // =========================================================================
  if (selecionado) {
    return (
      <div className="rarus-content-scroll rarus-fullscreen-view">
        {/* Barra Superior de Retorno */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setSelecionado(null)} type="button">
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Transferências</span>
          </button>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Movimento em Tela Cheia • ID <strong>{formIdentificador}</strong> • Doc Nº <strong>{formNumeroMovimento}</strong>
          </span>
        </div>

        {/* CONTAINER DO CARD (BASEADO NO DESIGN SYSTEM & FORUMALÃRIO DE TRANSFERÊNCIA DE ESTOQUE.JPEG) */}
        <div className="card-container">
          {/* Header */}
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 className="card-title">
                Visualizando Movimento... — Transferência Nº {formNumeroMovimento} (Série: {formSerie})
              </h2>
              <span className={`status-badge ${formStatus === 'Concluido' ? 'ativo' : formStatus === 'Cancelado' ? 'inativo' : 'pendente'}`}>
                <span className="rarus-status-dot" />
                {formStatus === 'Concluido' ? 'Efetivado' : formStatus === 'Normal' ? 'Normal / Aberto' : formStatus}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Identificador: <strong>{formIdentificador}</strong> • Hora: <strong>{formHoraEmissao}</strong> • Inc: <strong>{formUsuarioInc}</strong>
            </div>
          </div>

          {/* Barra de Ações do Movimento */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={handleAbrirNova} type="button">
              <Plus size={14} />
              <span>Novo</span>
            </button>
            <button className="btn btn-secondary" onClick={handleSalvar} type="button">
              <Save size={14} />
              <span>Salvar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setSelecionado(null)} type="button">
              <ArrowLeft size={14} />
              <span>Fechar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()} type="button">
              <Printer size={14} />
              <span>Imprimir Guia</span>
            </button>
            {formStatus !== 'Concluido' && (
              <button
                className="btn btn-primary"
                onClick={handleEfetivar}
                type="button"
                style={{ backgroundColor: 'var(--status-success-text)' }}
              >
                <Check size={14} />
                <span>Efetivar Baixa</span>
              </button>
            )}
            {formStatus !== 'Cancelado' && (
              <button className="btn btn-danger" onClick={handleCancelarMovimento} type="button">
                <Trash2 size={14} />
                <span>Cancelar Movto</span>
              </button>
            )}
          </div>

          {/* Cabeçalho de Dados do Movimento (Fiel à imagem de referência) */}
          <div className="card-body" style={{ paddingBottom: 0 }}>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group col-2">
                <label className="form-label">Identificador</label>
                <input className="form-input" value={formIdentificador} readOnly />
              </div>
              <div className="form-group col-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Concluido">Efetivado / Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div className="form-group col-2">
                <label className="form-label">Hora Emis.</label>
                <input
                  className="form-input"
                  value={formHoraEmissao}
                  onChange={(e) => setFormHoraEmissao(e.target.value)}
                />
              </div>
              <div className="form-group col-1">
                <label className="form-label">Série</label>
                <input
                  className="form-input"
                  value={formSerie}
                  onChange={(e) => setFormSerie(e.target.value)}
                />
              </div>
              <div className="form-group col-2">
                <label className="form-label">Nº do Movimento</label>
                <input
                  className="form-input"
                  value={formNumeroMovimento}
                  onChange={(e) => setFormNumeroMovimento(e.target.value)}
                />
              </div>
              <div className="form-group col-3">
                <label className="form-label">Data de Emissão</label>
                <input
                  type="date"
                  className="form-input"
                  value={formDataEmissao}
                  onChange={(e) => setFormDataEmissao(e.target.value)}
                />
              </div>

              <div className="form-group col-9">
                <label className="form-label">Tipo do Movto</label>
                <input
                  className="form-input"
                  value={formTipoMovimento}
                  onChange={(e) => setFormTipoMovimento(e.target.value)}
                />
              </div>
              <div className="form-group col-3">
                <label className="form-label">Usr Inc</label>
                <input className="form-input" value={formUsuarioInc} readOnly />
              </div>
            </div>

            {/* Box Seção Geral (Filiais & Locais de Estoque) */}
            <div
              style={{
                background: 'var(--color-bg-base)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 8 }}>
                Origem e Destino da Transferência
              </div>
              <div className="form-grid">
                <div className="form-group col-3">
                  <label className="form-label">Filial Origem</label>
                  <input className="form-input" value={formFilialOrigem} readOnly />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Local de Estoque (Origem) *</label>
                  <select
                    className="form-select"
                    value={formOrigemLocalId}
                    onChange={(e) => {
                      setFormOrigemLocalId(e.target.value);
                      const loc = locais.find((l) => l.id === e.target.value);
                      if (loc) setFormOrigemLocalNome(loc.nome);
                    }}
                  >
                    {locais.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nome} ({l.tipo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-3">
                  <label className="form-label">Filial Destino</label>
                  <input className="form-input" value={formFilialDestino} readOnly />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Local de Destino *</label>
                  <select
                    className="form-select"
                    value={formDestinoLocalId}
                    onChange={(e) => {
                      setFormDestinoLocalId(e.target.value);
                      const loc = locais.find((l) => l.id === e.target.value);
                      if (loc) setFormDestinoLocalNome(loc.nome);
                    }}
                  >
                    {locais.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nome} ({l.tipo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-2">
                  <label className="form-label">Cód. Func.</label>
                  <input
                    className="form-input"
                    value={formFuncionarioCodigo}
                    onChange={(e) => setFormFuncionarioCodigo(e.target.value)}
                  />
                </div>
                <div className="form-group col-10">
                  <label className="form-label">Funcionário Solicitante / Responsável</label>
                  <input
                    className="form-input"
                    value={formFuncionarioNome}
                    onChange={(e) => setFormFuncionarioNome(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Abas Inferiores do Movimento (Fiel à imagem real) */}
          <div className="tabs-navigation">
            <button
              className={`tab-button ${abaForm === 'produtos' ? 'active' : ''}`}
              onClick={() => setAbaForm('produtos')}
              type="button"
            >
              1. Produtos / Peças ({formItens.length})
            </button>
            <button
              className={`tab-button ${abaForm === 'observacoes' ? 'active' : ''}`}
              onClick={() => setAbaForm('observacoes')}
              type="button"
            >
              2. Observações & Motivo
            </button>
            <button
              className={`tab-button ${abaForm === 'finalizar' ? 'active' : ''}`}
              onClick={() => setAbaForm('finalizar')}
              type="button"
            >
              3. Finalização & Efetivação
            </button>
          </div>

          {/* Conteúdo da Aba */}
          <div className="card-body">
            {/* ABA 1: PRODUTOS / PEÇAS */}
            {abaForm === 'produtos' && (
              <div>
                {/* Linha de Inserção Rápida de Item */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 10,
                    marginBottom: 14,
                    padding: '12px 14px',
                    background: 'var(--color-bg-base)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <div style={{ flex: 2 }}>
                    <label className="form-label">Selecionar Produto / Peça do Catálogo</label>
                    <select
                      className="form-select"
                      value={novoItemCodigo}
                      onChange={(e) => setNovoItemCodigo(e.target.value)}
                    >
                      <option value="">-- Selecione uma peça para transferir --</option>
                      {itensCatalogo.map((it) => {
                        const saldo = it.saldosPorLocal[formOrigemLocalId] ?? 0;
                        return (
                          <option key={it.id} value={it.codigo}>
                            {it.codigo} - {it.descricao} (Saldo Origem: {saldo} {it.unidadeMedida})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div style={{ width: '100px' }}>
                    <label className="form-label">Quantidade</label>
                    <input
                      type="number"
                      min={1}
                      className="form-input"
                      value={novoItemQtd}
                      onChange={(e) => setNovoItemQtd(Number(e.target.value) || 1)}
                    />
                  </div>

                  <div style={{ width: '160px' }}>
                    <label className="form-label">Técnico (Func 1)</label>
                    <input
                      className="form-input"
                      value={novoItemFunc1}
                      onChange={(e) => setNovoItemFunc1(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAdicionarItem}
                    style={{ height: '36px' }}
                  >
                    <Plus size={14} />
                    <span>Inserir Ítem</span>
                  </button>
                </div>

                {/* Tabela Idêntica ao forumalãrio de tranferencia de estoque.jpeg */}
                <div className="rarus-table-container">
                  <table className="rarus-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Seq.</th>
                        <th style={{ width: 90 }}>Código</th>
                        <th>Descrição</th>
                        <th style={{ width: 60 }}>Unid.</th>
                        <th style={{ width: 90, textAlign: 'right' }}>Quantidade</th>
                        <th style={{ width: 100, textAlign: 'right' }}>Saldo Físico</th>
                        <th style={{ width: 90, textAlign: 'right' }}>Preço Unit.</th>
                        <th style={{ width: 90, textAlign: 'right' }}>Vlr. Ítem</th>
                        <th style={{ width: 90 }}>Func 1</th>
                        <th style={{ width: 90 }}>Func 2</th>
                        <th style={{ width: 50, textAlign: 'center' }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formItens.length === 0 ? (
                        <tr>
                          <td colSpan={11} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                            Nenhum item adicionado a esta transferência. Utilize o campo acima para adicionar peças.
                          </td>
                        </tr>
                      ) : (
                        formItens.map((it) => (
                          <tr key={it.seq}>
                            <td><code>{it.seq}</code></td>
                            <td><strong>{it.itemCodigo}</strong></td>
                            <td>{it.descricao}</td>
                            <td>{it.unidade}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-primary-500)' }}>
                              {it.quantidade.toFixed(4)}
                            </td>
                            <td style={{ textAlign: 'right', color: it.saldoFisicoOrigem < it.quantidade ? 'var(--status-danger-text)' : 'inherit' }}>
                              {it.saldoFisicoOrigem.toFixed(4)}
                            </td>
                            <td style={{ textAlign: 'right' }}>{it.precoUnitario.toFixed(2)}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>{it.valorItem.toFixed(2)}</td>
                            <td>{it.func1 || '-'}</td>
                            <td>{it.func2 || '-'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ padding: '2px 6px', color: 'var(--status-danger-text)' }}
                                onClick={() => handleRemoverItem(it.seq)}
                                title="Excluir item da transferência"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Barra Inferior de Totais (Fiel à imagem de referência) */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 16,
                    padding: '14px 18px',
                    background: 'var(--color-bg-base)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 24, fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Qtde Total: </span>
                      <strong style={{ fontSize: '14px', color: 'var(--color-primary-500)' }}>
                        {totalQuantidade.toFixed(3)}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Peso Total: </span>
                      <strong>0,000 kg</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Itens Transferidos: </span>
                      <strong>{formItens.length} itens</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 20, fontSize: '13px', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Valor Bruto: </span>
                      <strong>R$ {totalValorBruto.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Sub-Total: </span>
                      <strong>R$ {totalValorBruto.toFixed(2)}</strong>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      Valor Líquido: R$ {totalValorBruto.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: OBSERVAÇÕES */}
            {abaForm === 'observacoes' && (
              <div className="form-grid">
                <div className="form-group col-12">
                  <label className="form-label">Justificativa e Motivo da Transferência de Estoque</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    value={formObservacoes}
                    onChange={(e) => setFormObservacoes(e.target.value)}
                    placeholder="Informe a finalidade da transferência (ex: reposição de maleta técnica, atendimento emergencial de OS, remessa para bancada matriz)..."
                  />
                </div>
              </div>
            )}

            {/* ABA 3: FINALIZAR */}
            {abaForm === 'finalizar' && (
              <div className="form-grid">
                <div className="form-group col-4">
                  <label className="form-label">Data de Despacho Físico</label>
                  <input type="date" className="form-input" defaultValue="2026-08-19" />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Responsável pelo Transporte / Portador</label>
                  <input className="form-input" defaultValue="Frota Própria RARUS (Veículo 02)" />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Previsão de Recebimento</label>
                  <input type="date" className="form-input" defaultValue="2026-08-20" />
                </div>

                <div className="form-group col-12" style={{ marginTop: 12 }}>
                  <div
                    style={{
                      padding: 16,
                      background: 'var(--color-primary-50)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <CheckCircle2 size={20} color="var(--color-primary-500)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary-500)' }}>
                        Efetivação Contábil & Metrológica
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Ao clicar em "Efetivar Baixa", o sistema abaterá automaticamente o saldo físico do local de origem ({formOrigemLocalNome}) e creditará no estoque destino ({formDestinoLocalNome}).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé de Auditoria */}
          <div className="card-footer">
            <div>
              Usuário Inc: <strong>{formUsuarioInc}</strong> • Filial Origem: <strong>{formFilialOrigem}</strong>
            </div>
            <div>
              Status Movto: <strong>{formStatus}</strong> • Emissão: <strong>{formDataEmissao} às {formHoraEmissao}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODO 2: LISTAGEM PRINCIPAL DE TRANSFERÊNCIAS (PADRÃO IDÊNTICO À OS)
  // =========================================================================
  const totalMes = transferencias.length;
  const pendentes = transferencias.filter((t) => t.status === 'Pendente').length;
  const concluidas = transferencias.filter((t) => t.status === 'Normal' || t.status === 'Concluido').length;
  const totalPecasMovimentadas = transferencias.reduce((acc, cur) => acc + cur.quantidadeTotal, 0);

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Movimentos de Transferência de Estoque (Físico / Fiscal)</h1>
          <p>Gestão e rastreabilidade de transferências de peças entre almoxarifado central e técnicos de campo</p>
        </div>
        <button className="btn btn-primary" onClick={handleAbrirNova} type="button">
          <Plus size={15} />
          <span>Nova Transferência</span>
        </button>
      </div>

      {/* KPI Cards (Padrão Oficial 28px Display) */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Transferências no Mês</span>
            <div className="rarus-kpi-icon-box" style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-500)' }}>
              <ArrowLeftRight size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{totalMes}</div>
          <div className="rarus-kpi-trend trend-neutral">Movimentos registrados</div>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Pendentes / Trânsito</span>
            <div className="rarus-kpi-icon-box" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value" style={{ color: '#D97706' }}>{pendentes}</div>
          <div className="rarus-kpi-trend" style={{ color: '#D97706' }}>Aguardando recebimento</div>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Concluídas / Efetivadas</span>
            <div className="rarus-kpi-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value" style={{ color: '#059669' }}>{concluidas}</div>
          <div className="rarus-kpi-trend trend-up">Baixas computadas no estoque</div>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Peças Movimentadas</span>
            <div className="rarus-kpi-icon-box" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <Package size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{totalPecasMovimentadas.toFixed(0)}</div>
          <div className="rarus-kpi-trend trend-neutral">Unidades transferidas</div>
        </div>
      </div>

      {/* Painel Datagrid com Filtros e Tabela */}
      <div className="rarus-datagrid-container">
        {/* Barra de Busca e Filtros */}
        <div className="rarus-filter-toolbar">
          <div className="rarus-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por Nº Movimento, Código, Peça ou Funcionário..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              className="form-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{ minWidth: '150px', height: '38px', fontSize: '13px' }}
            >
              <option value="todos">Todos os Status</option>
              <option value="Normal">Normal / Aberto</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluido">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <select
              className="form-select"
              value={filtroLocalOrigem}
              onChange={(e) => setFiltroLocalOrigem(e.target.value)}
              style={{ minWidth: '220px', height: '38px', fontSize: '13px' }}
            >
              <option value="todos">Todas as Origens</option>
              {locais.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela com Rolagem Horizontal e Interação em Dois Cliques */}
        <div className="rarus-table-container">
          <table className="rarus-table">
            <thead>
              <tr>
                <th style={{ width: 110 }}>Nº Movimento</th>
                <th style={{ width: 140 }}>Data / Hora</th>
                <th>Tipo de Movimento</th>
                <th>Estoque Origem</th>
                <th>Estoque Destino</th>
                <th>Funcionário Solicitante</th>
                <th style={{ textAlign: 'right' }}>Qtd. Peças</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transferencias.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                    Nenhum movimento de transferência encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                transferencias.map((trf) => {
                  const isSelected = selectedRowId === trf.id;
                  return (
                    <tr
                      key={trf.id}
                      className={isSelected ? 'rarus-row-selected' : ''}
                      onClick={() => handleRowClick(trf)}
                      title={isSelected ? 'Clique novamente para abrir o movimento em tela cheia' : 'Clique para selecionar'}
                    >
                      <td>
                        <strong style={{ color: 'var(--color-primary-500)' }}>
                          {trf.serie}-{trf.numeroMovimento}
                        </strong>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          ID {trf.identificador}
                        </div>
                      </td>
                      <td>
                        <div>{trf.dataEmissao}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{trf.horaEmissao}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px', fontWeight: 500 }}>
                          {trf.tipoMovimento}
                        </span>
                      </td>
                      <td>
                        <strong>{trf.origemLocalNome}</strong>
                      </td>
                      <td>
                        <strong>{trf.destinoLocalNome}</strong>
                      </td>
                      <td>
                        <div>{trf.funcionarioNome}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          Cód. {trf.funcionarioCodigo} • Inc: {trf.usuarioInclusao}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {trf.quantidadeTotal.toFixed(0)} un.
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {trf.itens.length} itens
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge ${trf.status === 'Concluido' ? 'ativo' : trf.status === 'Cancelado' ? 'inativo' : 'pendente'}`}>
                          <span className="rarus-status-dot" />
                          {trf.status === 'Concluido' ? 'Efetivado' : trf.status === 'Normal' ? 'Normal' : trf.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            preencherFormulario(trf);
                            setSelecionado(trf);
                          }}
                        >
                          Abrir Movimento
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
