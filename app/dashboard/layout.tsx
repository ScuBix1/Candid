import Header from '@/components/dashboard/Header/Header';
import { ReactNode } from 'react';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
