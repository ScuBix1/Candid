'use client';

import { ApplicationCard } from '@/types/application';
import { useTranslations } from 'next-intl';
import KanbanCard from '../KanbanCard/KanbanCard';

type KanbanColumnProps = {
  label: string;
  applications: ApplicationCard[];
};

export default function KanbanColumn(props: KanbanColumnProps) {
  const { label, applications } = props;
  const t = useTranslations('dashboard.kanban');

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
      <div className="flex flex-col gap-2 min-h-100 bg-muted/40 rounded-lg p-2">
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
