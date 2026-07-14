'use client';

import { useApplicationStore } from '@/lib/stores/applicationStore';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';
import { useEffect } from 'react';
import StatCard from '../StatCard/StatCard';

export default function StatsBar() {
  const t = useTranslations('dashboard.stats');
  const { applications, showFollowUpOnly, toggleFollowUpFilter } = useApplicationStore();

  const totalApplications = applications.length;

  const responseRate =
    totalApplications === 0
      ? '0%'
      : `${Math.round(
          (applications.filter(
            (application) =>
              application.status === 'in_progress' ||
              application.status === 'interview' ||
              application.status === 'offer'
          ).length /
            totalApplications) *
            100
        )}%`;

  const interviews = applications.filter(
    (application) => application.status === 'interview'
  ).length;

  const toFollowUp = applications.filter((application) => {
    const daysAgo = Math.floor(
      (new Date().getTime() - new Date(application.applied_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysAgo > 7 && application.status === 'sent';
  }).length;

  useEffect(() => {
    if (toFollowUp > 0) {
      posthog.capture('reminder_triggered', { count: toFollowUp });
    }
  }, [toFollowUp]);

  return (
    <div className="border-b border-border bg-background px-6 py-4 flex items-center gap-8">
      <StatCard label={t('applications')} value={totalApplications} />
      <StatCard label={t('responseRate')} value={responseRate} />
      <StatCard label={t('interviews')} value={interviews} />
      <StatCard
        label={t('toFollowUp')}
        value={toFollowUp}
        highlight={toFollowUp > 0}
        active={showFollowUpOnly}
        onClick={toFollowUp > 0 ? toggleFollowUpFilter : undefined}
      />
    </div>
  );
}
