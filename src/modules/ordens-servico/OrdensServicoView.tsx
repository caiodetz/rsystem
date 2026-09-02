'use client';

import React, { useState, useEffect } from 'react';
import {
  OrdemServico,
  StatusOS,
  PrioridadeOS,
  OrdemServicoItemEquipamento,
  OrdemServicoItemPeca,
} from '@/core/types';
import { OrdensServicoService } from '@/core/services/ordensServicoService';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { EstoqueService } from '@/core/services/estoqueService';
import {
  ClipboardList,
  Plus,
  Search,
  Save,
  Printer,
  Trash2,
  ArrowLeft,
  Wrench,
  Clock,
  Boxes,
  Layers,
  FileCheck,
  CheckCircle2,
  RotateCcw,
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
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');
  const [busca, setBusca] = useState('');
  const [osSelecionada, setOsSelecionada] = useState<OrdemServico | null>(null);

  // Aba ativa do formulário Card
  const [abaForm, setAbaForm] = useState<
    'geral' | 'equipamentos' | 'produtos' | 'observacoes' | 'complementares' | 'finalizar'
  >('geral');

  // Form State
  const [formIdentificador, setFormIdentificador] = useState('168816');
  const [formNumero, setFormNumero] = useState('0005307');
  const [formStatus, setFormStatus] = useState<StatusOS>('Em Serviço');
  const [formTipoMovto, setFormTipoMovto] = useState('2.4.15 - Ordem de Serviço - Téc. Caio Detz');
  const [formUsrInc, setFormUsrInc] = useState('CAIO DETZ');
  const [formDataEmissao, setFormDataEmissao] = useState('2026-09-02');
  const [formFilial, setFormFilial] = useState('1 - RARUS TECNOLOGIA E SERVICOS');
  const [formLocalEstoque, setFormLocalEstoque] = useState('015 - Estoque Caio Detz - Rarus');
  const [formClienteNome, setFormClienteNome] = useState('C03709 - AgroGrãos Cooperativa');
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
  const [itensEstoqueDisponiveis, setItensEstoqueDisponiveis] = useState<any[]>([]);
  const [pecasLancadas, setPecasLancadas] = useState<OrdemServicoItemPeca[]>([]);

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
  };

  const carregarCatalogos = async () => {
    const eqs = await EquipamentosService.listar();
    setEquipamentosDisponiveis(eqs);
    const its = await EstoqueService.listarItens();
    setItensEstoqueDisponiveis(its);
  };

  const preencherForm = (os: OrdemServico) => {
    setFormNumero(os.numero.padStart(7, '0'));
    setFormStatus(os.status);
    setFormClienteNome(os.clienteNome);
    setFormTecnico(os.tecnicoNome);
    setFormObs(os.descricaoProblema || '');
    setEquipamentosSelecionados(os.equipamentos || []);
    setPecasLancadas(os.pecas || []);
  };

  const handleAbrirNovaOS = () => {
    const maior = ordens.reduce((max, o) => {
      const n = parseInt(o.numero, 10);
      return !isNaN(n) && n > max ? n : max;
    }, 5307);
    const novoNum = String(maior + 1).padStart(7, '0');

    setFormIdentificador(String(168800 + Math.floor(Math.random() * 100)));
    setFormNumero(novoNum);
    setFormStatus('Aberta');
    setFormClienteNome('C03709 - AgroGrãos Cooperativa');
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
    setAbaForm('geral');
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
        estoqueOrigemId: 'est-tec-caio',
      },
    ]);
  };

  const totalServicos = pecasLancadas
    .filter((p) => p.tipoItem === 'Servico')
    .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

  const totalPecas = pecasLancadas
    .filter((p) => p.tipoItem === 'Peca')
    .reduce((sum, p) => sum + p.quantidade * p.valorUnitario, 0);

  // SE UMA OS ESTÁ ABERTA PARA VISUALIZAÇÃO/EDIÇÃO:
  if (osSelecionada) {
    return (
      <div className="rarus-content-scroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setOsSelecionada(null)} type="button">
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Movimentos (OS)</span>
          </button>
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
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Identificador: <strong>{formIdentificador}</strong> • Série: <strong>OS</strong>
            </div>
          </div>

          {/* Barra de Ações (Action Bar) */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={handleAbrirNovaOS} type="button">
              <Plus size={14} />
              <span>Novo</span>
            </button>
            <button className="btn btn-secondary" onClick={handleSalvar} type="button">
              <Save size={14} />
              <span>Salvar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setOsSelecionada(null)} type="button">
              <RotateCcw size={14} />
              <span>Desfazer / Voltar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setOsSelecionada(null)} type="button">
              <Search size={14} />
              <span>Buscar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()} type="button">
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
                  <option value="015 - Estoque Caio Detz - Rarus">015 - Estoque Caio Detz - Rarus</option>
                  <option value="001 - Almoxarifado Central Matriz">001 - Almoxarifado Central Matriz</option>
                  <option value="006 - Estoque Itamar - Rarus">006 - Estoque Itamar - Rarus</option>
                </select>
              </div>
              <div className="form-group col-4">
                <label className="form-label">Cliente / Razão Social *</label>
                <input
                  className="form-input"
                  value={formClienteNome}
                  onChange={(e) => setFormClienteNome(e.target.value)}
                  placeholder="Buscar cliente..."
                />
              </div>

              <div className="form-group col-4">
                <label className="form-label">Técnico Responsável</label>
                <input
                  className="form-input"
                  value={formTecnico}
                  onChange={(e) => setFormTecnico(e.target.value)}
                />
              </div>
              <div className="form-group col-4">
                <label className="form-label">Condição de Pagamento</label>
                <input
                  className="form-input"
                  value={formCondicaoPagto}
                  onChange={(e) => setFormCondicaoPagto(e.target.value)}
                />
              </div>
              <div className="form-group col-2">
                <label className="form-label">Previsão Entrega</label>
                <input
                  type="date"
                  className="form-input"
                  value={formDataEntrega}
                  onChange={(e) => setFormDataEntrega(e.target.value)}
                />
              </div>
              <div className="form-group col-2">
                <label className="form-label">Serviço in loco?</label>
                <div className="checkbox-group">
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
              onClick={() => setAbaForm('geral')}
              type="button"
            >
              1. Abertura / Encerramento
            </button>
            <button
              className={`tab-button ${abaForm === 'equipamentos' ? 'active' : ''}`}
              onClick={() => setAbaForm('equipamentos')}
              type="button"
            >
              2. Equipamentos Vinculados ({equipamentosSelecionados.length})
            </button>
            <button
              className={`tab-button ${abaForm === 'produtos' ? 'active' : ''}`}
              onClick={() => setAbaForm('produtos')}
              type="button"
            >
              3. Produtos & Peças ({pecasLancadas.length})
            </button>
            <button
              className={`tab-button ${abaForm === 'observacoes' ? 'active' : ''}`}
              onClick={() => setAbaForm('observacoes')}
              type="button"
            >
              4. Observações
            </button>
            <button
              className={`tab-button ${abaForm === 'complementares' ? 'active' : ''}`}
              onClick={() => setAbaForm('complementares')}
              type="button"
            >
              5. Campos Complementares (Garantia / NF)
            </button>
            <button
              className={`tab-button ${abaForm === 'finalizar' ? 'active' : ''}`}
              onClick={() => setAbaForm('finalizar')}
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

            {/* Aba 2: Equipamentos Vinculados */}
            {abaForm === 'equipamentos' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <select
                    id="sel-eq-os"
                    className="form-select"
                    style={{ maxWidth: '500px' }}
                  >
                    {equipamentosDisponiveis.map((e) => (
                      <option key={e.id} value={e.id}>
                        [{e.modelo}] Série: {e.numeroSerie} • {e.clienteNome}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const sel = document.getElementById('sel-eq-os') as HTMLSelectElement;
                      if (sel) handleAddEquipamento(sel.value);
                    }}
                  >
                    + Vincular Equipamento à OS
                  </button>
                </div>

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
                    {equipamentosSelecionados.map((eq, idx) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Aba 3: Produtos & Peças */}
            {abaForm === 'produtos' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <select id="sel-peca-os" className="form-select" style={{ maxWidth: '550px' }}>
                    {itensEstoqueDisponiveis.map((item) => (
                      <option key={item.codigo} value={item.codigo}>
                        [{item.codigo}] {item.descricao} - R$ {item.precoVenda.toFixed(2)} ({item.tipoItem === 'ProdutoPeca' ? 'Peça Física' : 'Serviço'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const sel = document.getElementById('sel-peca-os') as HTMLSelectElement;
                      if (sel) handleAddPeca(sel.value);
                    }}
                  >
                    + Lançar Item / Peça
                  </button>
                </div>

                <table className="rarus-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descrição do Item</th>
                      <th>Tipo Fiscal</th>
                      <th>Qtd.</th>
                      <th>Preço Unit.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pecasLancadas.map((p, idx) => (
                      <tr key={idx}>
                        <td><code>{p.codigo}</code></td>
                        <td>{p.descricao}</td>
                        <td>
                          <span className={`status-badge ${p.tipoItem === 'Peca' ? 'neutro' : 'ativo'}`}>
                            {p.tipoItem === 'Peca' ? 'NF-e (Produto)' : 'NFS-e (Serviço)'}
                          </span>
                        </td>
                        <td>{p.quantidade}</td>
                        <td>R$ {p.valorUnitario.toFixed(2)}</td>
                        <td><strong>R$ {(p.quantidade * p.valorUnitario).toFixed(2)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <div className="col-12" style={{ backgroundColor: '#FAFAFA', padding: 20, borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: 12 }}>Resumo Financeiro da OS</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span>Subtotal Serviços (NFS-e):</span>
                    <strong>R$ {totalServicos.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span>Subtotal Peças Físicas (NF-e):</span>
                    <strong>R$ {totalPecas.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-500)' }}>
                    <span>Valor Líquido Total:</span>
                    <span>R$ {(totalServicos + totalPecas).toFixed(2)}</span>
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
        <button className="btn btn-primary" onClick={handleAbrirNovaOS} type="button">
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
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Status OS:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '5px 10px' }}
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

        {/* Grade de Movimentos (Colunas Reais de 'tabela de os.jpeg') */}
        <table className="rarus-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Status OS</th>
              <th>Série</th>
              <th>Data Emissão</th>
              <th>Cód. Cli/For</th>
              <th>Nome Cliente / Fornec</th>
              <th>Valor Líquido</th>
              <th>Status Financeiro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((os) => (
              <tr
                key={os.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setOsSelecionada(os)}
              >
                <td>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-500)' }}>
                    {os.numero.padStart(7, '0')}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      os.status === 'Equipamento Pronto' || os.status === 'Faturada' || os.status === 'Encerrada'
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
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOsSelecionada(os);
                    }}
                  >
                    Abrir OS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
