'use client';

import DeleteApplicationButton from '@/components/dashboard/Application/DeleteApplicationButton/DeleteApplicationButton';
import EditApplicationModal from '@/components/dashboard/Application/EditApplicationModal/EditApplicationModal';
import GenerateFollowUpModal from '@/components/dashboard/Application/GenerateFollowUpModal/GenerateFollowUpModal';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ApplicationCard } from '@/types/application';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type KanbanCardProps = {
  application: ApplicationCard;
  isDragging?: boolean;
};

export default function KanbanCard({ application, isDragging = false }: KanbanCardProps) {
  const t = useTranslations('dashboard.kanban');
  const [generateOpen, setGenerateOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: application.id,
    disabled: isDragging || popoverOpen || generateOpen || editOpen || deleteOpen,
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
    <>
      <div
        ref={setNodeRef}
        style={style}
        data-slot="kanban-card"
        {...attributes}
        {...listeners}
        className={`bg-background border rounded-lg p-3 flex flex-col gap-2 transition-colors ${
          needsFollowUp ? 'border-l-2 border-l-destructive' : ''
        } ${
          isDragging
            ? 'opacity-100 shadow-lg cursor-grabbing'
            : isBeingDragged
              ? 'opacity-30'
              : 'cursor-grab hover:border-ring'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{application.company}</span>
            <span className="text-xs text-muted-foreground">{application.role}</span>
          </div>

          {needsFollowUp && (
            <div onPointerDown={(event) => event.stopPropagation()}>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1" align="end">
                  <div className="flex flex-col items-start">
                    <EditApplicationModal
                      application={application}
                      open={editOpen}
                      onOpenChange={setEditOpen}
                    />
                    <button
                      className="text-left text-sm px-3 py-2 hover:bg-muted rounded-md w-full"
                      onClick={() => {
                        setPopoverOpen(false);
                        setGenerateOpen(true);
                      }}
                    >
                      {t('generateFollowUp')}
                    </button>
                    <DeleteApplicationButton
                      id={application.id}
                      open={deleteOpen}
                      onOpenChange={setDeleteOpen}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
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
        <div
          className="flex items-center gap-1 border-t pt-2 mt-1"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <EditApplicationModal
            application={application}
            open={editOpen}
            onOpenChange={setEditOpen}
          />

          <DeleteApplicationButton
            id={application.id}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </div>
      </div>

      <GenerateFollowUpModal
        key={`${application.id}-${generateOpen}`}
        application={application}
        open={generateOpen}
        onOpenChange={setGenerateOpen}
      />
    </>
  );
}
