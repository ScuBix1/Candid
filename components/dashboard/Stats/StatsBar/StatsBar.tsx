'use client';

import { useTranslations } from 'next-intl';
import StatCard from '../StatCard/StatCard';

export default function StatsBar() {
  const t = useTranslations('dashboard.stats');

  return (
    <div className="border-b border-border bg-background px-6 py-4 flex gap-8">
      <StatCard label={t('applications')} value={0} />
      <StatCard label={t('responseRate')} value="0%" />
      <StatCard label={t('interviews')} value={0} />
      <StatCard label={t('toFollowUp')} value={0} highlight />
    </div>
  );
}
