'use client';

import { useTranslations } from 'next-intl';

type KanbanColumnProps = {
  label: string;
};

export default function KanbanColumn(props: KanbanColumnProps) {
  const { label } = props;
  const t = useTranslations('dashboard.kanban');

  return (
    <div className="flex flex-col gap-3 min-w-55">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">0</span>
      </div>
      <div className="flex flex-col gap-2 min-h-100 bg-muted/40 rounded-lg p-2">
        <p className="text-xs text-muted-foreground text-center mt-4">{t('empty')}</p>
      </div>
    </div>
  );
}
