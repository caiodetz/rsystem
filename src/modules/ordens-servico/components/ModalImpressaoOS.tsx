'use client';

import React, { useState, useEffect, useRef } from 'react';
import { OrdemServico, ModeloDocumentoRelatorio } from '@/core/types';
import { ModelosRelatorioService } from '@/core/services/modelosRelatorioService';
import { renderizarTemplateHtml } from '@/core/utils/renderizadorTemplate';
import {
  Printer,
  X,
  FileText,
  Tag,
  Award,
  FileCheck2,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
} from 'lucide-react';

export interface ModalImpressaoOSProps {
  aberto: boolean;
  onFechar: () => void;
  os: OrdemServico | null;
}

export const ModalImpressaoOS: React.FC<ModalImpressaoOSProps> = ({
  aberto,
  onFechar,
  os,
}) => {
  const [modelos, setModelos] = useState<ModeloDocumentoRelatorio[]>([]);
  const [modeloSelecionadoId, setModeloSelecionadoId] = useState<string>('modelo-os-completa');
  const [htmlRenderizado, setHtmlRenderizado] = useState<string>('');
  const [carregando, setCarregando] = useState(false);
  const [zoom, setZoom] = useState<number>(0.85);
  const [copiado, setCopiado] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (aberto) {
      const docsOS = ModelosRelatorioService.listarDisponiveisOS();
      setModelos(docsOS);
      if (docsOS.length > 0 && !docsOS.some((m) => m.id === modeloSelecionadoId)) {
        setModeloSelecionadoId(docsOS[0].id);
      }
    }
  }, [aberto]);

  // Renderizar o HTML dinâmico quando a OS ou o modelo mudar
  useEffect(() => {
    if (!aberto || !os) return;

    const modelo = modelos.find((m) => m.id === modeloSelecionadoId);
    if (!modelo) return;

    let cancelado = false;
    setCarregando(true);

    renderizarTemplateHtml(modelo.templateHtml, {
      os,
      equipamento: os.equipamentos?.[0] || null,
      pecas: os.pecas || [],
    }).then((html) => {
      if (!cancelado) {
        setHtmlRenderizado(html);
        setCarregando(false);
      }
    });

    return () => {
      cancelado = true;
    };
  }, [aberto, os, modeloSelecionadoId, modelos]);

  // Atualiza o conteúdo do iframe de preview
  useEffect(() => {
    if (iframeRef.current && htmlRenderizado) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlRenderizado);
        doc.close();
      }
    }
  }, [htmlRenderizado]);

  if (!aberto || !os) return null;

  const modeloAtual = modelos.find((m) => m.id === modeloSelecionadoId);

  const handleImprimir = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    } else {
      window.print();
    }
  };

  const handleAbrirNovaAba = () => {
    const blob = new Blob([htmlRenderizado], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleCopiarHtml = () => {
    navigator.clipboard.writeText(htmlRenderizado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const getIconeCategoria = (categoria: string, id: string) => {
    if (id.includes('etiqueta')) return <Tag size={14} />;
    if (categoria === 'Certificados') return <Award size={14} />;
    if (categoria === 'Fiscal') return <FileCheck2 size={14} />;
    return <FileText size={14} />;
  };

  return (
    <div className="rarus-modal-backdrop" onClick={onFechar} style={{ zIndex: 10000 }}>
      <div
        className="rarus-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '95vw',
          maxWidth: '1280px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* CABEÇALHO DO MODAL */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Printer size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Central de Impressão & Emissão de Documentos — OS Nº {os.numero}
              </h3>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                Cliente: {os.clienteNome} • {os.equipamentos?.length || 0} equipamento(s) vinculado(s)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={handleCopiarHtml}
              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#334155', color: '#fff', border: 'none' }}
              title="Copiar código HTML do documento"
              type="button"
            >
              {copiado ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
              <span>{copiado ? 'Copiado!' : 'Copiar HTML'}</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleAbrirNovaAba}
              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#334155', color: '#fff', border: 'none' }}
              title="Abrir em nova aba do navegador"
              type="button"
            >
              <ExternalLink size={14} />
              <span>Abrir em Nova Aba</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={handleImprimir}
              style={{ padding: '6px 16px', fontSize: '13px', fontWeight: 600 }}
              type="button"
            >
              <Printer size={15} />
              <span>Imprimir Agora</span>
            </button>

            <button
              onClick={onFechar}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CORPO DO MODAL (SIDEBAR DE MODELOS + PREVIEW A4) */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* SELETOR LATERAL DE DOCUMENTOS */}
          <div
            style={{
              width: '320px',
              borderRight: '1px solid #1e293b',
              backgroundColor: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              gap: 12,
              overflowY: 'auto',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
              Documentos Disponíveis para esta OS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {modelos.map((m) => {
                const ativo = m.id === modeloSelecionadoId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setModeloSelecionadoId(m.id)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: ativo ? '1.5px solid #0284c7' : '1px solid #1e293b',
                      backgroundColor: ativo ? 'rgba(2, 132, 199, 0.15)' : '#1e293b',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                    type="button"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: ativo ? '#38bdf8' : '#e2e8f0', fontWeight: 600, fontSize: '13px' }}>
                        {getIconeCategoria(m.categoria, m.id)}
                        <span>{m.nome}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '9.5px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: ativo ? '#0284c7' : '#334155',
                          color: '#fff',
                        }}
                      >
                        {m.formatoPapel}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>
                      {m.descricao}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* DADOS RESUMIDOS DA OS */}
            <div
              style={{
                marginTop: 'auto',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                fontSize: '11px',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
                Resumo da OS {os.numero}
              </div>
              <div style={{ color: '#94a3b8' }}>Status: <strong style={{ color: '#38bdf8' }}>{os.status}</strong></div>
              <div style={{ color: '#94a3b8' }}>Técnico: <strong>{os.tecnicoNome}</strong></div>
              <div style={{ color: '#94a3b8' }}>Valor Líquido: <strong style={{ color: '#4ade80' }}>R$ {os.valorTotalGeral.toFixed(2)}</strong></div>
            </div>
          </div>

          {/* ÁREA DE VISUALIZAÇÃO (LIVE PREVIEW A4) */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#1e293b',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* BARRA DE CONTROLE DE ZOOM */}
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#0f172a',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#94a3b8' }}>
                <span>Pré-visualização Fiel de Impressão ({modeloAtual?.formatoPapel})</span>
                {carregando && <span style={{ color: '#38bdf8' }}>• Renderizando dados...</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                  style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                  title="Diminuir Zoom"
                  type="button"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '12px', width: '45px', textAlign: 'center' }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                  style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                  title="Aumentar Zoom"
                  type="button"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setZoom(0.85)}
                  style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                  title="Ajustar à tela"
                  type="button"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {/* CONTAINER COM SCROLL E IFRAME ESCALONADO */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: '#334155',
                position: 'relative',
              }}
            >
              {/* FEEDBACK DE LOADING ELEGANTE */}
              {carregando && (
                <div className="rarus-loading-overlay dark" style={{ zIndex: 20 }}>
                  <div className="rarus-spinner" />
                  <span className="rarus-loading-text" style={{ color: '#38bdf8', fontSize: '13px' }}>
                    Carregando modelo e gerando documento...
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Processando tags, dados metrológicos e QR Code de rastreio
                  </span>
                </div>
              )}

              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                  width: modeloAtual?.formatoPapel === 'Etiqueta Lab' ? '100mm' : '210mm',
                  minHeight: modeloAtual?.formatoPapel === 'Etiqueta Lab' ? '150mm' : '297mm',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  opacity: carregando ? 0.4 : 1,
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '0.2s',
                }}
              >
                <iframe
                  ref={iframeRef}
                  title="Pré-visualização do Documento"
                  style={{
                    width: '100%',
                    height: modeloAtual?.formatoPapel === 'Etiqueta Lab' ? '150mm' : '297mm',
                    border: 'none',
                    display: 'block',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
