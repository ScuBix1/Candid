import KanbanBoard from '@/components/dashboard/Kanban/KanbanBoard/KanbanBoard';
import StatsBar from '@/components/dashboard/Stats/StatsBar/StatsBar';
import { getApplications } from '@/lib/actions/application/getAll';

export default async function DashboardPage() {
  const { data: applications } = await getApplications();

  return (
    <>
      <StatsBar />
      <KanbanBoard applications={applications ?? []} />
    </>
  );
}
