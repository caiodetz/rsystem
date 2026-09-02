'use client';

import React, { useState, useEffect } from 'react';
import { Cliente, Equipamento, OrdemServico, CertificadoCalibracao } from '@/core/types';
import { ClientesService } from '@/core/services/clientesService';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { OrdensServicoService } from '@/core/services/ordensServicoService';
import { RelatosService } from '@/core/services/relatosService';
import {
  Users,
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  MapPin,
  X,
  ChevronRight,
  ArrowLeft,
  Wrench,
  ClipboardList,
  Award,
  History,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const ClientesView: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [segmentoFiltro, setSegmentoFiltro] = useState<string>('todos');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  // Sub-abas do Perfil 360
  const [aba360, setAba360] = useState<'equipamentos' | 'os' | 'certificados' | 'historico' | 'faturamento'>('equipamentos');

  // Dados do cliente selecionado
  const [equipamentosCliente, setEquipamentosCliente] = useState<Equipamento[]>([]);
  const [osCliente, setOsCliente] = useState<OrdemServico[]>([]);
  const [certificadosCliente, setCertificadosCliente] = useState<CertificadoCalibracao[]>([]);

  // Modais
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [modalNovoEquipamento, setModalNovoEquipamento] = useState(false);

  // Form novo cliente
  const [novoRazaoSocial, setNovoRazaoSocial] = useState('');
  const [novoNomeFantasia, setNovoNomeFantasia] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoCidade, setNovoCidade] = useState('');
  const [novoEstado, setNovoEstado] = useState('SP');
  const [novoSegmento, setNovoSegmento] = useState('Agronegócio / Grãos');
  const [novoObs, setNovoObs] = useState('');

  // Form novo equipamento para o cliente
  const [eqModelo, setEqModelo] = useState('G650i');
  const [eqFabricante, setEqFabricante] = useState('GEHAKA');
  const [eqTipo, setEqTipo] = useState('Medidor de Umidade GEHAKA');
  const [eqSerie, setEqSerie] = useState('');
  const [eqPatrimonio, setEqPatrimonio] = useState('');
  const [eqFaixa, setEqFaixa] = useState('8 a 50 %');
  const [eqResolucao, setEqResolucao] = useState('0,1 %');
  const [eqLacreNovo, setEqLacreNovo] = useState('');
  const [eqSeloNovo, setEqSeloNovo] = useState('');

  useEffect(() => {
    carregarClientes();
  }, [busca, segmentoFiltro]);

  useEffect(() => {
    if (clienteSelecionado) {
      carregarDadosCliente(clienteSelecionado.id);
    }
  }, [clienteSelecionado]);

  const carregarClientes = async () => {
    let itens = await ClientesService.listar(busca);
    if (segmentoFiltro !== 'todos') {
      itens = itens.filter((c) => c.segmento.toLowerCase().includes(segmentoFiltro.toLowerCase()));
    }
    setClientes(itens);
  };

  const carregarDadosCliente = async (clienteId: string) => {
    const eqs = await EquipamentosService.listar({ clienteId });
    setEquipamentosCliente(eqs);

    const ords = await OrdensServicoService.listar({ clienteId });
    setOsCliente(ords);

    const certs = await RelatosService.listarCertificados();
    setCertificadosCliente(certs.filter((c) => c.clienteId === clienteId));
  };

  const handleSalvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoRazaoSocial || !novoCnpj) return;

    await ClientesService.criar({
      codigo: `CLI-${String(clientes.length + 1).padStart(3, '0')}`,
      razaoSocial: novoRazaoSocial,
      nomeFantasia: novoNomeFantasia || novoRazaoSocial,
      cnpj: novoCnpj,
      email: novoEmail,
      telefone: novoTelefone,
      endereco: 'Planta Industrial',
      cidade: novoCidade || 'São Paulo',
      estado: novoEstado,
      cep: '00000-000',
      contatos: [
        {
          id: `cnt-${Date.now()}`,
          nome: 'Gerente da Qualidade',
          cargo: 'Gerente de Planta',
          email: novoEmail,
          telefone: novoTelefone,
        },
      ],
      contatoResponsavel: 'Gerente da Qualidade',
      segmento: novoSegmento,
      observacoesAvulsas: novoObs,
      status: 'Ativo',
    });

    setModalNovoCliente(false);
    setNovoRazaoSocial('');
    setNovoCnpj('');
    carregarClientes();
  };

  const handleSalvarEquipamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado || !eqSerie) return;

    await EquipamentosService.criar({
      clienteId: clienteSelecionado.id,
      clienteNome: clienteSelecionado.nomeFantasia,
      numeroSerie: eqSerie,
      fabricante: eqFabricante,
      modelo: eqModelo,
      tipoEquipamento: eqTipo,
      faixaMedicao: eqFaixa,
      resolucao: eqResolucao,
      patrimonio: eqPatrimonio,
      lacreNovo: eqLacreNovo,
      seloNovo: eqSeloNovo,
      dataUltimaCalibracao: new Date().toISOString().split('T')[0],
      dataProximaCalibracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Calibrado',
      observacoes: 'Cadastrado diretamente pelo perfil 360º do cliente',
    });

    setModalNovoEquipamento(false);
    setEqSerie('');
    setEqPatrimonio('');
    setEqLacreNovo('');
    setEqSeloNovo('');
    carregarDadosCliente(clienteSelecionado.id);
  };

  // Se um cliente está selecionado, exibe a Visão 360º estilo `cliente exemplo.webp`
  if (clienteSelecionado) {
    return (
      <div className="rarus-content-scroll">
        {/* Barra de Voltar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button
            className="btn-secondary-rarus"
            onClick={() => setClienteSelecionado(null)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Clientes</span>
          </button>
        </div>

        {/* Layout Perfil 360º do Cliente */}
        <div className="rarus-client-360-container">
          {/* Coluna Principal (Esquerda) */}
          <div className="rarus-client-main-col">
            {/* Card de Identidade do Cliente */}
            <div className="rarus-client-header-card">
              <div className="rarus-client-identity">
                <div className="rarus-client-avatar-large">
                  {clienteSelecionado.nomeFantasia.substring(0, 2).toUpperCase()}
                </div>
                <div className="rarus-client-info-names" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h2>{clienteSelecionado.nomeFantasia}</h2>
                    <span className="rarus-status-pill status-ativo">
                      <span className="rarus-status-dot" />
                      {clienteSelecionado.status}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        background: 'var(--rarus-cyan-light)',
                        color: 'var(--rarus-navy)',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      {clienteSelecionado.segmento}
                    </span>
                  </div>
                  <p>{clienteSelecionado.razaoSocial} • CNPJ: {clienteSelecionado.cnpj}</p>
                </div>
              </div>

              {/* Barra de Contatos em Linha */}
              <div className="rarus-client-contacts-bar">
                <div className="rarus-contact-item">
                  <Mail size={14} color="var(--rarus-cyan)" />
                  <span>{clienteSelecionado.email}</span>
                </div>
                <div className="rarus-contact-item">
                  <Phone size={14} color="var(--rarus-cyan)" />
                  <span>{clienteSelecionado.telefone}</span>
                </div>
                <div className="rarus-contact-item">
                  <Users size={14} color="var(--rarus-cyan)" />
                  <span>Resp: {clienteSelecionado.contatoResponsavel}</span>
                </div>
                <div className="rarus-contact-item">
                  <MapPin size={14} color="var(--rarus-cyan)" />
                  <span>{clienteSelecionado.cidade} / {clienteSelecionado.estado}</span>
                </div>
              </div>

              {clienteSelecionado.observacoesAvulsas && (
                <div
                  style={{
                    fontSize: '12px',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <strong>Observações:</strong> {clienteSelecionado.observacoesAvulsas}
                </div>
              )}
            </div>

            {/* Abas Internas 360 */}
            <div className="rarus-client-tabs-nav">
              <button
                className={`rarus-client-tab-btn ${aba360 === 'equipamentos' ? 'active' : ''}`}
                onClick={() => setAba360('equipamentos')}
              >
                Equipamentos ({equipamentosCliente.length})
              </button>
              <button
                className={`rarus-client-tab-btn ${aba360 === 'os' ? 'active' : ''}`}
                onClick={() => setAba360('os')}
              >
                Ordens de Serviço ({osCliente.length})
              </button>
              <button
                className={`rarus-client-tab-btn ${aba360 === 'certificados' ? 'active' : ''}`}
                onClick={() => setAba360('certificados')}
              >
                Certificados ({certificadosCliente.length})
              </button>
              <button
                className={`rarus-client-tab-btn ${aba360 === 'historico' ? 'active' : ''}`}
                onClick={() => setAba360('historico')}
              >
                Histórico & Interações
              </button>
              <button
                className={`rarus-client-tab-btn ${aba360 === 'faturamento' ? 'active' : ''}`}
                onClick={() => setAba360('faturamento')}
              >
                Faturamento & Propostas
              </button>
            </div>

            {/* Conteúdo da Aba Equipamentos */}
            {aba360 === 'equipamentos' && (
              <div className="rarus-datagrid-container">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                    Parque de Equipamentos do Cliente
                  </h3>
                  <button
                    className="btn-primary-rarus"
                    onClick={() => setModalNovoEquipamento(true)}
                    type="button"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <Plus size={14} />
                    <span>Novo Equipamento</span>
                  </button>
                </div>

                <table className="rarus-table">
                  <thead>
                    <tr>
                      <th>Modelo / Tipo</th>
                      <th>Nº Série</th>
                      <th>Patrimônio</th>
                      <th>Lacre Novo</th>
                      <th>Selo Novo</th>
                      <th>Última Calibração</th>
                      <th>Próxima Calibração</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipamentosCliente.map((eq) => (
                      <tr key={eq.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{eq.modelo}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {eq.fabricante} • {eq.tipoEquipamento}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{eq.numeroSerie}</span>
                        </td>
                        <td>{eq.patrimonio || 'S/N'}</td>
                        <td>{eq.lacreNovo || '-'}</td>
                        <td>{eq.seloNovo || '-'}</td>
                        <td>{eq.dataUltimaCalibracao}</td>
                        <td style={{ fontWeight: 600 }}>{eq.dataProximaCalibracao}</td>
                        <td>
                          <span
                            className={`rarus-status-pill ${
                              eq.status === 'Calibrado' ? 'status-calibrado' : 'status-vencido'
                            }`}
                          >
                            <span className="rarus-status-dot" />
                            {eq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Conteúdo da Aba Ordens de Serviço */}
            {aba360 === 'os' && (
              <div className="rarus-datagrid-container">
                <table className="rarus-table">
                  <thead>
                    <tr>
                      <th>Nº OS</th>
                      <th>Tipo de Serviço</th>
                      <th>Equipamentos Vinculados</th>
                      <th>Técnico</th>
                      <th>Abertura</th>
                      <th>Previsão</th>
                      <th>Status</th>
                      <th>Valor Geral</th>
                    </tr>
                  </thead>
                  <tbody>
                    {osCliente.map((os) => (
                      <tr key={os.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--rarus-cyan)' }}>
                            #{os.numero}
                          </span>
                        </td>
                        <td>{os.tipo}</td>
                        <td>
                          {os.equipamentos.map((e) => e.modelo).join(', ') || '1 Equipamento'}
                        </td>
                        <td>{os.tecnicoNome}</td>
                        <td>{os.dataAbertura}</td>
                        <td>{os.dataPrevisao}</td>
                        <td>
                          <span className="rarus-status-pill status-alerta">
                            <span className="rarus-status-dot" />
                            {os.status}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--rarus-navy)' }}>
                            R$ {os.valorTotalGeral.toFixed(2)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Conteúdo da Aba Certificados */}
            {aba360 === 'certificados' && (
              <div className="rarus-datagrid-container">
                <table className="rarus-table">
                  <thead>
                    <tr>
                      <th>Certificado Nº</th>
                      <th>OS Vinculada</th>
                      <th>Equipamento</th>
                      <th>Técnico Executor</th>
                      <th>Emissão</th>
                      <th>Validade</th>
                      <th>Autenticidade (Hash)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificadosCliente.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <strong style={{ color: 'var(--rarus-navy)' }}>{c.numero}</strong>
                        </td>
                        <td>#{c.osNumero}</td>
                        <td>
                          {c.equipamentoModelo} ({c.equipamentoSerie})
                        </td>
                        <td>{c.tecnicoNome}</td>
                        <td>{c.dataEmissao}</td>
                        <td style={{ fontWeight: 600 }}>{c.dataValidade}</td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--rarus-cyan)' }}>
                            {c.hashAutenticidade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Conteúdo da Aba Histórico & Timeline */}
            {aba360 === 'historico' && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--rarus-cyan)', marginTop: 6 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px' }}>
                        OS #1045 iniciada em campo pelo Técnico Itamar Soares
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>01/09/2026 às 09:30</div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-main)' }}>
                        Calibração de 2 medidores de umidade Gehaka e 1 balança de precisão na moega central.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--rarus-success)', marginTop: 6 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px' }}>
                        Emissão de Certificado de Calibração 1041-1/25
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>15/02/2025</div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-main)' }}>
                        Certificado emitido e assinado digitalmente. Equipamento em conformidade com critérios de safra.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba Faturamento */}
            {aba360 === 'faturamento' && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Total Faturado no Ano:</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--rarus-navy)' }}>
                    R$ 14.850,00
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Contrato de calibração periódica e assistência técnica para a safra de grãos. Condição padrão: 28 DDL.
                </div>
              </div>
            )}
          </div>

          {/* Coluna Lateral Direita ("Próximos Passos / Checklist" do Exemplo) */}
          <div className="rarus-client-sidebar-col">
            <div className="rarus-next-steps-card">
              <div className="rarus-next-steps-title">
                <span>Próximos Passos & Ações</span>
                <AlertTriangle size={16} color="var(--rarus-warning)" />
              </div>

              <div className="rarus-checklist-list">
                <div className="rarus-checklist-item">
                  <div className="rarus-checklist-num">1</div>
                  <div>
                    <strong>Revisar instrumentos vencendo no próximo 1 ano</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Horizonte comercial preventivo de calibração para safra.
                    </div>
                  </div>
                </div>

                <div className="rarus-checklist-item">
                  <div className="rarus-checklist-num">2</div>
                  <div>
                    <strong>Enviar orçamento de recalibração</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Proposta comercial para os medidores G650i e balança BG1000.
                    </div>
                  </div>
                </div>

                <div className="rarus-checklist-item">
                  <div className="rarus-checklist-num">3</div>
                  <div>
                    <strong>Validar selos e lacres novos</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Conferir numeração apostada pelo técnico Itamar Soares.
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary-rarus"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => alert(`Abertura de nova OS direcionada para: ${clienteSelecionado.nomeFantasia}`)}
              >
                <Plus size={15} />
                <span>Abrir Nova OS para este Cliente</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Novo Equipamento Vinculado Diretamente a este Cliente */}
        {modalNovoEquipamento && (
          <div className="rarus-modal-backdrop" onClick={() => setModalNovoEquipamento(false)}>
            <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="rarus-modal-header">
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                  Novo Equipamento para: {clienteSelecionado.nomeFantasia}
                </h3>
              </div>
              <form onSubmit={handleSalvarEquipamento}>
                <div className="rarus-modal-body">
                  <div className="rarus-form-row">
                    <div className="rarus-form-group">
                      <label>Cliente (Vinculado Automaticamente):</label>
                      <input value={`${clienteSelecionado.nomeFantasia} (${clienteSelecionado.cnpj})`} disabled />
                    </div>
                    <div className="rarus-form-group">
                      <label>Tipo de Equipamento:</label>
                      <select value={eqTipo} onChange={(e) => setEqTipo(e.target.value)}>
                        <option value="Medidor de Umidade GEHAKA">Medidor de Umidade GEHAKA</option>
                        <option value="Balança de Precisão">Balança de Precisão</option>
                        <option value="Multigás">Detector Multigás</option>
                        <option value="pHmetro">pHmetro Industrial</option>
                      </select>
                    </div>
                  </div>

                  <div className="rarus-form-row">
                    <div className="rarus-form-group">
                      <label>Fabricante:</label>
                      <input value={eqFabricante} onChange={(e) => setEqFabricante(e.target.value)} required />
                    </div>
                    <div className="rarus-form-group">
                      <label>Modelo:</label>
                      <input value={eqModelo} onChange={(e) => setEqModelo(e.target.value)} required />
                    </div>
                  </div>

                  <div className="rarus-form-row">
                    <div className="rarus-form-group">
                      <label>Número de Série *:</label>
                      <input
                        placeholder="Ex: GEH-2025-00123"
                        value={eqSerie}
                        onChange={(e) => setEqSerie(e.target.value)}
                        required
                      />
                    </div>
                    <div className="rarus-form-group">
                      <label>Patrimônio do Cliente:</label>
                      <input
                        placeholder="Ex: PAT-AGRO-450"
                        value={eqPatrimonio}
                        onChange={(e) => setEqPatrimonio(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rarus-form-row">
                    <div className="rarus-form-group">
                      <label>Lacre Novo:</label>
                      <input
                        placeholder="Ex: LAC-2026-1050"
                        value={eqLacreNovo}
                        onChange={(e) => setEqLacreNovo(e.target.value)}
                      />
                    </div>
                    <div className="rarus-form-group">
                      <label>Selo Novo (Inmetro / RARUS):</label>
                      <input
                        placeholder="Ex: SELO-INM-66201"
                        value={eqSeloNovo}
                        onChange={(e) => setEqSeloNovo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="rarus-modal-footer">
                  <button
                    type="button"
                    className="btn-secondary-rarus"
                    onClick={() => setModalNovoEquipamento(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary-rarus">
                    Salvar Equipamento no Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Listagem Geral dos Clientes (Inspirado no DataGrid de exemplo para tela de OS e CLIENTES.webp)
  return (
    <div className="rarus-content-scroll">
      {/* Header do Módulo */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Clientes & Plantas Industriais</h1>
          <p>Gestão comercial, parque de equipamentos vinculados e rastreabilidade de serviços</p>
        </div>
        <button className="btn-primary-rarus" onClick={() => setModalNovoCliente(true)} type="button">
          <Plus size={15} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Cards de Métricas Superiores */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Total de Clientes Ativos</span>
            <div className="rarus-kpi-icon-box">
              <Users size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{clientes.length}</div>
          <span className="rarus-kpi-trend trend-up">↑ 12% no trimestre</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Equipamentos no Parque</span>
            <div className="rarus-kpi-icon-box">
              <Wrench size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">5</div>
          <span className="rarus-kpi-trend trend-neutral">Linha GEHAKA & Balanças</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Ordens de Serviço em Aberto</span>
            <div className="rarus-kpi-icon-box">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">2</div>
          <span className="rarus-kpi-trend trend-up">1 em bancada, 1 em campo</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Conformidade Metrológica</span>
            <div className="rarus-kpi-icon-box">
              <Award size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">100%</div>
          <span className="rarus-kpi-trend trend-up">Padrões dentro da tolerância</span>
        </div>
      </div>

      {/* Grid com Abas de Contadores e Toolbar */}
      <div className="rarus-datagrid-container">
        {/* Abas de Filtros de Segmento */}
        <div className="rarus-grid-header-tabs">
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'todos' ? 'active' : ''}`}
            onClick={() => setSegmentoFiltro('todos')}
          >
            <span>Todos os Clientes</span>
            <span className="count">{clientes.length}</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'grãos' ? 'active' : ''}`}
            onClick={() => setSegmentoFiltro('grãos')}
          >
            <span>Agronegócio / Grãos</span>
            <span className="count">2</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'farma' ? 'active' : ''}`}
            onClick={() => setSegmentoFiltro('farma')}
          >
            <span>Farmacêutico / Lab</span>
            <span className="count">1</span>
          </button>
        </div>

        {/* Toolbar de Busca */}
        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--text-muted)" />
            <input
              placeholder="Buscar por razão social, nome fantasia, CNPJ..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* DataGrid de Clientes */}
        <table className="rarus-table">
          <thead>
            <tr>
              <th>Cliente / Razão Social</th>
              <th>CNPJ</th>
              <th>Segmento Industrial</th>
              <th>Localização</th>
              <th>Contato Técnico</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => {
              const initials = c.nomeFantasia.substring(0, 2).toUpperCase();
              return (
                <tr
                  key={c.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setClienteSelecionado(c)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        className="rarus-table-avatar"
                        style={{ background: 'linear-gradient(135deg, var(--rarus-navy), var(--rarus-cyan))' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {c.nomeFantasia}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          {c.razaoSocial}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{c.cnpj}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: 'var(--rarus-navy)',
                        background: 'var(--rarus-cyan-light)',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {c.segmento}
                    </span>
                  </td>
                  <td>
                    {c.cidade} / {c.estado}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.contatoResponsavel}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.telefone}</div>
                  </td>
                  <td>
                    <span className="rarus-status-pill status-ativo">
                      <span className="rarus-status-dot" />
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary-rarus"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setClienteSelecionado(c);
                      }}
                    >
                      <span>Perfil 360º</span>
                      <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Cliente */}
      {modalNovoCliente && (
        <div className="rarus-modal-backdrop" onClick={() => setModalNovoCliente(false)}>
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="rarus-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                Cadastrar Novo Cliente Industrial
              </h3>
            </div>
            <form onSubmit={handleSalvarCliente}>
              <div className="rarus-modal-body">
                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Razão Social *:</label>
                    <input
                      required
                      placeholder="Ex: Cooperativa Agrícola do Sul Ltda"
                      value={novoRazaoSocial}
                      onChange={(e) => setNovoRazaoSocial(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Nome Fantasia:</label>
                    <input
                      placeholder="Ex: AgroSul"
                      value={novoNomeFantasia}
                      onChange={(e) => setNovoNomeFantasia(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>CNPJ *:</label>
                    <input
                      required
                      placeholder="00.000.000/0000-00"
                      value={novoCnpj}
                      onChange={(e) => setNovoCnpj(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Segmento Industrial:</label>
                    <select
                      value={novoSegmento}
                      onChange={(e) => setNovoSegmento(e.target.value)}
                    >
                      <option value="Agronegócio / Grãos">Agronegócio / Grãos</option>
                      <option value="Farmacêutico / Laboratório">Farmacêutico / Laboratório</option>
                      <option value="Alimentos / Moagem">Alimentos / Moagem</option>
                      <option value="Químico / Petroquímico">Químico / Petroquímico</option>
                    </select>
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>E-mail:</label>
                    <input
                      type="email"
                      placeholder="qualidade@empresa.com"
                      value={novoEmail}
                      onChange={(e) => setNovoEmail(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Telefone / WhatsApp:</label>
                    <input
                      placeholder="(19) 99999-9999"
                      value={novoTelefone}
                      onChange={(e) => setNovoTelefone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Cidade:</label>
                    <input
                      placeholder="Ex: Ribeirão Preto"
                      value={novoCidade}
                      onChange={(e) => setNovoCidade(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Estado:</label>
                    <input
                      value={novoEstado}
                      onChange={(e) => setNovoEstado(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rarus-form-group">
                  <label>Observações Avulsas:</label>
                  <textarea
                    placeholder="Instruções de acesso, quantidade estimada de equipamentos..."
                    value={novoObs}
                    onChange={(e) => setNovoObs(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="rarus-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-rarus"
                  onClick={() => setModalNovoCliente(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-rarus">
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
