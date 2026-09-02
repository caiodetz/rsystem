'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Download,
  Moon,
  Sun,
  Bell,
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
        <Search size={15} />
        <span>Buscar clientes, OS, instrumentos, relatórios...</span>
        <span className="rarus-search-shortcut">⌘K</span>
      </button>

      {/* Ações Rápidas à Direita */}
      <div className="rarus-topbar-actions">
        {onExportar && (
          <button className="btn btn-secondary" onClick={onExportar} type="button">
            <Download size={14} />
            <span>Exportar</span>
          </button>
        )}

        <button className="btn btn-secondary" onClick={onNovoCliente} type="button">
          <Plus size={14} />
          <span>Novo Cliente</span>
        </button>

        <button className="btn btn-primary" onClick={onNovaOS} type="button">
          <Plus size={14} />
          <span>Nova OS</span>
        </button>

        {/* Alternador de Tema Claro / Escuro */}
        <button
          className="btn btn-secondary"
          style={{ padding: '7px 10px' }}
          onClick={toggleTheme}
          title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          type="button"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notificações com Dot */}
        <button
          className="btn btn-secondary"
          style={{ padding: '7px 10px', position: 'relative' }}
          title="Notificações e Alertas Metrológicos"
          type="button"
        >
          <Bell size={15} />
          <span className="rarus-badge-dot" />
        </button>

        {/* Perfil do Usuário */}
        <div className="rarus-user-profile-badge">
          <div className="rarus-avatar-circle">CD</div>
          <div className="rarus-user-info-text">
            <span className="rarus-user-name">Caio Detz</span>
            <span className="rarus-user-role">Auxiliar Técnico / Metrologia</span>
          </div>
        </div>
      </div>
    </header>
  );
}
