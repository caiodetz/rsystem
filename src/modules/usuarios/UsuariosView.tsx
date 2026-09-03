'use client';

import React, { useState, useEffect } from 'react';
import { UsuarioFuncionario } from '@/core/types';
import { UsuariosService } from '@/core/services/usuariosService';
import {
  UserCheck,
  Plus,
  Search,
  Save,
  Printer,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Award,
  Upload,
  User,
} from 'lucide-react';

export const UsuariosView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioFuncionario[]>([]);
  const [selecionado, setSelecionado] = useState<UsuarioFuncionario | null>(null);
  const [busca, setBusca] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRowClick = (u: UsuarioFuncionario) => {
    if (selectedRowId === u.id) {
      preencherForm(u);
      setSelecionado(u);
    } else {
      setSelectedRowId(u.id);
    }
  };

  // Aba ativa do formulário Card
  const [abaForm, setAbaForm] = useState<'identificacao' | 'permissoes' | 'assinatura'>('identificacao');

  // Form State baseado na imagem real (exemplo de cadastro de funcionario preenchido.jpeg)
  const [formCodigo, setFormCodigo] = useState('058');
  const [formCodigoAuxiliar, setFormCodigoAuxiliar] = useState('');
  const [formNome, setFormNome] = useState('Caio Detz');
  const [formCargo, setFormCargo] = useState('AUXILIAR TECNICO');
  const [formVendeCompra, setFormVendeCompra] = useState(true);
  const [formInativo, setFormInativo] = useState(false);
  const [formComissao1, setFormComissao1] = useState('0,00');
  const [formComissao2, setFormComissao2] = useState('0,00');
  const [formComissao3, setFormComissao3] = useState('0,00');
  const [formMargemMin, setFormMargemMin] = useState('0,00');
  const [formLoginUsuario, setFormLoginUsuario] = useState('caio.detz');
  const [formCodFilial, setFormCodFilial] = useState('1 - RARUS TECNOLOGIA E SERVICOS');
  const [formEmail, setFormEmail] = useState('caio.detz@rarus.com.br');
  const [formTelefone, setFormTelefone] = useState('(19) 98877-6655');

  // Permissões Metrológicas
  const [permGehaka, setPermGehaka] = useState(true);
  const [permBalanca, setPermBalanca] = useState(true);
  const [permMultigas, setPermMultigas] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const list = await UsuariosService.listar();
    setUsuarios(list);
  };

  const preencherForm = (u: UsuarioFuncionario) => {
    setFormCodigo(u.id.replace(/\D/g, '') || '058');
    setFormNome(u.nome);
    setFormCargo(u.cargo);
    setFormEmail(u.email);
    setFormTelefone(u.telefone || '');
    setFormInativo(!u.ativo);
    setPermGehaka(u.permissoesCalibracao.some((p) => p.tipoEquipamento.includes('GEHAKA')));
    setPermBalanca(u.permissoesCalibracao.some((p) => p.tipoEquipamento.includes('Balança')));
  };

  const handleAbrirNovo = () => {
    const novoCod = String(usuarios.length + 59).padStart(3, '0');
    setFormCodigo(novoCod);
    setFormNome('');
    setFormCargo('Técnico de Laboratório');
    setFormEmail('');
    setFormTelefone('');
    setFormInativo(false);
    setSelecionado({
      id: `usr-${novoCod}`,
      nome: '',
      email: '',
      cargo: 'Técnico de Laboratório',
      perfil: 'Tecnico',
      telefone: '(19) 98877-6655',
      permissoesCalibracao: [],
      ativo: true,
    });
    setAbaForm('identificacao');
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome || !formEmail) {
      alert('Preencha os campos obrigatórios: Nome e E-mail');
      return;
    }

    const novasPermissoes = [];
    if (permGehaka) {
      novasPermissoes.push({
        tipoCalibracaoId: 'tp-cal-rarus',
        tipoCalibracaoNome: 'Calibração Rastreável RARUS',
        tipoEquipamento: 'Medidor de Umidade GEHAKA',
      });
    }
    if (permBalanca) {
      novasPermissoes.push({
        tipoCalibracaoId: 'tp-cal-rarus',
        tipoCalibracaoNome: 'Calibração Rastreável RARUS',
        tipoEquipamento: 'Balança de Precisão',
      });
    }

    await UsuariosService.cadastrar({
      nome: formNome,
      email: formEmail,
      cargo: formCargo,
      perfil: 'Tecnico',
      telefone: formTelefone,
      permissoesCalibracao: novasPermissoes,
    });

    alert('Funcionário / Técnico salvo com sucesso!');
    carregar();
  };

  // SE UM FUNCIONÁRIO ESTÁ ABERTO PARA EDIÇÃO (CARD FORM):
  if (selecionado) {
    return (
      <div className="rarus-content-scroll rarus-fullscreen-view">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setSelecionado(null)} type="button">
            <ArrowLeft size={14} />
            <span>Voltar para Lista de Funcionários</span>
          </button>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Ficha Funcional em Tela Cheia • Código {formCodigo}
          </span>
        </div>

        <div className="card-container">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 className="card-title">
                Cadastro de Funcionário / Técnico — {formNome || 'Novo'}
              </h2>
              <span className={`status-badge ${formInativo ? 'inativo' : 'ativo'}`}>
                <span className="rarus-status-dot" />
                {formInativo ? 'Inativo' : 'Ativo'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Código: <strong>{formCodigo}</strong>
            </div>
          </div>

          <div className="action-bar">
            <button className="btn btn-primary" onClick={handleAbrirNovo} type="button">
              <Plus size={14} />
              <span>Novo</span>
            </button>
            <button className="btn btn-secondary" onClick={handleSalvar} type="button">
              <Save size={14} />
              <span>Salvar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setSelecionado(null)} type="button">
              <ArrowLeft size={14} />
              <span>Cancelar</span>
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()} type="button">
              <Printer size={14} />
              <span>Imprimir</span>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirm('Deseja inativar este funcionário?')) {
                  setFormInativo(true);
                }
              }}
              type="button"
            >
              <Trash2 size={14} />
              <span>Excluir</span>
            </button>
          </div>

          <div className="tabs-navigation">
            <button
              className={`tab-button ${abaForm === 'identificacao' ? 'active' : ''}`}
              onClick={() => setAbaForm('identificacao')}
              type="button"
            >
              1. Identificação
            </button>
            <button
              className={`tab-button ${abaForm === 'permissoes' ? 'active' : ''}`}
              onClick={() => setAbaForm('permissoes')}
              type="button"
            >
              2. Frente de Caixa / Permissões Metrológicas
            </button>
            <button
              className={`tab-button ${abaForm === 'assinatura' ? 'active' : ''}`}
              onClick={() => setAbaForm('assinatura')}
              type="button"
            >
              3. Outros Dados & Assinatura Digital (.PNG)
            </button>
          </div>

          <div className="card-body">
            {/* Aba 1: Identificação (Baseada na imagem real) */}
            {abaForm === 'identificacao' && (
              <div className="form-grid">
                <div className="form-group col-2">
                  <label className="form-label">Código</label>
                  <input className="form-input" value={formCodigo} readOnly />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">Código Auxiliar</label>
                  <input
                    className="form-input"
                    value={formCodigoAuxiliar}
                    onChange={(e) => setFormCodigoAuxiliar(e.target.value)}
                  />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Nome Completo *</label>
                  <input
                    className="form-input"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Cargo *</label>
                  <input
                    className="form-input"
                    value={formCargo}
                    onChange={(e) => setFormCargo(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Vende / Compra?</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="chk-vende"
                      checked={formVendeCompra}
                      onChange={(e) => setFormVendeCompra(e.target.checked)}
                    />
                    <label htmlFor="chk-vende">Sim</label>
                  </div>
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Funcionário Inativo?</label>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="chk-inativo-func"
                      checked={formInativo}
                      onChange={(e) => setFormInativo(e.target.checked)}
                    />
                    <label htmlFor="chk-inativo-func">Sim</label>
                  </div>
                </div>

                <div className="form-group col-4">
                  <label className="form-label">% Comissão 1</label>
                  <input className="form-input" value={formComissao1} onChange={(e) => setFormComissao1(e.target.value)} />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">% Comissão 2</label>
                  <input className="form-input" value={formComissao2} onChange={(e) => setFormComissao2(e.target.value)} />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">% Comissão 3</label>
                  <input className="form-input" value={formComissao3} onChange={(e) => setFormComissao3(e.target.value)} />
                </div>

                <div className="form-group col-6">
                  <label className="form-label">Usuário de Login</label>
                  <input className="form-input" value={formLoginUsuario} onChange={(e) => setFormLoginUsuario(e.target.value)} />
                </div>
                <div className="form-group col-6">
                  <label className="form-label">Cód. Filial</label>
                  <input className="form-input" value={formCodFilial} readOnly />
                </div>
              </div>
            )}

            {/* Aba 2: Permissões Metrológicas */}
            {abaForm === 'permissoes' && (
              <div className="form-grid">
                <div className="form-section-title">Matriz de Habilitação Técnica (RBC / ISO 17025)</div>

                <div className="form-group col-12">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="perm-gehaka"
                      checked={permGehaka}
                      onChange={(e) => setPermGehaka(e.target.checked)}
                    />
                    <label htmlFor="perm-gehaka">
                      <strong>Habilitado para Medidores de Umidade de Grãos GEHAKA</strong> (G650i, G810, G939)
                    </label>
                  </div>
                  <div className="checkbox-group" style={{ marginTop: 8 }}>
                    <input
                      type="checkbox"
                      id="perm-balanca"
                      checked={permBalanca}
                      onChange={(e) => setPermBalanca(e.target.checked)}
                    />
                    <label htmlFor="perm-balanca">
                      <strong>Habilitado para Balanças de Precisão & Analíticas</strong> (BG1000, Classe I e II)
                    </label>
                  </div>
                  <div className="checkbox-group" style={{ marginTop: 8 }}>
                    <input
                      type="checkbox"
                      id="perm-multigas"
                      checked={permMultigas}
                      onChange={(e) => setPermMultigas(e.target.checked)}
                    />
                    <label htmlFor="perm-multigas">
                      <strong>Habilitado para Detectores Multigás & Sensores</strong>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Aba 3: Assinatura Digital */}
            {abaForm === 'assinatura' && (
              <div className="form-grid">
                <div className="form-section-title">Assinatura Digital Oficial para Certificados de Calibração</div>

                <div className="col-12" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    A assinatura em arquivo transparente (.png) é inserida automaticamente em todos os laudos emitidos por este técnico.
                  </p>

                  <div
                    style={{
                      border: '2px dashed var(--color-border-subtle)',
                      borderRadius: 8,
                      padding: 24,
                      textAlign: 'center',
                      backgroundColor: '#FAFAFA',
                    }}
                  >
                    <Upload size={28} color="var(--color-primary-500)" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      Assinatura Digital de {formNome} (Carregada e Ativa)
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: 4 }}>
                      Formato: PNG Transparente • Resolução: 400x120px
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card-footer">
            <div>
              Código do Funcionário: <strong>{formCodigo}</strong> • Filial: <strong>1 - RARUS</strong>
            </div>
            <div>
              Login do Sistema: <strong>{formLoginUsuario}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LISTAGEM PRINCIPAL DE FUNCIONÁRIOS
  return (
    <div className="rarus-content-scroll">
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Equipe Técnica & Funcionários (RH)</h1>
          <p>Cadastro funcional, matriz de competência metrológica e gestão de assinaturas digitais</p>
        </div>
        <button className="btn btn-primary" onClick={handleAbrirNovo} type="button">
          <Plus size={15} />
          <span>Cadastrar Funcionário</span>
        </button>
      </div>

      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Total de Funcionários</span>
            <div className="rarus-kpi-icon-box">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{usuarios.length}</div>
          <span className="rarus-kpi-trend trend-up">Metrologistas e RH</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Técnicos Habilitados GEHAKA</span>
            <div className="rarus-kpi-icon-box">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">2</div>
          <span className="rarus-kpi-trend trend-up">Certificados oficiais ativos</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Assinaturas Digitais Validadas</span>
            <div className="rarus-kpi-icon-box">
              <Award size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">100%</div>
          <span className="rarus-kpi-trend trend-neutral">Imagens .PNG em alta resolução</span>
        </div>
      </div>

      <div className="rarus-datagrid-container">
        <div className="rarus-grid-toolbar">
          <div className="rarus-inline-search">
            <Search size={15} color="var(--color-text-muted)" />
            <input
              placeholder="Buscar por nome, cargo ou e-mail..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="rarus-table-container">
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome do Funcionário</th>
                <th>Cargo</th>
                <th>E-mail</th>
                <th>Habilitação Metrológica</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const isSelected = selectedRowId === u.id;
                return (
                  <tr
                    key={u.id}
                    className={isSelected ? 'rarus-row-selected' : ''}
                    onClick={() => handleRowClick(u)}
                    title={isSelected ? 'Clique novamente para abrir a ficha em tela cheia' : 'Clique para selecionar o funcionário'}
                  >
                    <td><code>058</code></td>
                    <td><strong>{u.nome}</strong></td>
                    <td>{u.cargo}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          background: 'var(--color-primary-100)',
                          color: 'var(--color-primary-500)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        {u.permissoesCalibracao.map((p) => p.tipoEquipamento).join(', ') || 'Administrativo'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.ativo ? 'ativo' : 'inativo'}`}>
                        <span className="rarus-status-dot" />
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          preencherForm(u);
                          setSelecionado(u);
                        }}
                        type="button"
                      >
                        Editar
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
