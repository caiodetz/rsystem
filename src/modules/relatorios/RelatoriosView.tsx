'use client';

import React, { useState, useEffect } from 'react';
import { ResultadoRelatorio, FiltroRelatorio } from '@/core/types';
import { RelatoriosService } from '@/core/services/relatoriosService';
import { EstoqueService } from '@/core/services/estoqueService';
import { EstoqueLocal } from '@/core/types';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  Filter,
  Boxes,
  QrCode,
  FileText,
  Clock,
  DollarSign,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const RelatoriosView: React.FC = () => {
  const [tipo, setTipo] = useState<
    'estoque' | 'etiquetas' | 'orcamento' | 'vencimentos-anual' | 'sla-os'
  >('estoque');
  const [relatorio, setRelatorio] = useState<ResultadoRelatorio | null>(null);
  const [gerando, setGerando] = useState(false);

  // Filtros de Estoque
  const [locaisEstoque, setLocaisEstoque] = useState<EstoqueLocal[]>([]);
  const [estoqueLocalId, setEstoqueLocalId] = useState<string>('');
  const [filtroSaldo, setFiltroSaldo] = useState<'todos' | 'saldo-zero' | 'saldo-positivo' | 'saldo-negativo'>('todos');

  useEffect(() => {
    EstoqueService.listarLocais().then(setLocaisEstoque);
    gerarRelatorio('estoque');
  }, []);

  const gerarRelatorio = async (tipoEscolhido = tipo) => {
    setGerando(true);
    const res = await RelatoriosService.gerarRelatorio({
      tipo: tipoEscolhido,
      estoqueLocalId: estoqueLocalId || undefined,
      filtroSaldo,
    });
    setRelatorio(res);
    setGerando(false);
  };

  const handleExportCSV = () => {
    if (!relatorio || relatorio.itens.length === 0) return;
    const headers = Object.keys(relatorio.itens[0]).join(',');
    const rows = relatorio.itens.map((item) =>
      Object.values(item)
        .map((v) => `"${v}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${relatorio.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Central de Geração de Relatórios & Etiquetas</h1>
          <p>
            Emissão de relatórios operacionais, contagem de estoque físico/fiscal, orçamentos e etiquetas Elgin
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary-rarus" onClick={handleExportCSV} disabled={!relatorio}>
            <Download size={14} />
            <span>Exportar Planilha (CSV)</span>
          </button>
          <button className="btn-primary-rarus" onClick={() => window.print()} disabled={!relatorio}>
            <Printer size={14} />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Seleção do Tipo de Relatório */}
      <div className="rarus-datagrid-container">
        <div className="rarus-grid-header-tabs">
          <button
            className={`rarus-filter-tab-pill ${tipo === 'estoque' ? 'active' : ''}`}
            onClick={() => {
              setTipo('estoque');
              gerarRelatorio('estoque');
            }}
          >
            <Boxes size={14} />
            <span>Contagem de Estoque</span>
          </button>

          <button
            className={`rarus-filter-tab-pill ${tipo === 'etiquetas' ? 'active' : ''}`}
            onClick={() => {
              setTipo('etiquetas');
              gerarRelatorio('etiquetas');
            }}
          >
            <QrCode size={14} />
            <span>Etiquetas Elgin (Rolo Térmico) *</span>
          </button>

          <button
            className={`rarus-filter-tab-pill ${tipo === 'orcamento' ? 'active' : ''}`}
            onClick={() => {
              setTipo('orcamento');
              gerarRelatorio('orcamento');
            }}
          >
            <DollarSign size={14} />
            <span>Orçamentos & Propostas</span>
          </button>

          <button
            className={`rarus-filter-tab-pill ${tipo === 'vencimentos-anual' ? 'active' : ''}`}
            onClick={() => {
              setTipo('vencimentos-anual');
              gerarRelatorio('vencimentos-anual');
            }}
          >
            <Clock size={14} />
            <span>Vencimento Anual de Clientes (Safra)</span>
          </button>

          <button
            className={`rarus-filter-tab-pill ${tipo === 'sla-os' ? 'active' : ''}`}
            onClick={() => {
              setTipo('sla-os');
              gerarRelatorio('sla-os');
            }}
          >
            <FileText size={14} />
            <span>Desempenho & SLA de OS</span>
          </button>
        </div>

        {/* Barra de Filtros Específicos para Contagem de Estoque */}
        {tipo === 'estoque' && (
          <div className="rarus-grid-toolbar">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Filtrar Local:</span>
              <select
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                }}
                value={estoqueLocalId}
                onChange={(e) => {
                  setEstoqueLocalId(e.target.value);
                  setTimeout(() => gerarRelatorio('estoque'), 50);
                }}
              >
                <option value="">Todos os Locais (Consolidado)</option>
                {locaisEstoque.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nome}
                  </option>
                ))}
              </select>

              <span style={{ fontSize: '12.5px', fontWeight: 600, marginLeft: 10 }}>Filtro de Saldo:</span>
              <select
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                }}
                value={filtroSaldo}
                onChange={(e) => {
                  setFiltroSaldo(e.target.value as any);
                  setTimeout(() => gerarRelatorio('estoque'), 50);
                }}
              >
                <option value="todos">Todos os Saldos</option>
                <option value="saldo-zero">Saldo Igual a Zero (0)</option>
                <option value="saldo-positivo">Saldo Acima de Zero (&gt; 0)</option>
                <option value="saldo-negativo">Saldo Abaixo de Zero (&lt; 0)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Relatório Gerado */}
      {gerando ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Compilando e gerando dados do relatório...
        </div>
      ) : relatorio ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Card de Resumo do Relatório */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: 'var(--rarus-navy)' }}>
                {relatorio.titulo}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Posição gerada em: <strong>{relatorio.geradoEm}</strong> • Período: {relatorio.periodo}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              {Object.entries(relatorio.indicadores).map(([label, val]) => (
                <div key={label} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--rarus-navy)' }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Renderização Especial de ETIQUETAS ELGIN TÉRMICAS (*) */}
          {tipo === 'etiquetas' && (
            <div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--rarus-navy)',
                  background: 'var(--rarus-cyan-light)',
                  padding: '8px 14px',
                  borderRadius: 6,
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                * Formato térmico em rolo contínuo para impressora Elgin (50x30mm / 100x50mm) com QR Code para leitura rápida da ficha do equipamento.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {relatorio.itens.map((item: any, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '2px dashed var(--rarus-navy)',
                      borderRadius: 8,
                      padding: 16,
                      color: '#0a2240',
                      fontFamily: 'monospace',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #0a2240', paddingBottom: 6 }}>
                      <strong style={{ fontSize: '12px' }}>RARUS METROLOGIA</strong>
                      <span style={{ fontSize: '10px' }}>ELGIN TÉRMICA</span>
                    </div>

                    <div style={{ margin: '10px 0', fontSize: '11px', lineHeight: 1.5 }}>
                      <div><strong>PATRIMÔNIO:</strong> {item.patrimonio}</div>
                      <div><strong>SÉRIE:</strong> {item.numeroSerie}</div>
                      <div><strong>MODELO:</strong> {item.modelo}</div>
                      <div><strong>CALIBRADO:</strong> {item.dataCalibracao}</div>
                      <div style={{ color: 'var(--rarus-cyan)', fontWeight: 800 }}>
                        <strong>VALIDADE:</strong> {item.proximaCalibracao}
                      </div>
                      <div><strong>LACRE NOVO:</strong> {item.lacreNovo}</div>
                      <div><strong>SELO INMETRO:</strong> {item.seloNovo}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>
                        Aponte a câmera para conferir autenticidade
                      </div>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          background: '#0a2240',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4,
                        }}
                      >
                        <QrCode size={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabela Padrão para os Demais Relatórios */}
          {tipo !== 'etiquetas' && (
            <div className="rarus-datagrid-container">
              <table className="rarus-table">
                <thead>
                  <tr>
                    {relatorio.itens.length > 0 &&
                      Object.keys(relatorio.itens[0]).map((col) => (
                        <th key={col}>
                          {col.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {relatorio.itens.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val: any, cIdx) => (
                        <td key={cIdx}>
                          {typeof val === 'number' ? (
                            <strong>{val}</strong>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
