'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Download,
  Moon,
  Sun,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';

interface DesktopTopBarProps {
  onOpenSearch: () => void;
  onNovaOS: () => void;
  onNovoCliente: () => void;
  onExportar?: () => void;
}

export function DesktopTopBar({
  onOpenSearch,
  onNovaOS,
  onNovoCliente,
  onExportar,
}: DesktopTopBarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('rarus-theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('rarus-theme', nextTheme);
  };

  return (
    <header className="rarus-topbar">
      {/* Campo de Busca Global ⌘K */}
      <button className="rarus-search-trigger" onClick={onOpenSearch} type="button">
        <Search size={16} />
        <span>Buscar clientes, OS, instrumentos, relatórios...</span>
        <span className="rarus-search-shortcut">⌘K</span>
      </button>

      {/* Ações Rápidas à Direita */}
      <div className="rarus-topbar-actions">
        {onExportar && (
          <button className="btn-secondary-rarus" onClick={onExportar} type="button">
            <Download size={15} />
            <span>Exportar</span>
          </button>
        )}

        <button className="btn-secondary-rarus" onClick={onNovoCliente} type="button">
          <Plus size={15} />
          <span>Novo Cliente</span>
        </button>

        <button className="btn-primary-rarus" onClick={onNovaOS} type="button">
          <Plus size={15} />
          <span>Nova OS</span>
        </button>

        {/* Alternador de Tema Claro / Escuro */}
        <button
          className="icon-btn-rarus"
          onClick={toggleTheme}
          title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          type="button"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notificações com Dot */}
        <button className="icon-btn-rarus" title="Notificações e Alertas Metrológicos" type="button">
          <Bell size={17} />
          <span className="rarus-badge-dot" />
        </button>

        {/* Perfil do Técnico Operador */}
        <div className="rarus-user-profile-badge">
          <div className="rarus-avatar-circle">IS</div>
          <div className="rarus-user-info-text">
            <span className="rarus-user-name">Itamar Soares</span>
            <span className="rarus-user-role">Metrologista GEHAKA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
