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
import { useApplicationStore } from '@/lib/stores/applicationStore';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';
import { useState } from 'react';

type DeleteApplicationButtonProps = {
  id: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function DeleteApplicationButton({
  id,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: DeleteApplicationButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('dashboard.application.deleteModal');
  const { removeApplication } = useApplicationStore();

  async function handleDelete() {
    setIsLoading(true);

    removeApplication(id);
    setInternalOpen(false);

    const { error } = await deleteApplication(id);

    if (error) {
      setIsLoading(false);
      return;
    }

    posthog.capture('application_deleted');
  }

  return (
    <Dialog
      open={externalOpen ?? internalOpen}
      onOpenChange={externalOnOpenChange ?? setInternalOpen}
    >
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
          <Button
            variant="outline"
            onClick={() => {
              if (externalOnOpenChange) {
                externalOnOpenChange(false);
              } else {
                setInternalOpen(false);
              }
            }}
            disabled={isLoading}
          >
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
