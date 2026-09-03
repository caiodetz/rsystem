'use client';

import React, { useState, useEffect } from 'react';
import { PadraoBasal } from '@/core/types';
import { PadroesBasaisService } from '@/core/services/padroesBasaisService';
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  AlertCircle,
  Clock,
  History,
  Lock,
} from 'lucide-react';

export const PadroesView: React.FC = () => {
  const [padroes, setPadroes] = useState<
    (PadraoBasal & {
      diasRestantes: number;
      mensagemAlerta?: string;
      bloqueado: boolean;
    })[]
  >([]);
  const [busca, setBusca] = useState('');
  const [modalNovo, setModalNovo] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Form State
  const [codigoIdentificador, setCodigoIdentificador] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [grandeza, setGrandeza] = useState('Temperatura / Umidade');
  const [orgaoCalibrador, setOrgaoCalibrador] = useState('LabMetrol RBC #0112');
  const [certificadoRBC, setCertificadoRBC] = useState('');
  const [dataCalibracao, setDataCalibracao] = useState(new Date().toISOString().split('T')[0]);
  const [dataValidade, setDataValidade] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [incertezaPadrao, setIncertezaPadrao] = useState('± 0,1 °C');

  useEffect(() => {
    carregar();
  }, [busca]);

  const carregar = async () => {
    const list = await PadroesBasaisService.listar(busca);
    setPadroes(list);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoIdentificador || !descricao || !certificadoRBC) return;

    await PadroesBasaisService.cadastrar({
      codigoIdentificador: codigoIdentificador.toUpperCase(),
      descricao,
      fabricante,
      modelo,
      numeroSerie,
      grandeza,
      orgaoCalibrador,
      certificadoRBC,
      dataCalibracao,
      dataValidade,
      incertezaPadrao,
      fatorK: 2.0,
    });

    setModalNovo(false);
    setCodigoIdentificador('');
    setDescricao('');
    setCertificadoRBC('');
    carregar();
  };

  const padroesCriticos30d = padroes.filter((p) => p.status === 'Alerta30dCritico');
  const padroesBloqueados = padroes.filter((p) => p.status === 'VencidoBloqueado');

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Padrões Basais de Referência (Laboratório RARUS)</h1>
          <p>
            Rastreabilidade RBC, controle de validade em 4 escalas (90d, 60d, 30d crítico e bloqueio de uso)
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalNovo(true)} type="button">
          <Plus size={15} />
          <span>Cadastrar Padrão Basal</span>
        </button>
      </div>

      {/* POPUP / BANNER DE ALERTA CRÍTICO SE HOUVER PADRÃO COM MENOS DE 30 DIAS OU BLOQUEADO */}
      {(padroesCriticos30d.length > 0 || padroesBloqueados.length > 0) && (
        <div
          style={{
            backgroundColor: 'var(--rarus-danger-bg)',
            border: '1px solid var(--rarus-danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: 'var(--rarus-danger)',
          }}
        >
          <AlertCircle size={28} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '14.5px' }}>
              ATENÇÃO: AVISO CRÍTICO DE PADRÕES METROLÓGICOS
            </div>
            <div style={{ fontSize: '12.5px', marginTop: 2 }}>
              {padroesBloqueados.length > 0 && (
                <div>
                  • <strong>{padroesBloqueados.map((p) => p.codigoIdentificador).join(', ')}:</strong> Vencido! Bloqueado automaticamente para emissão de novos certificados.
                </div>
              )}
              {padroesCriticos30d.length > 0 && (
                <div>
                  • <strong>{padroesCriticos30d.map((p) => p.codigoIdentificador).join(', ')}:</strong> Vence em menos de 30 dias! Providencie calibração externa imediata.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Total de Padrões Basais</span>
            <div className="rarus-kpi-icon-box">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{padroes.length}</div>
          <span className="rarus-kpi-trend trend-up">RBC Inmetro / IPT</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Padrões Vigentes</span>
            <div className="rarus-kpi-icon-box">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            {padroes.filter((p) => p.status === 'Valido').length}
          </div>
          <span className="rarus-kpi-trend trend-up">Liberados para uso</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Alertas de Vencimento</span>
            <div
              className="rarus-kpi-icon-box"
              style={{ background: 'var(--rarus-warning-bg)', color: 'var(--rarus-warning)' }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">
            {padroes.filter((p) => p.status === 'Alerta90d' || p.status === 'Alerta60d' || p.status === 'Alerta30dCritico').length}
          </div>
          <span className="rarus-kpi-trend trend-down">Em escala de monitoramento</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Bloqueados por Vencimento</span>
            <div
              className="rarus-kpi-icon-box"
              style={{ background: 'var(--rarus-danger-bg)', color: 'var(--rarus-danger)' }}
            >
              <Lock size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{padroesBloqueados.length}</div>
          <span className="rarus-kpi-trend trend-down">Uso proibido pelo sistema</span>
        </div>
      </div>

      {/* Grid de Padrões Basais */}
      <div className="rarus-datagrid-container">
        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--text-muted)" />
            <input
              placeholder="Buscar por código (ex: TH-01), descrição, órgão ou certificado..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="rarus-table-container">
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Descrição do Padrão</th>
                <th>Grandeza</th>
                <th>Certificado RBC</th>
                <th>Órgão Calibrador</th>
                <th>Validade</th>
                <th>Escala de Alerta</th>
                <th>Status Operacional</th>
              </tr>
            </thead>
            <tbody>
              {padroes.map((p) => {
                let badgeClasse = 'status-calibrado';
                let badgeTexto = '● Válido';

                if (p.status === 'Alerta90d') {
                  badgeClasse = 'status-alerta';
                  badgeTexto = `⚠ Alerta 90d (${p.diasRestantes} dias)`;
                } else if (p.status === 'Alerta60d') {
                  badgeClasse = 'status-alerta';
                  badgeTexto = `⚠ Atenção 60d (${p.diasRestantes} dias)`;
                } else if (p.status === 'Alerta30dCritico') {
                  badgeClasse = 'status-vencido';
                  badgeTexto = `🚨 CRÍTICO (${p.diasRestantes} dias)`;
                } else if (p.status === 'VencidoBloqueado') {
                  badgeClasse = 'status-vencido';
                  badgeTexto = '🔒 BLOQUEADO';
                }

                const isSelected = selectedRowId === p.id;

                return (
                  <tr
                    key={p.id}
                    className={isSelected ? 'rarus-row-selected' : ''}
                    onClick={() => setSelectedRowId(isSelected ? null : p.id)}
                    title={isSelected ? 'Linha selecionada' : 'Clique para selecionar o padrão'}
                  >
                    <td>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: '13px',
                          color: 'var(--color-primary-500)',
                          background: 'var(--color-primary-50)',
                          padding: '4px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {p.codigoIdentificador}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.descricao}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {p.fabricante} {p.modelo} • Série: {p.numeroSerie}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px' }}>{p.grandeza}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '12px', color: 'var(--color-text-main)' }}>
                        {p.certificadoRBC}
                      </strong>
                    </td>
                    <td style={{ fontSize: '12px' }}>{p.orgaoCalibrador}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.dataValidade}</div>
                    </td>
                    <td>
                      <span className={`rarus-status-pill ${badgeClasse}`}>
                        {badgeTexto}
                      </span>
                    </td>
                    <td>
                      {p.bloqueado ? (
                        <span style={{ color: 'var(--status-danger-text)', fontWeight: 700, fontSize: '12px' }}>
                          Bloqueado p/ Certificados
                        </span>
                      ) : (
                        <span style={{ color: 'var(--status-success-text)', fontWeight: 600, fontSize: '12px' }}>
                          ✓ Liberado p/ Uso
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Padrão */}
      {modalNovo && (
        <div className="rarus-modal-backdrop" onClick={() => setModalNovo(false)}>
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="rarus-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                Cadastrar Novo Padrão Basal de Referência
              </h3>
            </div>
            <form onSubmit={handleSalvar}>
              <div className="rarus-modal-body">
                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Identificador Único (ex: TH-01, BAL-01) *:</label>
                    <input
                      required
                      placeholder="Ex: TH-02"
                      value={codigoIdentificador}
                      onChange={(e) => setCodigoIdentificador(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Grandeza Metrológica:</label>
                    <select value={grandeza} onChange={(e) => setGrandeza(e.target.value)}>
                      <option value="Temperatura / Umidade">Temperatura / Umidade</option>
                      <option value="Massa">Massa</option>
                      <option value="Pressão">Pressão</option>
                      <option value="Dimensional">Dimensional</option>
                    </select>
                  </div>
                </div>

                <div className="rarus-form-group">
                  <label>Descrição do Padrão *:</label>
                  <input
                    required
                    placeholder="Ex: Termohigrômetro Digital de Alta Precisão"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Fabricante:</label>
                    <input value={fabricante} onChange={(e) => setFabricante(e.target.value)} />
                  </div>
                  <div className="rarus-form-group">
                    <label>Modelo:</label>
                    <input value={modelo} onChange={(e) => setModelo(e.target.value)} />
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Número do Certificado RBC *:</label>
                    <input
                      required
                      placeholder="Ex: RBC-2026-9044"
                      value={certificadoRBC}
                      onChange={(e) => setCertificadoRBC(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Órgão Calibrador Credenciado:</label>
                    <input
                      value={orgaoCalibrador}
                      onChange={(e) => setOrgaoCalibrador(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Data de Calibração:</label>
                    <input
                      type="date"
                      value={dataCalibracao}
                      onChange={(e) => setDataCalibracao(e.target.value)}
                    />
                  </div>
                  <div className="rarus-form-group">
                    <label>Data de Validade:</label>
                    <input
                      type="date"
                      value={dataValidade}
                      onChange={(e) => setDataValidade(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rarus-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalNovo(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Cadastrar Padrão Basal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
