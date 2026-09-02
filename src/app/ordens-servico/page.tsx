import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Ordens de Serviço - RSYSTEM',
  description: 'Gestão de Ordens de Serviço (Preventiva, Corretiva, Calibração).',
};

export default function OrdensServicoPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
