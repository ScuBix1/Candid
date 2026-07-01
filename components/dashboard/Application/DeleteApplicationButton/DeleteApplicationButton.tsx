'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteApplication } from '@/lib/actions/application/delete';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';
import { useState } from 'react';

type DeleteApplicationButtonProps = {
  id: string;
};

export default function DeleteApplicationButton({ id }: DeleteApplicationButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('dashboard.application.deleteModal');

  async function handleDelete() {
    setIsLoading(true);

    const { error } = await deleteApplication(id);

    if (error) {
      setIsLoading(false);
      return;
    }

    posthog.capture('application_deleted');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          {t('trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription className="sr-only">{t('description')}</DialogDescription>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t('message')}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? t('loadingButton') : t('confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
