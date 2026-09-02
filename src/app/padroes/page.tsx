import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Padrões de Referência RBC - RSYSTEM',
  description: 'Controle de padrões metrológicos de referência e certificados de calibração RBC.',
};

export default function PadroesPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
