'use client';

import React, { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
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
import { TransferenciasView } from '@/modules/transferencias/TransferenciasView';
import { SwaggerView } from '@/modules/swagger/SwaggerView';

const MODULE_TO_ROUTE: Record<ModuleKey, string> = {
  dashboard: '/',
  clientes: '/clientes',
  'ordens-servico': '/ordens-servico',
  equipamentos: '/equipamentos',
  calibracoes: '/calibracoes',
  padroes: '/padroes',
  estoque: '/estoque',
  'pecas-servicos': '/estoque',
  transferencias: '/transferencias',
  relatorios: '/relatorios',
  consultas: '/consultas',
  usuarios: '/usuarios',
  'templates-relato': '/templates-relato',
  swagger: '/api-docs',
};

const ROUTE_TO_MODULE: Record<string, ModuleKey> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/clientes': 'clientes',
  '/ordens-servico': 'ordens-servico',
  '/equipamentos': 'equipamentos',
  '/calibracoes': 'calibracoes',
  '/padroes': 'padroes',
  '/estoque': 'estoque',
  '/transferencias': 'transferencias',
  '/relatorios': 'relatorios',
  '/consultas': 'consultas',
  '/usuarios': 'usuarios',
  '/templates-relato': 'templates-relato',
  '/api-docs': 'swagger',
};

const TITLES_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  clientes: 'Clientes',
  'ordens-servico': 'Ordens de Serviço',
  equipamentos: 'Equipamentos',
  calibracoes: 'Calibrações & Relatos',
  padroes: 'Padrões Basais',
  estoque: 'Estoque Multi-Local',
  transferencias: 'Transferências',
  relatorios: 'Central de Relatórios',
  consultas: 'Consultas Globais',
  usuarios: 'Funcionários & RH',
  'templates-relato': 'Templates de Certificado',
  swagger: 'Swagger API Explorer',
};

export const DesktopWorkstation: React.FC = () => {
  const pathname = usePathname();
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    setActiveTab,
    openCommandPalette,
  } = useTabs();

  const currentTab: DesktopTab | undefined = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleSelectModule = useCallback(
    (moduleId: string, updateUrl = true) => {
      const targetModule = moduleId as ModuleKey;

      openTab({
        id: `tab-${targetModule}`,
        title: TITLES_MAP[targetModule] || targetModule,
        iconName: 'Layers',
        moduleKey: targetModule,
        closable: targetModule !== 'dashboard',
      });

      if (updateUrl && typeof window !== 'undefined') {
        const route = MODULE_TO_ROUTE[targetModule] || '/';
        const targetUrl = route + window.location.search;
        if (window.location.pathname !== route) {
          window.history.pushState({ moduleKey: targetModule }, '', targetUrl);
        }
      }
    },
    [openTab]
  );

  // Sincronização inicial com base no path ou query params da URL carregada
  useEffect(() => {
    const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
    let matchedModule = ROUTE_TO_MODULE[currentPath];

    if ((!matchedModule || matchedModule === 'dashboard') && typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab') as ModuleKey;
      if (tabParam && MODULE_TO_ROUTE[tabParam]) {
        matchedModule = tabParam;
      } else if (searchParams.has('os') || searchParams.has('osId') || searchParams.has('novaOS')) {
        matchedModule = 'ordens-servico';
      } else if (searchParams.has('cliente') || searchParams.has('clienteId') || searchParams.has('novoCliente')) {
        matchedModule = 'clientes';
      } else if (searchParams.has('eqId') || searchParams.has('serie')) {
        matchedModule = 'equipamentos';
      } else if (searchParams.has('local')) {
        matchedModule = 'estoque';
      }
    }

    if (matchedModule && matchedModule !== 'dashboard') {
      handleSelectModule(matchedModule, false);
    }
  }, [pathname, handleSelectModule]);

  // Sincronizar URL quando a aba ativa mudar pelo clique nas abas (preservando search params)
  useEffect(() => {
    if (currentTab && typeof window !== 'undefined') {
      const expectedRoute = MODULE_TO_ROUTE[currentTab.moduleKey] || '/';
      if (window.location.pathname !== expectedRoute) {
        const targetUrl = expectedRoute + window.location.search;
        window.history.replaceState({ moduleKey: currentTab.moduleKey }, '', targetUrl);
      }
    }
  }, [currentTab]);

  // Suporte a Voltar e Avançar do navegador (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const matchedModule = ROUTE_TO_MODULE[currentPath] || 'dashboard';
      handleSelectModule(matchedModule, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleSelectModule]);

  const handleNovaOS = () => {
    openTab({
      id: 'tab-ordens-servico',
      title: 'Ordens de Serviço',
      iconName: 'ClipboardList',
      moduleKey: 'ordens-servico',
      params: { abrirNovaOS: true },
      closable: true,
    });
    if (typeof window !== 'undefined' && window.location.pathname !== '/ordens-servico') {
      window.history.pushState(null, '', '/ordens-servico');
    }
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
    if (typeof window !== 'undefined' && window.location.pathname !== '/clientes') {
      window.history.pushState(null, '', '/clientes');
    }
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
        return <EstoqueView />;
      case 'transferencias':
        return <TransferenciasView />;
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
        onSelectModule={(mod) => handleSelectModule(mod, true)}
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
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            const target = tabs.find((t) => t.id === tabId);
            if (target && typeof window !== 'undefined') {
              const route = MODULE_TO_ROUTE[target.moduleKey] || '/';
              window.history.pushState(null, '', route);
            }
          }}
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
