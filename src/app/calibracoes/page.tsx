import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Calibrações & Certificados RBC - RSYSTEM',
  description: 'Histórico de ensaios metrológicos e emissão de certificados oficiais RBC.',
};

export default function CalibracoesPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
