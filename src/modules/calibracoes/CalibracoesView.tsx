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
          <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="rarus-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                Execução de Calibração Metrológica & Emissão de Certificado
              </h3>
            </div>
            <form onSubmit={handleEmitirCertificado}>
              <div className="rarus-modal-body">
                {/* Seleção do Relato */}
                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Modelo de Relato Metrológico:</label>
                    <select
                      value={relatoEscolhido?.id}
                      onChange={(e) => {
                        const r = relatos.find((rel) => rel.id === e.target.value);
                        if (r) setRelatoEscolhido(r);
                      }}
                    >
                      {relatos.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.tipoEquipamento} - {r.tituloRelato}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rarus-form-group">
                    <label>Padrão Basal Exigido (RBC):</label>
                    <input value="TH-01 (Termohigrômetro Testo 625 - Válido até 01/09/2028)" disabled />
                  </div>
                </div>

                {/* Dados da OS e Técnico */}
                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Ordem de Serviço:</label>
                    <input value={`OS #${osNumero}`} disabled />
                  </div>
                  <div className="rarus-form-group">
                    <label>Técnico Executor:</label>
                    <input value={`${tecnicoNome} (Habilitado GEHAKA)`} disabled />
                  </div>
                </div>

                {/* Equipamento */}
                <div className="rarus-form-row">
                  <div className="rarus-form-group">
                    <label>Equipamento:</label>
                    <input value={`${equipamentoModelo} - Série: ${equipamentoSerie}`} disabled />
                  </div>
                  <div className="rarus-form-group">
                    <label>Cliente:</label>
                    <input value={clienteRazao} disabled />
                  </div>
                </div>

                {/* Tabela de Coleta do Relato */}
                <div
                  style={{
                    marginTop: 12,
                    padding: '14px',
                    background: 'var(--bg-app)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--rarus-navy)', marginBottom: 10 }}>
                    COLETA DE DADOS DO ENSAIO (CONFORME RELATO GEHAKA):
                  </div>

                  <div className="rarus-form-row">
                    <div className="rarus-form-group">
                      <label>Temperatura Ambiente (°C):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tempAmbiente}
                        onChange={(e) => setTempAmbiente(e.target.value)}
                        required
                      />
                    </div>
                    <div className="rarus-form-group">
                      <label>Umidade Relativa (%UR):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={umidAmbiente}
                        onChange={(e) => setUmidAmbiente(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="rarus-form-row">
                    <div className="rarus-form-group">
                      <label>Ponto 13,0% - Leitura Observada (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={leitura13}
                        onChange={(e) => setLeitura13(e.target.value)}
                        required
                      />
                    </div>
                    <div className="rarus-form-group">
                      <label>Ponto 20,0% - Leitura Observada (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={leitura20}
                        onChange={(e) => setLeitura20(e.target.value)}
                        required
                      />
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
                  Assinar & Emitir Certificado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
