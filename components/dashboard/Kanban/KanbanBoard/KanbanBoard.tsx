'use client';

import { useTranslations } from 'next-intl';
import KanbanColumn from '../KanbanColumn/KanbanColumn';

type Column = {
  id: string;
  label: string;
};

export default function KanbanBoard() {
  const t = useTranslations('dashboard.kanban');

  const columns: Column[] = [
    { id: 'sent', label: t('sent') },
    { id: 'in_progress', label: t('inProgress') },
    { id: 'interview', label: t('interview') },
    { id: 'offer', label: t('offer') },
    { id: 'rejected', label: t('rejected') },
  ];

  return (
    <div className="flex gap-4 p-6 overflow-x-auto">
      {columns.map((col) => (
        <KanbanColumn key={col.id} label={col.label} />
      ))}
    </div>
  );
}
