'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplicationCard } from '@/types/application';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ApplicationForm from '../ApplicationForm/ApplicationForm';

type EditApplicationModalProps = {
  application: ApplicationCard;
};

export default function EditApplicationModal({ application }: EditApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('dashboard.application.editModal');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {t('trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogDescription className="sr-only">{t('description')}</DialogDescription>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <ApplicationForm application={application} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
