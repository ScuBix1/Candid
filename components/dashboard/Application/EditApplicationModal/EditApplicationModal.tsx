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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function EditApplicationModal({
  application,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: EditApplicationModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const t = useTranslations('dashboard.application.editModal');

  return (
    <Dialog
      open={externalOpen ?? internalOpen}
      onOpenChange={externalOnOpenChange ?? setInternalOpen}
    >
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
        <ApplicationForm
          application={application}
          onSuccess={() => {
            if (externalOnOpenChange) {
              externalOnOpenChange(false);
            } else {
              setInternalOpen(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
