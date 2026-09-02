'use client';

import React, { useState, useEffect } from 'react';
import { useTabs } from '@/core/context/TabContext';

export const DesktopStatusBar: React.FC = () => {
  const { tabs, activeTabId } = useTabs();
  const [horario, setHorario] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHorario(now.toLocaleTimeString('pt-BR'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <footer className="desktop-status-bar">
      <div className="status-section">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="status-dot" />
          <strong style={{ color: '#0f172a' }}>Servidor Local Conectado</strong>
        </span>
        <span>|</span>
        <span>Módulo: <strong>{activeTab?.title || 'Principal'}</strong></span>
        <span>|</span>
        <span>Abas Abertas: <strong>{tabs.length}</strong></span>
      </div>

      <div className="status-section">
        <span>Técnico: <strong>Eng. Caio Detz (RBC #0412)</strong></span>
        <span>|</span>
        <span style={{ display: 'inline-flex', gap: 6 }}>
          <span className="status-hotkey-tag">F1</span> Ajuda
          <span className="status-hotkey-tag">Ctrl+K</span> Busca
          <span className="status-hotkey-tag">F5</span> Atualizar
        </span>
        <span>|</span>
        <span>{horario || '--:--:--'}</span>
      </div>
    </footer>
  );
};
