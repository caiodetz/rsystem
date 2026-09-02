'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface TabItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  closable?: boolean;
}

interface DesktopTabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

export function DesktopTabs({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
}: DesktopTabsProps) {
  return (
    <div className="rarus-tabs-container">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            className={`rarus-tab-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>}
            <span>{tab.title}</span>
            {tab.closable && (
              <button
                className="rarus-tab-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                title="Fechar aba"
              >
                <X size={13} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
