'use client';

import React, { useState, useEffect } from 'react';
import { Equipamento } from '@/core/types';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { getUrlParam, updateUrlParams, clearUrlParams } from '@/core/utils/urlParams';
import {
  Wrench,
  Plus,
  Search,
  Save,
  Printer,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Award,
  Calendar,
  Layers,
  History,
  Shield,
} from 'lucide-react';

export const EquipamentosView: React.FC = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>(() => getUrlParam('tipo') || 'Todos');
  const [busca, setBusca] = useState<string>(() => getUrlParam('busca') || '');
  const [selecionado, setSelecionado] = useState<Equipamento | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const urlRestauradaRef = React.useRef(false);

  // Aba do formulário Card
  const [abaForm, setAbaForm] = useState<'identificacao' | 'complementares' | 'historico'>(
    () => (getUrlParam('aba') as any) || 'identificacao'
  );

  const handleMudarAba = (novaAba: typeof abaForm) => {
    setAbaForm(novaAba);
    updateUrlParams({ aba: novaAba });
  };

  const selecionarEquipamento = (eq: Equipamento, targetAba?: typeof abaForm) => {
    setSelecionado(eq);
    preencherForm(eq);
    const aba = targetAba || abaForm;
    if (targetAba) setAbaForm(targetAba);
    updateUrlParams({
      eqId: eq.id,
      serie: eq.numeroSerie,
      aba,
    });
  };

  const handleFechar = () => {
    setSelecionado(null);
    clearUrlParams('eqId', 'serie', 'aba');
  };

  const handleRowClick = (eq: Equipamento) => {
    if (selectedRowId === eq.id) {
      selecionarEquipamento(eq);
    } else {
      setSelectedRowId(eq.id);
    }
  };

  // Form State
  const [formIdObjeto, setFormIdObjeto] = useState('17815');
  const [formSerie, setFormSerie] = useState('GEH-2023-90812');
  const [formModelo, setFormModelo] = useState('G650i');
  const [formMarca, setFormMarca] = useState('GEHAKA');
  const [formPatrimonio, setFormPatrimonio] = useState('PAT-0012');
  const [formInmetro, setFormInmetro] = useState('SELO-INM-88910');
  const [formCliente, setFormCliente] = useState('C03709 - ESPAÇOGRÃOS EMPREENDIMENTOS E PARTICIPAÇÕES');
  const [formInativo, setFormInativo] = useState(false);
  const [formObs, setFormObs] = useState('Equipamento em operação na moega central de grãos');

  // Campos Complementares (Imagem aba 2)
  const [formLacreAnterior, setFormLacreAnterior] = useState('LAC-2024-0091');
  const [formSeloAnterior, setFormSeloAnterior] = useState('SELO-2024-881');
  const [formLacreNovo, setFormLacreNovo] = useState('LAC-2026-4401');
  const [formSeloNovo, setFormSeloNovo] = useState('SELO-INM-88910');
  const [formAnoFabricacao, setFormAnoFabricacao] = useState('2023');
  const [formDataServicoAnterior, setFormDataServicoAnterior] = useState('2025-02-15');
  const [formDataCalibracao, setFormDataCalibracao] = useState('2026-02-15');
  const [formPortaria, setFormPortaria] = useState('Portaria INMETRO/DIMEL Nº 0296/2013');
  const [formTemEtiquetaAnterior, setFormTemEtiquetaAnterior] = useState('Sim, etiqueta Elgin térmica preservada');

  useEffect(() => {
    carregar();
  }, [filtroTipo, busca]);

  useEffect(() => {
    if (selecionado) {
      preencherForm(selecionado);
    }
  }, [selecionado]);

  const carregar = async () => {
    const list = await EquipamentosService.listar({
      tipoEquipamento: filtroTipo !== 'Todos' ? filtroTipo : undefined,
      busca: busca || undefined,
    });
    setEquipamentos(list);

    // Restauração via URL (F5-Proof)
    if (!urlRestauradaRef.current) {
      urlRestauradaRef.current = true;
      const paramEqId = getUrlParam('eqId');
      const paramSerie = getUrlParam('serie');
      const paramAba = (getUrlParam('aba') as any) || 'identificacao';

      if (paramEqId || paramSerie) {
        let found = list.find(
          (e) =>
            (paramEqId && e.id === paramEqId) ||
            (paramSerie && e.numeroSerie.toLowerCase() === paramSerie.toLowerCase())
        );
        if (!found) {
          const todos = await EquipamentosService.listar();
          found = todos.find(
            (e) =>
              (paramEqId && e.id === paramEqId) ||
              (paramSerie && e.numeroSerie.toLowerCase() === paramSerie.toLowerCase())
          );
        }
        if (found) {
          selecionarEquipamento(found, paramAba);
        }
      }
    }
  };

  const preencherForm = (eq: Equipamento) => {
    setFormIdObjeto(eq.id.replace(/\D/g, '') || '17815');
    setFormSerie(eq.numeroSerie);
    setFormModelo(eq.modelo);
    setFormMarca(eq.fabricante);
    setFormPatrimonio(eq.patrimonio || '');
    setFormInmetro(eq.seloNovo || '');
    setFormCliente(eq.clienteNome);
    setFormLacreAnterior(eq.lacreAnterior || '');
    setFormSeloAnterior(eq.seloAnterior || '');
    setFormLacreNovo(eq.lacreNovo || '');
    setFormSeloNovo(eq.seloNovo || '');
    setFormObs(eq.observacoes || '');
  };

  const handleAbrirNovo = () => {
    const novoId = String(17800 + Math.floor(Math.random() * 100));
    setFormIdObjeto(novoId);
    setFormSerie('');
    setFormModelo('G650i');
    setFormMarca('GEHAKA');
    setFormPatrimonio('');
    setFormInmetro('');
    setFormCliente('C03709 - AgroGrãos Cooperativa');
    setFormInativo(false);
    setFormObs('');
    setFormLacreAnterior('');
    setFormSeloAnterior('');
    setFormLacreNovo('');
    setFormSeloNovo('');
    setSelecionado({
      id: `eq-${novoId}`,
      clienteId: 'cli-1',
      clienteNome: 'AgroGrãos Cooperativa',
      numeroSerie: '',
      fabricante: 'GEHAKA',
      modelo: 'G650i',
      tipoEquipamento: 'Medidor de Umidade GEHAKA',
      faixaMedicao: '8 a 50 %',
      resolucao: '0,1 %',
      patrimonio: '',
      dataUltimaCalibracao: new Date().toISOString().split('T')[0],
      dataProximaCalibracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Calibrado',
    });
    setAbaForm('identificacao');
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSerie || !formModelo) {
      alert('Preencha os campos obrigatórios: Série e Modelo');
      return;
    }

    await EquipamentosService.criar({
      clienteId: 'cli-1',
      clienteNome: formCliente,
      numeroSerie: formSerie,
      fabricante: formMarca,
      modelo: formModelo,
      tipoEquipamento: 'Medidor de Umidade GEHAKA',
      faixaMedicao: '8 a 50 %',
      resolucao: '0,1 %',
      patrimonio: formPatrimonio,
      lacreAnterior: formLacreAnterior,
      seloAnterior: formSeloAnterior,
      lacreNovo: formLacreNovo,
      seloNovo: formSeloNovo,
      dataUltimaCalibracao: formDataCalibracao,
      dataProximaCalibracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: formInativo ? 'Em Manutenção' : 'Calibrado',
      observacoes: formObs,
    });

    alert('Equipamento salvo com sucesso!');
    carregar();
  };

  // SE UM EQUIPAMENTO ESTÁ ABERTO PARA EDIÇÃO (CARD FORM):
  if (selecionado) {
    return (
      <div className="rarus-content-scroll rarus-fullscreen-view">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleFechar} type="button">
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Equipamentos</span>
          </button>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Ficha Técnica em Tela Cheia • ID {formIdObjeto}
          </span>
        </div>

        {/* CONTAINER CARD FORMULÁRIO (PADRÃO ESPECIFICAÇÃO & IMAGEM REAL) */}
        <div className="card-container">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 className="card-title">
                Equipamento — {formModelo} (Série: {formSerie || 'Novo'})
              </h2>
              <span className={`status-badge ${formInativo ? 'inativo' : 'ativo'}`}>
                <span className="rarus-status-dot" />
                {formInativo ? 'Inativo' : 'Ativo / Calibrado'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Identificador: <strong>{formIdObjeto}</strong>
            </div>
          </div>

          {/* Barra de Ações */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={handleAbrirNovo} type="button">
              <Plus size={14} />
              <span>Novo</span>
            </button>
            <button className="btn btn-secondary" onClick={handleSalvar} type="button">
              <Save size={14} />
              <span>Salvar</span>
            </button>
            <button className="btn btn-secondary" onClick={handleFechar} type="button">
              <ArrowLeft size={14} />
              <span>Cancelar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()} type="button">
              <Printer size={14} />
              <span>Imprimir Ficha</span>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirm('Deseja marcar este equipamento como inativo?')) {
                  setFormInativo(true);
                }
              }}
              type="button"
            >
              <Trash2 size={14} />
              <span>Excluir</span>
            </button>
          </div>

          {/* Abas */}
          <div className="tabs-navigation">
            <button
              className={`tab-button ${abaForm === 'identificacao' ? 'active' : ''}`}
              onClick={() => handleMudarAba('identificacao')}
              type="button"
            >
              1. Identificação
            </button>
            <button
              className={`tab-button ${abaForm === 'complementares' ? 'active' : ''}`}
              onClick={() => handleMudarAba('complementares')}
              type="button"
            >
              2. Campos Complementares (Lacres & Selos)
            </button>
            <button
              className={`tab-button ${abaForm === 'historico' ? 'active' : ''}`}
              onClick={() => handleMudarAba('historico')}
              type="button"
            >
              3. Histórico de OS & Anotações
            </button>
          </div>

          {/* Corpo do Formulário */}
          <div className="card-body">
            {/* Aba 1: Identificação (Imagem 1) */}
            {abaForm === 'identificacao' && (
              <div className="form-grid">
                <div className="form-group col-2">
                  <label className="form-label">Identificador</label>
                  <input className="form-input" value={formIdObjeto} readOnly />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Série *</label>
                  <input
                    className="form-input"
                    value={formSerie}
                    onChange={(e) => setFormSerie(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Modelo *</label>
                  <input
                    className="form-input"
                    value={formModelo}
                    onChange={(e) => setFormModelo(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Marca / Fabricante</label>
                  <input
                    className="form-input"
                    value={formMarca}
                    onChange={(e) => setFormMarca(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Patrimônio do Cliente</label>
                  <input
                    className="form-input"
                    value={formPatrimonio}
                    onChange={(e) => setFormPatrimonio(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Selo INMETRO</label>
                  <input
                    className="form-input"
                    value={formInmetro}
                    onChange={(e) => setFormInmetro(e.target.value)}
                  />
                </div>

                <div className="form-group col-10">
                  <label className="form-label">Cliente / Fornecedor Titular *</label>
                  <input
                    className="form-input"
                    value={formCliente}
                    onChange={(e) => setFormCliente(e.target.value)}
                  />
                </div>
                <div className="form-group col-2">
                  <label className="form-label">Inativo?</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="chk-inativo"
                      checked={formInativo}
                      onChange={(e) => setFormInativo(e.target.checked)}
                    />
                    <label htmlFor="chk-inativo">Sim</label>
                  </div>
                </div>

                <div className="form-group col-12">
                  <label className="form-label">Observações Gerais</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={formObs}
                    onChange={(e) => setFormObs(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Aba 2: Campos Complementares (Imagem 2) */}
            {abaForm === 'complementares' && (
              <div className="form-grid">
                <div className="form-group col-6">
                  <label className="form-label">Lacre Anterior</label>
                  <input
                    className="form-input"
                    value={formLacreAnterior}
                    onChange={(e) => setFormLacreAnterior(e.target.value)}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Selo Anterior</label>
                  <input
                    className="form-input"
                    value={formSeloAnterior}
                    onChange={(e) => setFormSeloAnterior(e.target.value)}
                  />
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Lacre Novo</label>
                  <input
                    className="form-input"
                    value={formLacreNovo}
                    onChange={(e) => setFormLacreNovo(e.target.value)}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Selo Novo (INMETRO)</label>
                  <input
                    className="form-input"
                    value={formSeloNovo}
                    onChange={(e) => setFormSeloNovo(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Ano de Fabricação</label>
                  <input
                    className="form-input"
                    value={formAnoFabricacao}
                    onChange={(e) => setFormAnoFabricacao(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Data Serviço Anterior</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formDataServicoAnterior}
                    onChange={(e) => setFormDataServicoAnterior(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Data da Calibração</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formDataCalibracao}
                    onChange={(e) => setFormDataCalibracao(e.target.value)}
                  />
                </div>

                <div className="form-group col-8">
                  <label className="form-label">Portaria INMETRO</label>
                  <input
                    className="form-input"
                    value={formPortaria}
                    onChange={(e) => setFormPortaria(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Tem Etiqueta Anterior?</label>
                  <input
                    className="form-input"
                    value={formTemEtiquetaAnterior}
                    onChange={(e) => setFormTemEtiquetaAnterior(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Aba 3: Histórico de OS */}
            {abaForm === 'historico' && (
              <div>
                <table className="rarus-table">
                  <thead>
                    <tr>
                      <th>Nº OS</th>
                      <th>Data</th>
                      <th>Tipo de Serviço</th>
                      <th>Técnico</th>
                      <th>Certificado Emitido</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>#0005307</strong></td>
                      <td>02/09/2026</td>
                      <td>Calibração em Campo (In Loco)</td>
                      <td>Caio Detz</td>
                      <td><code>1045-1/25</code></td>
                      <td><span className="status-badge ativo">Concluído</span></td>
                    </tr>
                    <tr>
                      <td><strong>#0005298</strong></td>
                      <td>24/08/2026</td>
                      <td>Manutenção Preventiva Safra</td>
                      <td>Itamar Soares</td>
                      <td>-</td>
                      <td><span className="status-badge ativo">Encerrada</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card-footer">
            <div>
              Cadastrado em: <strong>02/09/2026</strong> • Usr: <strong>CAIO DETZ</strong>
            </div>
            <div>
              Portaria Homologada: <strong>INMETRO DIMEL 0296/2013</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LISTAGEM PRINCIPAL DE EQUIPAMENTOS
  return (
    <div className="rarus-content-scroll">
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Equipamentos & Instrumentos Metrológicos</h1>
          <p>
            Parque instalado dos clientes com foco em medidores de grãos GEHAKA, balanças de precisão e controle de lacres/selos
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAbrirNovo} type="button">
          <Plus size={15} />
          <span>Cadastrar Equipamento</span>
        </button>
      </div>

      {/* KPI Cards */}
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
          <div className="rarus-kpi-value">{equipamentos.filter((e) => e.status === 'Calibrado').length}</div>
          <span className="rarus-kpi-trend trend-up">100% de conformidade técnica</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Aparelhos com Selo INMETRO</span>
            <div className="rarus-kpi-icon-box">
              <Shield size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{equipamentos.filter((e) => e.seloNovo).length}</div>
          <span className="rarus-kpi-trend trend-up">Rastreabilidade metrológica</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Previsão Comercial 1 Ano</span>
            <div className="rarus-kpi-icon-box">
              <Calendar size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">1</div>
          <span className="rarus-kpi-trend trend-neutral">Avisar para safra futura</span>
        </div>
      </div>

      {/* DataGrid Container (Baseado em tabela de equipamentos vinculados) */}
      <div className="rarus-datagrid-container">
        <div className="rarus-grid-header-tabs">
          <button
            className={`rarus-filter-tab-pill ${filtroTipo === 'Todos' ? 'active' : ''}`}
            onClick={() => {
              setFiltroTipo('Todos');
              updateUrlParams({ tipo: null });
            }}
          >
            <span>Todos os Equipamentos</span>
            <span className="count">{equipamentos.length}</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${filtroTipo === 'Medidor de Umidade GEHAKA' ? 'active' : ''}`}
            onClick={() => {
              setFiltroTipo('Medidor de Umidade GEHAKA');
              updateUrlParams({ tipo: 'Medidor de Umidade GEHAKA' });
            }}
          >
            <span>Medidores de Umidade GEHAKA</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${filtroTipo === 'Balança de Precisão' ? 'active' : ''}`}
            onClick={() => {
              setFiltroTipo('Balança de Precisão');
              updateUrlParams({ tipo: 'Balança de Precisão' });
            }}
          >
            <span>Balanças de Precisão</span>
          </button>
        </div>

        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--color-text-muted)" />
            <input
              placeholder="Buscar por Modelo, Série, Patrimônio, INMETRO ou Cliente..."
              value={busca}
              onChange={(e) => {
                const val = e.target.value;
                setBusca(val);
                updateUrlParams({ busca: val || null });
              }}
            />
          </div>
        </div>

        <div className="rarus-table-container">
          <table className="rarus-table">
            <thead>
              <tr>
                <th>ID Objeto</th>
                <th>Série</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>INMETRO</th>
                <th>Patrimônio</th>
                <th>Cliente Titular</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((eq) => {
                const isSelected = selectedRowId === eq.id;
                return (
                  <tr
                    key={eq.id}
                    className={isSelected ? 'rarus-row-selected' : ''}
                    onClick={() => handleRowClick(eq)}
                    title={isSelected ? 'Clique novamente para abrir a ficha técnica em tela cheia' : 'Clique para selecionar o equipamento'}
                  >
                    <td><code>17815</code></td>
                    <td><strong style={{ color: 'var(--color-primary-500)' }}>{eq.numeroSerie}</strong></td>
                    <td>{eq.modelo}</td>
                    <td>{eq.fabricante}</td>
                    <td>{eq.seloNovo || 'SELO-INM-88910'}</td>
                    <td>{eq.patrimonio || 'S/N'}</td>
                    <td>{eq.clienteNome}</td>
                    <td>
                      <span className={`status-badge ${eq.status === 'Calibrado' ? 'ativo' : 'inativo'}`}>
                        <span className="rarus-status-dot" />
                        {eq.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          selecionarEquipamento(eq);
                        }}
                        type="button"
                      >
                        Ficha Técnica
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
