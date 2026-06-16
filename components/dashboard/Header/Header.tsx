'use client';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth/signout/signout';
import { useTranslations } from 'next-intl';
import ApplicationModal from '../Application/ApplicationModal/ApplicationModal';

export default function Header() {
  const t = useTranslations();

  return (
    <header className="border-b border-border bg-background px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg text-primary">{t('appName')}</span>
      </div>
      <ApplicationModal />
      <form action={signOut}>
        <Button variant="outline" size="sm" type="submit">
          {t('header.signout')}
        </Button>
      </form>
    </header>
  );
}
