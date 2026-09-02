import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Relatórios Metrológicos & Operacionais - RSYSTEM',
  description: 'Geração analítica de relatórios de vencimento, calibrações emitidas e SLA de ordens de serviço.',
};

export default function RelatoriosPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
