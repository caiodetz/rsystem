import SwaggerDocs from '@/core/components/SwaggerDocs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swagger API Documentation - RSYSTEM Metrologia',
  description: 'Documentação interativa OpenAPI 3.0 dos endpoints do RSYSTEM',
};

export default function ApiDocsPage() {
  return (
    <main style={{ padding: '24px', background: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <SwaggerDocs />
      </div>
    </main>
  );
}
