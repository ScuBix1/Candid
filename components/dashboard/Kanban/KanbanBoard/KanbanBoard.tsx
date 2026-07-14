'use client';

import { updateApplicationStatus } from '@/lib/actions/application/updateStatus';
import { useApplicationStore } from '@/lib/stores/applicationStore';
import { ApplicationCard, ApplicationStatus } from '@/types/application';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import KanbanCard from '../KanbanCard/KanbanCard';
import KanbanColumn from '../KanbanColumn/KanbanColumn';

type KanbanBoardProps = {
  applications: ApplicationCard[];
};

export default function KanbanBoard({ applications: initialApplications }: KanbanBoardProps) {
  const t = useTranslations('dashboard.kanban');
  const { applications, setApplications, moveApplication, showFollowUpOnly } =
    useApplicationStore();
  const [activeApplication, setActiveApplication] = useState<ApplicationCard | null>(null);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications, setApplications]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const columns: { id: ApplicationStatus; label: string }[] = [
    { id: 'sent', label: t('sent') },
    { id: 'in_progress', label: t('inProgress') },
    { id: 'interview', label: t('interview') },
    { id: 'offer', label: t('offer') },
    { id: 'rejected', label: t('rejected') },
  ];

  const filteredApplications = showFollowUpOnly
    ? applications.filter((application) => {
        const daysAgo = Math.floor(
          (new Date().getTime() - new Date(application.applied_at).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return daysAgo > 7 && application.status === 'sent';
      })
    : applications;

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveApplication(null);

    if (!over) return;
    if (active.id === over.id) return;

    const applicationId = active.id as string;
    const newStatus = over.id as ApplicationStatus;
    const previousStatus = applications.find(
      (application) => application.id === applicationId
    )?.status;

    moveApplication(applicationId, newStatus);

    posthog.capture('application_moved', {
      from_column: previousStatus,
      to_column: newStatus,
    });

    const { error } = await updateApplicationStatus(applicationId, newStatus);

    if (error) {
      moveApplication(applicationId, previousStatus!);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        const app = applications.find((application) => application.id === event.active.id);
        if (app) setActiveApplication(app);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-6 overflow-x-auto">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            applications={filteredApplications.filter(
              (application) => application.status === col.id
            )}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication && <KanbanCard application={activeApplication} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
