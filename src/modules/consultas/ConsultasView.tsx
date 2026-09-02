'use client';

import React, { useState } from 'react';
import { useTabs } from '@/core/context/TabContext';
import { BuscaGlobalService } from '@/core/services/buscaGlobalService';
import { ItemBuscaGlobal } from '@/core/types';
import {
  Search,
  Layers,
  Wrench,
  Activity,
  Bookmark,
  Users,
  ExternalLink,
  GitBranch,
} from 'lucide-react';

export const ConsultasView: React.FC = () => {
  const { openTab } = useTabs();
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<ItemBuscaGlobal[]>([]);
  const [pesquisado, setPesquisado] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termo.trim()) return;
    const res = await BuscaGlobalService.buscar(termo);
    setResultados(res);
    setPesquisado(true);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Título */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={20} color="#0284c7" />
          Central de Consultas Globais & Rastreabilidade Metrológica
        </h2>
        <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
          Pesquisa unificada em toda a cadeia metrológica (Equipamentos, Ordens de Serviço, Certificados RBC, Padrões e Clientes).
        </p>
      </div>

      {/* Caixa de Pesquisa Central */}
      <div
        className="desktop-panel"
        style={{ padding: '20px', background: '#ffffff', marginBottom: '16px' }}
      >
        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="#64748b"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Digite Tag (ex: PI-4001), Nº de Série, Certificado (CAL-2026), Cliente ou OS..."
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                fontSize: '14px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          </div>

          <button type="submit" className="toolbar-btn primary" style={{ padding: '0 20px', fontSize: '13px' }}>
            <Search size={14} />
            <span>Consultar Global</span>
          </button>
        </form>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', fontSize: '11.5px', color: '#64748b', alignItems: 'center' }}>
          <span>Exemplos rápidos:</span>
          <button
            type="button"
            className="toolbar-btn"
            style={{ fontSize: '11px', padding: '2px 8px' }}
            onClick={() => {
              setTermo('PI-4001');
              BuscaGlobalService.buscar('PI-4001').then(setResultados);
              setPesquisado(true);
            }}
          >
            PI-4001 (Manômetro)
          </button>
          <button
            type="button"
            className="toolbar-btn"
            style={{ fontSize: '11px', padding: '2px 8px' }}
            onClick={() => {
              setTermo('PetroVale');
              BuscaGlobalService.buscar('PetroVale').then(setResultados);
              setPesquisado(true);
            }}
          >
            PetroVale (Cliente)
          </button>
          <button
            type="button"
            className="toolbar-btn"
            style={{ fontSize: '11px', padding: '2px 8px' }}
            onClick={() => {
              setTermo('OS-2026');
              BuscaGlobalService.buscar('OS-2026').then(setResultados);
              setPesquisado(true);
            }}
          >
            OS-2026 (Ordens de Serviço)
          </button>
          <button
            type="button"
            className="toolbar-btn"
            style={{ fontSize: '11px', padding: '2px 8px' }}
            onClick={() => {
              setTermo('RBC');
              BuscaGlobalService.buscar('RBC').then(setResultados);
              setPesquisado(true);
            }}
          >
            RBC (Padrões Metrológicos)
          </button>
        </div>
      </div>

      {/* Resultados da Consulta */}
      {pesquisado && (
        <div>
          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
            Foram encontrados <strong>{resultados.length}</strong> registros relacionados:
          </div>

          {resultados.length === 0 ? (
            <div className="desktop-panel" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
              Nenhum registro encontrado para o termo pesquisado.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {resultados.map((item) => (
                <div
                  key={`${item.tipo}-${item.id}`}
                  className="desktop-panel"
                  style={{ margin: 0, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        padding: 10,
                        background: '#e0f2fe',
                        color: '#0284c7',
                        borderRadius: '6px',
                        display: 'flex',
                      }}
                    >
                      {item.tipo === 'equipamento' && <Layers size={20} />}
                      {item.tipo === 'os' && <Wrench size={20} />}
                      {item.tipo === 'calibracao' && <Activity size={20} />}
                      {item.tipo === 'cliente' && <Users size={20} />}
                      {item.tipo === 'padrao' && <Bookmark size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 style={{ fontSize: '15px', color: '#0f172a', margin: 0 }}>{item.titulo}</h4>
                        <span className="badge-status badge-calibrado">{item.tagBadge}</span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#64748b', margin: '3px 0 0 0' }}>{item.subtitulo}</p>
                    </div>
                  </div>

                  <button
                    className="toolbar-btn primary"
                    onClick={() =>
                      openTab({
                        id: `tab-${item.moduloAlvo}`,
                        title: item.titulo.split('-')[0].trim(),
                        iconName:
                          item.tipo === 'equipamento'
                            ? 'Layers'
                            : item.tipo === 'os'
                            ? 'Wrench'
                            : 'Activity',
                        moduleKey: item.moduloAlvo as any,
                        params: { itemId: item.id },
                      })
                    }
                  >
                    <span>Abrir Módulo</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
