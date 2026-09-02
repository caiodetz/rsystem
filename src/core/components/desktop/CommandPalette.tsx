'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTabs, ModuleKey } from '@/core/context/TabContext';
import { BuscaGlobalService } from '@/core/services/buscaGlobalService';
import { ItemBuscaGlobal } from '@/core/types';
import {
  Search,
  X,
  ChevronRight,
  Layers,
  Wrench,
  Activity,
  Users,
  Bookmark,
  Boxes,
  FileBarChart,
  Command,
} from 'lucide-react';

const ICON_MAP = {
  equipamento: Layers,
  os: Wrench,
  calibracao: Activity,
  cliente: Users,
  padrao: Bookmark,
  estoque: Boxes,
  relatorio: FileBarChart,
};

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, closeCommandPalette, openTab } = useTabs();
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<ItemBuscaGlobal[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setResultados([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    let active = true;
    if (query.trim().length === 0) {
      setResultados([]);
      return;
    }

    BuscaGlobalService.buscar(query).then((items) => {
      if (active) {
        setResultados(items);
      }
    });

    return () => {
      active = false;
    };
  }, [query]);

  if (!isCommandPaletteOpen) return null;

  const handleSelect = (item: ItemBuscaGlobal) => {
    openTab({
      id: `tab-${item.moduloAlvo}`,
      title: item.titulo.split('(')[0].split('-')[0].trim(),
      iconName: item.tipo === 'equipamento' ? 'Layers' : item.tipo === 'os' ? 'Wrench' : 'Activity',
      moduleKey: item.moduloAlvo as ModuleKey,
      params: { itemId: item.id, comando: item.comandoAcao },
    });
    closeCommandPalette();
  };

  return (
    <div
      className="rarus-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCommandPalette();
      }}
    >
      <div className="rarus-modal-box" style={{ maxWidth: '640px' }}>
        {/* Barra de Busca do Modal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={20} color="var(--rarus-cyan)" />
          <input
            ref={inputRef}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              color: 'var(--text-main)',
            }}
            placeholder="Digite qualquer coisa (ex: contagem de estoque, G650i, AgroGrãos, OS 1045)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeCommandPalette();
              if (e.key === 'Enter' && resultados.length > 0) {
                handleSelect(resultados[0]);
              }
            }}
          />
          <button
            onClick={closeCommandPalette}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Resultados */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {query.trim().length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              <Command size={28} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <div>Busca rápida instantânea em todos os módulos</div>
              <div style={{ fontSize: '11.5px', marginTop: 4, color: 'var(--text-subtle)' }}>
                Dica: Digite <strong>contagem de estoque</strong> e aperte Enter para abrir diretamente!
              </div>
            </div>
          ) : resultados.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '13px' }}>
              Nenhum resultado encontrado para &ldquo;{query}&rdquo;
            </div>
          ) : (
            resultados.map((item) => {
              const IconComp = ICON_MAP[item.tipo] || Layers;
              return (
                <div
                  key={`${item.tipo}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-app)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        padding: 8,
                        background: 'var(--rarus-cyan-light)',
                        borderRadius: 6,
                        color: 'var(--rarus-navy)',
                        display: 'flex',
                      }}
                    >
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '13.5px' }}>
                        {item.titulo}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.subtitulo}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        background: 'var(--border-subtle)',
                        borderRadius: 4,
                        color: 'var(--text-main)',
                        fontWeight: 600,
                      }}
                    >
                      {item.tagBadge}
                    </span>
                    <ChevronRight size={16} color="var(--text-subtle)" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
