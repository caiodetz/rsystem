'use client';

import React, { useState, useEffect } from 'react';
import { RelatosService } from '@/core/services/relatosService';
import { RelatoCalibracao } from '@/core/types';
import {
  FileCode2,
  Eye,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Code,
  RotateCcw,
  Printer,
  Copy,
} from 'lucide-react';

export function TemplatesRelatoView() {
  const [relatos, setRelatos] = useState<RelatoCalibracao[]>([]);
  const [relatoAtivo, setRelatoAtivo] = useState<RelatoCalibracao | null>(null);
  const [codigoHtml, setCodigoHtml] = useState<string>('');
  const [mensagemSalvo, setMensagemSalvo] = useState(false);

  useEffect(() => {
    carregarRelatos();
  }, []);

  const carregarRelatos = async () => {
    const list = await RelatosService.listarRelatos();
    setRelatos(list);
    if (list.length > 0) {
      setRelatoAtivo(list[0]);
      setCodigoHtml(list[0].templateHtmlCertificado);
    }
  };

  const handleSelecionarRelato = (r: RelatoCalibracao) => {
    setRelatoAtivo(r);
    setCodigoHtml(r.templateHtmlCertificado);
    setMensagemSalvo(false);
  };

  const handleInserirVariavel = (varName: string) => {
    setCodigoHtml((prev) => prev + `{{${varName}}}`);
  };

  const handleSalvar = async () => {
    if (!relatoAtivo) return;
    const atualizado = {
      ...relatoAtivo,
      templateHtmlCertificado: codigoHtml,
    };
    await RelatosService.salvarRelato(atualizado);
    setMensagemSalvo(true);
    setTimeout(() => setMensagemSalvo(false), 2500);
  };

  const handleRestaurarPadrao = () => {
    if (!relatoAtivo) return;
    if (confirm('Deseja restaurar o código HTML padrão deste modelo de certificado?')) {
      const templateOriginal = RelatosService.obterTemplateOriginal(relatoAtivo.id);
      if (templateOriginal) {
        setCodigoHtml(templateOriginal);
      }
    }
  };

  const handleCopiarHtml = () => {
    navigator.clipboard.writeText(codigoHtml);
    alert('Código HTML copiado para a área de transferência!');
  };

  // Variáveis simuladas para a prévia em tempo real
  const variaveisSimuladas = {
    certificado: {
      numero: '1045-1/25',
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      hash: 'RARUS-AUTH-7A8B9C10',
    },
    cliente: {
      razaoSocial: 'Cooperativa Agroindustrial Grãos do Vale',
      cnpj: '14.288.910/0001-44',
    },
    equipamento: {
      modelo: 'GEHAKA G650i',
      numeroSerie: 'GEH-2023-90812',
      patrimonio: 'PAT-AGRO-401',
      lacreNovo: 'LAC-2025-1022',
      seloNovo: 'SELO-INM-55201',
    },
    padrao: {
      identificador: 'TH-01',
      descricao: 'Termohigrômetro Digital Testo 625 Reference',
      certificado: 'LT-457 607',
    },
    ensaio: {
      temperaturaAmbiente: 22.4,
      umidadeAmbiente: 54.0,
      leituraPadrao13: 13.1,
      leituraPadrao20: 19.9,
    },
    tecnico: {
      nome: 'Itamar Soares',
    },
  };

  const htmlPrevia = relatoAtivo
    ? RelatosService.renderizarHtmlCertificado(codigoHtml, variaveisSimuladas)
    : '';

  const listaVariaveis = [
    { label: 'Nº Certificado', valor: 'certificado.numero' },
    { label: 'Data de Emissão', valor: 'certificado.dataEmissao' },
    { label: 'Razão Social Cliente', valor: 'cliente.razaoSocial' },
    { label: 'CNPJ Cliente', valor: 'cliente.cnpj' },
    { label: 'Modelo Equipamento', valor: 'equipamento.modelo' },
    { label: 'Nº Série Equipamento', valor: 'equipamento.numeroSerie' },
    { label: 'Patrimônio', valor: 'equipamento.patrimonio' },
    { label: 'Lacre Novo', valor: 'equipamento.lacreNovo' },
    { label: 'Selo Novo', valor: 'equipamento.seloNovo' },
    { label: 'ID Padrão Metrológico', valor: 'padrao.identificador' },
    { label: 'Certificado RBC Padrão', valor: 'padrao.certificado' },
    { label: 'Nome do Técnico', valor: 'tecnico.nome' },
    { label: 'Chave Digital (Hash)', valor: 'certificado.hash' },
  ];

  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Editor de Templates HTML de Certificados (Relatos)</h1>
          <p>
            Configure o layout, variáveis dinâmicas e critérios metrológicos por Tipo de Equipamento (GEHAKA, Balanças, etc.)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {mensagemSalvo && (
            <span style={{ color: 'var(--status-success-text)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} />
              Template salvo com sucesso!
            </span>
          )}
          <button className="btn btn-secondary" onClick={handleRestaurarPadrao} type="button">
            <RotateCcw size={14} />
            <span>Restaurar Padrão</span>
          </button>
          <button className="btn btn-primary" onClick={handleSalvar} type="button">
            <Save size={14} />
            <span>Salvar Template</span>
          </button>
        </div>
      </div>

      {/* Seletor de Modelo de Relato */}
      <div className="rarus-datagrid-container" style={{ flexShrink: 0 }}>
        <div className="rarus-grid-header-tabs" style={{ borderBottom: 'none' }}>
          {relatos.map((r) => {
            const isAtivo = relatoAtivo?.id === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelecionarRelato(r)}
                className={`rarus-filter-tab-pill ${isAtivo ? 'active' : ''}`}
              >
                <Layers size={14} />
                <span>
                  {r.tipoEquipamento} • ({r.tipoCalibracaoNome})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de Variáveis Rápidas (Clique para Inserir) */}
      <div
        className="rarus-datagrid-container"
        style={{
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Clique para inserir variáveis dinâmicas no código HTML:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {listaVariaveis.map((v) => (
            <button
              key={v.valor}
              type="button"
              onClick={() => handleInserirVariavel(v.valor)}
              className="btn btn-secondary"
              style={{
                padding: '3px 8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 600,
                color: 'var(--color-primary-500)',
                backgroundColor: 'var(--color-primary-50)',
                borderColor: 'rgba(37, 99, 235, 0.2)',
                height: '26px',
              }}
              title={`Insere {{${v.valor}}}`}
            >
              + {`{{${v.valor}}}`}
            </button>
          ))}
        </div>
      </div>

      {/* Editor em Split-View Responsivo com Editor Ampliado */}
      <div className="rarus-split-editor">
        {/* Painel Esquerdo: Código HTML com Altura Confortável */}
        <div className="rarus-code-pane">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code size={15} color="var(--color-primary-500)" />
              Código HTML do Modelo ({relatoAtivo?.tipoEquipamento || 'G650i'})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '2px 8px', fontSize: '11px', height: '24px' }}
                onClick={handleCopiarHtml}
                title="Copiar código HTML"
              >
                <Copy size={12} />
                <span>Copiar</span>
              </button>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Suporta CSS inline & Flex/Grid
              </span>
            </div>
          </div>
          <textarea
            className="rarus-code-textarea"
            value={codigoHtml}
            onChange={(e) => setCodigoHtml(e.target.value)}
            placeholder="Insira o código HTML do certificado com variáveis {{variavel}}..."
            spellCheck={false}
          />
        </div>

        {/* Painel Direito: Prévia em Tempo Real */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Eye size={15} color="var(--color-primary-500)" />
              Prévia do Certificado em Tempo Real
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-primary-500)', fontWeight: 600 }}>
              ● Atualização Instantânea
            </span>
          </div>
          <div
            className="rarus-preview-pane"
            dangerouslySetInnerHTML={{ __html: htmlPrevia }}
          />
        </div>
      </div>
    </div>
  );
}
