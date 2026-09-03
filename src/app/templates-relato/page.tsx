import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Templates de Relato Metrológico - RSYSTEM',
  description: 'Editor visual e HTML de certificados RBC e laudos técnicos.',
};

export default function TemplatesRelatoPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
