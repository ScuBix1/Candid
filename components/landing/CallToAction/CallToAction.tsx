import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function CallToAction() {
  const t = await getTranslations('landing.cta');

  return (
    <section className="px-6 py-24 w-full bg-muted/40 border-t border-border">
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-foreground">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
        <div className="flex justify-center">
          <Link href="/signup">
            <Button size="lg">{t('cta')}</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">{t('subtext')}</p>
      </div>
    </section>
  );
}
