'use client';

import React, { useState, useEffect } from 'react';
import { ItemEstoque } from '@/core/types';
import { DualLookupInput } from '@/core/components/common/DualLookupInput';
import { ModalConsultaGenerica, ColunaConsulta } from '@/core/components/common/ModalConsultaGenerica';
import {
  Package,
  Wrench,
  DollarSign,
  Percent,
  Layers,
  Check,
  X,
  AlertCircle,
  Barcode,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';

export interface ItemLancadoOS {
  codigo: string;
  descricao: string;
  tipoFiscal: 'NF-e (Produto)' | 'NFS-e (Serviço)';
  quantidade: number;
  precoUnitario: number;
  valorDesconto: number;
  percentualDesconto: number;
  valorTotal: number;
  seriaisOuIds: string[];
}

interface ModalLancamentoPecaOSProps {
  aberto: boolean;
  onClose: () => void;
  onAdicionar: (item: ItemLancadoOS) => void;
  catalogoItens: ItemEstoque[];
  localEstoqueId?: string;
  localEstoqueNome?: string;
  tecnicoNomePadrao?: string;
}

export const ModalLancamentoPecaOS: React.FC<ModalLancamentoPecaOSProps> = ({
  aberto,
  onClose,
  onAdicionar,
  catalogoItens,
  localEstoqueId = 'est-central',
  localEstoqueNome = '001 - Almoxarifado Central - Matriz',
  tecnicoNomePadrao = 'Caio Detz',
}) => {
  const [aba, setAba] = useState<'dados' | 'seriais'>('dados');
  const [modalConsultaAberto, setModalConsultaAberto] = useState(false);

  // Form State
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoFiscal, setTipoFiscal] = useState<'NF-e (Produto)' | 'NFS-e (Serviço)'>('NF-e (Produto)');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [precoUnitario, setPrecoUnitario] = useState<number>(0);
  const [percentualDesconto, setPercentualDesconto] = useState<number>(0);
  const [valorDesconto, setValorDesconto] = useState<number>(0);
  const [saldoDisponivel, setSaldoDisponivel] = useState<number>(0);
  const [itemSelecionado, setItemSelecionado] = useState<ItemEstoque | null>(null);

  // Aba 2: Rastreabilidade Serial / IDs de Entrada do Estoque
  const [seriaisDisponiveis, setSeriaisDisponiveis] = useState<string[]>([]);
  const [seriaisVinculados, setSeriaisVinculados] = useState<string[]>([]);
  const [inputSerialManual, setInputSerialManual] = useState('');

  // Controle de Supervisor para Descontos > 10% (Decisão 3 do Usuário) - Declarado no topo para cumprir Regras de Hooks
  const [modalSupervisorAberto, setModalSupervisorAberto] = useState(false);
  const [senhaSupervisor, setSenhaSupervisor] = useState('');
  const [erroSenhaSupervisor, setErroSenhaSupervisor] = useState(false);
  const [supervisorAutorizado, setSupervisorAutorizado] = useState(false);

  useEffect(() => {
    if (aberto) {
      // Resetar formulário
      setAba('dados');
      setCodigo('');
      setDescricao('');
      setTipoFiscal('NF-e (Produto)');
      setQuantidade(1);
      setPrecoUnitario(0);
      setPercentualDesconto(0);
      setValorDesconto(0);
      setSaldoDisponivel(0);
      setItemSelecionado(null);
      setSeriaisDisponiveis([]);
      setSeriaisVinculados([]);
      setInputSerialManual('');
      setModalSupervisorAberto(false);
      setSenhaSupervisor('');
      setErroSenhaSupervisor(false);
      setSupervisorAutorizado(false);
    }
  }, [aberto]);

  if (!aberto) return null;

  const aplicarItemSelecionado = (item: ItemEstoque) => {
    setItemSelecionado(item);
    setCodigo(item.codigo);
    setDescricao(item.descricao);
    const preco = item.precoVenda || 0;
    setPrecoUnitario(preco);

    // Identifica se é serviço ou produto pelo código/tipoItem
    if (item.codigo.startsWith('SRV') || item.tipoItem === 'Servico') {
      setTipoFiscal('NFS-e (Serviço)');
    } else {
      setTipoFiscal('NF-e (Produto)');
    }

    // Saldo no local
    const saldo = item.saldosPorLocal[localEstoqueId] ?? 0;
    setSaldoDisponivel(saldo);

    // Mock de Números de Série / IDs registrados na entrada da Nota Fiscal
    const mockSeriais = [
      `SN-${item.codigo}-0149`,
      `SN-${item.codigo}-0150`,
      `SN-${item.codigo}-0151`,
      `ID-${item.codigo}-NF8820`,
      `ID-${item.codigo}-NF8821`,
    ];
    setSeriaisDisponiveis(mockSeriais);
    setSeriaisVinculados([]);
  };

  const handleBuscarCodigo = (cod: string) => {
    if (!cod.trim()) return;
    const encontrado = catalogoItens.find(
      (i) => i.codigo.toUpperCase() === cod.trim().toUpperCase()
    );
    if (encontrado) {
      aplicarItemSelecionado(encontrado);
    } else {
      // Abre modal filtrado
      setModalConsultaAberto(true);
    }
  };

  // Sincronização de Descontos
  const handlePercentualDescontoChange = (pct: number) => {
    setPercentualDesconto(pct);
    const subtotal = quantidade * precoUnitario;
    const vlrDesc = (subtotal * pct) / 100;
    setValorDesconto(vlrDesc);
  };

  const handleValorDescontoChange = (vlr: number) => {
    setValorDesconto(vlr);
    const subtotal = quantidade * precoUnitario;
    if (subtotal > 0) {
      setPercentualDesconto((vlr / subtotal) * 100);
    }
  };

  const subtotalBruto = quantidade * precoUnitario;
  const valorTotalFinal = Math.max(0, subtotalBruto - valorDesconto);

  // Manipulação de Seriais (Aba 2)
  const handleVincularSerial = (sn: string) => {
    if (seriaisVinculados.includes(sn)) return;
    if (seriaisVinculados.length >= quantidade) {
      alert(`Você já vinculou ${quantidade} número(s) de série para a quantidade indicada.`);
      return;
    }
    setSeriaisVinculados([...seriaisVinculados, sn]);
    setInputSerialManual('');
  };

  const handleRemoverSerial = (sn: string) => {
    setSeriaisVinculados(seriaisVinculados.filter((s) => s !== sn));
  };

  const executarInsercaoFinal = () => {
    onAdicionar({
      codigo,
      descricao,
      tipoFiscal,
      quantidade,
      precoUnitario,
      valorDesconto,
      percentualDesconto,
      valorTotal: valorTotalFinal,
      seriaisOuIds: seriaisVinculados,
    });
    onClose();
  };

  const handleConfirmarInsercao = () => {
    if (!codigo || !descricao) {
      alert('Por favor, informe ou selecione uma peça / serviço.');
      return;
    }
    if (quantidade <= 0) {
      alert('A quantidade deve ser maior do que zero.');
      return;
    }

    // 1. Validação Rígida de Rastreabilidade Serial (Decisão 2 do Usuário: Opção A)
    if (itemSelecionado?.requerNumeroSerie && seriaisVinculados.length < quantidade) {
      alert(
        `[BLOQUEIO DE RASTREABILIDADE METROLÓGICA]\n\nO item "${descricao}" exige obrigatoriamente a vinculação de ${quantidade} número(s) de série/ID(s) registrados na entrada em estoque.\n\nAtualmente vinculados: ${seriaisVinculados.length} de ${quantidade}.\nVocê será direcionado para a Aba 2 para registrar os seriais.`
      );
      setAba('seriais');
      return;
    }

    // 2. Validação de Alçada de Desconto por Supervisor (Decisão 3 do Usuário: Opção B)
    if (percentualDesconto > 10 && !supervisorAutorizado) {
      setModalSupervisorAberto(true);
      return;
    }

    executarInsercaoFinal();
  };

  const handleConfirmarSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação com senhas administrativas padrão de demonstração
    if (senhaSupervisor === '1234' || senhaSupervisor.toLowerCase() === 'admin' || senhaSupervisor === 'supervisor') {
      setSupervisorAutorizado(true);
      setModalSupervisorAberto(false);
      setErroSenhaSupervisor(false);
      // Executa a inserção autorizada
      onAdicionar({
        codigo,
        descricao,
        tipoFiscal,
        quantidade,
        precoUnitario,
        valorDesconto,
        percentualDesconto,
        valorTotal: valorTotalFinal,
        seriaisOuIds: seriaisVinculados,
      });
      onClose();
    } else {
      setErroSenhaSupervisor(true);
    }
  };

  const colunasConsulta: ColunaConsulta<ItemEstoque>[] = [
    { chave: 'codigo', titulo: 'Código', width: 110 },
    { chave: 'descricao', titulo: 'Descrição do Item' },
    {
      chave: 'tipoItem',
      titulo: 'Tipo',
      width: 120,
      render: (it) => (it.tipoItem === 'ProdutoPeca' ? 'Produto/Peça' : 'Serviço'),
    },
    { chave: 'unidadeMedida', titulo: 'Unid.', width: 60, align: 'center' },
    {
      chave: 'precoVenda',
      titulo: 'Preço Tab.',
      width: 110,
      align: 'right',
      render: (it) => `R$ ${(it.precoVenda || 0).toFixed(2)}`,
    },
    {
      chave: 'saldosPorLocal',
      titulo: 'Saldo Local',
      width: 100,
      align: 'right',
      render: (it) => {
        const s = it.saldosPorLocal[localEstoqueId] ?? 0;
        return (
          <span style={{ fontWeight: 600, color: s > 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)' }}>
            {s} {it.unidadeMedida}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9990,
          padding: '20px',
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Package size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  Lançar Produto / Peça / Serviço na OS
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Estoque de Origem: <strong>{localEstoqueNome}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Abas de Navegação Interna */}
          <div className="tabs-navigation" style={{ padding: '0 20px', backgroundColor: 'var(--color-bg-base)' }}>
            <button
              type="button"
              className={`tab-button ${aba === 'dados' ? 'active' : ''}`}
              onClick={() => setAba('dados')}
            >
              1. Dados do Item, Preço & Desconto
            </button>
            <button
              type="button"
              className={`tab-button ${aba === 'seriais' ? 'active' : ''}`}
              onClick={() => setAba('seriais')}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>2. Rastreabilidade & Seriais (IDs) ({seriaisVinculados.length}/{quantidade})</span>
              {itemSelecionado?.requerNumeroSerie && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#B91C1C',
                    backgroundColor: '#FEE2E2',
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  Obrigatório
                </span>
              )}
            </button>
          </div>

          {/* Corpo do Modal */}
          <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
            {aba === 'dados' && (
              <div>
                {/* 1. Componente Universal Dual Lookup (Baseado em input code.png) */}
                <DualLookupInput
                  label="Produto / Peça / Serviço do Catálogo"
                  codigoValue={codigo}
                  descricaoValue={descricao}
                  onCodigoChange={setCodigo}
                  onDescricaoChange={setDescricao}
                  onCodigoBlurOrEnter={handleBuscarCodigo}
                  onOpenConsulta={() => setModalConsultaAberto(true)}
                  placeholderCodigo="CÓDIGO (ex: 004674)"
                  placeholderDescricao="Clique na lupa ou tecle Enter para pesquisar no acervo..."
                  required
                  widthCodigo="160px"
                  infoExtra={
                    saldoDisponivel > 0
                      ? `Saldo disponível: ${saldoDisponivel} un.`
                      : codigo
                      ? 'Sem saldo físico neste local'
                      : undefined
                  }
                />

                {/* Linha Fiscal & Estoque */}
                <div className="form-grid" style={{ marginTop: 14 }}>
                  <div className="form-group col-6">
                    <label className="form-label">Enquadramento Fiscal</label>
                    <select
                      className="form-select"
                      value={tipoFiscal}
                      onChange={(e) => setTipoFiscal(e.target.value as any)}
                    >
                      <option value="NF-e (Produto)">NF-e (Produto / Peça de Reposição)</option>
                      <option value="NFS-e (Serviço)">NFS-e (Serviço / Mão de Obra / Calibração)</option>
                    </select>
                  </div>

                  <div className="form-group col-6">
                    <label className="form-label">Técnico Executor / Aplicador</label>
                    <input className="form-input" defaultValue={tecnicoNomePadrao} />
                  </div>
                </div>

                {/* Box de Valores, Quantidade e Desconto */}
                <div
                  style={{
                    marginTop: 14,
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-base)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 10 }}>
                    Condições Comerciais do Item
                  </div>

                  <div className="form-grid">
                    <div className="form-group col-3">
                      <label className="form-label">Quantidade *</label>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        className="form-input"
                        value={quantidade}
                        onChange={(e) => {
                          const q = Math.max(1, Number(e.target.value) || 1);
                          setQuantidade(q);
                          const sub = q * precoUnitario;
                          setValorDesconto((sub * percentualDesconto) / 100);
                        }}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label className="form-label">Preço Unit. (R$) *</label>
                      <input
                        type="number"
                        step={0.01}
                        className="form-input"
                        value={precoUnitario}
                        onChange={(e) => {
                          const p = Number(e.target.value) || 0;
                          setPrecoUnitario(p);
                          const sub = quantidade * p;
                          setValorDesconto((sub * percentualDesconto) / 100);
                        }}
                      />
                    </div>

                    <div className="form-group col-3">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="form-label">% Desconto</label>
                        {percentualDesconto > 10 && (
                          <span style={{ fontSize: '10px', color: '#DC2626', fontWeight: 700 }} title="Desconto superior a 10% requer autorização">
                            Supervisor (&gt;10%)
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        className="form-input"
                        value={percentualDesconto}
                        onChange={(e) => handlePercentualDescontoChange(Number(e.target.value) || 0)}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label className="form-label">Valor Desconto (R$)</label>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        className="form-input"
                        value={valorDesconto}
                        onChange={(e) => handleValorDescontoChange(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Resumo Totalizador do Item */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px dashed var(--color-border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Subtotal Bruto: <strong>R$ {subtotalBruto.toFixed(2)}</strong> • Desconto:{' '}
                      <strong style={{ color: 'var(--status-danger-text)' }}>
                        - R$ {valorDesconto.toFixed(2)}
                      </strong>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-500)' }}>
                      Total do Item: R$ {valorTotalFinal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {aba === 'seriais' && (
              <div>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-50)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <Barcode size={20} color="var(--color-primary-500)" />
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-main)' }}>
                    Vincule os <strong>{quantidade}</strong> números de série / IDs físicos desta peça que saíram do estoque para a OS.
                  </div>
                </div>

                {/* Bipar / Inserir Serial Manual */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Bipe com leitor de código de barras ou digite o Nº de Série / ID..."
                      value={inputSerialManual}
                      onChange={(e) => setInputSerialManual(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputSerialManual.trim()) {
                          handleVincularSerial(inputSerialManual.trim());
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      if (inputSerialManual.trim()) {
                        handleVincularSerial(inputSerialManual.trim());
                      }
                    }}
                  >
                    <Plus size={14} />
                    <span>Vincular</span>
                  </button>
                </div>

                {/* Sugestões de Seriais em Estoque (provenientes da entrada de nota) */}
                {seriaisDisponiveis.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      Seriais / Lotes disponíveis no estoque (entrada via NF-e):
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {seriaisDisponiveis.map((sn) => {
                        const jaVinculado = seriaisVinculados.includes(sn);
                        return (
                          <button
                            key={sn}
                            type="button"
                            className="btn btn-secondary"
                            disabled={jaVinculado}
                            onClick={() => handleVincularSerial(sn)}
                            style={{
                              fontSize: '11.5px',
                              fontFamily: 'monospace',
                              padding: '4px 8px',
                              opacity: jaVinculado ? 0.4 : 1,
                            }}
                          >
                            + {sn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lista de Seriais Vinculados */}
                <div
                  style={{
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-bg-base)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Seriais Vinculados a esta OS ({seriaisVinculados.length} de {quantidade})</span>
                    {seriaisVinculados.length === quantidade && (
                      <span style={{ color: 'var(--status-success-text)' }}>✓ Quantidade conferida</span>
                    )}
                  </div>

                  {seriaisVinculados.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12.5px' }}>
                      Nenhum número de série vinculado ainda. Utilize os botões acima ou bipe o código.
                    </div>
                  ) : (
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {seriaisVinculados.map((sn, idx) => (
                        <div
                          key={sn}
                          style={{
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--color-border-subtle)',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>#{idx + 1}</span>
                            <code style={{ fontWeight: 600 }}>{sn}</code>
                          </div>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleRemoverSerial(sn)}
                            style={{ padding: '2px 6px', color: 'var(--status-danger-text)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer de Ações */}
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-bg-surface)',
            }}
          >
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmarInsercao}
              style={{ fontWeight: 600, padding: '0 20px' }}
            >
              <Check size={15} />
              <span>Inserir Item na OS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modal de Consulta de Peças do Catálogo */}
      <ModalConsultaGenerica<ItemEstoque>
        aberto={modalConsultaAberto}
        titulo="Consulta de Peças, Insumos e Serviços no Estoque"
        subtitulo="Selecione um item do acervo cadastrado para preenchimento imediato"
        dados={catalogoItens}
        colunas={colunasConsulta}
        campoCodigo="codigo"
        campoDescricao="descricao"
        termoInicial={codigo || descricao}
        onSelect={(it) => aplicarItemSelecionado(it)}
        onClose={() => setModalConsultaAberto(false)}
      />

      {/* Modal de Autorização por Senha de Supervisor (Decisão 3 do Usuário: Opção B) */}
      {modalSupervisorAberto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10002,
            padding: '20px',
          }}
          onClick={() => setModalSupervisorAberto(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  Alçada de Desconto Excedida
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Desconto de {percentualDesconto.toFixed(1)}% (R$ {valorDesconto.toFixed(2)})
                </p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.5, marginBottom: 16 }}>
              Descontos comerciais acima de <strong>10%</strong> exigem autorização do Supervisor Comercial. Digite a senha para liberar o lançamento:
            </p>

            <form onSubmit={handleConfirmarSupervisor}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Senha do Supervisor Comercial</label>
                <input
                  type="password"
                  className="form-input"
                  value={senhaSupervisor}
                  onChange={(e) => {
                    setSenhaSupervisor(e.target.value);
                    setErroSenhaSupervisor(false);
                  }}
                  placeholder="Digite a senha (padrão: 1234)"
                  autoFocus
                />
                {erroSenhaSupervisor && (
                  <span style={{ fontSize: '11.5px', color: 'var(--status-danger-text)', fontWeight: 600, marginTop: 4, display: 'block' }}>
                    Senha incorreta. Utilize a senha padrão "1234".
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalSupervisorAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={14} />
                  <span>Autorizar Lançamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
