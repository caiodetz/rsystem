import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Equipamentos & Instrumentos - RSYSTEM',
  description: 'Gestão e rastreabilidade metrológica do parque de instrumentos industriais.',
};

export default function EquipamentosPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
