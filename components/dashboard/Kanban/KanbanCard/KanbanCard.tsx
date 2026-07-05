'use client';

import DeleteApplicationButton from '@/components/dashboard/Application/DeleteApplicationButton/DeleteApplicationButton';
import EditApplicationModal from '@/components/dashboard/Application/EditApplicationModal/EditApplicationModal';
import { ApplicationCard } from '@/types/application';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useTranslations } from 'next-intl';

type KanbanCardProps = {
  application: ApplicationCard;
  isDragging?: boolean;
};

export default function KanbanCard({ application, isDragging = false }: KanbanCardProps) {
  const t = useTranslations('dashboard.kanban');

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: application.id,
  });

  const daysAgo = Math.max(
    0,
    Math.floor(
      (new Date().getTime() - new Date(application.applied_at).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const needsFollowUp = daysAgo > 7 && application.status === 'sent';

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="kanban-card"
      className={`bg-background border rounded-lg p-3 flex flex-col gap-2 transition-colors ${
        needsFollowUp ? 'border-l-2 border-l-destructive' : ''
      } ${isDragging ? 'opacity-50 shadow-lg' : 'cursor-grab hover:border-ring'}`}
    >
      {/* Zone de drag — exclut les boutons */}
      <div {...attributes} {...listeners} className="flex flex-col gap-0.5 cursor-grab">
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
