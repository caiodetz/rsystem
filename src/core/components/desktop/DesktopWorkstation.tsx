'use client';

import React from 'react';
import { useTabs, DesktopTab, ModuleKey } from '@/core/context/TabContext';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopTopBar } from './DesktopTopBar';
import { DesktopTabs } from './DesktopTabs';
import { CommandPalette } from './CommandPalette';

import { DashboardView } from '@/modules/dashboard/DashboardView';
import { EquipamentosView } from '@/modules/equipamentos/EquipamentosView';
import { CalibracoesView } from '@/modules/calibracoes/CalibracoesView';
import { OrdensServicoView } from '@/modules/ordens-servico/OrdensServicoView';
import { PadroesView } from '@/modules/padroes/PadroesView';
import { ClientesView } from '@/modules/clientes/ClientesView';
import { EstoqueView } from '@/modules/estoque/EstoqueView';
import { RelatoriosView } from '@/modules/relatorios/RelatoriosView';
import { ConsultasView } from '@/modules/consultas/ConsultasView';
import { UsuariosView } from '@/modules/usuarios/UsuariosView';
import { TemplatesRelatoView } from '@/modules/templates-relato/TemplatesRelatoView';
import { SwaggerView } from '@/modules/swagger/SwaggerView';

export const DesktopWorkstation: React.FC = () => {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    openCommandPalette,
  } = useTabs();

  const currentTab: DesktopTab | undefined = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleSelectModule = (moduleId: string) => {
    const titlesMap: Record<string, string> = {
      dashboard: 'Dashboard',
      clientes: 'Clientes',
      'ordens-servico': 'Ordens de Serviço',
      equipamentos: 'Equipamentos (GEHAKA)',
      calibracoes: 'Calibrações & Relatos',
      padroes: 'Padrões Basais (RBC)',
      estoque: 'Estoque Multi-Local',
      'pecas-servicos': 'Peças & Serviços',
      transferencias: 'Transferências / Req.',
      relatorios: 'Central de Relatórios',
      consultas: 'Consultas Globais',
      usuarios: 'Funcionários & RH',
      'templates-relato': 'Templates de Certificado',
      swagger: 'Swagger API Explorer',
    };

    openTab({
      id: `tab-${moduleId}`,
      title: titlesMap[moduleId] || moduleId,
      iconName: 'Layers',
      moduleKey: moduleId as ModuleKey,
      closable: moduleId !== 'dashboard',
    });
  };

  const handleNovaOS = () => {
    openTab({
      id: 'tab-ordens-servico',
      title: 'Ordens de Serviço',
      iconName: 'ClipboardList',
      moduleKey: 'ordens-servico',
      params: { abrirNovaOS: true },
      closable: true,
    });
  };

  const handleNovoCliente = () => {
    openTab({
      id: 'tab-clientes',
      title: 'Clientes',
      iconName: 'Users',
      moduleKey: 'clientes',
      params: { abrirNovoCliente: true },
      closable: true,
    });
  };

  const renderActiveModule = () => {
    if (!currentTab) return null;

    switch (currentTab.moduleKey) {
      case 'dashboard':
        return <DashboardView />;
      case 'equipamentos':
        return <EquipamentosView />;
      case 'calibracoes':
        return <CalibracoesView />;
      case 'ordens-servico':
        return <OrdensServicoView />;
      case 'padroes':
        return <PadroesView />;
      case 'clientes':
        return <ClientesView />;
      case 'estoque':
      case 'pecas-servicos':
      case 'transferencias':
        return <EstoqueView />;
      case 'relatorios':
        return <RelatoriosView />;
      case 'consultas':
        return <ConsultasView />;
      case 'usuarios':
        return <UsuariosView />;
      case 'templates-relato':
        return <TemplatesRelatoView />;
      case 'swagger':
        return <SwaggerView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="rarus-workstation-root">
      {/* 1. Sidebar Retrátil Lateral */}
      <DesktopSidebar
        activeModule={currentTab?.moduleKey || 'dashboard'}
        onSelectModule={handleSelectModule}
      />

      {/* 2. Área Principal com Topbar, Abas e Viewport */}
      <div className="rarus-main-viewport">
        {/* Topbar com busca ⌘K, ações rápidas, tema Claro/Escuro */}
        <DesktopTopBar
          onOpenSearch={openCommandPalette}
          onNovaOS={handleNovaOS}
          onNovoCliente={handleNovoCliente}
        />

        {/* Faixa de Abas MDI de Trabalho (Modelo Híbrido) */}
        <DesktopTabs
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTab}
          onCloseTab={closeTab}
        />

        {/* Viewport do Módulo Ativo */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderActiveModule()}
        </main>
      </div>

      {/* Modal Universal Command Palette (⌘K) */}
      <CommandPalette />
    </div>
  );
};
