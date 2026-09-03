import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Estoque Multi-Local - RSYSTEM',
  description: 'Controle de peças, saldo físico/fiscal e transferências entre almoxarifado central e técnicos.',
};

export default function EstoquePage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
