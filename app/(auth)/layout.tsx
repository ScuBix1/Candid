import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;
  const t = await getTranslations('auth.layout');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          ← {t('backHome')}
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">{children}</div>
    </div>
  );
}
