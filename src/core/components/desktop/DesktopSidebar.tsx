'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Wrench,
  Award,
  ShieldCheck,
  Boxes,
  Layers,
  ArrowLeftRight,
  FileBarChart,
  Search,
  UserCheck,
  Code2,
  FileCode2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DesktopSidebarProps {
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  unidadeAtual?: string;
}

export function DesktopSidebar({
  activeModule,
  onSelectModule,
  unidadeAtual = 'Laboratório Matriz - SP',
}: DesktopSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      group: 'VISÃO GERAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'METROLOGIA & OPERAÇÃO',
      items: [
        { id: 'clientes', label: 'Clientes', icon: Users, badge: '3' },
        { id: 'ordens-servico', label: 'Ordens de Serviço', icon: ClipboardList, badge: '1045' },
        { id: 'equipamentos', label: 'Equipamentos (GEHAKA)', icon: Wrench, badge: '5' },
        { id: 'calibracoes', label: 'Calibrações & Relatos', icon: Award },
        { id: 'padroes', label: 'Padrões Basais (RBC)', icon: ShieldCheck, badge: 'Atenção' },
      ],
    },
    {
      group: 'ESTOQUE & SUPRIMENTOS',
      items: [
        { id: 'estoque', label: 'Estoque Multi-Local', icon: Boxes },
        { id: 'pecas-servicos', label: 'Peças & Serviços', icon: Layers },
        { id: 'transferencias', label: 'Transferências / Req.', icon: ArrowLeftRight, badge: '1 pend.' },
      ],
    },
    {
      group: 'RELATÓRIOS & GESTÃO',
      items: [
        { id: 'relatorios', label: 'Central de Relatórios', icon: FileBarChart },
        { id: 'consultas', label: 'Consultas Globais', icon: Search },
      ],
    },
    {
      group: 'SISTEMA & RH',
      items: [
        { id: 'usuarios', label: 'Funcionários & RH', icon: UserCheck },
        { id: 'templates-relato', label: 'Templates de Certificado', icon: FileCode2 },
        { id: 'swagger', label: 'Swagger API Explorer', icon: Code2 },
      ],
    },
  ];

  return (
    <aside className={`rarus-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header com Logotipo Oficial RARUS */}
      <div className="rarus-sidebar-header">
        <Image
          src="/logo-rarus.png"
          alt="RARUS Tecnologia & Serviços"
          width={40}
          height={40}
          className="rarus-logo-img"
          priority
        />
        {!collapsed && (
          <div className="rarus-sidebar-brand-text">
            <span className="rarus-brand-name">RARUS</span>
            <span className="rarus-brand-tagline">Tecnologia & Serviços</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
          }}
          title={collapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Seletor de Unidade */}
      {!collapsed && (
        <div className="rarus-unidade-selector">
          <span>{unidadeAtual}</span>
          <ChevronDown size={14} />
        </div>
      )}

      {/* Navegação Agrupada */}
      <nav className="rarus-sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.group} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!collapsed && <div className="rarus-nav-group-title">{group.group}</div>}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  className={`rarus-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectModule(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <>
                      <span>{item.label}</span>
                      {item.badge && <span className="badge">{item.badge}</span>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Rodapé da Sidebar (Metas & SLA) */}
      {!collapsed && (
        <div className="rarus-sidebar-footer">
          <div className="rarus-sla-card">
            <div className="rarus-sla-header">
              <span>SLA Safra de Grãos</span>
              <span style={{ color: 'var(--rarus-cyan)' }}>84%</span>
            </div>
            <div className="rarus-progress-bar">
              <div className="rarus-progress-fill" style={{ width: '84%' }} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
