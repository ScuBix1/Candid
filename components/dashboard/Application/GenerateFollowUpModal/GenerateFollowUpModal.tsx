'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generateFollowUp } from '@/lib/actions/application/generateFollowUp';
import { ApplicationCard } from '@/types/application';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';
import { useState } from 'react';

type GenerateFollowUpModalProps = {
  application: ApplicationCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GenerateFollowUpModal({
  application,
  open,
  onOpenChange,
}: GenerateFollowUpModalProps) {
  const t = useTranslations('dashboard.application.generateModal');
  const [email, setEmail] = useState<string | null>(application.last_generated_email ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    posthog.capture('ai_generation_clicked', {
      company: application.company,
      role: application.role,
    });

    const result = await generateFollowUp(application);

    if (result.error === 'NO_GENERATIONS_LEFT') {
      if (result.lastGeneratedEmail) {
        setEmail(result.lastGeneratedEmail);
      }
      setError(t('noGenerationsLeft'));
      setIsLoading(false);
      return;
    }

    if (result.error) {
      if (result.lastGeneratedEmail) {
        setEmail(result.lastGeneratedEmail);
        setError(null);
      } else {
        setError(t('generationFailed'));
      }
      setIsLoading(false);
      return;
    }

    setEmail(result.email);
    setRemainingGenerations(result.remainingGenerations);
    setIsLoading(false);

    posthog.capture('ai_generation_validated', {
      company: application.company,
      role: application.role,
    });
  }

  async function handleCopy() {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setEmail(null);
    setError(null);
    setCopied(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onInteractOutside={(event) => event.preventDefault()}>
        <DialogDescription className="sr-only">{t('description')}</DialogDescription>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{application.company}</span>
            {' — '}
            {application.role}
          </div>

          {!email && !error && (
            <div className="flex flex-col gap-3">
              {isLoading && (
                <p className="text-sm text-muted-foreground text-center">
                  {t('generatingMessage')}
                </p>
              )}
              <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? t('generating') : t('generate')}
              </Button>
            </div>
          )}

          {error && !email && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" onClick={handleClose}>
                {t('close')}
              </Button>
            </div>
          )}

          {email && (
            <div className="flex flex-col gap-3">
              {application.last_generated_email && !isLoading && remainingGenerations === null && (
                <p className="text-xs text-muted-foreground">{t('lastGenerated')}</p>
              )}
              <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap">{email}</div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              {remainingGenerations !== null && (
                <p className="text-xs text-muted-foreground">
                  {t('remainingGenerations', { count: remainingGenerations })}
                </p>
              )}
              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1">
                  {copied ? t('copied') : t('copy')}
                </Button>
                <Button variant="outline" onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? t('generating') : t('regenerate')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
