import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Footer() {
  const t = await getTranslations('landing.footer');

  return (
    <footer className="border-t border-border px-6 py-8 w-full">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-semibold text-foreground">Candid</span>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/signin" className="hover:text-foreground transition-colors">
            {t('signin')}
          </Link>
          <Link href="/signup" className="hover:text-foreground transition-colors">
            {t('signup')}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
