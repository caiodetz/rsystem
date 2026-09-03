'use client';

import React, { useState } from 'react';
import { useTabs, ModuleKey } from '@/core/context/TabContext';
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
  ShieldCheck,
  FileCheck2,
  Boxes,
} from 'lucide-react';

export const ConsultasView: React.FC = () => {
  const { openTab } = useTabs();
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<ItemBuscaGlobal[]>([]);
  const [pesquisado, setPesquisado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const executarBusca = async (texto: string) => {
    if (!texto.trim()) return;
    setCarregando(true);
    const res = await BuscaGlobalService.buscar(texto);
    setResultados(res);
    setPesquisado(true);
    setCarregando(false);
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    await executarBusca(termo);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'equipamento':
        return <Wrench size={18} />;
      case 'os':
        return <Activity size={18} />;
      case 'certificado':
        return <FileCheck2 size={18} />;
      case 'padrao':
        return <ShieldCheck size={18} />;
      case 'cliente':
        return <Users size={18} />;
      case 'estoque':
        return <Boxes size={18} />;
      default:
        return <Bookmark size={18} />;
    }
  };

  return (
    <div className="rarus-content-scroll">
      {/* Header Padronizado */}
      <div className="rarus-page-header" style={{ flexShrink: 0 }}>
        <div className="rarus-page-title-group">
          <h1>Central de Consultas Globais & Rastreabilidade Metrológica</h1>
          <p>
            Pesquisa instantânea em toda a cadeia: Equipamentos, Ordens de Serviço, Certificados RBC, Padrões e Clientes.
          </p>
        </div>
      </div>

      {/* Caixa de Pesquisa Central - Fix para nunca encolher (flexShrink: 0) */}
      <div className="rarus-datagrid-container rarus-search-panel" style={{ padding: '24px', flexShrink: 0 }}>
        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Digite Tag (ex: PI-4001), Nº de Série, Certificado (CAL-2026), Cliente ou OS..."
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              style={{
                paddingLeft: '42px',
                height: '42px',
                fontSize: '14px',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              height: '42px',
              padding: '0 24px',
              fontSize: '13.5px',
              fontWeight: 600,
              gap: '8px',
            }}
          >
            <Search size={16} />
            <span>Consultar Global</span>
          </button>
        </form>

        {/* Exemplos Rápidos com Estilo de Chips */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '14px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontWeight: 600 }}>Exemplos rápidos:</span>
          {[
            { label: 'PI-4001 (Manômetro)', valor: 'PI-4001' },
            { label: 'PetroVale (Cliente)', valor: 'PetroVale' },
            { label: 'OS-2026 (Ordens de Serviço)', valor: 'OS-2026' },
            { label: 'RBC (Padrões Metrológicos)', valor: 'RBC' },
            { label: 'G650i (Medidor de Umidade)', valor: 'G650i' },
          ].map((chip) => (
            <button
              key={chip.valor}
              type="button"
              className="btn btn-secondary"
              style={{
                fontSize: '11.5px',
                height: '26px',
                padding: '0 10px',
                borderRadius: 'var(--radius-full)',
              }}
              onClick={() => {
                setTermo(chip.valor);
                executarBusca(chip.valor);
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Indicador de Carregando */}
      {carregando && (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Buscando registros na base metrológica...
        </div>
      )}

      {/* Resultados da Consulta */}
      {pesquisado && !carregando && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <div style={{ fontSize: '13.5px', color: 'var(--color-text-main)', fontWeight: 600 }}>
            {resultados.length === 0
              ? 'Nenhum registro encontrado'
              : `Encontrado(s) ${resultados.length} registro(s) correspondente(s):`}
          </div>

          {resultados.length === 0 ? (
            <div
              className="rarus-datagrid-container"
              style={{
                padding: '40px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
              }}
            >
              Nenhum dado encontrado para o termo pesquisado. Verifique a grafia ou tente um dos exemplos rápidos acima.
            </div>
          ) : (
            resultados.map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                className="rarus-datagrid-container"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getTipoIcon(item.tipo)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                        {item.titulo}
                      </h4>
                      <span className="status-badge ativo">
                        <span className="rarus-status-dot" />
                        {item.tagBadge}
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: 0 }}>
                      {item.subtitulo}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flexShrink: 0 }}
                  onClick={() =>
                    openTab({
                      id: `tab-${item.moduloAlvo}`,
                      title: item.titulo.split('-')[0].trim(),
                      iconName:
                        item.tipo === 'equipamento'
                          ? 'Wrench'
                          : item.tipo === 'os'
                          ? 'ClipboardList'
                          : item.tipo === 'padrao'
                          ? 'ShieldCheck'
                          : 'Layers',
                      moduleKey: item.moduloAlvo as ModuleKey,
                      params: { itemId: item.id },
                    })
                  }
                >
                  <span>Abrir Módulo</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
