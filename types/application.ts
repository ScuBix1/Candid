export type ApplicationStatus = 'sent' | 'in_progress' | 'interview' | 'offer' | 'rejected';

export type Application = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  location: string | null;
  status: ApplicationStatus;
  source: string | null;
  notes: string | null;
  salary: string | null;
  applied_at: string;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  last_generated_email: string | null;
};

export type ApplicationCard = Omit<Application, 'user_id'>;
