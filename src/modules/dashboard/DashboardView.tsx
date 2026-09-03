'use client';

import React, { useState } from 'react';
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
  ChevronRight,
  ShieldAlert,
  Boxes,
  Users,
  ArrowRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { openTab } = useTabs();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

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

  const handleRowClick = (osId: string) => {
    if (selectedRowId === osId) {
      // 2º clique na mesma linha: abre a OS
      openTab({
        id: 'tab-ordens-servico',
        title: 'Ordens de Serviço',
        iconName: 'ClipboardList',
        moduleKey: 'ordens-servico',
        params: { osIdSelecionada: osId },
      });
    } else {
      // 1º clique: apenas seleciona a linha
      setSelectedRowId(osId);
    }
  };

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
        <div className="rarus-alert-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert size={22} color="var(--status-danger-text)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--status-danger-text)' }}>
                AVISO DE BLOQUEIO METROLÓGICO: PADRÃO BASAL [{padraoCritico.codigoIdentificador}]
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--status-danger-text)', marginTop: 1 }}>
                {padraoCritico.calc.mensagemAlerta}
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--status-danger-text)', whiteSpace: 'nowrap', fontSize: '11.5px' }}
            onClick={() =>
              openTab({
                id: 'tab-padroes',
                title: 'Padrões Basais',
                iconName: 'ShieldCheck',
                moduleKey: 'padroes',
              })
            }
            type="button"
          >
            <span>Ver Padrões Basais</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Grid de 4 Cards de Métricas Principais (Estilo Amanah CRM) */}
      <div className="rarus-kpi-grid">
        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Ordens de Serviço Ativas</span>
            <div className="rarus-kpi-icon-box">
              <Wrench size={16} />
            </div>
          </div>
          <div className="rarus-kpi-value">{osAbertas}</div>
          <span className="rarus-kpi-trend trend-up">↑ 2 abertas nesta semana</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Equipamentos no Parque</span>
            <div className="rarus-kpi-icon-box">
              <Activity size={16} />
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
              <Users size={16} />
            </div>
          </div>
          <div className="rarus-kpi-value">{MOCK_CLIENTES.length}</div>
          <span className="rarus-kpi-trend trend-neutral">Safra de Grãos & Farmacêutico</span>
        </div>

        <div className="rarus-kpi-card">
          <div className="rarus-kpi-top">
            <span className="rarus-kpi-label">Itens no Catálogo de Peças</span>
            <div className="rarus-kpi-icon-box">
              <Boxes size={16} />
            </div>
          </div>
          <div className="rarus-kpi-value">{MOCK_ITENS_ESTOQUE.length}</div>
          <span className="rarus-kpi-trend trend-up">Estoque Central & Móvel</span>
        </div>
      </div>

      {/* Tabela de Ordens de Serviço Expandida para 100% da Largura Inferior */}
      <div className="rarus-datagrid-container">
        <div className="rarus-datagrid-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Ordens de Serviço em Andamento
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              {selectedRowId ? 'Clique novamente na linha selecionada para abrir a OS' : 'Selecione uma linha para visualizar ou clique em "Ver Todas as OS"'}
            </span>
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '11.5px' }}
            onClick={() =>
              openTab({
                id: 'tab-ordens-servico',
                title: 'Ordens de Serviço',
                iconName: 'ClipboardList',
                moduleKey: 'ordens-servico',
              })
            }
            type="button"
          >
            <span>Ver Todas as OS</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Container com scroll horizontal garantido */}
        <div className="rarus-table-container">
          <table className="rarus-table">
            <thead>
              <tr>
                <th>Nº OS</th>
                <th>Cliente / Titular</th>
                <th>Tipo de Serviço</th>
                <th>Equipamentos Vinculados</th>
                <th>Técnico Responsável</th>
                <th>Data Abertura</th>
                <th>Previsão Entrega</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDENS_SERVICO.map((os) => {
                const isSelected = selectedRowId === os.id;
                return (
                  <tr
                    key={os.id}
                    className={isSelected ? 'rarus-row-selected' : ''}
                    onClick={() => handleRowClick(os.id)}
                    title={isSelected ? 'Clique novamente para abrir esta OS' : 'Clique para selecionar'}
                  >
                    <td>
                      <strong style={{ color: 'var(--color-primary-500)', fontFamily: 'monospace' }}>
                        #{os.numero}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-text-main)' }}>{os.clienteNome}</strong>
                    </td>
                    <td style={{ fontSize: '12px' }}>{os.tipo}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '11.5px',
                          background: 'var(--color-primary-100)',
                          color: 'var(--color-primary-500)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        {os.equipamentos.length} aparelho(s)
                      </span>
                    </td>
                    <td>{os.tecnicoNome}</td>
                    <td>{os.dataAbertura}</td>
                    <td>{os.dataPrevisao}</td>
                    <td>
                      <strong>R$ {os.valorTotalGeral.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          os.status === 'Equipamento Pronto' || os.status === 'Faturada' || os.status === 'Encerrada'
                            ? 'ativo'
                            : os.status === 'Aguardando Peças' || os.status === 'Sem Conserto'
                            ? 'inativo'
                            : 'pendente'
                        }`}
                      >
                        <span className="rarus-status-dot" />
                        {os.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '11.5px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openTab({
                            id: 'tab-ordens-servico',
                            title: 'Ordens de Serviço',
                            iconName: 'ClipboardList',
                            moduleKey: 'ordens-servico',
                            params: { osIdSelecionada: os.id },
                          });
                        }}
                        type="button"
                      >
                        Abrir OS
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
