'use client';

import React, { useState, useEffect } from 'react';
import { CertificadoCalibracao, RelatoCalibracao } from '@/core/types';
import { RelatosService } from '@/core/services/relatosService';
import { OrdensServicoService } from '@/core/services/ordensServicoService';
import { PadroesBasaisService } from '@/core/services/padroesBasaisService';
import {
  Award,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  FileText,
  UserCheck,
  Eye,
  X,
} from 'lucide-react';

export const CalibracoesView: React.FC = () => {
  const [certificados, setCertificados] = useState<CertificadoCalibracao[]>([]);
  const [selecionado, setSelecionado] = useState<CertificadoCalibracao | null>(null);
  const [busca, setBusca] = useState('');

  // Modal Nova Calibração / Emissão
  const [modalNovaCalibracao, setModalNovaCalibracao] = useState(false);
  const [relatos, setRelatos] = useState<RelatoCalibracao[]>([]);
  const [relatoEscolhido, setRelatoEscolhido] = useState<RelatoCalibracao | null>(null);

  // Form State
  const [osNumero, setOsNumero] = useState('1045');
  const [equipamentoSerie, setEquipamentoSerie] = useState('GEH-2023-90812');
  const [equipamentoModelo, setEquipamentoModelo] = useState('GEHAKA G650i');
  const [clienteRazao, setClienteRazao] = useState('Cooperativa Agroindustrial Grãos do Vale');
  const [clienteCnpj, setClienteCnpj] = useState('14.288.910/0001-44');
  const [tecnicoId, setTecnicoId] = useState('usr-tec-itamar');
  const [tecnicoNome, setTecnicoNome] = useState('Itamar Soares');

  // Coleta de dados de ensaio
  const [leitura13, setLeitura13] = useState('13.1');
  const [leitura20, setLeitura20] = useState('19.9');
  const [tempAmbiente, setTempAmbiente] = useState('22.5');
  const [umidAmbiente, setUmidAmbiente] = useState('53.0');

  useEffect(() => {
    carregarCertificados();
    carregarRelatos();
  }, []);

  const carregarCertificados = async () => {
    const list = await RelatosService.listarCertificados();
    setCertificados(list);
    if (list.length > 0 && !selecionado) {
      setSelecionado(list[0]);
    }
  };

  const carregarRelatos = async () => {
    const rList = await RelatosService.listarRelatos();
    setRelatos(rList);
    if (rList.length > 0) {
      setRelatoEscolhido(rList[0]);
    }
  };

  const handleEmitirCertificado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relatoEscolhido) return;

    // 1. Validação de Competência do Técnico
    const validacao = RelatosService.verificarPermissaoTecnico(
      tecnicoId,
      relatoEscolhido.tipoCalibracaoId,
      relatoEscolhido.tipoEquipamento
    );

    if (!validacao.permitido) {
      alert(`Bloqueio de Conformidade: ${validacao.motivo}`);
      return;
    }

    // 2. Validação de Padrão Basal (Verifica se TH-01 está vigente)
    const padrao = await PadroesBasaisService.obterPorIdentificador('TH-01');
    if (padrao) {
      const statusPad = PadroesBasaisService.calcularStatusPorValidade(padrao.dataValidade);
      if (statusPad.status === 'VencidoBloqueado') {
        alert('Erro: O padrão basal TH-01 está vencido e bloqueado para calibração!');
        return;
      }
    }

    const novo = await RelatosService.emitirCertificado({
      osNumero,
      osId: `os-${osNumero}`,
      equipamentoId: 'eq-1',
      equipamentoSerie,
      equipamentoModelo,
      clienteId: 'cli-1',
      clienteRazaoSocial: clienteRazao,
      clienteCnpj,
      relatoId: relatoEscolhido.id,
      tecnicoId,
      tecnicoNome,
      padroesUtilizados: [
        {
          identificador: 'TH-01',
          descricao: 'Termohigrômetro Digital Testo 625 Reference',
          certificado: 'LT-457 607',
          validade: '01/09/2028',
        },
      ],
      dadosColetados: {
        temperaturaAmbiente: tempAmbiente,
        umidadeAmbiente: umidAmbiente,
        leituraPadrao13: leitura13,
        leituraPadrao20: leitura20,
      },
    });

    setModalNovaCalibracao(false);
    setSelecionado(novo);
    carregarCertificados();
  };

  const certificadosFiltrados = certificados.filter(
    (c) =>
      c.numero.toLowerCase().includes(busca.toLowerCase()) ||
      c.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
      c.equipamentoSerie.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Calibrações & Emissão de Certificados Metrológicos</h1>
          <p>
            Execução de ensaios por Relato, validação de padrões basais RBC e numeração oficial 0000-X/AA
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {selecionado && (
            <button className="btn btn-secondary" onClick={() => window.print()} type="button">
              <Printer size={15} />
              <span>Imprimir Certificado</span>
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setModalNovaCalibracao(true)} type="button">
            <Plus size={15} />
            <span>Executar Calibração & Emitir</span>
          </button>
        </div>
      </div>

      {/* Layout Split: Lista de Certificados na Esquerda + Prévia Oficial na Direita */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Lista de Certificados */}
        <div className="rarus-datagrid-container">
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="rarus-inline-search" style={{ width: '100%' }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                placeholder="Buscar por Nº, Cliente ou Série..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {certificadosFiltrados.map((cert) => {
              const isSelected = selecionado?.id === cert.id;
              return (
                <div
                  key={cert.id}
                  onClick={() => setSelecionado(cert)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--rarus-cyan-light)' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--rarus-navy)' }}>
                      Certificado #{cert.numero}
                    </strong>
                    <span className="rarus-status-pill status-calibrado" style={{ fontSize: '10.5px' }}>
                      <span className="rarus-status-dot" />
                      {cert.status}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '13px', marginTop: 4 }}>
                    {cert.equipamentoModelo} (Série: {cert.equipamentoSerie})
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                    Cliente: {cert.clienteNome}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: 4 }}>
                    Técnico: {cert.tecnicoNome} • Emissão: {cert.dataEmissao}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prévia Oficial do Certificado HTML Emitido */}
        {selecionado ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileCheck size={18} color="var(--rarus-cyan)" />
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--rarus-navy)' }}>
                  Visualização do Certificado Oficial #{selecionado.numero}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Hash de Autenticidade: <code>{selecionado.hashAutenticidade}</code>
              </span>
            </div>

            <div
              style={{ minHeight: '480px' }}
              dangerouslySetInnerHTML={{ __html: selecionado.htmlCertificadoGerado }}
            />
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            Selecione um certificado para visualizar o documento oficial.
          </div>
        )}
      </div>

      {/* Modal Executar Calibração & Emitir Certificado */}
      {modalNovaCalibracao && (
        <div className="rarus-modal-backdrop" onClick={() => setModalNovaCalibracao(false)}>
          <div
            className="rarus-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '820px' }}
          >
            {/* Cabeçalho do Modal */}
            <div className="rarus-modal-header">
              <div className="rarus-modal-header-info">
                <div className="rarus-modal-icon-badge">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="rarus-modal-title">
                    Execução de Calibração Metrológica & Emissão de Certificado
                  </h3>
                  <p className="rarus-modal-subtitle">
                    Ensaio metrológico de conformidade, registro RBC e geração de laudo oficial
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rarus-modal-close-btn"
                onClick={() => setModalNovaCalibracao(false)}
                title="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEmitirCertificado}>
              <div className="rarus-modal-body">
                <div className="form-grid">
                  {/* Seleção do Relato */}
                  <div className="form-group col-7">
                    <label className="form-label">
                      Modelo de Relato Metrológico <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={relatoEscolhido?.id}
                      onChange={(e) => {
                        const r = relatos.find((rel) => rel.id === e.target.value);
                        if (r) setRelatoEscolhido(r);
                      }}
                    >
                      {relatos.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.tipoEquipamento} — {r.tituloRelato}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group col-5">
                    <label className="form-label">Padrão Basal Exigido (RBC)</label>
                    <input
                      className="form-input"
                      value="TH-01 (Termohigrômetro Testo 625 - Válido até 01/09/2028)"
                      readOnly
                    />
                  </div>

                  {/* Dados da OS e Técnico */}
                  <div className="form-group col-4">
                    <label className="form-label">Ordem de Serviço</label>
                    <input className="form-input" value={`OS #${osNumero}`} readOnly />
                  </div>
                  <div className="form-group col-8">
                    <label className="form-label">Técnico Executor Habilitado</label>
                    <input className="form-input" value={`${tecnicoNome} (Habilitado GEHAKA)`} readOnly />
                  </div>

                  {/* Equipamento e Cliente */}
                  <div className="form-group col-6">
                    <label className="form-label">Equipamento em Calibração</label>
                    <input className="form-input" value={`${equipamentoModelo} — Série: ${equipamentoSerie}`} readOnly />
                  </div>
                  <div className="form-group col-6">
                    <label className="form-label">Cliente / Proprietário</label>
                    <input className="form-input" value={clienteRazao} readOnly />
                  </div>

                  {/* Card de Coleta de Dados do Ensaio */}
                  <div className="col-12" style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'var(--color-primary-50, #f8fafc)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-subtle, #e2e8f0)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                          paddingBottom: '8px',
                          borderBottom: '1px solid var(--color-border-subtle, #e2e8f0)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileCheck size={16} color="var(--color-primary-500, #2563eb)" />
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: 'var(--color-text-main, #0f172a)',
                              letterSpacing: '0.3px',
                            }}
                          >
                            COLETA DE DADOS DO ENSAIO (CONFORME RELATO GEHAKA)
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                          }}
                        >
                          Ensaio Normativo
                        </span>
                      </div>

                      <div className="form-grid">
                        <div className="form-group col-6">
                          <label className="form-label">
                            Temperatura Ambiente (°C) <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input"
                            value={tempAmbiente}
                            onChange={(e) => setTempAmbiente(e.target.value)}
                            placeholder="Ex: 22.5"
                            required
                          />
                        </div>
                        <div className="form-group col-6">
                          <label className="form-label">
                            Umidade Relativa (%UR) <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input"
                            value={umidAmbiente}
                            onChange={(e) => setUmidAmbiente(e.target.value)}
                            placeholder="Ex: 53.0"
                            required
                          />
                        </div>

                        <div className="form-group col-6">
                          <label className="form-label">
                            Ponto 13,0% — Leitura Observada (%) <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input"
                            value={leitura13}
                            onChange={(e) => setLeitura13(e.target.value)}
                            placeholder="Ex: 13.1"
                            required
                          />
                        </div>
                        <div className="form-group col-6">
                          <label className="form-label">
                            Ponto 20,0% — Leitura Observada (%) <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input"
                            value={leitura20}
                            onChange={(e) => setLeitura20(e.target.value)}
                            placeholder="Ex: 19.9"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rarus-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalNovaCalibracao(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Award size={15} />
                  <span>Assinar & Emitir Certificado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
