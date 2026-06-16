'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ApplicationForm from '../ApplicationForm/ApplicationForm';

export default function ApplicationModal() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('dashboard.application.modal');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t('trigger')}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <ApplicationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
