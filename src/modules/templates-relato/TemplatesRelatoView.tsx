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
            <span style={{ color: 'var(--rarus-success)', fontSize: '13px', fontWeight: 600 }}>
              ✓ Template salvo com sucesso!
            </span>
          )}
          <button className="btn-primary-rarus" onClick={handleSalvar} type="button">
            <Save size={15} />
            <span>Salvar Template</span>
          </button>
        </div>
      </div>

      {/* Seletor de Modelo de Relato */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {relatos.map((r) => (
          <button
            key={r.id}
            onClick={() => handleSelecionarRelato(r)}
            className={`btn-secondary-rarus ${relatoAtivo?.id === r.id ? 'active' : ''}`}
            style={{
              borderColor: relatoAtivo?.id === r.id ? 'var(--rarus-cyan)' : undefined,
              backgroundColor: relatoAtivo?.id === r.id ? 'var(--rarus-cyan-light)' : undefined,
              color: relatoAtivo?.id === r.id ? 'var(--rarus-navy)' : undefined,
              fontWeight: relatoAtivo?.id === r.id ? 700 : 500,
            }}
          >
            <Layers size={14} />
            <span>
              {r.tipoEquipamento} • ({r.tipoCalibracaoNome})
            </span>
          </button>
        ))}
      </div>

      {/* Barra de Variáveis Rápidas (Clique para Inserir) */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
        }}
      >
        <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
          CLIQUE PARA INSERIR VARIÁVEIS NO HTML:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {listaVariaveis.map((v) => (
            <button
              key={v.valor}
              onClick={() => handleInserirVariavel(v.valor)}
              style={{
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: '11.5px',
                cursor: 'pointer',
                color: 'var(--rarus-cyan)',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
              title={`Insere {{${v.valor}}}`}
            >
              + {`{{${v.valor}}}`}
            </button>
          ))}
        </div>
      </div>

      {/* Editor em Split-View */}
      <div className="rarus-split-editor">
        {/* Painel Esquerdo: Código HTML */}
        <div className="rarus-code-pane">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code size={14} /> Código HTML do Modelo
            </span>
            <span style={{ fontSize: '11px' }}>Suporta CSS inline</span>
          </div>
          <textarea
            value={codigoHtml}
            onChange={(e) => setCodigoHtml(e.target.value)}
            placeholder="Insira o código HTML do certificado com variáveis {{variavel}}..."
          />
        </div>

        {/* Painel Direito: Prévia em Tempo Real */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Eye size={14} /> Prévia em Tempo Real (Dados Simulados)
            </span>
            <span style={{ fontSize: '11px', color: 'var(--rarus-cyan)', fontWeight: 600 }}>
              Atualização Automática
            </span>
          </div>
          <div
            className="rarus-preview-pane"
            style={{ flex: 1 }}
            dangerouslySetInnerHTML={{ __html: htmlPrevia }}
          />
        </div>
      </div>
    </div>
  );
}
