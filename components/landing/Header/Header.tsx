import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Header() {
  const t = await getTranslations('landing.header');

  return (
    <header className="border-b border-border bg-background px-6 py-3 flex items-center justify-between">
      <span className="font-semibold text-lg">Candid</span>
      <div className="flex items-center gap-3">
        <Link href="/signin">
          <Button variant="ghost" size="sm">
            {t('signin')}
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">{t('signup')}</Button>
        </Link>
      </div>
    </header>
  );
}
