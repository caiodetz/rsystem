'use client';

import React, { useState, useEffect } from 'react';
import { Cliente, Equipamento } from '@/core/types';
import { ClientesService } from '@/core/services/clientesService';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { getUrlParam, updateUrlParams, clearUrlParams } from '@/core/utils/urlParams';
import {
  Users,
  Plus,
  Search,
  Save,
  Printer,
  Trash2,
  ArrowLeft,
  Wrench,
  Award,
  ClipboardList,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ClientesView: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState<string>(() => getUrlParam('busca') || '');
  const [segmentoFiltro, setSegmentoFiltro] = useState<string>(() => getUrlParam('segmento') || 'todos');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const urlRestauradaRef = React.useRef(false);

  // Aba ativa do formulário card (inicializada via URL)
  const [abaForm, setAbaForm] = useState<
    'identificacao' | 'endereco' | 'observacoes' | 'tributacao' | 'confidencial' | 'equipamentos'
  >(() => (getUrlParam('aba') as any) || 'identificacao');

  const handleMudarAba = (novaAba: typeof abaForm) => {
    setAbaForm(novaAba);
    updateUrlParams({ aba: novaAba });
  };

  const selecionarCliente = (c: Cliente, targetAba?: typeof abaForm) => {
    setClienteSelecionado(c);
    preencherForm(c);
    const aba = targetAba || abaForm;
    if (targetAba) setAbaForm(targetAba);
    updateUrlParams({
      cliente: c.codigo,
      clienteId: c.id,
      novoCliente: null,
      aba,
    });
  };

  const handleFecharFormulario = () => {
    setClienteSelecionado(null);
    clearUrlParams('cliente', 'clienteId', 'novoCliente', 'aba');
  };

  const handleRowClick = (c: Cliente) => {
    if (selectedRowId === c.id) {
      selecionarCliente(c);
    } else {
      setSelectedRowId(c.id);
    }
  };

  // Equipamentos do cliente selecionado
  const [equipamentosCliente, setEquipamentosCliente] = useState<Equipamento[]>([]);

  // Form State
  const [formCodigo, setFormCodigo] = useState('C03709');
  const [formTipoPessoa, setFormTipoPessoa] = useState('Jurídica');
  const [formCnpj, setFormCnpj] = useState('');
  const [formRazaoSocial, setFormRazaoSocial] = useState('');
  const [formNomeFantasia, setFormNomeFantasia] = useState('');
  const [formInscEstadual, setFormInscEstadual] = useState('');
  const [formInscMunicipal, setFormInscMunicipal] = useState('');
  const [formDataCadastro, setFormDataCadastro] = useState('2026-09-02');
  const [formTelefone1, setFormTelefone1] = useState('');
  const [formTelefone2, setFormTelefone2] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTipoCliente, setFormTipoCliente] = useState('Agronegócio / Grãos');
  const [formRamoAtividade, setFormRamoAtividade] = useState('Armazenamento e Beneficiamento de Grãos');
  const [formRegiao, setFormRegiao] = useState('Centro-Oeste / Vale do Paranapanema');
  const [formRenasem, setFormRenasem] = useState('');
  const [formAtivo, setFormAtivo] = useState(true);

  // Endereço
  const [formCep, setFormCep] = useState('');
  const [formLogradouro, setFormLogradouro] = useState('');
  const [formNumero, setFormNumero] = useState('');
  const [formComplemento, setFormComplemento] = useState('');
  const [formBairro, setFormBairro] = useState('');
  const [formCidade, setFormCidade] = useState('');
  const [formUf, setFormUf] = useState('SP');

  // Observações
  const [formObs, setFormObs] = useState('');

  // Tributação
  const [formIndicadorIe, setFormIndicadorIe] = useState('1 - Contribuinte ICMS');
  const [formRegimeTributario, setFormRegimeTributario] = useState('1 - Simples Nacional');

  // Modal Equipamento Vinculado (Formulário completo idêntico ao de Equipamentos)
  const [modalNovoEquipamento, setModalNovoEquipamento] = useState(false);
  const [eqAbaForm, setEqAbaForm] = useState<'identificacao' | 'complementares' | 'historico'>('identificacao');
  const [eqIdObjeto, setEqIdObjeto] = useState('17815');
  const [eqModelo, setEqModelo] = useState('G650i');
  const [eqFabricante, setEqFabricante] = useState('GEHAKA');
  const [eqSerie, setEqSerie] = useState('');
  const [eqPatrimonio, setEqPatrimonio] = useState('');
  const [eqInmetro, setEqInmetro] = useState('SELO-INM-88910');
  const [eqInativo, setEqInativo] = useState(false);
  const [eqObs, setEqObs] = useState('');
  // Campos Complementares (Aba 2)
  const [eqLacreAnterior, setEqLacreAnterior] = useState('LAC-2024-0091');
  const [eqSeloAnterior, setEqSeloAnterior] = useState('SELO-2024-881');
  const [eqLacreNovo, setEqLacreNovo] = useState('LAC-2026-4401');
  const [eqSeloNovo, setEqSeloNovo] = useState('SELO-INM-88910');
  const [eqAnoFabricacao, setEqAnoFabricacao] = useState('2023');
  const [eqDataServicoAnterior, setEqDataServicoAnterior] = useState('2025-02-15');
  const [eqDataCalibracao, setEqDataCalibracao] = useState(new Date().toISOString().split('T')[0]);
  const [eqPortaria, setEqPortaria] = useState('Portaria INMETRO/DIMEL Nº 0296/2013');
  const [eqTemEtiquetaAnterior, setEqTemEtiquetaAnterior] = useState('Sim, etiqueta Elgin térmica preservada');

  useEffect(() => {
    carregarClientes();
  }, [busca, segmentoFiltro]);

  useEffect(() => {
    if (clienteSelecionado) {
      preencherForm(clienteSelecionado);
      carregarEquipamentos(clienteSelecionado.id);
    }
  }, [clienteSelecionado]);

  const carregarClientes = async () => {
    let itens = await ClientesService.listar(busca);
    if (segmentoFiltro !== 'todos') {
      itens = itens.filter((c) => c.segmento.toLowerCase().includes(segmentoFiltro.toLowerCase()));
    }
    setClientes(itens);

    // Restauração de formulário de Cliente via URL (F5-Proof)
    if (!urlRestauradaRef.current) {
      urlRestauradaRef.current = true;
      const paramNovo = getUrlParam('novoCliente');
      const paramCliente = getUrlParam('cliente');
      const paramClienteId = getUrlParam('clienteId');
      const paramAba = (getUrlParam('aba') as any) || 'identificacao';

      if (paramNovo === 'true') {
        handleAbrirNovoCliente(paramAba);
      } else if (paramCliente || paramClienteId) {
        let found = itens.find(
          (c) =>
            (paramCliente && (c.codigo.toUpperCase() === paramCliente.toUpperCase() || c.razaoSocial.toLowerCase().includes(paramCliente.toLowerCase()))) ||
            (paramClienteId && c.id === paramClienteId)
        );
        if (!found) {
          const todos = await ClientesService.listar();
          found = todos.find(
            (c) =>
              (paramCliente && (c.codigo.toUpperCase() === paramCliente.toUpperCase() || c.razaoSocial.toLowerCase().includes(paramCliente.toLowerCase()))) ||
              (paramClienteId && c.id === paramClienteId)
          );
        }
        if (found) {
          selecionarCliente(found, paramAba);
        }
      }
    }
  };

  const carregarEquipamentos = async (clienteId: string) => {
    const eqs = await EquipamentosService.listar({ clienteId });
    setEquipamentosCliente(eqs);
  };

  const preencherForm = (c: Cliente) => {
    setFormCodigo(c.codigo || 'C03709');
    setFormRazaoSocial(c.razaoSocial);
    setFormNomeFantasia(c.nomeFantasia);
    setFormCnpj(c.cnpj);
    setFormEmail(c.email);
    setFormTelefone1(c.telefone);
    setFormTelefone2(c.telefone);
    setFormLogradouro(c.endereco || 'Planta Industrial');
    setFormCidade(c.cidade);
    setFormUf(c.estado);
    setFormCep(c.cep || '14000-000');
    setFormTipoCliente(c.segmento);
    setFormObs(c.observacoesAvulsas || '');
    setFormAtivo(c.status === 'Ativo');
  };

  const handleAbrirNovoCliente = (targetAba?: typeof abaForm) => {
    const novoCodigo = `C${String(clientes.length + 1).padStart(5, '0')}`;
    setFormCodigo(novoCodigo);
    setFormRazaoSocial('');
    setFormNomeFantasia('');
    setFormCnpj('');
    setFormEmail('');
    setFormTelefone1('');
    setFormTelefone2('');
    setFormLogradouro('');
    setFormNumero('');
    setFormComplemento('');
    setFormBairro('');
    setFormCidade('');
    setFormUf('SP');
    setFormCep('');
    setFormObs('');
    setEquipamentosCliente([]);
    setClienteSelecionado({
      id: `cli-${Date.now()}`,
      codigo: novoCodigo,
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: 'SP',
      cep: '',
      contatos: [],
      contatoResponsavel: 'Gerente da Qualidade',
      segmento: 'Agronegócio / Grãos',
      observacoesAvulsas: '',
      status: 'Ativo',
    });
    const aba = targetAba || 'identificacao';
    setAbaForm(aba);
    updateUrlParams({
      novoCliente: 'true',
      cliente: null,
      clienteId: null,
      aba,
    });
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRazaoSocial || !formCnpj) {
      alert('Preencha os campos obrigatórios: Razão Social e CNPJ/CPF');
      return;
    }

    await ClientesService.criar({
      codigo: formCodigo,
      razaoSocial: formRazaoSocial,
      nomeFantasia: formNomeFantasia || formRazaoSocial,
      cnpj: formCnpj,
      email: formEmail,
      telefone: formTelefone1,
      endereco: `${formLogradouro}, ${formNumero}`,
      cidade: formCidade || 'São Paulo',
      estado: formUf,
      cep: formCep,
      contatos: [
        {
          id: `cnt-${Date.now()}`,
          nome: 'Gerente da Qualidade',
          cargo: 'Gerente de Planta',
          email: formEmail,
          telefone: formTelefone1,
        },
      ],
      contatoResponsavel: 'Gerente da Qualidade',
      segmento: formTipoCliente,
      observacoesAvulsas: formObs,
      status: formAtivo ? 'Ativo' : 'Inativo',
    });

    alert('Cliente salvo com sucesso!');
    carregarClientes();
  };

  const handleAbrirNovoEquipamento = () => {
    setEqIdObjeto(String(17800 + Math.floor(Math.random() * 100)));
    setEqModelo('G650i');
    setEqFabricante('GEHAKA');
    setEqSerie('');
    setEqPatrimonio('');
    setEqInmetro('SELO-INM-88910');
    setEqInativo(false);
    setEqObs('');
    setEqLacreAnterior('LAC-2024-0091');
    setEqSeloAnterior('SELO-2024-881');
    setEqLacreNovo('LAC-2026-4401');
    setEqSeloNovo('SELO-INM-88910');
    setEqAnoFabricacao('2023');
    setEqDataServicoAnterior('2025-02-15');
    setEqDataCalibracao(new Date().toISOString().split('T')[0]);
    setEqPortaria('Portaria INMETRO/DIMEL Nº 0296/2013');
    setEqTemEtiquetaAnterior('Sim, etiqueta Elgin térmica preservada');
    setEqAbaForm('identificacao');
    setModalNovoEquipamento(true);
  };

  const handleEditarEquipamento = (eq: Equipamento) => {
    setEqIdObjeto(eq.id.replace(/\D/g, '') || '17815');
    setEqModelo(eq.modelo);
    setEqFabricante(eq.fabricante);
    setEqSerie(eq.numeroSerie);
    setEqPatrimonio(eq.patrimonio || '');
    setEqInmetro(eq.seloNovo || 'SELO-INM-88910');
    setEqInativo(eq.status === 'Em Manutenção');
    setEqObs(eq.observacoes || '');
    setEqLacreAnterior(eq.lacreAnterior || 'LAC-2024-0091');
    setEqSeloAnterior(eq.seloAnterior || 'SELO-2024-881');
    setEqLacreNovo(eq.lacreNovo || 'LAC-2026-4401');
    setEqSeloNovo(eq.seloNovo || 'SELO-INM-88910');
    setEqAnoFabricacao(eq.anoFabricacao || '2023');
    setEqDataServicoAnterior(eq.dataServicoAnterior || '2025-02-15');
    setEqDataCalibracao(eq.dataUltimaCalibracao);
    setEqPortaria(eq.portariaInmetro || 'Portaria INMETRO/DIMEL Nº 0296/2013');
    setEqTemEtiquetaAnterior(eq.temEtiquetaAnterior || 'Sim, etiqueta Elgin térmica preservada');
    setEqAbaForm('identificacao');
    setModalNovoEquipamento(true);
  };

  const handleSalvarEquipamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado || !eqSerie) {
      alert('Preencha ao menos o número de série do equipamento.');
      return;
    }

    await EquipamentosService.criar({
      clienteId: clienteSelecionado.id,
      clienteNome: clienteSelecionado.nomeFantasia || formRazaoSocial,
      numeroSerie: eqSerie,
      fabricante: eqFabricante,
      modelo: eqModelo,
      tipoEquipamento: eqModelo.includes('Balança') ? 'Balança de Precisão' : 'Medidor de Umidade GEHAKA',
      faixaMedicao: '8 a 50 %',
      resolucao: '0,1 %',
      patrimonio: eqPatrimonio,
      lacreAnterior: eqLacreAnterior,
      seloAnterior: eqSeloAnterior,
      lacreNovo: eqLacreNovo,
      seloNovo: eqSeloNovo,
      anoFabricacao: eqAnoFabricacao,
      dataServicoAnterior: eqDataServicoAnterior,
      dataUltimaCalibracao: eqDataCalibracao,
      dataProximaCalibracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      portariaInmetro: eqPortaria,
      temEtiquetaAnterior: eqTemEtiquetaAnterior,
      status: eqInativo ? 'Em Manutenção' : 'Calibrado',
      observacoes: eqObs || 'Cadastrado diretamente pela ficha de cliente',
    });

    setModalNovoEquipamento(false);
    carregarEquipamentos(clienteSelecionado.id);
  };

  // Se um cliente está aberto no formulário, exibe o Card Form fiel ao gemini-code-1788366369820.html
  if (clienteSelecionado) {
    return (
      <div className="rarus-content-scroll rarus-fullscreen-view">
        {/* Barra de Voltar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={handleFecharFormulario}
            type="button"
          >
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Clientes</span>
          </button>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Visualização em Tela Cheia • Código {formCodigo}
          </span>
        </div>

        {/* CONTAINER CARD FORMULÁRIO (PADRÃO ESPECIFICAÇÃO & GEMINI-CODE) */}
        <div className="card-container">
          {/* Cabeçalho do Card */}
          <div className="card-header">
            <h2 className="card-title">
              Cadastro de Cliente / Fornecedor {formNomeFantasia ? `— ${formNomeFantasia}` : ''}
            </h2>
            <span className={`status-badge ${formAtivo ? 'ativo' : 'inativo'}`}>
              <span className="rarus-status-dot" />
              {formAtivo ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          {/* Barra de Ações (Action Bar) */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => handleAbrirNovoCliente()} type="button">
              <Plus size={14} />
              <span>Novo</span>
            </button>
            <button className="btn btn-secondary" onClick={handleSalvar} type="button">
              <Save size={14} />
              <span>Salvar</span>
            </button>
            <button className="btn btn-secondary" onClick={handleFecharFormulario} type="button">
              <Search size={14} />
              <span>Buscar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()} type="button">
              <Printer size={14} />
              <span>Imprimir</span>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirm('Deseja realmente inativar este cliente?')) {
                  setFormAtivo(false);
                }
              }}
              type="button"
            >
              <Trash2 size={14} />
              <span>Excluir</span>
            </button>
          </div>

          {/* Navegação por Abas */}
          <div className="tabs-navigation">
            <button
              className={`tab-button ${abaForm === 'identificacao' ? 'active' : ''}`}
              onClick={() => handleMudarAba('identificacao')}
              type="button"
            >
              1. Identificação
            </button>
            <button
              className={`tab-button ${abaForm === 'endereco' ? 'active' : ''}`}
              onClick={() => handleMudarAba('endereco')}
              type="button"
            >
              2. Endereço
            </button>
            <button
              className={`tab-button ${abaForm === 'observacoes' ? 'active' : ''}`}
              onClick={() => handleMudarAba('observacoes')}
              type="button"
            >
              3. Observações
            </button>
            <button
              className={`tab-button ${abaForm === 'tributacao' ? 'active' : ''}`}
              onClick={() => handleMudarAba('tributacao')}
              type="button"
            >
              4. Tributação
            </button>
            <button
              className={`tab-button ${abaForm === 'confidencial' ? 'active' : ''}`}
              onClick={() => handleMudarAba('confidencial')}
              type="button"
            >
              5. Confidencial
            </button>
            <button
              className={`tab-button ${abaForm === 'equipamentos' ? 'active' : ''}`}
              onClick={() => handleMudarAba('equipamentos')}
              type="button"
            >
              6. Tabelas / Equipamentos ({equipamentosCliente.length})
            </button>
          </div>

          {/* Corpo do Formulário */}
          <div className="card-body">
            {/* Aba 1: Identificação */}
            {abaForm === 'identificacao' && (
              <div className="form-grid">
                <div className="form-group col-2">
                  <label className="form-label">Código</label>
                  <input type="text" className="form-input" value={formCodigo} readOnly />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Tipo de Pessoa</label>
                  <select
                    className="form-select"
                    value={formTipoPessoa}
                    onChange={(e) => setFormTipoPessoa(e.target.value)}
                  >
                    <option value="Jurídica">Jurídica</option>
                    <option value="Física">Física</option>
                  </select>
                </div>

                <div className="form-group col-6">
                  <label className="form-label">CNPJ / CPF *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="00.000.000/0000-00"
                    value={formCnpj}
                    onChange={(e) => setFormCnpj(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Nome / Razão Social *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Razão social completa"
                    value={formRazaoSocial}
                    onChange={(e) => setFormRazaoSocial(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Apelido / Nome Fantasia</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nome comercial da unidade"
                    value={formNomeFantasia}
                    onChange={(e) => setFormNomeFantasia(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Inscrição Estadual</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formInscEstadual}
                    onChange={(e) => setFormInscEstadual(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Inscrição Municipal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formInscMunicipal}
                    onChange={(e) => setFormInscMunicipal(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Data de Cadastro</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formDataCadastro}
                    onChange={(e) => setFormDataCadastro(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Telefone 1</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="(00) 0000-0000"
                    value={formTelefone1}
                    onChange={(e) => setFormTelefone1(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Celular / WhatsApp</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="(00) 00000-0000"
                    value={formTelefone2}
                    onChange={(e) => setFormTelefone2(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">E-mail Principal</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="qualidade@empresa.com.br"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Tipo de Cliente</label>
                  <select
                    className="form-select"
                    value={formTipoCliente}
                    onChange={(e) => setFormTipoCliente(e.target.value)}
                  >
                    <option value="Agronegócio / Grãos">Agronegócio / Grãos</option>
                    <option value="Farmacêutico / Laboratório">Farmacêutico / Laboratório</option>
                    <option value="Alimentos / Moagem">Alimentos / Moagem</option>
                    <option value="Químico">Químico</option>
                  </select>
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Ramo de Atividade / Profissão</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formRamoAtividade}
                    onChange={(e) => setFormRamoAtividade(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Região</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formRegiao}
                    onChange={(e) => setFormRegiao(e.target.value)}
                  />
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Renasem / Indea</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Registro oficial de sementes"
                    value={formRenasem}
                    onChange={(e) => setFormRenasem(e.target.value)}
                  />
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Status do Cadastro</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="check-ativo"
                      checked={formAtivo}
                      onChange={(e) => setFormAtivo(e.target.checked)}
                    />
                    <label htmlFor="check-ativo">Cliente Ativo no Sistema</label>
                  </div>
                </div>
              </div>
            )}

            {/* Aba 2: Endereço */}
            {abaForm === 'endereco' && (
              <div className="form-grid">
                <div className="form-section-title">Endereço Principal / Planta Industrial</div>

                <div className="form-group col-3">
                  <label className="form-label">CEP</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="00000-000"
                      value={formCep}
                      onChange={(e) => setFormCep(e.target.value)}
                    />
                    <button className="input-icon-btn" type="button" title="Buscar CEP">
                      🔍
                    </button>
                  </div>
                </div>

                <div className="form-group col-7">
                  <label className="form-label">Rua / Logradouro</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formLogradouro}
                    onChange={(e) => setFormLogradouro(e.target.value)}
                  />
                </div>

                <div className="form-group col-2">
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formNumero}
                    onChange={(e) => setFormNumero(e.target.value)}
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">Complemento</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formComplemento}
                    onChange={(e) => setFormComplemento(e.target.value)}
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">Bairro</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formBairro}
                    onChange={(e) => setFormBairro(e.target.value)}
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formCidade}
                    onChange={(e) => setFormCidade(e.target.value)}
                  />
                </div>

                <div className="form-group col-2">
                  <label className="form-label">Estado (UF)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formUf}
                    onChange={(e) => setFormUf(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Aba 3: Observações */}
            {abaForm === 'observacoes' && (
              <div className="form-grid">
                <div className="form-group col-12">
                  <label className="form-label">Observações Gerais / Instruções de Acesso</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    placeholder="Instruções de acesso à planta, contatos na portaria, exigências de EPI..."
                    value={formObs}
                    onChange={(e) => setFormObs(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Aba 4: Tributação */}
            {abaForm === 'tributacao' && (
              <div className="form-grid">
                <div className="form-group col-6">
                  <label className="form-label">Indicador de Inscrição Estadual</label>
                  <select
                    className="form-select"
                    value={formIndicadorIe}
                    onChange={(e) => setFormIndicadorIe(e.target.value)}
                  >
                    <option value="1 - Contribuinte ICMS">1 - Contribuinte ICMS</option>
                    <option value="2 - Contribuinte Isento">2 - Contribuinte Isento</option>
                    <option value="9 - Não Contribuinte">9 - Não Contribuinte</option>
                  </select>
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Regime Tributário</label>
                  <select
                    className="form-select"
                    value={formRegimeTributario}
                    onChange={(e) => setFormRegimeTributario(e.target.value)}
                  >
                    <option value="1 - Simples Nacional">1 - Simples Nacional</option>
                    <option value="2 - Lucro Presumido">2 - Lucro Presumido</option>
                    <option value="3 - Lucro Real">3 - Lucro Real</option>
                  </select>
                </div>
              </div>
            )}

            {/* Aba 5: Confidencial */}
            {abaForm === 'confidencial' && (
              <div className="form-grid">
                <div className="form-group col-6">
                  <label className="form-label">Condição de Pagamento Padrão</label>
                  <input type="text" className="form-input" defaultValue="28 DDL (Safra)" />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Limite de Crédito Liberado (R$)</label>
                  <input type="text" className="form-input" defaultValue="50.000,00" />
                </div>
              </div>
            )}

            {/* Aba 6: Equipamentos do Cliente */}
            {abaForm === 'equipamentos' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
                    Parque Instalado Vinculado a este Cliente ({equipamentosCliente.length})
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAbrirNovoEquipamento}
                  >
                    <Plus size={14} />
                    <span>Novo Equipamento</span>
                  </button>
                </div>

                <div className="rarus-table-container">
                  <table className="rarus-table">
                    <thead>
                      <tr>
                        <th>Modelo / Tipo</th>
                        <th>Nº Série</th>
                        <th>Patrimônio</th>
                        <th>Lacre Novo</th>
                        <th>Selo Inmetro</th>
                        <th>Próxima Calibração</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipamentosCliente.map((eq) => (
                        <tr
                          key={eq.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleEditarEquipamento(eq)}
                          title="Clique para abrir e editar a ficha completa deste equipamento"
                        >
                          <td>
                            <strong>{eq.modelo}</strong>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              {eq.fabricante} • {eq.tipoEquipamento}
                            </div>
                          </td>
                          <td>
                            <code>{eq.numeroSerie}</code>
                          </td>
                          <td>{eq.patrimonio || 'S/N'}</td>
                          <td>{eq.lacreNovo || '-'}</td>
                          <td>{eq.seloNovo || '-'}</td>
                          <td style={{ fontWeight: 600 }}>{eq.dataProximaCalibracao}</td>
                          <td>
                            <span className={`status-badge ${eq.status === 'Calibrado' ? 'ativo' : 'inativo'}`}>
                              <span className="rarus-status-dot" />
                              {eq.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '3px 8px', fontSize: '11.5px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditarEquipamento(eq);
                              }}
                            >
                              Ficha Técnica
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé de Auditoria (Baseado na Imagem e Gemini Code) */}
          <div className="card-footer">
            <div>
              Usuário Inc: <strong>CAIO DETZ</strong> • Usuário Alt: <strong>JANAINA</strong>
            </div>
            <div>
              Últ. Alteração: <strong>02/09/2026 14:20</strong> • Data Cadastro: <strong>{formDataCadastro}</strong>
            </div>
          </div>
        </div>

        {/* Modal Equipamento Completo (Idêntico a EquipamentosView com 3 Abas) */}
        {modalNovoEquipamento && (
          <div className="rarus-modal-backdrop" onClick={() => setModalNovoEquipamento(false)}>
            <div
              className="rarus-modal-box"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '980px', width: '95vw', maxHeight: '92vh' }}
            >
              {/* Cabeçalho do Card */}
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Equipamento — {eqModelo} (Série: {eqSerie || 'Novo'})
                  </h3>
                  <span className={`status-badge ${eqInativo ? 'inativo' : 'ativo'}`}>
                    <span className="rarus-status-dot" />
                    {eqInativo ? 'Inativo' : 'Ativo / Calibrado'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Identificador: <strong>{eqIdObjeto}</strong> • Cliente: <strong>{clienteSelecionado?.nomeFantasia || formRazaoSocial}</strong>
                </div>
              </div>

              {/* Barra de Ações */}
              <div className="action-bar">
                <button type="button" className="btn btn-primary" onClick={handleSalvarEquipamento}>
                  <Save size={14} />
                  <span>Salvar Equipamento</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalNovoEquipamento(false)}
                >
                  <ArrowLeft size={14} />
                  <span>Cancelar</span>
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
                  <Printer size={14} />
                  <span>Imprimir Ficha</span>
                </button>
              </div>

              {/* Abas de Navegação */}
              <div className="tabs-navigation">
                <button
                  type="button"
                  className={`tab-button ${eqAbaForm === 'identificacao' ? 'active' : ''}`}
                  onClick={() => setEqAbaForm('identificacao')}
                >
                  1. Identificação
                </button>
                <button
                  type="button"
                  className={`tab-button ${eqAbaForm === 'complementares' ? 'active' : ''}`}
                  onClick={() => setEqAbaForm('complementares')}
                >
                  2. Campos Complementares (Lacres & Selos)
                </button>
                <button
                  type="button"
                  className={`tab-button ${eqAbaForm === 'historico' ? 'active' : ''}`}
                  onClick={() => setEqAbaForm('historico')}
                >
                  3. Histórico de OS & Anotações
                </button>
              </div>

              {/* Corpo do Formulário */}
              <div className="card-body" style={{ overflowY: 'auto', maxHeight: 'calc(92vh - 200px)' }}>
                {/* Aba 1: Identificação */}
                {eqAbaForm === 'identificacao' && (
                  <div className="form-grid">
                    <div className="form-group col-2">
                      <label className="form-label">Identificador</label>
                      <input className="form-input" value={eqIdObjeto} readOnly />
                    </div>
                    <div className="form-group col-4">
                      <label className="form-label">Série *</label>
                      <input
                        className="form-input"
                        placeholder="Ex: GEH-2023-90812"
                        value={eqSerie}
                        onChange={(e) => setEqSerie(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Modelo *</label>
                      <select
                        className="form-select"
                        value={eqModelo}
                        onChange={(e) => setEqModelo(e.target.value)}
                      >
                        <option value="G650i">G650i (Medidor de Umidade de Grãos)</option>
                        <option value="G810">G810 (Medidor de Umidade de Bancada)</option>
                        <option value="BG1000">BG1000 (Balança de Umidade)</option>
                        <option value="XPR205">XPR205 (Balança Analítica)</option>
                      </select>
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Marca / Fabricante</label>
                      <input
                        className="form-input"
                        value={eqFabricante}
                        onChange={(e) => setEqFabricante(e.target.value)}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label className="form-label">INMETRO / Selo Atual</label>
                      <input
                        className="form-input"
                        value={eqInmetro}
                        onChange={(e) => setEqInmetro(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Patrimônio</label>
                      <input
                        className="form-input"
                        placeholder="PAT-0012"
                        value={eqPatrimonio}
                        onChange={(e) => setEqPatrimonio(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Cliente Titular</label>
                      <input
                        className="form-input"
                        value={`${formCodigo} - ${formRazaoSocial || clienteSelecionado?.nomeFantasia}`}
                        readOnly
                      />
                    </div>

                    <div className="form-group col-12">
                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          id="chk-eq-inativo-cli"
                          checked={eqInativo}
                          onChange={(e) => setEqInativo(e.target.checked)}
                        />
                        <label htmlFor="chk-eq-inativo-cli">
                          Marcar este equipamento como <strong>Inativo / Em Manutenção</strong>
                        </label>
                      </div>
                    </div>

                    <div className="form-group col-12">
                      <label className="form-label">Observações Técnicas do Instrumento</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        value={eqObs}
                        onChange={(e) => setEqObs(e.target.value)}
                        placeholder="Detalhes sobre localização na planta, condições de operação ou histórico..."
                      />
                    </div>
                  </div>
                )}

                {/* Aba 2: Campos Complementares (Lacres & Selos) */}
                {eqAbaForm === 'complementares' && (
                  <div className="form-grid">
                    <div className="form-section-title">Selagem & Lacração Metrológica</div>
                    <div className="form-group col-3">
                      <label className="form-label">Lacre Anterior</label>
                      <input
                        className="form-input"
                        value={eqLacreAnterior}
                        onChange={(e) => setEqLacreAnterior(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Selo Anterior</label>
                      <input
                        className="form-input"
                        value={eqSeloAnterior}
                        onChange={(e) => setEqSeloAnterior(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Lacre Novo (Atual)</label>
                      <input
                        className="form-input"
                        value={eqLacreNovo}
                        onChange={(e) => setEqLacreNovo(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Selo Novo INMETRO</label>
                      <input
                        className="form-input"
                        value={eqSeloNovo}
                        onChange={(e) => setEqSeloNovo(e.target.value)}
                      />
                    </div>

                    <div className="form-section-title">Dados Regulatórios & Datas Metrológicas</div>
                    <div className="form-group col-3">
                      <label className="form-label">Ano de Fabricação</label>
                      <input
                        className="form-input"
                        value={eqAnoFabricacao}
                        onChange={(e) => setEqAnoFabricacao(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Data do Serviço Anterior</label>
                      <input
                        type="date"
                        className="form-input"
                        value={eqDataServicoAnterior}
                        onChange={(e) => setEqDataServicoAnterior(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label className="form-label">Data da Calibração</label>
                      <input
                        type="date"
                        className="form-input"
                        value={eqDataCalibracao}
                        onChange={(e) => setEqDataCalibracao(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Portaria INMETRO / DIMEL</label>
                      <input
                        className="form-input"
                        value={eqPortaria}
                        onChange={(e) => setEqPortaria(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Possui Etiqueta Elgin Anterior?</label>
                      <input
                        className="form-input"
                        value={eqTemEtiquetaAnterior}
                        onChange={(e) => setEqTemEtiquetaAnterior(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Aba 3: Histórico de OS */}
                {eqAbaForm === 'historico' && (
                  <div>
                    <div style={{ marginBottom: 12, fontSize: '13px', fontWeight: 600 }}>
                      Ordens de Serviço e Manutenções no Equipamento
                    </div>
                    <div className="rarus-table-container">
                      <table className="rarus-table">
                        <thead>
                          <tr>
                            <th>Nº Movimento (OS)</th>
                            <th>Data</th>
                            <th>Técnico</th>
                            <th>Tipo de Serviço</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong style={{ color: 'var(--color-primary-500)' }}>OS #0001045</strong></td>
                            <td>19/08/2026</td>
                            <td>Caio Detz</td>
                            <td>Calibração em Campo - Padrão RBC</td>
                            <td><span className="status-badge ativo"><span className="rarus-status-dot" />Concluída</span></td>
                          </tr>
                          <tr>
                            <td><strong style={{ color: 'var(--color-primary-500)' }}>OS #0001012</strong></td>
                            <td>14/02/2025</td>
                            <td>Itamar Soares</td>
                            <td>Manutenção Preventiva e Troca de Lacre</td>
                            <td><span className="status-badge ativo"><span className="rarus-status-dot" />Concluída</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LISTAGEM PRINCIPAL DE CLIENTES
  return (
    <div className="rarus-content-scroll">
      {/* Header */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Clientes & Plantas Industriais</h1>
          <p>Gestão comercial, parque de equipamentos vinculados e rastreabilidade de serviços</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleAbrirNovoCliente()} type="button">
          <Plus size={15} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* KPI Cards (Padrão 28px Display) */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Total de Clientes Ativos</span>
            <div className="rarus-kpi-icon-box">
              <Users size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{clientes.length}</div>
          <span className="rarus-kpi-trend trend-up">↑ 12% vs último trimestre</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Equipamentos no Parque</span>
            <div className="rarus-kpi-icon-box">
              <Wrench size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">5</div>
          <span className="rarus-kpi-trend trend-neutral">Linha GEHAKA & Balanças</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Ordens de Serviço Ativas</span>
            <div className="rarus-kpi-icon-box">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">2</div>
          <span className="rarus-kpi-trend trend-up">Em atendimento na safra</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Conformidade Metrológica</span>
            <div className="rarus-kpi-icon-box">
              <Award size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">100%</div>
          <span className="rarus-kpi-trend trend-up">Padrões RBC vigentes</span>
        </div>
      </div>

      {/* DataGrid Container */}
      <div className="rarus-datagrid-container">
        <div className="rarus-grid-header-tabs">
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'todos' ? 'active' : ''}`}
            onClick={() => {
              setSegmentoFiltro('todos');
              updateUrlParams({ segmento: null });
            }}
          >
            <span>Todos os Clientes</span>
            <span className="count">{clientes.length}</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'grãos' ? 'active' : ''}`}
            onClick={() => {
              setSegmentoFiltro('grãos');
              updateUrlParams({ segmento: 'grãos' });
            }}
          >
            <span>Agronegócio / Grãos</span>
            <span className="count">2</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'farma' ? 'active' : ''}`}
            onClick={() => {
              setSegmentoFiltro('farma');
              updateUrlParams({ segmento: 'farma' });
            }}
          >
            <span>Farmacêutico / Lab</span>
            <span className="count">1</span>
          </button>
        </div>

        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--color-text-muted)" />
            <input
              placeholder="Buscar por razão social, nome fantasia, CNPJ..."
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
                <th>Código</th>
                <th>Razão Social / Nome Fantasia</th>
                <th>CNPJ</th>
                <th>Segmento</th>
                <th>Cidade / UF</th>
                <th>Contato Técnico</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => {
                const isSelected = selectedRowId === c.id;
                return (
                  <tr
                    key={c.id}
                    className={isSelected ? 'rarus-row-selected' : ''}
                    onClick={() => handleRowClick(c)}
                    title={isSelected ? 'Clique novamente para abrir a ficha do cliente em tela cheia' : 'Clique para selecionar o cliente'}
                  >
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary-500)' }}>
                        {c.codigo || 'C03709'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                        {c.nomeFantasia}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                        {c.razaoSocial}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{c.cnpj}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: 'var(--color-primary-500)',
                          background: 'var(--color-primary-100)',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {c.segmento}
                      </span>
                    </td>
                    <td>
                      {c.cidade} / {c.estado}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.contatoResponsavel}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{c.telefone}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${c.status === 'Ativo' ? 'ativo' : 'inativo'}`}>
                        <span className="rarus-status-dot" />
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          selecionarCliente(c);
                        }}
                        type="button"
                      >
                        Abrir Ficha
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
