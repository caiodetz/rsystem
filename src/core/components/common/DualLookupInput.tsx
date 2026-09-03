'use client';

import React, { useState } from 'react';
import { Search, FolderSearch } from 'lucide-react';

export interface DualLookupInputProps {
  label: string;
  codigoValue: string;
  descricaoValue: string;
  onCodigoChange?: (codigo: string) => void;
  onDescricaoChange?: (desc: string) => void;
  onCodigoBlurOrEnter?: (codigo: string) => void;
  onOpenConsulta: () => void;
  placeholderCodigo?: string;
  placeholderDescricao?: string;
  readOnlyDescricao?: boolean;
  disabled?: boolean;
  required?: boolean;
  widthCodigo?: string;
  infoExtra?: string;
}

/**
 * DualLookupInput
 * Padrão clássico de ERP (Código ↔ Lupa / Pasta ↔ Descrição)
 * Baseado no exemplo oficial: input code.png
 */
export const DualLookupInput: React.FC<DualLookupInputProps> = ({
  label,
  codigoValue,
  descricaoValue,
  onCodigoChange,
  onDescricaoChange,
  onCodigoBlurOrEnter,
  onOpenConsulta,
  placeholderCodigo = 'Código',
  placeholderDescricao = 'Descrição ou pesquise...',
  readOnlyDescricao = false,
  disabled = false,
  required = false,
  widthCodigo = '130px',
  infoExtra,
}) => {
  const [focused, setFocused] = useState(false);

  const handleKeyDownCodigo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (onCodigoBlurOrEnter) {
        onCodigoBlurOrEnter(codigoValue);
      }
    }
  };

  const handleKeyDownDescricao = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onOpenConsulta();
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="form-label" style={{ marginBottom: '4px' }}>
          {label} {required && <span style={{ color: 'var(--status-danger-text)' }}>*</span>}
        </label>
        {infoExtra && (
          <span style={{ fontSize: '11px', color: 'var(--color-primary-500)', fontWeight: 500 }}>
            {infoExtra}
          </span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
        }}
      >
        {/* Campo 1: Código (Esquerda) */}
        <div style={{ width: widthCodigo, flexShrink: 0 }}>
          <input
            type="text"
            className="form-input"
            value={codigoValue}
            onChange={(e) => onCodigoChange && onCodigoChange(e.target.value)}
            onBlur={() => onCodigoBlurOrEnter && onCodigoBlurOrEnter(codigoValue)}
            onKeyDown={handleKeyDownCodigo}
            placeholder={placeholderCodigo}
            disabled={disabled}
            style={{
              fontWeight: 600,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          />
        </div>

        {/* Botão Central: Busca / Pasta (Baseado em input code.png) */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onOpenConsulta}
          disabled={disabled}
          title="Abrir pesquisa e consulta detalhada (Enter no campo de descrição)"
          style={{
            height: '38px',
            padding: '0 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: 'var(--color-bg-base)',
            borderColor: 'var(--color-border-input)',
            color: 'var(--color-primary-500)',
          }}
        >
          <Search size={15} />
        </button>

        {/* Campo 2: Descrição / Nome (Direita) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            type="text"
            className="form-input"
            value={descricaoValue}
            onChange={(e) => onDescricaoChange && onDescricaoChange(e.target.value)}
            onKeyDown={handleKeyDownDescricao}
            placeholder={placeholderDescricao}
            readOnly={readOnlyDescricao}
            disabled={disabled}
            style={{
              width: '100%',
              backgroundColor: readOnlyDescricao ? 'var(--color-bg-base)' : 'inherit',
              cursor: readOnlyDescricao ? 'pointer' : 'text',
            }}
            onClick={() => {
              if (readOnlyDescricao) onOpenConsulta();
            }}
          />
        </div>
      </div>
    </div>
  );
};
