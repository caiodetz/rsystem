'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { openapiSpec } from '@/core/swagger/openapiSpec';

// Carrega SwaggerUI dinamicamente para evitar conflitos de SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
      Carregando especificações interativas da API (Swagger UI)...
    </div>
  ),
});

export default function SwaggerDocs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="swagger-container" style={{ background: '#ffffff', borderRadius: '8px', padding: '16px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ color: '#0f172a' }}>RSYSTEM OpenAPI 3.0 Live Documentation</strong>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Endpoints RESTful modulares para metrologia e manutenção industrial.
          </p>
        </div>
        <a
          href="/api/v1/openapi"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            background: '#0284c7',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          JSON Schema Raw ↗
        </a>
      </div>
      <SwaggerUI spec={openapiSpec} />
    </div>
  );
}
