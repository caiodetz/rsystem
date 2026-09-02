'use client';

import React, { useState, useEffect } from 'react';
import { Cliente, Equipamento } from '@/core/types';
import { ClientesService } from '@/core/services/clientesService';
import { EquipamentosService } from '@/core/services/equipamentosService';
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
  const [busca, setBusca] = useState('');
  const [segmentoFiltro, setSegmentoFiltro] = useState<string>('todos');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  // Aba ativa do formulário card
  const [abaForm, setAbaForm] = useState<
    'identificacao' | 'endereco' | 'observacoes' | 'tributacao' | 'confidencial' | 'equipamentos'
  >('identificacao');

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

  // Modal Novo Equipamento Vinculado
  const [modalNovoEquipamento, setModalNovoEquipamento] = useState(false);
  const [eqModelo, setEqModelo] = useState('G650i');
  const [eqFabricante, setEqFabricante] = useState('GEHAKA');
  const [eqSerie, setEqSerie] = useState('');
  const [eqPatrimonio, setEqPatrimonio] = useState('');
  const [eqLacreNovo, setEqLacreNovo] = useState('');
  const [eqSeloNovo, setEqSeloNovo] = useState('');

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

  const handleAbrirNovo = () => {
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
    setAbaForm('identificacao');
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

  const handleSalvarEquipamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado || !eqSerie) return;

    await EquipamentosService.criar({
      clienteId: clienteSelecionado.id,
      clienteNome: clienteSelecionado.nomeFantasia || formRazaoSocial,
      numeroSerie: eqSerie,
      fabricante: eqFabricante,
      modelo: eqModelo,
      tipoEquipamento: 'Medidor de Umidade GEHAKA',
      faixaMedicao: '8 a 50 %',
      resolucao: '0,1 %',
      patrimonio: eqPatrimonio,
      lacreNovo: eqLacreNovo,
      seloNovo: eqSeloNovo,
      dataUltimaCalibracao: new Date().toISOString().split('T')[0],
      dataProximaCalibracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Calibrado',
      observacoes: 'Cadastrado diretamente pela ficha de cliente',
    });

    setModalNovoEquipamento(false);
    setEqSerie('');
    setEqPatrimonio('');
    setEqLacreNovo('');
    setEqSeloNovo('');
    carregarEquipamentos(clienteSelecionado.id);
  };

  // Se um cliente está aberto no formulário, exibe o Card Form fiel ao gemini-code-1788366369820.html
  if (clienteSelecionado) {
    return (
      <div className="rarus-content-scroll">
        {/* Barra de Voltar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={() => setClienteSelecionado(null)}
            type="button"
          >
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Clientes</span>
          </button>
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
            <button className="btn btn-primary" onClick={handleAbrirNovo} type="button">
              <Plus size={14} />
              <span>Novo</span>
            </button>
            <button className="btn btn-secondary" onClick={handleSalvar} type="button">
              <Save size={14} />
              <span>Salvar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setClienteSelecionado(null)} type="button">
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
              onClick={() => setAbaForm('identificacao')}
              type="button"
            >
              1. Identificação
            </button>
            <button
              className={`tab-button ${abaForm === 'endereco' ? 'active' : ''}`}
              onClick={() => setAbaForm('endereco')}
              type="button"
            >
              2. Endereço
            </button>
            <button
              className={`tab-button ${abaForm === 'observacoes' ? 'active' : ''}`}
              onClick={() => setAbaForm('observacoes')}
              type="button"
            >
              3. Observações
            </button>
            <button
              className={`tab-button ${abaForm === 'tributacao' ? 'active' : ''}`}
              onClick={() => setAbaForm('tributacao')}
              type="button"
            >
              4. Tributação
            </button>
            <button
              className={`tab-button ${abaForm === 'confidencial' ? 'active' : ''}`}
              onClick={() => setAbaForm('confidencial')}
              type="button"
            >
              5. Confidencial
            </button>
            <button
              className={`tab-button ${abaForm === 'equipamentos' ? 'active' : ''}`}
              onClick={() => setAbaForm('equipamentos')}
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
                    onClick={() => setModalNovoEquipamento(true)}
                  >
                    <Plus size={14} />
                    <span>+ Novo Equipamento</span>
                  </button>
                </div>

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
                    </tr>
                  </thead>
                  <tbody>
                    {equipamentosCliente.map((eq) => (
                      <tr key={eq.id}>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
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

        {/* Modal Novo Equipamento */}
        {modalNovoEquipamento && (
          <div className="rarus-modal-backdrop" onClick={() => setModalNovoEquipamento(false)}>
            <div className="rarus-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="card-header">
                <h3 className="card-title">Novo Equipamento para {formRazaoSocial || 'Cliente'}</h3>
              </div>
              <form onSubmit={handleSalvarEquipamento}>
                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group col-6">
                      <label className="form-label">Modelo *</label>
                      <input
                        className="form-input"
                        value={eqModelo}
                        onChange={(e) => setEqModelo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Fabricante</label>
                      <input
                        className="form-input"
                        value={eqFabricante}
                        onChange={(e) => setEqFabricante(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Número de Série *</label>
                      <input
                        className="form-input"
                        placeholder="Ex: GEH-2026-9014"
                        value={eqSerie}
                        onChange={(e) => setEqSerie(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Patrimônio do Cliente</label>
                      <input
                        className="form-input"
                        placeholder="Ex: PAT-001"
                        value={eqPatrimonio}
                        onChange={(e) => setEqPatrimonio(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Lacre Novo</label>
                      <input
                        className="form-input"
                        placeholder="Ex: LAC-2026-10"
                        value={eqLacreNovo}
                        onChange={(e) => setEqLacreNovo(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Selo Novo Inmetro</label>
                      <input
                        className="form-input"
                        placeholder="Ex: SELO-INM-902"
                        value={eqSeloNovo}
                        onChange={(e) => setEqSeloNovo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="action-bar" style={{ justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalNovoEquipamento(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Salvar Equipamento
                  </button>
                </div>
              </form>
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
        <button className="btn btn-primary" onClick={handleAbrirNovo} type="button">
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
            onClick={() => setSegmentoFiltro('todos')}
          >
            <span>Todos os Clientes</span>
            <span className="count">{clientes.length}</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'grãos' ? 'active' : ''}`}
            onClick={() => setSegmentoFiltro('grãos')}
          >
            <span>Agronegócio / Grãos</span>
            <span className="count">2</span>
          </button>
          <button
            className={`rarus-filter-tab-pill ${segmentoFiltro === 'farma' ? 'active' : ''}`}
            onClick={() => setSegmentoFiltro('farma')}
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
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

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
            {clientes.map((c) => (
              <tr
                key={c.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setClienteSelecionado(c)}
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
                      setClienteSelecionado(c);
                    }}
                  >
                    Abrir Ficha
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
