'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ModuleKey =
  | 'dashboard'
  | 'equipamentos'
  | 'calibracoes'
  | 'ordens-servico'
  | 'padroes'
  | 'clientes'
  | 'estoque'
  | 'pecas-servicos'
  | 'transferencias'
  | 'relatorios'
  | 'consultas'
  | 'usuarios'
  | 'templates-relato'
  | 'swagger';

export interface DesktopTab {
  id: string;
  title: string;
  iconName: string;
  moduleKey: ModuleKey;
  params?: Record<string, unknown>;
  closable?: boolean;
}

interface TabContextType {
  tabs: DesktopTab[];
  activeTabId: string;
  openTab: (tab: Omit<DesktopTab, 'closable'> & { closable?: boolean }) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (id: string) => void;
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

const DEFAULT_TABS: DesktopTab[] = [
  {
    id: 'tab-dashboard',
    title: 'Visão Geral (Dashboard)',
    iconName: 'LayoutDashboard',
    moduleKey: 'dashboard',
    closable: false,
  },
];

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<DesktopTab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('tab-dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const openTab = useCallback(
    (newTab: Omit<DesktopTab, 'closable'> & { closable?: boolean }) => {
      setTabs((prevTabs) => {
        const existingIndex = prevTabs.findIndex((t) => t.id === newTab.id);
        if (existingIndex !== -1) {
          // Já existe, atualiza parâmetros se houver
          const updated = [...prevTabs];
          updated[existingIndex] = {
            ...updated[existingIndex],
            params: newTab.params || updated[existingIndex].params,
          };
          return updated;
        }
        return [
          ...prevTabs,
          {
            ...newTab,
            closable: newTab.closable !== false,
          },
        ];
      });
      setActiveTabId(newTab.id);
    },
    []
  );

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prevTabs) => {
        const target = prevTabs.find((t) => t.id === id);
        if (target && target.closable === false) return prevTabs;

        const filtered = prevTabs.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const nextActive = filtered[filtered.length - 1];
          if (nextActive) {
            setActiveTabId(nextActive.id);
          }
        }
        return filtered;
      });
    },
    [activeTabId]
  );

  const closeAllTabs = useCallback(() => {
    setTabs((prev) => {
      const nonClosable = prev.filter((t) => t.closable === false);
      if (nonClosable.length > 0) {
        setActiveTabId(nonClosable[0].id);
        return nonClosable;
      }
      return prev;
    });
  }, []);

  const closeOtherTabs = useCallback(
    (keepId: string) => {
      setTabs((prev) => {
        const filtered = prev.filter((t) => t.id === keepId || t.closable === false);
        setActiveTabId(keepId);
        return filtered;
      });
    },
    []
  );

  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const toggleCommandPalette = useCallback(() => setIsCommandPaletteOpen((v) => !v), []);

  // Atalhos globais de teclado (Ctrl+K, F3, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      } else if (e.key === 'F3') {
        e.preventDefault();
        openCommandPalette();
      } else if (e.key === 'Escape') {
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette, openCommandPalette, closeCommandPalette]);

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        openTab,
        closeTab,
        setActiveTab: setActiveTabId,
        closeAllTabs,
        closeOtherTabs,
        isCommandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        toggleCommandPalette,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs deve ser utilizado dentro de um TabProvider');
  }
  return context;
};
