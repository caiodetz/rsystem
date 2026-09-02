import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Consultas Globais & Rastreabilidade - RSYSTEM',
  description: 'Consulta integrada e rastreabilidade metrológica cruzada de instrumentos, OS e certificados.',
};

export default function ConsultasPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
