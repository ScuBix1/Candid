import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Hero() {
  const t = await getTranslations('landing.hero');

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6 w-full bg-muted/40 border-b border-border">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t('description')}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/signup">
          <Button size="lg">{t('cta')}</Button>
        </Link>
        <Link href="/signin">
          <Button variant="outline" size="lg">
            {t('signin')}
          </Button>
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">{t('subtext')}</p>
    </section>
  );
}
