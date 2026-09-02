import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Clientes Industriais - RSYSTEM',
  description: 'Cadastro e gestão de indústrias e clientes atendidos pela metrologia.',
};

export default function ClientesPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
