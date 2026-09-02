'use client';

import React, { useState, useEffect } from 'react';
import { Equipamento, StatusEquipamento } from '@/core/types';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { ClientesService } from '@/core/services/clientesService';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  Calendar,
  Layers,
  Shield,
  Tag,
} from 'lucide-react';

export const EquipamentosView: React.FC = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState<Equipamento | null>(null);
  const [modalNovo, setModalNovo] = useState(false);

  // Form State
  const [clienteNome, setClienteNome] = useState('AgroGrãos Cooperativa');
  const [tipoEquipamento, setTipoEquipamento] = useState('Medidor de Umidade GEHAKA');
  const [fabricante, setFabricante] = useState('GEHAKA');
  const [modelo, setModelo] = useState('G650i');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [patrimonio, setPatrimonio] = useState('');
  const [faixaMedicao, setFaixaMedicao] = useState('8 a 50 % Umidade');
  const [resolucao, setResolucao] = useState('0,1 %');
  const [lacreNovo, setLacreNovo] = useState('');
  const [seloNovo, setSeloNovo] = useState('');
  const [servicoAnterior, setServicoAnterior] = useState('');

  useEffect(() => {
    carregar();
  }, [filtroTipo, busca]);

  const carregar = async () => {
    const list = await EquipamentosService.listar({
      tipoEquipamento: filtroTipo !== 'Todos' ? filtroTipo : undefined,
      busca: busca || undefined,
    });
    setEquipamentos(list);
    if (list.length > 0 && !selecionado) {
      setSelecionado(list[0]);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroSerie || !modelo) return;

    await EquipamentosService.criar({
      clienteId: 'cli-1',
      clienteNome,
      numeroSerie,
      fabricante,
      modelo,
      tipoEquipamento,
      faixaMedicao,
      resolucao,
      patrimonio,
      lacreNovo,
      seloNovo,
      servicoAnterior,
      dataUltimaCalibracao: new Date().toISOString().split('T')[0],
      dataProximaCalibracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Calibrado',
    });

    setModalNovo(false);
    setNumeroSerie('');
    setPatrimonio('');
    carregar();
  };

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Equipamentos & Instrumentos Metrológicos</h1>
          <p>
            Parque instalado dos clientes com foco em medidores de grãos GEHAKA, balanças de precisão e rastreabilidade de selos/lacres
          </p>
        </div>
        <button className="btn-primary-rarus" onClick={() => setModalNovo(true)} type="button">
          <Plus size={15} />
          <span>Cadastrar Equipamento</span>
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Equipamentos Cadastrados</span>
            <div className="rarus-kpi-icon-box">
              <Wrench size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{equipamentos.length}</div>
          <span className="rarus-kpi-trend trend-up">Linha GEHAKA & Balanças</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Calibrados & Vigentes</span>
            <div className="rarus-kpi-icon-box">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            {equipamentos.filter((e) => e.status === 'Calibrado').length}
          </div>
          <span className="rarus-kpi-trend trend-up">100% de conformidade técnica</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Horizonte Comercial 1 Ano</span>
            <div
              className="rarus-kpi-icon-box"
              style={{ background: 'var(--rarus-warning-bg)', color: 'var(--rarus-warning)' }}
            >
              <Calendar size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">1</div>
          <span className="rarus-kpi-trend trend-neutral">Disponível para contato comercial safra</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Aparelhos com Selo Inmetro</span>
            <div className="rarus-kpi-icon-box">
              <Shield size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            {equipamentos.filter((e) => e.seloNovo).length}
          </div>
          <span className="rarus-kpi-trend trend-up">Rastreabilidade metrológica</span>
        </div>
      </div>

      {/* Layout com Tabela e Detalhes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
        <div className="rarus-datagrid-container">
          {/* Abas de Tipos de Equipamento */}
          <div className="rarus-grid-header-tabs">
            <button
              className={`rarus-filter-tab-pill ${filtroTipo === 'Todos' ? 'active' : ''}`}
              onClick={() => setFiltroTipo('Todos')}
            >
              <span>Todos ({equipamentos.length})</span>
            </button>
            <button
              className={`rarus-filter-tab-pill ${filtroTipo === 'Medidor de Umidade GEHAKA' ? 'active' : ''}`}
              onClick={() => setFiltroTipo('Medidor de Umidade GEHAKA')}
            >
              <span>Medidores de Umidade GEHAKA</span>
            </button>
            <button
              className={`rarus-filter-tab-pill ${filtroTipo === 'Balança de Precisão' ? 'active' : ''}`}
              onClick={() => setFiltroTipo('Balança de Precisão')}
            >
              <span>Balanças de Precisão</span>
            </button>
          </div>

          <div className="rarus-grid-toolbar">
            <div className="rarus-inline-search">
              <Search size={15} color="var(--text-muted)" />
              <input
                placeholder="Buscar por Modelo, Série, Patrimônio, Lacre ou Cliente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <table className="rarus-table">
            <thead>
              <tr>
                <th>Modelo / Fabricante</th>
                <th>Nº Série</th>
                <th>Patrimônio</th>
                <th>Cliente</th>
                <th>Última Calibração</th>
                <th>Próxima Calibração</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((eq) => {
                const isSelected = selecionado?.id === eq.id;
                return (
                  <tr
                    key={eq.id}
                    onClick={() => setSelecionado(eq)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--rarus-cyan-light)' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{eq.modelo}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {eq.fabricante} • {eq.tipoEquipamento}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{eq.numeroSerie}</span>
                    </td>
                    <td>{eq.patrimonio || 'S/N'}</td>
                    <td>{eq.clienteNome}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ficha Lateral do Equipamento */}
        {selecionado && (
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Ficha Técnica do Instrumento
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '17px', fontWeight: 800, color: 'var(--rarus-navy)' }}>
                {selecionado.modelo}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--rarus-cyan)', fontWeight: 600 }}>
                {selecionado.fabricante} • Série: {selecionado.numeroSerie}
              </div>
            </div>

            <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <strong>Cliente Titular:</strong> {selecionado.clienteNome}
              </div>
              <div>
                <strong>Patrimônio:</strong> {selecionado.patrimonio || 'Não informado'}
              </div>
              <div>
                <strong>Faixa de Medição:</strong> {selecionado.faixaMedicao}
              </div>
              <div>
                <strong>Resolução:</strong> {selecionado.resolucao}
              </div>

              <div
                style={{
                  background: 'var(--bg-app)',
                  padding: '10px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: '11.5px',
                }}
              >
                <div>
                  <strong>Lacre Anterior:</strong> {selecionado.lacreAnterior || 'N/A'}
                </div>
                <div>
                  <strong>Selo Anterior:</strong> {selecionado.seloAnterior || 'N/A'}
                </div>
                <div style={{ color: 'var(--rarus-cyan)', fontWeight: 700, marginTop: 4 }}>
                  <strong>Lacre Novo:</strong> {selecionado.lacreNovo || 'Não aplicado'}
                </div>
                <div style={{ color: 'var(--rarus-cyan)', fontWeight: 700 }}>
                  <strong>Selo Novo Inmetro:</strong> {selecionado.seloNovo || 'Não aplicado'}
                </div>
              </div>

              {selecionado.servicoAnterior && (
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  <strong>Serviço Anterior:</strong> {selecionado.servicoAnterior}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo Equipamento */}
      {modalNovo && (
        <div className="rarus-modal-backdrop" onClick={() => setModalNovo(false)}>
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="rarus-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                Cadastrar Equipamento no Parque Instalado
              </h3>
            </div>
            <form onSubmit={handleSalvar}>
              <div className="rarus-modal-body">
                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Cliente Titular:</label>
                    <select value={clienteNome} onChange={(e) => setClienteNome(e.target.value)}>
                      <option value="AgroGrãos Cooperativa">AgroGrãos Cooperativa</option>
                      <option value="BioFarma do Brasil">BioFarma do Brasil</option>
                      <option value="Moinho Triângulo">Moinho Triângulo</option>
                    </select>
                  </div>
                  <div className="rarus-form-group">
                    <label>Tipo de Equipamento:</label>
                    <select value={tipoEquipamento} onChange={(e) => setTipoEquipamento(e.target.value)}>
                      <option value="Medidor de Umidade GEHAKA">Medidor de Umidade GEHAKA</option>
                      <option value="Balança de Precisão">Balança de Precisão</option>
                      <option value="Multigás">Multigás</option>
                      <option value="pHmetro">pHmetro</option>
                    </select>
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Fabricante:</label>
                    <input value={fabricante} onChange={(e) => setFabricante(e.target.value)} required />
                  </div>
                  <div className="rarus-form-group">
                    <label>Modelo:</label>
                    <input value={modelo} onChange={(e) => setModelo(e.target.value)} required />
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Número de Série *:</label>
                    <input
                      required
                      placeholder="Ex: GEH-2026-90412"
                      value={numeroSerie}
                      onChange={(e) => setNumeroSerie(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Patrimônio do Cliente:</label>
                    <input
                      placeholder="Ex: PAT-001"
                      value={patrimonio}
                      onChange={(e) => setPatrimonio(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Lacre Novo:</label>
                    <input
                      placeholder="Ex: LAC-2026-4401"
                      value={lacreNovo}
                      onChange={(e) => setLacreNovo(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Selo Novo Inmetro:</label>
                    <input
                      placeholder="Ex: SELO-INM-88910"
                      value={seloNovo}
                      onChange={(e) => setSeloNovo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rarus-form-group">
                  <label>Serviço Anterior / Histórico Breve:</label>
                  <input
                    placeholder="Ex: Calibração em campo realizada em 2025"
                    value={servicoAnterior}
                    onChange={(e) => setServicoAnterior(e.target.value)}
                  />
                </div>
              </div>

              <div className="rarus-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-rarus"
                  onClick={() => setModalNovo(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-rarus">
                  Cadastrar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
