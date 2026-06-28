'use client';

import { ApplicationCard } from '@/types/application';
import { useTranslations } from 'next-intl';
import DeleteApplicationButton from '../../Application/DeleteApplicationButton/DeleteApplicationButton';
import EditApplicationModal from '../../Application/EditApplicationModal/EditApplicationModal';

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
      data-slot="kanban-card"
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
      <div className="flex items-center gap-1 border-t pt-2 mt-1">
        <EditApplicationModal application={application} />
        <DeleteApplicationButton id={application.id} />
      </div>
    </div>
  );
}
