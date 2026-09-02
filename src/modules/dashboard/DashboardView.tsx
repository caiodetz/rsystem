'use client';

import React, { useState, useEffect } from 'react';
import { useTabs } from '@/core/context/TabContext';
import {
  MOCK_EQUIPAMENTOS,
  MOCK_ORDENS_SERVICO,
  MOCK_PADROES_BASAIS,
  MOCK_CLIENTES,
  MOCK_ITENS_ESTOQUE,
} from '@/core/mock-db/data';
import { PadroesBasaisService } from '@/core/services/padroesBasaisService';
import {
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  Boxes,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { openTab } = useTabs();

  const totalEquipamentos = MOCK_EQUIPAMENTOS.length;
  const calibrados = MOCK_EQUIPAMENTOS.filter((e) => e.status === 'Calibrado').length;
  const osAbertas = MOCK_ORDENS_SERVICO.filter(
    (o) => o.status !== 'Encerrada' && o.status !== 'Cancelada'
  ).length;

  const padroesAlerta = MOCK_PADROES_BASAIS.map((p) => {
    const calc = PadroesBasaisService.calcularStatusPorValidade(p.dataValidade);
    return { ...p, calc };
  });

  const padraoCritico = padroesAlerta.find(
    (p) => p.calc.status === 'Alerta30dCritico' || p.calc.status === 'VencidoBloqueado'
  );

  return (
    <div className="rarus-content-scroll">
      {/* Cabeçalho do Dashboard */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <h1>Visão Geral Operacional & Metrológica</h1>
          <p>
            Laboratório RARUS Tecnologia & Serviços • Monitoramento de Safra, Padrões Basais e Ordens de Serviço
          </p>
        </div>
      </div>

      {/* BANNER DE ALERTA SE HOUVER PADRÃO BASAL CRÍTICO OU BLOQUEADO */}
      {padraoCritico && (
        <div
          style={{
            backgroundColor: 'var(--rarus-danger-bg)',
            border: '1px solid var(--rarus-danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ShieldAlert size={28} color="var(--rarus-danger)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--rarus-danger)' }}>
                AVISO DE BLOQUEIO METROLÓGICO: PADRÃO BASAL [{padraoCritico.codigoIdentificador}]
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--rarus-danger)', marginTop: 2 }}>
                {padraoCritico.calc.mensagemAlerta}
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--status-danger-text)', whiteSpace: 'nowrap' }}
            onClick={() =>
              openTab({
                id: 'tab-padroes',
                title: 'Padrões Basais',
                iconName: 'ShieldCheck',
                moduleKey: 'padroes',
              })
            }
          >
            <span>Ver Padrões Basais</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Grid de 4 Cards de Métricas Principais (Estilo Amanah CRM) */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Ordens de Serviço Ativas</span>
            <div className="rarus-kpi-icon-box">
              <Wrench size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{osAbertas}</div>
          <span className="rarus-kpi-trend trend-up">↑ 2 abertas nesta semana</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Equipamentos no Parque</span>
            <div className="rarus-kpi-icon-box">
              <Activity size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{totalEquipamentos}</div>
          <span className="rarus-kpi-trend trend-up">
            {calibrados} calibrados ({Math.round((calibrados / totalEquipamentos) * 100)}% conformidade)
          </span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Clientes Industriais / Agro</span>
            <div className="rarus-kpi-icon-box">
              <Users size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{MOCK_CLIENTES.length}</div>
          <span className="rarus-kpi-trend trend-neutral">Safra de Grãos & Farmacêutico</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Itens no Catálogo de Peças</span>
            <div className="rarus-kpi-icon-box">
              <Boxes size={18} />
            </div>
          </div>
          <div className="rarus-kpi-value">{MOCK_ITENS_ESTOQUE.length}</div>
          <span className="rarus-kpi-trend trend-up">Estoque Central & Móvel dos Técnicos</span>
        </div>
      </div>

      {/* Painel Duplo: Últimas OS e Padrões Basais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px', alignItems: 'start' }}>
        {/* Tabela de Ordens de Serviço Recentes */}
        <div className="rarus-datagrid-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
              Ordens de Serviço em Andamento
            </h3>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '4px 10px' }}
              onClick={() =>
                openTab({
                  id: 'tab-ordens-servico',
                  title: 'Ordens de Serviço',
                  iconName: 'ClipboardList',
                  moduleKey: 'ordens-servico',
                })
              }
            >
              <span>Ver Todas as OS</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <table className="rarus-table">
            <thead>
              <tr>
                <th>Nº OS</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Técnico</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDENS_SERVICO.map((os) => (
                <tr key={os.id}>
                  <td>
                    <strong style={{ color: 'var(--color-primary-500)' }}>#{os.numero}</strong>
                  </td>
                  <td>{os.clienteNome}</td>
                  <td style={{ fontSize: '12px' }}>{os.tipo}</td>
                  <td>{os.tecnicoNome}</td>
                  <td>
                    <span className="status-badge pendente">
                      <span className="rarus-status-dot" />
                      {os.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Padrões Basais de Referência & Status */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Padrões Basais (RBC)</h3>
            <button
              className="btn-secondary-rarus"
              style={{ fontSize: '11.5px', padding: '4px 8px' }}
              onClick={() =>
                openTab({
                  id: 'tab-padroes',
                  title: 'Padrões Basais',
                  iconName: 'ShieldCheck',
                  moduleKey: 'padroes',
                })
              }
            >
              Gerenciar
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {padroesAlerta.map((p) => {
              const isCritico = p.calc.status === 'VencidoBloqueado';
              const isWarning = p.calc.status === 'Alerta60d' || p.calc.status === 'Alerta90d';

              return (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--rarus-navy)' }}>
                      [{p.codigoIdentificador}] {p.modelo}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Validade: {p.dataValidade} • Cert: {p.certificadoRBC}
                    </div>
                  </div>

                  <span
                    className={`rarus-status-pill ${
                      isCritico
                        ? 'status-vencido'
                        : isWarning
                        ? 'status-alerta'
                        : 'status-calibrado'
                    }`}
                    style={{ fontSize: '10.5px' }}
                  >
                    <span className="rarus-status-dot" />
                    {isCritico ? 'Bloqueado' : isWarning ? 'Atenção' : 'Válido'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
