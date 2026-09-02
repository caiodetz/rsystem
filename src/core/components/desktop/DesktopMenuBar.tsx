'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTabs } from '@/core/context/TabContext';
import {
  Activity,
  Layers,
  Wrench,
  FileText,
  Search,
  BookOpen,
  HelpCircle,
  FolderOpen,
} from 'lucide-react';

export const DesktopMenuBar: React.FC = () => {
  const {
    openTab,
    closeTab,
    closeAllTabs,
    closeOtherTabs,
    activeTabId,
    openCommandPalette,
  } = useTabs();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleAction = (callback: () => void) => {
    callback();
    setActiveMenu(null);
  };

  return (
    <header className="desktop-menu-bar" ref={barRef}>
      <div className="desktop-app-brand">
        <Activity size={16} strokeWidth={2.5} />
        <span>RSYSTEM</span>
      </div>

      <nav className="desktop-menu-items">
        {/* Menu: Arquivo */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'arquivo' ? 'active' : ''}`}
            onClick={() => handleMenuClick('arquivo')}
          >
            Arquivo
          </button>
          {activeMenu === 'arquivo' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-nova-os',
                      title: 'Nova Ordem de Serviço',
                      iconName: 'Wrench',
                      moduleKey: 'ordens-servico',
                      params: { abrirModalNovo: true },
                    })
                  )
                }
              >
                <span>Nova Ordem de Serviço...</span>
                <span className="hotkey">Ctrl+N</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-nova-cal',
                      title: 'Nova Calibração',
                      iconName: 'Activity',
                      moduleKey: 'calibracoes',
                      params: { abrirModalNovo: true },
                    })
                  )
                }
              >
                <span>Nova Calibração Metrológica...</span>
                <span className="hotkey">Ctrl+Shift+C</span>
              </div>
              <div className="desktop-dropdown-divider" />
              <div
                className="desktop-dropdown-item"
                onClick={() => handleAction(() => window.print())}
              >
                <span>Imprimir Tela Atual</span>
                <span className="hotkey">Ctrl+P</span>
              </div>
              <div className="desktop-dropdown-divider" />
              <div
                className="desktop-dropdown-item"
                onClick={() => handleAction(() => closeTab(activeTabId))}
              >
                <span>Fechar Aba Atual</span>
                <span className="hotkey">Ctrl+W</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu: Cadastros */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'cadastros' ? 'active' : ''}`}
            onClick={() => handleMenuClick('cadastros')}
          >
            Cadastros
          </button>
          {activeMenu === 'cadastros' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-equipamentos',
                      title: 'Equipamentos & Instrumentos',
                      iconName: 'Layers',
                      moduleKey: 'equipamentos',
                    })
                  )
                }
              >
                <span>Equipamentos e Instrumentos</span>
                <span className="hotkey">F4</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-clientes',
                      title: 'Cadastro de Clientes',
                      iconName: 'FolderOpen',
                      moduleKey: 'clientes',
                    })
                  )
                }
              >
                <span>Clientes e Plantas Industriais</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-padroes',
                      title: 'Padrões de Referência RBC',
                      iconName: 'Bookmark',
                      moduleKey: 'padroes',
                    })
                  )
                }
              >
                <span>Padrões Metrológicos (RBC)</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu: Operações */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'operacoes' ? 'active' : ''}`}
            onClick={() => handleMenuClick('operacoes')}
          >
            Operações
          </button>
          {activeMenu === 'operacoes' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-ordens-servico',
                      title: 'Ordens de Serviço',
                      iconName: 'Wrench',
                      moduleKey: 'ordens-servico',
                    })
                  )
                }
              >
                <span>Gestão de Ordens de Serviço</span>
                <span className="hotkey">F6</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-calibracoes',
                      title: 'Calibrações & Certificados',
                      iconName: 'Activity',
                      moduleKey: 'calibracoes',
                    })
                  )
                }
              >
                <span>Execução de Calibrações</span>
                <span className="hotkey">F7</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu: Consultas */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'consultas' ? 'active' : ''}`}
            onClick={() => handleMenuClick('consultas')}
          >
            Consultas
          </button>
          {activeMenu === 'consultas' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() => handleAction(() => openCommandPalette())}
              >
                <span>Busca Rápida Universal</span>
                <span className="hotkey">Ctrl+K / F3</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-consultas',
                      title: 'Consultas Globais & Rastreabilidade',
                      iconName: 'Search',
                      moduleKey: 'consultas',
                    })
                  )
                }
              >
                <span>Central de Rastreabilidade Metrológica</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu: Relatórios */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'relatorios' ? 'active' : ''}`}
            onClick={() => handleMenuClick('relatorios')}
          >
            Relatórios
          </button>
          {activeMenu === 'relatorios' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-relatorios',
                      title: 'Gerador de Relatórios',
                      iconName: 'FileText',
                      moduleKey: 'relatorios',
                      params: { tipoInicial: 'vencimentos' },
                    })
                  )
                }
              >
                <span>Vencimento de Calibrações</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-relatorios',
                      title: 'Gerador de Relatórios',
                      iconName: 'FileText',
                      moduleKey: 'relatorios',
                      params: { tipoInicial: 'calibracoes' },
                    })
                  )
                }
              >
                <span>Certificados Emitidos no Período</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-relatorios',
                      title: 'Gerador de Relatórios',
                      iconName: 'FileText',
                      moduleKey: 'relatorios',
                      params: { tipoInicial: 'sla-os' },
                    })
                  )
                }
              >
                <span>SLA e Atendimento de OS</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu: Ferramentas */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'ferramentas' ? 'active' : ''}`}
            onClick={() => handleMenuClick('ferramentas')}
          >
            Ferramentas
          </button>
          {activeMenu === 'ferramentas' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() =>
                    openTab({
                      id: 'tab-swagger',
                      title: 'Swagger API Explorer',
                      iconName: 'BookOpen',
                      moduleKey: 'swagger',
                    })
                  )
                }
              >
                <span>Documentação Swagger OpenAPI</span>
                <span className="hotkey">F12</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() => handleAction(() => window.location.reload())}
              >
                <span>Recarregar Sistema</span>
                <span className="hotkey">F5</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu: Janela */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'janela' ? 'active' : ''}`}
            onClick={() => handleMenuClick('janela')}
          >
            Janela
          </button>
          {activeMenu === 'janela' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() => handleAction(() => closeTab(activeTabId))}
              >
                <span>Fechar Aba Ativa</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() => handleAction(() => closeOtherTabs(activeTabId))}
              >
                <span>Fechar Outras Abas</span>
              </div>
              <div
                className="desktop-dropdown-item"
                onClick={() => handleAction(() => closeAllTabs())}
              >
                <span>Fechar Todas as Abas</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu: Ajuda */}
        <div className="desktop-menu-item">
          <button
            className={`desktop-menu-btn ${activeMenu === 'ajuda' ? 'active' : ''}`}
            onClick={() => handleMenuClick('ajuda')}
          >
            Ajuda
          </button>
          {activeMenu === 'ajuda' && (
            <div className="desktop-menu-dropdown">
              <div
                className="desktop-dropdown-item"
                onClick={() =>
                  handleAction(() => {
                    alert(
                      'RSYSTEM v1.0.0 Modular\nSistema de Metrologia e Manutenção Industrial\nConformidade ABNT NBR ISO/IEC 17025\n\nAtalhos:\n• Ctrl+K ou F3: Busca Global\n• F4: Equipamentos\n• F6: Ordens de Serviço\n• F7: Calibrações\n• F12: Documentação Swagger'
                    );
                  })
                }
              >
                <span>Sobre o RSYSTEM...</span>
                <span className="hotkey">F1</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
