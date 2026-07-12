'use client';

import { useApplicationStore } from '@/lib/stores/applicationStore';
import { useTranslations } from 'next-intl';

export default function FilterBanner() {
  const { showFollowUpOnly, resetFollowUpFilter } = useApplicationStore();
  const t = useTranslations('dashboard.filter');

  if (!showFollowUpOnly) return null;

  return (
    <div className="px-6 py-2 flex items-center gap-2 border-b border-border bg-background">
      <div className="w-2 h-2 rounded-full bg-destructive" />
      <span className="text-sm text-muted-foreground">{t('followUpActive')}</span>
      <button
        onClick={resetFollowUpFilter}
        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors ml-1"
      >
        {t('reset')}
      </button>
    </div>
  );
}
