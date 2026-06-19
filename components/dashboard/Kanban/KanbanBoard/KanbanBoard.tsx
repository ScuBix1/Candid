'use client';

import { ApplicationCard, ApplicationStatus } from '@/types/application';
import { useTranslations } from 'next-intl';
import KanbanColumn from '../KanbanColumn/KanbanColumn';

type KanbanBoardProps = {
  applications: ApplicationCard[];
};

export default function KanbanBoard({ applications }: KanbanBoardProps) {
  const t = useTranslations('dashboard.kanban');

  const columns: { id: ApplicationStatus; label: string }[] = [
    { id: 'sent', label: t('sent') },
    { id: 'in_progress', label: t('inProgress') },
    { id: 'interview', label: t('interview') },
    { id: 'offer', label: t('offer') },
    { id: 'rejected', label: t('rejected') },
  ];

  return (
    <div className="flex gap-4 p-6 overflow-x-auto">
      {columns.map((col) => (
        <KanbanColumn
          key={col.id}
          label={col.label}
          applications={applications.filter((app) => app.status === col.id)}
        />
      ))}
    </div>
  );
}
