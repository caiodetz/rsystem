'use client';

import React from 'react';
import SwaggerDocs from '@/core/components/SwaggerDocs';
import { ExternalLink, FileCode } from 'lucide-react';

export const SwaggerView: React.FC = () => {
  return (
    <div className="rarus-content-scroll">
      {/* Header Padronizado RARUS */}
      <div className="rarus-page-header">
        <div className="rarus-page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1>Swagger API Explorer</h1>
            <span
              style={{
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-600)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              OAS 3.0
            </span>
          </div>
          <p>
            Documentação interativa OpenAPI 3.0 dos endpoints RESTful de Metrologia e Manutenção Industrial.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a
            href="/api/v1/openapi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <FileCode size={14} />
            <span>JSON Schema Raw</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Container Integrado no Design System com Largura Total */}
      <div
        className="rarus-datagrid-container"
        style={{
          padding: '20px',
          backgroundColor: '#FFFFFF',
          minHeight: '75vh',
        }}
      >
        <SwaggerDocs showHeader={false} />
      </div>
    </div>
  );
};
