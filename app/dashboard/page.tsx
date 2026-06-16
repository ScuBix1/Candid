import KanbanBoard from '@/components/dashboard/Kanban/KanbanBoard/KanbanBoard';
import StatsBar from '@/components/dashboard/Stats/StatsBar/StatsBar';

export default function DashboardPage() {
  return (
    <>
      <StatsBar />
      <KanbanBoard />
    </>
  );
}
