'use client';

import { ApplicationCard } from '@/types/application';
import { useTranslations } from 'next-intl';

type KanbanCardProps = {
  application: ApplicationCard;
};

export default function KanbanCard({ application }: KanbanCardProps) {
  const t = useTranslations('dashboard.kanban');

  const daysAgo = Math.max(
    0,
    Math.floor(
      (new Date().getTime() - new Date(application.applied_at).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const needsFollowUp = daysAgo > 7 && application.status === 'sent';

  return (
    <div
      className={`bg-background border rounded-lg p-3 flex flex-col gap-2 cursor-pointer hover:border-ring transition-colors ${needsFollowUp ? 'border-l-2 border-l-destructive' : ''}`}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{application.company}</span>
        <span className="text-xs text-muted-foreground">{application.role}</span>
      </div>

      <div className="flex items-center justify-between">
        {application.location && (
          <span className="text-xs text-muted-foreground">{application.location}</span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          {needsFollowUp && (
            <span className="text-xs font-medium text-destructive">{t('followUp')}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {daysAgo === 0 ? t('today') : `${daysAgo}j`}
          </span>
        </div>
      </div>
    </div>
  );
}
