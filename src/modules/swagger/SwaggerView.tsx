'use client';

import React from 'react';
import SwaggerDocs from '@/core/components/SwaggerDocs';

export const SwaggerView: React.FC = () => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <SwaggerDocs />
    </div>
  );
};
