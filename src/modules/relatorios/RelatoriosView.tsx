'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ModeloDocumentoRelatorio,
  CategoriaModeloDocumento,
  FormatoPapelDocumento,
  ResultadoRelatorio,
  EstoqueLocal,
} from '@/core/types';
import { ModelosRelatorioService } from '@/core/services/modelosRelatorioService';
import { RelatoriosService } from '@/core/services/relatoriosService';
import { EstoqueService } from '@/core/services/estoqueService';
import { renderizarTemplateHtml } from '@/core/utils/renderizadorTemplate';
import {
  FileText,
  Printer,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Eye,
  CheckCircle2,
  Layers,
  Sparkles,
  RotateCcw,
  Search,
  Filter,
  Tag,
  Award,
  FileCheck2,
  Sliders,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Code,
  Save,
  Check,
  CheckCircle,
  XCircle,
  Boxes,
  Package,
} from 'lucide-react';

const VARIAVEIS_DISPONIVEIS = [
  { tag: '{{os.numero}}', desc: 'Número da OS (0005303)' },
  { tag: '{{os.data}}', desc: 'Data de Abertura da OS' },
  { tag: '{{os.status}}', desc: 'Status atual da OS' },
  { tag: '{{os.tecnicoNome}}', desc: 'Nome do Técnico' },
  { tag: '{{os.descricaoProblema}}', desc: 'Laudo de Defeito' },
  { tag: '{{os.servicosExecutados}}', desc: 'Serviços Executados' },
  { tag: '{{cliente.nome}}', desc: 'Razão Social do Cliente' },
  { tag: '{{cliente.cnpj}}', desc: 'CNPJ do Cliente' },
  { tag: '{{cliente.endereco}}', desc: 'Endereço Completo' },
  { tag: '{{cliente.cidade}}', desc: 'Município' },
  { tag: '{{cliente.uf}}', desc: 'Estado' },
  { tag: '{{equipamento.modelo}}', desc: 'Modelo do Instrumento' },
  { tag: '{{equipamento.marca}}', desc: 'Marca / Fabricante' },
  { tag: '{{equipamento.serie}}', desc: 'Número de Série' },
  { tag: '{{equipamento.lacreNovo}}', desc: 'Lacre Novo Aplicado' },
  { tag: '{{equipamento.seloNovo}}', desc: 'Selo Inmetro Reparado' },
  { tag: '{{tabelaServicos}}', desc: 'Linhas HTML de Serviços' },
  { tag: '{{tabelaPecas}}', desc: 'Linhas HTML de Peças/NCM' },
  { tag: '{{totais.servicos}}', desc: 'Total de Serviços (R$)' },
  { tag: '{{totais.produtos}}', desc: 'Total de Peças (R$)' },
  { tag: '{{totais.liquido}}', desc: 'Total Líquido Geral' },
  { tag: '{{qrcode}}', desc: 'QR Code Dinâmico da OS' },
  { tag: '{{dataHoje}}', desc: 'Data Atual (DD/MM/AAAA)' },
];

export const RelatoriosView: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'modelos' | 'editor' | 'emissao'>('modelos');

  // ==========================================
  // ESTADOS DA ABA MODELOS
  // ==========================================
  const [modelos, setModelos] = useState<ModeloDocumentoRelatorio[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [buscaModelo, setBuscaModelo] = useState<string>('');
  const [filtroMovimento, setFiltroMovimento] = useState<string>('Todos');
  const [filtroMenuOS, setFiltroMenuOS] = useState<string>('Todos');

  // Modal de Preview
  const [previewModalAberto, setPreviewModalAberto] = useState(false);
  const [modeloParaPreview, setModeloParaPreview] = useState<ModeloDocumentoRelatorio | null>(null);
  const [htmlPreviewModal, setHtmlPreviewModal] = useState<string>('');
  const [zoomPreview, setZoomPreview] = useState<number>(0.85);
  const iframePreviewRef = useRef<HTMLIFrameElement>(null);

  // ==========================================
  // ESTADOS DO EDITOR DE MODELO
  // ==========================================
  const [modeloEmEdicao, setModeloEmEdicao] = useState<Partial<ModeloDocumentoRelatorio>>({
    id: '',
    nome: '',
    codigo: '',
    descricao: '',
    categoria: 'Ordem de Serviço',
    tipoMovimentoVinculado: 'Ordem de Serviço',
    disponivelNaImpressaoOS: true,
    formatoPapel: 'A4 Retrato',
    templateHtml: '',
    versao: 'REV 01',
    ativo: true,
  });
  const [htmlLivePreview, setHtmlLivePreview] = useState<string>('');
  const [zoomLive, setZoomLive] = useState<number>(0.75);
  const [salvoFeedback, setSalvoFeedback] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeLiveRef = useRef<HTMLIFrameElement>(null);

  // ==========================================
  // ESTADOS DA ABA EMISSÃO ANALÍTICA
  // ==========================================
  const [tipoRelatorioAnalitico, setTipoRelatorioAnalitico] = useState<
    'estoque' | 'etiquetas' | 'orcamento' | 'vencimentos-anual' | 'sla-os'
  >('estoque');
  const [relatorioAnalitico, setRelatorioAnalitico] = useState<ResultadoRelatorio | null>(null);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [locaisEstoque, setLocaisEstoque] = useState<EstoqueLocal[]>([]);
  const [estoqueLocalId, setEstoqueLocalId] = useState<string>('');
  const [filtroSaldo, setFiltroSaldo] = useState<'todos' | 'saldo-zero' | 'saldo-positivo' | 'saldo-negativo'>('todos');

  // Carregar dados iniciais
  useEffect(() => {
    carregarModelos();
    EstoqueService.listarLocais().then(setLocaisEstoque);
  }, []);

  const carregarModelos = () => {
    const list = ModelosRelatorioService.listar();
    setModelos(list);
  };

  // Alternar instantaneamente se o modelo aparece na OS
  const handleToggleImpressaoOS = (id: string) => {
    const alvo = modelos.find((m) => m.id === id);
    if (!alvo) return;
    const atualizado = {
      ...alvo,
      disponivelNaImpressaoOS: !alvo.disponivelNaImpressaoOS,
    };
    ModelosRelatorioService.salvar(atualizado);
    carregarModelos();
  };

  // Atualizar Live Preview quando o template em edição mudar
  useEffect(() => {
    if (abaAtiva === 'editor' && modeloEmEdicao.templateHtml) {
      renderizarTemplateHtml(modeloEmEdicao.templateHtml, {}).then((html) => {
        setHtmlLivePreview(html);
      });
    }
  }, [abaAtiva, modeloEmEdicao.templateHtml]);

  // Atualizar iframe do live preview
  useEffect(() => {
    if (iframeLiveRef.current && htmlLivePreview) {
      const doc = iframeLiveRef.current.contentDocument || iframeLiveRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlLivePreview);
        doc.close();
      }
    }
  }, [htmlLivePreview]);

  // Atualizar iframe do modal de preview
  useEffect(() => {
    if (iframePreviewRef.current && htmlPreviewModal) {
      const doc = iframePreviewRef.current.contentDocument || iframePreviewRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlPreviewModal);
        doc.close();
      }
    }
  }, [htmlPreviewModal]);

  // Iniciar criação de novo modelo
  const handleNovoModelo = () => {
    setModeloEmEdicao({
      id: `modelo-custom-${Date.now()}`,
      codigo: 'MOD-NOVO',
      nome: 'Novo Modelo de Documento',
      descricao: 'Modelo personalizado com formatação A4 oficial e dados dinâmicos.',
      categoria: 'Ordem de Serviço',
      tipoMovimentoVinculado: 'Ordem de Serviço',
      disponivelNaImpressaoOS: true,
      formatoPapel: 'A4 Retrato',
      templateHtml: modelos[0]?.templateHtml || '',
      versao: 'REV 01',
      ativo: true,
    });
    setAbaAtiva('editor');
  };

  // Editar modelo existente
  const handleEditarModelo = (m: ModeloDocumentoRelatorio) => {
    setModeloEmEdicao({ ...m });
    setAbaAtiva('editor');
  };

  // Duplicar modelo existente
  const handleDuplicarModelo = (m: ModeloDocumentoRelatorio) => {
    const novo = ModelosRelatorioService.duplicar(m.id);
    if (novo) {
      carregarModelos();
      handleEditarModelo(novo);
    }
  };

  // Excluir modelo
  const handleExcluirModelo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo de relatório?')) {
      ModelosRelatorioService.excluir(id);
      carregarModelos();
    }
  };

  // Restaurar padrões
  const handleRestaurarPadroes = () => {
    if (confirm('Deseja restaurar todos os modelos padrão do sistema? Suas alterações serão redefinidas.')) {
      ModelosRelatorioService.restaurarPadroes();
      carregarModelos();
    }
  };

  // Abrir Modal de Preview A4
  const handleAbrirPreviewModal = async (m: ModeloDocumentoRelatorio) => {
    setModeloParaPreview(m);
    setPreviewModalAberto(true);
    const html = await renderizarTemplateHtml(m.templateHtml, {});
    setHtmlPreviewModal(html);
  };

  // Inserir variável no cursor do textarea
  const handleInserirVariavel = (tag: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const textoAtual = modeloEmEdicao.templateHtml || '';
    const novoTexto = textoAtual.substring(0, start) + tag + textoAtual.substring(end);

    setModeloEmEdicao((prev) => ({ ...prev, templateHtml: novoTexto }));

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = start + tag.length;
        textareaRef.current.selectionEnd = start + tag.length;
      }
    }, 50);
  };

  // Salvar modelo no serviço
  const handleSalvarModelo = () => {
    if (!modeloEmEdicao.nome || !modeloEmEdicao.templateHtml) {
      alert('Por favor preencha o nome do modelo e o código HTML.');
      return;
    }

    const completo: ModeloDocumentoRelatorio = {
      id: modeloEmEdicao.id || `mod-${Date.now()}`,
      codigo: modeloEmEdicao.codigo || 'MOD-01',
      nome: modeloEmEdicao.nome,
      descricao: modeloEmEdicao.descricao || '',
      categoria: (modeloEmEdicao.categoria as CategoriaModeloDocumento) || 'Ordem de Serviço',
      tipoMovimentoVinculado: modeloEmEdicao.tipoMovimentoVinculado || 'Ordem de Serviço',
      disponivelNaImpressaoOS: Boolean(modeloEmEdicao.disponivelNaImpressaoOS),
      formatoPapel: (modeloEmEdicao.formatoPapel as FormatoPapelDocumento) || 'A4 Retrato',
      templateHtml: modeloEmEdicao.templateHtml,
      versao: modeloEmEdicao.versao || 'REV 01',
      dataAtualizacao: new Date().toISOString().split('T')[0],
      ativo: modeloEmEdicao.ativo ?? true,
    };

    ModelosRelatorioService.salvar(completo);
    carregarModelos();
    setSalvoFeedback(true);
    setTimeout(() => setSalvoFeedback(false), 2500);
  };

  // Geração de relatórios analíticos
  const handleGerarAnalitico = async (tipo = tipoRelatorioAnalitico) => {
    setGerandoRelatorio(true);
    const res = await RelatoriosService.gerarRelatorio({
      tipo,
      estoqueLocalId: estoqueLocalId || undefined,
      filtroSaldo,
    });
    setRelatorioAnalitico(res);
    setGerandoRelatorio(false);
  };

  // Cores por categoria para badges e ícones (Design System Specification)
  const getCoresCategoria = (cat: string) => {
    switch (cat) {
      case 'Ordem de Serviço':
        return {
          bgIcon: '#EFF6FF',
          textIcon: '#2563EB',
          bgBadge: '#EFF6FF',
          textBadge: '#1D4ED8',
          borderBadge: '#BFDBFE',
        };
      case 'Etiquetas':
        return {
          bgIcon: '#E0F2FE',
          textIcon: '#0284C7',
          bgBadge: '#E0F2FE',
          textBadge: '#0369A1',
          borderBadge: '#BAE6FD',
        };
      case 'Certificados':
        return {
          bgIcon: '#FEF3C7',
          textIcon: '#D97706',
          bgBadge: '#FEF3C7',
          textBadge: '#92400E',
          borderBadge: '#FDE68A',
        };
      case 'Estoque':
        return {
          bgIcon: '#F3E8FF',
          textIcon: '#9333EA',
          bgBadge: '#F3E8FF',
          textBadge: '#6B21A8',
          borderBadge: '#E9D5FF',
        };
      case 'Fiscal':
        return {
          bgIcon: '#ECFDF5',
          textIcon: '#10B981',
          bgBadge: '#ECFDF5',
          textBadge: '#065F46',
          borderBadge: '#A7F3D0',
        };
      default:
        return {
          bgIcon: '#F1F5F9',
          textIcon: '#64748B',
          bgBadge: '#F8FAFC',
          textBadge: '#475569',
          borderBadge: '#E2E8F0',
        };
    }
  };

  const getIconeCategoria = (cat: string) => {
    if (cat === 'Etiquetas') return <Tag size={16} />;
    if (cat === 'Certificados') return <Award size={16} />;
    if (cat === 'Fiscal') return <FileCheck2 size={16} />;
    if (cat === 'Estoque') return <Boxes size={16} />;
    return <FileText size={16} />;
  };

  // Filtrar modelos
  const modelosFiltrados = modelos.filter((m) => {
    if (filtroCategoria !== 'Todas' && m.categoria !== filtroCategoria) return false;
    if (filtroMovimento !== 'Todos' && m.tipoMovimentoVinculado !== filtroMovimento) return false;
    if (filtroMenuOS === 'Apenas Menu OS' && !m.disponivelNaImpressaoOS) return false;
    if (filtroMenuOS === 'Apenas Avulsos' && m.disponivelNaImpressaoOS) return false;
    if (buscaModelo) {
      const q = buscaModelo.toLowerCase();
      return (
        m.nome.toLowerCase().includes(q) ||
        m.descricao.toLowerCase().includes(q) ||
        m.tipoMovimentoVinculado.toLowerCase().includes(q) ||
        (m.codigo && m.codigo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Métricas para KPI Cards
  const totalModelos = modelos.length;
  const modelosMenuOS = modelos.filter((m) => m.disponivelNaImpressaoOS).length;
  const modelosCertificados = modelos.filter((m) => m.categoria === 'Certificados').length;
  const modelosEstoque = modelos.filter((m) => m.categoria === 'Estoque').length;

  return (
    <div className="rarus-content-scroll">
      {/* CABEÇALHO DA PÁGINA (DESIGN SYSTEM) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
              Central de Modelos, Relatórios & Certificados
            </h1>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
              }}
            >
              Enterprise Hub
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Modelos oficiais A4 com escala metrológica, etiquetas térmicas com QR Code e regras de vinculação operacional.
          </p>
        </div>

        {/* NAVEGAÇÃO DE ABAS SEGMENTADA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#E2E8F0',
            padding: '4px',
            borderRadius: '10px',
          }}
        >
          <button
            onClick={() => setAbaAtiva('modelos')}
            style={{
              fontSize: '13px',
              fontWeight: abaAtiva === 'modelos' ? 700 : 500,
              padding: '7px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: abaAtiva === 'modelos' ? '#FFFFFF' : 'transparent',
              color: abaAtiva === 'modelos' ? '#2563EB' : '#475569',
              boxShadow: abaAtiva === 'modelos' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
            }}
            type="button"
          >
            <Layers size={15} color={abaAtiva === 'modelos' ? '#2563EB' : '#64748B'} />
            <span>Modelos Cadastrados</span>
            <span
              style={{
                fontSize: '11px',
                padding: '1px 7px',
                borderRadius: '9999px',
                backgroundColor: abaAtiva === 'modelos' ? '#EFF6FF' : '#CBD5E1',
                color: abaAtiva === 'modelos' ? '#1D4ED8' : '#334155',
                fontWeight: 700,
              }}
            >
              {modelos.length}
            </span>
          </button>

          <button
            onClick={() => setAbaAtiva('editor')}
            style={{
              fontSize: '13px',
              fontWeight: abaAtiva === 'editor' ? 700 : 500,
              padding: '7px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: abaAtiva === 'editor' ? '#FFFFFF' : 'transparent',
              color: abaAtiva === 'editor' ? '#2563EB' : '#475569',
              boxShadow: abaAtiva === 'editor' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
            }}
            type="button"
          >
            <Code size={15} color={abaAtiva === 'editor' ? '#2563EB' : '#64748B'} />
            <span>Editor & Novo Modelo</span>
          </button>

          <button
            onClick={() => {
              setAbaAtiva('emissao');
              if (!relatorioAnalitico) handleGerarAnalitico('estoque');
            }}
            style={{
              fontSize: '13px',
              fontWeight: abaAtiva === 'emissao' ? 700 : 500,
              padding: '7px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: abaAtiva === 'emissao' ? '#FFFFFF' : 'transparent',
              color: abaAtiva === 'emissao' ? '#2563EB' : '#475569',
              boxShadow: abaAtiva === 'emissao' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
            }}
            type="button"
          >
            <Printer size={15} color={abaAtiva === 'emissao' ? '#2563EB' : '#64748B'} />
            <span>Emissão Analítica</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ABA 1: MODELOS CADASTRADOS NO SISTEMA                     */}
      {/* ========================================================= */}
      {abaAtiva === 'modelos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* CARDS DE RESUMO / KPIS (DESIGN SYSTEM) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Layers size={22} />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>Total de Modelos</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{totalModelos}</div>
                <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '2px' }}>Templates operacionais</div>
              </div>
            </div>

            <div
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Printer size={22} />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>Menu de Impressão OS</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{modelosMenuOS}</div>
                <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '2px' }}>Disponíveis no clique da OS</div>
              </div>
            </div>

            <div
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>Certificados Metrológicos</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{modelosCertificados}</div>
                <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px' }}>Padrão RBC / ISO 17025</div>
              </div>
            </div>

            <div
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#F3E8FF',
                  color: '#9333EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Boxes size={22} />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>Logística & Estoque</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{modelosEstoque}</div>
                <div style={{ fontSize: '11px', color: '#9333EA', marginTop: '2px' }}>Mov. 3.1.03 e Contagem</div>
              </div>
            </div>
          </div>

          {/* BARRA DE FILTROS & AÇÕES */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: '340px', flexWrap: 'wrap' }}>
                {/* CAMPO DE BUSCA EXPANSIVO */}
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    className="rarus-input"
                    placeholder="Buscar por nome, código, movimento..."
                    value={buscaModelo}
                    onChange={(e) => setBuscaModelo(e.target.value)}
                    style={{ paddingLeft: '36px', height: '36px', fontSize: '13px', width: '100%' }}
                  />
                  {buscaModelo && (
                    <button
                      type="button"
                      onClick={() => setBuscaModelo('')}
                      style={{ position: 'absolute', right: 10, top: 9, color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* SELECT CATEGORIA */}
                <select
                  className="rarus-select"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  style={{ minWidth: '160px', height: '36px', fontSize: '13px' }}
                >
                  <option value="Todas">Todas Categorias</option>
                  <option value="Ordem de Serviço">Ordem de Serviço</option>
                  <option value="Etiquetas">Etiquetas</option>
                  <option value="Certificados">Certificados</option>
                  <option value="Estoque">Estoque</option>
                  <option value="Fiscal">Fiscal</option>
                </select>

                {/* SELECT MOVIMENTO */}
                <select
                  className="rarus-select"
                  value={filtroMovimento}
                  onChange={(e) => setFiltroMovimento(e.target.value)}
                  style={{ minWidth: '190px', height: '36px', fontSize: '13px' }}
                >
                  <option value="Todos">Todos os Movimentos</option>
                  <option value="Ordem de Serviço">Ordem de Serviço</option>
                  <option value="Calibração">Calibração</option>
                  <option value="3.1.03 - Transferência de Estoque">Transferência de Estoque</option>
                  <option value="Contagem de Estoque">Contagem de Estoque</option>
                  <option value="Venda/Saída NF-e">Venda/Saída NF-e</option>
                </select>

                {/* SELECT FILTRO MENU OS */}
                <select
                  className="rarus-select"
                  value={filtroMenuOS}
                  onChange={(e) => setFiltroMenuOS(e.target.value)}
                  style={{ minWidth: '150px', height: '36px', fontSize: '13px' }}
                >
                  <option value="Todos">Menu OS (Todos)</option>
                  <option value="Apenas Menu OS">Ativos no Menu OS</option>
                  <option value="Apenas Avulsos">Apenas Avulsos</option>
                </select>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleRestaurarPadroes}
                  style={{ height: '36px', fontSize: '12.5px', padding: '0 14px' }}
                  title="Restaura os modelos padrão da RARUS"
                  type="button"
                >
                  <RotateCcw size={14} />
                  <span>Restaurar Padrões</span>
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleNovoModelo}
                  style={{
                    height: '36px',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '0 16px',
                    boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
                  }}
                  type="button"
                >
                  <Plus size={15} />
                  <span>Novo Modelo</span>
                </button>
              </div>
            </div>
          </div>

          {/* TABELA DE MODELOS - COM CONTAINER COM SCROLL SEGURO E SEM QUEBRA DE LINHAS */}
          <div
            className="rarus-table-container"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              overflowX: 'auto',
            }}
          >
            <table className="rarus-table" style={{ width: '100%', minWidth: '1100px' }}>
              <thead>
                <tr>
                  <th style={{ width: '120px', minWidth: '120px', whiteSpace: 'nowrap' }}>Código</th>
                  <th style={{ minWidth: '320px' }}>Nome do Modelo</th>
                  <th style={{ width: '150px', minWidth: '150px', whiteSpace: 'nowrap' }}>Categoria</th>
                  <th style={{ width: '190px', minWidth: '190px', whiteSpace: 'nowrap' }}>Movimento Vinculado</th>
                  <th style={{ width: '170px', minWidth: '170px', textAlign: 'center', whiteSpace: 'nowrap' }}>Menu Impressão OS</th>
                  <th style={{ width: '120px', minWidth: '120px', whiteSpace: 'nowrap' }}>Papel</th>
                  <th style={{ width: '110px', minWidth: '110px', whiteSpace: 'nowrap' }}>Revisão</th>
                  <th style={{ width: '190px', minWidth: '190px', textAlign: 'right', whiteSpace: 'nowrap' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {modelosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                      Nenhum modelo encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  modelosFiltrados.map((m) => {
                    const coresCat = getCoresCategoria(m.categoria);
                    return (
                      <tr key={m.id} style={{ transition: 'background-color 0.15s ease' }}>
                        {/* CÓDIGO (NUNCA QUEBRA LINHA) */}
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono, monospace)',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              backgroundColor: '#F1F5F9',
                              color: '#334155',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                              letterSpacing: '0.2px',
                            }}
                          >
                            {m.codigo || 'MOD-01'}
                          </span>
                        </td>

                        {/* NOME DO MODELO */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                backgroundColor: coresCat.bgIcon,
                                color: coresCat.textIcon,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '1px',
                              }}
                            >
                              {getIconeCategoria(m.categoria)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '13px' }}>{m.nome}</div>
                              <div
                                style={{
                                  fontSize: '11.5px',
                                  color: '#64748B',
                                  lineHeight: '1.35',
                                  marginTop: '2px',
                                  maxWidth: '380px',
                                }}
                              >
                                {m.descricao}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORIA */}
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: coresCat.bgBadge,
                              color: coresCat.textBadge,
                              border: `1px solid ${coresCat.borderBadge}`,
                            }}
                          >
                            {m.categoria}
                          </span>
                        </td>

                        {/* MOVIMENTO VINCULADO */}
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600, fontSize: '12.5px', color: '#1E293B' }}>
                            {m.tipoMovimentoVinculado}
                          </div>
                        </td>

                        {/* MENU IMPRESSÃO OS (INTERATIVO COM 1 CLIQUE) */}
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleImpressaoOS(m.id)}
                            title="Clique para alternar se este modelo aparece no modal de impressão da OS"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '4px 11px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              backgroundColor: m.disponivelNaImpressaoOS ? '#DCFCE7' : '#F1F5F9',
                              color: m.disponivelNaImpressaoOS ? '#15803D' : '#64748B',
                              border: m.disponivelNaImpressaoOS ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                backgroundColor: m.disponivelNaImpressaoOS ? '#16A34A' : '#94A3B8',
                              }}
                            />
                            <span>{m.disponivelNaImpressaoOS ? 'Sim (Menu OS)' : 'Não (Avulso)'}</span>
                          </button>
                        </td>

                        {/* PAPEL */}
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              padding: '3px 7px',
                              borderRadius: '4px',
                              color: '#475569',
                            }}
                          >
                            {m.formatoPapel}
                          </span>
                        </td>

                        {/* REVISÃO */}
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '11.5px', color: '#64748B' }}>{m.versao}</span>
                        </td>

                        {/* AÇÕES (SEM CORTES OU OVERFLOW) */}
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleAbrirPreviewModal(m)}
                              style={{
                                padding: '4px 10px',
                                fontSize: '11.5px',
                                height: '29px',
                                color: '#0F172A',
                                fontWeight: 500,
                              }}
                              title="Visualizar documento em formato A4"
                              type="button"
                            >
                              <Eye size={13} style={{ marginRight: 4, color: '#2563EB' }} />
                              <span>Visualizar</span>
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleEditarModelo(m)}
                              style={{ padding: '4px 8px', fontSize: '11.5px', height: '29px' }}
                              title="Editar Template HTML"
                              type="button"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleDuplicarModelo(m)}
                              style={{ padding: '4px 8px', fontSize: '11.5px', height: '29px' }}
                              title="Duplicar Modelo"
                              type="button"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleExcluirModelo(m.id)}
                              style={{ padding: '4px 8px', fontSize: '11.5px', height: '29px', color: '#DC2626' }}
                              title="Excluir Modelo"
                              type="button"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* RODAPÉ DA TABELA COM CONTAGEM */}
            <div
              style={{
                padding: '12px 18px',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#64748B',
                backgroundColor: '#FAFAFA',
              }}
            >
              <span>Exibindo <strong>{modelosFiltrados.length}</strong> de <strong>{modelos.length}</strong> modelos cadastrados</span>
              <span>Dica: Clique no botão da coluna <strong>Menu Impressão OS</strong> para ativar ou desativar o documento no formulário da OS instantaneamente.</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ABA 2: EDITOR DE TEMPLATES & NOVO MODELO (SPLIT SCREEN)   */}
      {/* ========================================================= */}
      {abaAtiva === 'editor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* BARRA SUPERIOR DO EDITOR */}
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setAbaAtiva('modelos')} type="button" style={{ height: '34px' }}>
                  <span>← Voltar para Modelos</span>
                </button>
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                  Editando: {modeloEmEdicao.nome || 'Novo Modelo'}
                </h2>
                {salvoFeedback && (
                  <span style={{ color: 'var(--status-success-text)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <Check size={15} /> Salvo com sucesso!
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    const blob = new Blob([modeloEmEdicao.templateHtml || ''], { type: 'text/html;charset=utf-8' });
                    window.open(URL.createObjectURL(blob), '_blank');
                  }}
                  style={{ height: '34px', fontSize: '12.5px' }}
                  type="button"
                >
                  <ExternalLink size={14} />
                  <span>Abrir em Nova Aba</span>
                </button>
                <button className="btn btn-primary" onClick={handleSalvarModelo} type="button" style={{ height: '34px', fontSize: '13px', fontWeight: 600 }}>
                  <Save size={14} />
                  <span>Salvar Modelo</span>
                </button>
              </div>
            </div>

            {/* FORMULÁRIO DE METADADOS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                marginTop: 14,
                paddingTop: 14,
                borderTop: '1px solid var(--color-border-subtle)',
              }}
            >
              <div className="form-group">
                <label className="form-label">Nome do Modelo:</label>
                <input
                  type="text"
                  className="rarus-input"
                  value={modeloEmEdicao.nome || ''}
                  onChange={(e) => setModeloEmEdicao((prev) => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Código / Identificador:</label>
                <input
                  type="text"
                  className="rarus-input"
                  value={modeloEmEdicao.codigo || ''}
                  onChange={(e) => setModeloEmEdicao((prev) => ({ ...prev, codigo: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoria:</label>
                <select
                  className="rarus-select"
                  value={modeloEmEdicao.categoria || 'Ordem de Serviço'}
                  onChange={(e) => setModeloEmEdicao((prev) => ({ ...prev, categoria: e.target.value as any }))}
                >
                  <option value="Ordem de Serviço">Ordem de Serviço</option>
                  <option value="Etiquetas">Etiquetas</option>
                  <option value="Certificados">Certificados</option>
                  <option value="Estoque">Estoque</option>
                  <option value="Fiscal">Fiscal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Movimento Vinculado:</label>
                <input
                  type="text"
                  className="rarus-input"
                  value={modeloEmEdicao.tipoMovimentoVinculado || ''}
                  onChange={(e) => setModeloEmEdicao((prev) => ({ ...prev, tipoMovimentoVinculado: e.target.value }))}
                  placeholder="Ex: Ordem de Serviço, Calibração..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Formato do Papel:</label>
                <select
                  className="rarus-select"
                  value={modeloEmEdicao.formatoPapel || 'A4 Retrato'}
                  onChange={(e) => setModeloEmEdicao((prev) => ({ ...prev, formatoPapel: e.target.value as any }))}
                >
                  <option value="A4 Retrato">A4 Retrato (210x297mm)</option>
                  <option value="A4 Paisagem">A4 Paisagem (297x210mm)</option>
                  <option value="Etiqueta Lab">Etiqueta Lab (100x150mm)</option>
                  <option value="Etiqueta Térmica">Etiqueta Térmica</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '22px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '12.5px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(modeloEmEdicao.disponivelNaImpressaoOS)}
                    onChange={(e) =>
                      setModeloEmEdicao((prev) => ({ ...prev, disponivelNaImpressaoOS: e.target.checked }))
                    }
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Disponível no menu ao imprimir na OS</span>
                </label>
              </div>
            </div>
          </div>

          {/* SPLIT: VARIÁVEIS + EDITOR HTML À ESQUERDA | LIVE PREVIEW A4 À DIREITA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14, height: 'calc(100vh - 270px)', minHeight: '620px' }}>
            {/* PAINEL ESQUERDO: VARIÁVEIS E CÓDIGO HTML */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '14px',
                gap: 8,
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
              }}
            >
              {/* CHIPS DE VARIÁVEIS DINÂMICAS */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  Variáveis Dinâmicas (Clique para Inserir no Cursor):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: '90px', overflowY: 'auto' }}>
                  {VARIAVEIS_DISPONIVEIS.map((v) => (
                    <button
                      key={v.tag}
                      onClick={() => handleInserirVariavel(v.tag)}
                      className="btn btn-secondary"
                      style={{ padding: '2px 8px', fontSize: '11px', fontFamily: 'monospace' }}
                      title={v.desc}
                      type="button"
                    >
                      + {v.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEXTAREA COM CÓDIGO HTML */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                  <span>Código do Template HTML & CSS:</span>
                  <span>{modeloEmEdicao.templateHtml?.length || 0} caracteres</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={modeloEmEdicao.templateHtml || ''}
                  onChange={(e) => setModeloEmEdicao((prev) => ({ ...prev, templateHtml: e.target.value }))}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: 'monospace',
                    fontSize: '11.5px',
                    lineHeight: '1.4',
                    padding: '10px',
                    backgroundColor: '#0f172a',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    resize: 'none',
                    outline: 'none',
                  }}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* PAINEL DIREITO: LIVE PREVIEW A4 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                overflow: 'hidden',
                backgroundColor: '#334155',
                borderRadius: '12px',
                border: '1px solid #1E293B',
              }}
            >
              {/* CONTROLES DE ZOOM DO LIVE PREVIEW */}
              <div
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#0f172a',
                  borderBottom: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#fff',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="#38bdf8" />
                  <span>Live Preview Fiel A4 (Dados da OS 0005303)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => setZoomLive((z) => Math.max(0.4, z - 0.1))}
                    style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', padding: '3px 6px', cursor: 'pointer' }}
                    type="button"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span style={{ fontSize: '11.5px', width: '40px', textAlign: 'center' }}>
                    {Math.round(zoomLive * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLive((z) => Math.min(1.3, z + 0.1))}
                    style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px', padding: '3px 6px', cursor: 'pointer' }}
                    type="button"
                  >
                    <ZoomIn size={13} />
                  </button>
                </div>
              </div>

              {/* CONTAINER DO IFRAME ESCALONADO */}
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    transform: `scale(${zoomLive})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                    width: modeloEmEdicao.formatoPapel === 'Etiqueta Lab' ? '100mm' : '210mm',
                    minHeight: modeloEmEdicao.formatoPapel === 'Etiqueta Lab' ? '150mm' : '297mm',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.35)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    ref={iframeLiveRef}
                    title="Live Preview A4"
                    style={{
                      width: '100%',
                      height: modeloEmEdicao.formatoPapel === 'Etiqueta Lab' ? '150mm' : '297mm',
                      border: 'none',
                      backgroundColor: '#ffffff',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ABA 3: CENTRAL DE EMISSÃO ANALÍTICA & CONSULTAS           */}
      {/* ========================================================= */}
      {abaAtiva === 'emissao' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* FILTROS OPERACIONAIS */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div className="form-group" style={{ margin: 0, width: '240px' }}>
                <label className="form-label">Tipo de Relatório Analítico:</label>
                <select
                  className="rarus-select"
                  value={tipoRelatorioAnalitico}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setTipoRelatorioAnalitico(t);
                    handleGerarAnalitico(t);
                  }}
                  style={{ height: '36px' }}
                >
                  <option value="estoque">Posição de Estoque</option>
                  <option value="etiquetas">Etiquetas para Impressão</option>
                  <option value="orcamento">Orçamentos & Ordens de Serviço</option>
                  <option value="vencimentos-anual">Vencimento de Calibrações</option>
                  <option value="sla-os">SLA de Atendimento</option>
                </select>
              </div>

              {tipoRelatorioAnalitico === 'estoque' && (
                <>
                  <div className="form-group" style={{ margin: 0, width: '240px' }}>
                    <label className="form-label">Local de Estoque:</label>
                    <select
                      className="rarus-select"
                      value={estoqueLocalId}
                      onChange={(e) => setEstoqueLocalId(e.target.value)}
                      style={{ height: '36px' }}
                    >
                      <option value="">Todos os Locais</option>
                      {locaisEstoque.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.codigo ? `${l.codigo} - ` : ''}{l.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0, width: '180px' }}>
                    <label className="form-label">Filtro de Saldo:</label>
                    <select
                      className="rarus-select"
                      value={filtroSaldo}
                      onChange={(e) => setFiltroSaldo(e.target.value as any)}
                      style={{ height: '36px' }}
                    >
                      <option value="todos">Todos os Saldos</option>
                      <option value="saldo-positivo">Saldo &gt; 0</option>
                      <option value="saldo-zero">Saldo = 0</option>
                      <option value="saldo-negativo">Saldo &lt; 0</option>
                    </select>
                  </div>
                </>
              )}

              <button
                className="btn btn-primary"
                onClick={() => handleGerarAnalitico()}
                style={{ height: '36px', marginTop: '19px', padding: '0 16px', fontWeight: 600 }}
                type="button"
              >
                <Filter size={14} />
                <span>Atualizar Consulta</span>
              </button>
            </div>
          </div>

          {/* INDICADORES RESUMIDOS */}
          {relatorioAnalitico && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {Object.entries(relatorioAnalitico.indicadores).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    padding: '14px 18px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border-subtle)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                    {k.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', marginTop: 4 }}>
                    {String(v)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TABELA DE RESULTADOS ANALÍTICOS */}
          {relatorioAnalitico && relatorioAnalitico.itens.length > 0 && (
            <div
              className="rarus-table-container"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                overflowX: 'auto',
              }}
            >
              <table className="rarus-table">
                <thead>
                  <tr>
                    {Object.keys(relatorioAnalitico.itens[0]).map((col) => (
                      <th key={col} style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {col.replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {relatorioAnalitico.itens.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} style={{ whiteSpace: 'nowrap' }}>{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE PREVIEW EM TAMANHO CHEIO A4                     */}
      {/* ========================================================= */}
      {previewModalAberto && modeloParaPreview && (
        <div className="rarus-modal-backdrop" onClick={() => setPreviewModalAberto(false)} style={{ zIndex: 10000 }}>
          <div
            className="rarus-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '94vw',
              maxWidth: '1200px',
              height: '92vh',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              borderRadius: '12px',
            }}
          >
            {/* HEADER DO PREVIEW */}
            <div
              style={{
                padding: '12px 20px',
                backgroundColor: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #334155',
              }}
            >
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: 700 }}>
                  Visualização A4: {modeloParaPreview.nome}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                  Movimento: {modeloParaPreview.tipoMovimentoVinculado} • Papel: {modeloParaPreview.formatoPapel}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setZoomPreview((z) => Math.max(0.4, z - 0.1))}
                  style={{ background: '#334155', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                  type="button"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ color: '#fff', fontSize: '12px', width: '45px', textAlign: 'center' }}>
                  {Math.round(zoomPreview * 100)}%
                </span>
                <button
                  onClick={() => setZoomPreview((z) => Math.min(1.4, z + 0.1))}
                  style={{ background: '#334155', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                  type="button"
                >
                  <ZoomIn size={14} />
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (iframePreviewRef.current?.contentWindow) {
                      iframePreviewRef.current.contentWindow.focus();
                      iframePreviewRef.current.contentWindow.print();
                    }
                  }}
                  style={{ padding: '6px 14px', fontSize: '12.5px', fontWeight: 600 }}
                  type="button"
                >
                  <Printer size={14} />
                  <span>Imprimir Agora</span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setPreviewModalAberto(false)}
                  style={{ padding: '6px 12px', fontSize: '12.5px' }}
                  type="button"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* CORPO DO MODAL */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: '#334155',
              }}
            >
              <div
                style={{
                  transform: `scale(${zoomPreview})`,
                  transformOrigin: 'top center',
                  width: modeloParaPreview.formatoPapel === 'Etiqueta Lab' ? '100mm' : '210mm',
                  minHeight: modeloParaPreview.formatoPapel === 'Etiqueta Lab' ? '150mm' : '297mm',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <iframe
                  ref={iframePreviewRef}
                  title="Preview Modal A4"
                  style={{
                    width: '100%',
                    height: modeloParaPreview.formatoPapel === 'Etiqueta Lab' ? '150mm' : '297mm',
                    border: 'none',
                    backgroundColor: '#ffffff',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
