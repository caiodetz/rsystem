import { Metadata } from 'next';
import { TabProvider } from '@/core/context/TabContext';
import { DesktopWorkstation } from '@/core/components/desktop/DesktopWorkstation';

export const metadata: Metadata = {
  title: 'Funcionários & RH - RSYSTEM',
  description: 'Gestão de usuários, técnicos de laboratório, habilitações metrológicas e permissões.',
};

export default function UsuariosPage() {
  return (
    <TabProvider>
      <DesktopWorkstation />
    </TabProvider>
  );
}
