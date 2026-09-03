'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Check, ArrowRight } from 'lucide-react';

export interface ColunaConsulta<T> {
  chave: keyof T | string;
  titulo: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

export interface ModalConsultaGenericaProps<T> {
  aberto: boolean;
  titulo: string;
  subtitulo?: string;
  colunas: ColunaConsulta<T>[];
  dados: T[];
  campoCodigo: keyof T;
  campoDescricao: keyof T;
  termoInicial?: string;
  extraAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  onSelect: (item: T) => void;
  onClose: () => void;
}

export function ModalConsultaGenerica<T extends Record<string, any>>({
  aberto,
  titulo,
  subtitulo = 'Selecione um registro da lista ou utilize a pesquisa rápida',
  colunas,
  dados,
  campoCodigo,
  campoDescricao,
  termoInicial = '',
  extraAction,
  onSelect,
  onClose,
}: ModalConsultaGenericaProps<T>) {
  const [busca, setBusca] = useState(termoInicial);
  const [itemSelecionado, setItemSelecionado] = useState<T | null>(null);

  const dadosFiltrados = useMemo(() => {
    if (!busca.trim()) return dados;
    const q = busca.toLowerCase();
    return dados.filter((item) => {
      const cod = String(item[campoCodigo] || '').toLowerCase();
      const desc = String(item[campoDescricao] || '').toLowerCase();
      return (
        cod.includes(q) ||
        desc.includes(q) ||
        Object.values(item).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))
      );
    });
  }, [dados, busca, campoCodigo, campoDescricao]);

  if (!aberto) return null;

  const handleConfirmar = () => {
    if (itemSelecionado) {
      onSelect(itemSelecionado);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
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
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {titulo}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {subtitulo}
            </p>
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

        {/* Barra de Busca Rápida + Ação Extra */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-base)',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div className="rarus-search-box" style={{ flex: 1, maxWidth: '100%' }}>
            <Search size={15} />
            <input
              type="text"
              placeholder="Digite código, descrição ou palavra-chave para filtrar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus
            />
          </div>
          {extraAction && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={extraAction.onClick}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {extraAction.icon}
              <span>{extraAction.label}</span>
            </button>
          )}
        </div>

        {/* Tabela de Resultados */}
        <div
          className="rarus-table-container"
          style={{ flex: 1, overflowY: 'auto', maxHeight: '420px', border: 'none', borderRadius: 0 }}
        >
          <table className="rarus-table">
            <thead>
              <tr>
                {colunas.map((c, i) => (
                  <th
                    key={String(c.chave) + i}
                    style={{
                      width: c.width,
                      textAlign: c.align || 'left',
                    }}
                  >
                    {c.titulo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={colunas.length}
                    style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}
                  >
                    Nenhum registro encontrado para o termo pesquisado.
                  </td>
                </tr>
              ) : (
                dadosFiltrados.map((item, idx) => {
                  const isSel = itemSelecionado === item;
                  return (
                    <tr
                      key={String(item[campoCodigo]) + idx}
                      className={isSel ? 'rarus-row-selected' : ''}
                      onClick={() => setItemSelecionado(item)}
                      onDoubleClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      style={{ cursor: 'pointer' }}
                      title="Duplo clique para selecionar imediatamente"
                    >
                      {colunas.map((col, colIdx) => (
                        <td
                          key={String(col.chave) + colIdx}
                          style={{ textAlign: col.align || 'left' }}
                        >
                          {col.render ? col.render(item) : String(item[col.chave] ?? '-')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé de Ações */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg-surface)',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Exibindo <strong>{dadosFiltrados.length}</strong> registro(s) • Dica: utilize o{' '}
            <strong>duplo clique</strong> na linha para seleção rápida.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!itemSelecionado}
              onClick={handleConfirmar}
            >
              <Check size={14} />
              <span>Confirmar Seleção</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
