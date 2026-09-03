'use client';

import React, { useState } from 'react';
import { Equipamento } from '@/core/types';
import { EquipamentosService } from '@/core/services/equipamentosService';
import { Lock, Wrench, X, Check } from 'lucide-react';

interface ModalCadastroEquipamentoRapidoProps {
  aberto: boolean;
  clienteId: string;
  clienteNome: string;
  onClose: () => void;
  onEquipamentoSalvo: (equipamento: Equipamento) => void;
}

export const ModalCadastroEquipamentoRapido: React.FC<ModalCadastroEquipamentoRapidoProps> = ({
  aberto,
  clienteId,
  clienteNome,
  onClose,
  onEquipamentoSalvo,
}) => {
  const [modelo, setModelo] = useState('G650i');
  const [fabricante, setFabricante] = useState('GEHAKA');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [patrimonio, setPatrimonio] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('Medidor de Umidade GEHAKA');
  const [faixaMedicao, setFaixaMedicao] = useState('5,0% a 40,0% Umidade');
  const [resolucao, setResolucao] = useState('0,1%');
  const [seloInmetro, setSeloInmetro] = useState('');
  const [lacreNovo, setLacreNovo] = useState('');
  const [salvando, setSalvando] = useState(false);

  if (!aberto) return null;

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroSerie.trim()) {
      alert('Por favor, informe o Número de Série do equipamento.');
      return;
    }
    if (!modelo.trim()) {
      alert('Por favor, informe o Modelo do equipamento.');
      return;
    }

    setSalvando(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const proximoAno = new Date();
      proximoAno.setFullYear(proximoAno.getFullYear() + 1);
      const proxCalib = proximoAno.toISOString().split('T')[0];

      const novo = await EquipamentosService.criar({
        clienteId,
        clienteNome,
        modelo: modelo.trim(),
        fabricante: fabricante.trim() || 'GEHAKA',
        numeroSerie: numeroSerie.trim().toUpperCase(),
        patrimonio: patrimonio.trim(),
        tipoEquipamento,
        faixaMedicao,
        resolucao,
        seloNovo: seloInmetro.trim() || `SELO-INM-${Math.floor(10000 + Math.random() * 90000)}`,
        lacreNovo: lacreNovo.trim() || `LAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        dataUltimaCalibracao: hoje,
        dataProximaCalibracao: proxCalib,
        status: 'Em Manutenção',
        observacoes: 'Equipamento cadastrado diretamente via Ordem de Serviço',
      });

      onEquipamentoSalvo(novo);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar novo equipamento.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001,
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
          maxWidth: '680px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
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
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wrench size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Cadastrar Novo Equipamento
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Cadastro direto para inclusão instantânea na Ordem de Serviço
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

        {/* Formulário */}
        <form onSubmit={handleSalvar} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Alerta de Cliente Travado conforme Decisão 6 */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={15} color="#15803D" />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  Cliente Proprietário (Travado da OS)
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#14532D' }}>
                  {clienteNome || 'Cliente não identificado'}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              Exclusivo deste cliente
            </span>
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12 }}>
            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">
                Modelo do Instrumento <span style={{ color: 'var(--status-danger-text)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: G650i, G800, AUW-220D"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">Fabricante</label>
              <input
                type="text"
                className="form-input"
                value={fabricante}
                onChange={(e) => setFabricante(e.target.value)}
                placeholder="Ex: GEHAKA, Toledo, Marte"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">
                Número de Série / Tag <span style={{ color: 'var(--status-danger-text)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value.toUpperCase())}
                placeholder="Ex: GEH-2026-9910"
                style={{ fontFamily: 'monospace', fontWeight: 600 }}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">Patrimônio Interno do Cliente</label>
              <input
                type="text"
                className="form-input"
                value={patrimonio}
                onChange={(e) => setPatrimonio(e.target.value)}
                placeholder="Ex: PAT-GR-089"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">Tipo de Instrumento</label>
              <select
                className="form-select"
                value={tipoEquipamento}
                onChange={(e) => setTipoEquipamento(e.target.value)}
              >
                <option value="Medidor de Umidade GEHAKA">Medidor de Umidade GEHAKA</option>
                <option value="Balança de Precisão">Balança de Precisão</option>
                <option value="Termohigrômetro">Termohigrômetro</option>
                <option value="Multigás">Detector Multigás</option>
                <option value="pHmetro Industrial">pHmetro Industrial</option>
                <option value="Outro">Outro Equipamento Industrial</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">Faixa de Medição / Capacidade</label>
              <input
                type="text"
                className="form-input"
                value={faixaMedicao}
                onChange={(e) => setFaixaMedicao(e.target.value)}
                placeholder="Ex: 5,0% a 40,0% Umidade"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">Selo Inmetro (se houver)</label>
              <input
                type="text"
                className="form-input"
                value={seloInmetro}
                onChange={(e) => setSeloInmetro(e.target.value)}
                placeholder="Ex: SELO-INM-88910"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 6' }}>
              <label className="form-label">Lacre de Proteção Metrológica</label>
              <input
                type="text"
                className="form-input"
                value={lacreNovo}
                onChange={(e) => setLacreNovo(e.target.value)}
                placeholder="Ex: LAC-2026-1022"
              />
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              <Check size={15} />
              <span>{salvando ? 'Salvando...' : '+ Salvar e Vincular à OS'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
