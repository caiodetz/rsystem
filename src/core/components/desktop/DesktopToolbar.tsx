'use client';

import React from 'react';
import { useTabs } from '@/core/context/TabContext';
import {
  Wrench,
  Activity,
  Layers,
  FileText,
  Bookmark,
  Search,
  BookOpen,
  Users,
} from 'lucide-react';

export const DesktopToolbar: React.FC = () => {
  const { openTab, openCommandPalette } = useTabs();

  return (
    <div className="desktop-toolbar">
      <div className="desktop-toolbar-actions">
        {/* Nova Ordem de Serviço */}
        <button
          className="toolbar-btn primary"
          title="Abrir formulário de nova Ordem de Serviço (Ctrl+N)"
          onClick={() =>
            openTab({
              id: 'tab-ordens-servico',
              title: 'Ordens de Serviço',
              iconName: 'Wrench',
              moduleKey: 'ordens-servico',
              params: { abrirModalNovo: true },
            })
          }
        >
          <Wrench size={14} />
          <span>Nova OS</span>
        </button>

        {/* Nova Calibração */}
        <button
          className="toolbar-btn"
          title="Registrar ensaios e emitir certificado de calibração"
          onClick={() =>
            openTab({
              id: 'tab-calibracoes',
              title: 'Calibrações & Certificados',
              iconName: 'Activity',
              moduleKey: 'calibracoes',
              params: { abrirModalNovo: true },
            })
          }
        >
          <Activity size={14} color="#0284c7" />
          <span>Nova Calibração</span>
        </button>

        <div className="toolbar-divider" />

        {/* Equipamentos */}
        <button
          className="toolbar-btn"
          title="Visualizar parque de instrumentos e equipamentos"
          onClick={() =>
            openTab({
              id: 'tab-equipamentos',
              title: 'Equipamentos & Instrumentos',
              iconName: 'Layers',
              moduleKey: 'equipamentos',
            })
          }
        >
          <Layers size={14} />
          <span>Equipamentos</span>
        </button>

        {/* Clientes */}
        <button
          className="toolbar-btn"
          title="Cadastro de indústrias e clientes atendidos"
          onClick={() =>
            openTab({
              id: 'tab-clientes',
              title: 'Cadastro de Clientes',
              iconName: 'Users',
              moduleKey: 'clientes',
            })
          }
        >
          <Users size={14} />
          <span>Clientes</span>
        </button>

        {/* Padrões RBC */}
        <button
          className="toolbar-btn"
          title="Padrões de referência rastreados RBC/Inmetro"
          onClick={() =>
            openTab({
              id: 'tab-padroes',
              title: 'Padrões de Referência RBC',
              iconName: 'Bookmark',
              moduleKey: 'padroes',
            })
          }
        >
          <Bookmark size={14} />
          <span>Padrões RBC</span>
        </button>

        <div className="toolbar-divider" />

        {/* Relatórios */}
        <button
          className="toolbar-btn"
          title="Painel de relatórios analíticos de vencimento e desempenho"
          onClick={() =>
            openTab({
              id: 'tab-relatorios',
              title: 'Gerador de Relatórios',
              iconName: 'FileText',
              moduleKey: 'relatorios',
            })
          }
        >
          <FileText size={14} />
          <span>Relatórios</span>
        </button>

        {/* Swagger API */}
        <button
          className="toolbar-btn"
          title="Documentação interativa OpenAPI / Swagger dos endpoints"
          onClick={() =>
            openTab({
              id: 'tab-swagger',
              title: 'Swagger API Explorer',
              iconName: 'BookOpen',
              moduleKey: 'swagger',
            })
          }
        >
          <BookOpen size={14} color="#059669" />
          <span>Swagger API</span>
        </button>
      </div>

      {/* Caixa de Busca Universal Rápida na Toolbar */}
      <div
        className="desktop-quick-search"
        onClick={openCommandPalette}
        title="Busca instantânea universal (Ctrl+K / F3)"
      >
        <Search size={14} color="#64748b" />
        <input
          type="text"
          placeholder="Busca rápida (Tag, Serial, OS, Cliente)..."
          readOnly
        />
        <span className="search-badge">Ctrl+K</span>
      </div>
    </div>
  );
};
