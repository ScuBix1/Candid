'use client';

import { ApplicationCard, ApplicationStatus } from '@/types/application';
import { useDroppable } from '@dnd-kit/core';
import { useTranslations } from 'next-intl';
import KanbanCard from '../KanbanCard/KanbanCard';

type KanbanColumnProps = {
  id: ApplicationStatus;
  label: string;
  applications: ApplicationCard[];
};

export default function KanbanColumn({ id, label, applications }: KanbanColumnProps) {
  const t = useTranslations('dashboard.kanban');

  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-3 min-w-55">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-100 rounded-lg p-2 transition-colors ${
          isOver ? 'bg-muted/70 border-2 border-dashed border-ring' : 'bg-muted/40'
        }`}
      >
        {applications.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-4">{t('empty')}</p>
        ) : (
          applications.map((application) => (
            <KanbanCard key={application.id} application={application} />
          ))
        )}
      </div>
    </div>
  );
}
