import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Transferências de Estoque - RSYSTEM',
  description: 'Movimentos de transferência física e fiscal entre filiais, almoxarifado e veículos de técnicos.',
};

export default function TransferenciasPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
