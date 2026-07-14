'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createApplication } from '@/lib/actions/application/create';
import { updateApplication } from '@/lib/actions/application/update';
import { useApplicationStore } from '@/lib/stores/applicationStore';
import {
  createApplicationSchema,
  type CreateApplicationSchema,
} from '@/lib/validations/application';
import { ApplicationCard, ApplicationStatus } from '@/types/application';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ApplicationFormProps = {
  onSuccess: () => void;
  application?: ApplicationCard;
};

export default function ApplicationForm({ onSuccess, application }: ApplicationFormProps) {
  const t = useTranslations('dashboard.application.form.errors');
  const tForm = useTranslations('dashboard.application.form.fields');
  const tAction = useTranslations('dashboard.application.form');
  const tStatus = useTranslations('dashboard.kanban');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateApplication: updateStore } = useApplicationStore();
  const isEditing = !!application;

  const form = useForm<CreateApplicationSchema>({
    resolver: zodResolver(createApplicationSchema(t)),
    defaultValues: {
      company: application?.company ?? '',
      role: application?.role ?? '',
      location: application?.location ?? '',
      source: application?.source ?? '',
      salary: application?.salary ?? '',
      notes: application?.notes ?? '',
      applied_at: application?.applied_at ?? new Date().toISOString().split('T')[0],
      status: application?.status ?? 'sent',
    },
  });

  async function onSubmit(values: CreateApplicationSchema) {
    console.log('values', values);
    setIsLoading(true);
    setServerError(null);

    if (isEditing) {
      const { error } = await updateApplication(application.id, values);
      if (error) {
        setServerError(error);
        setIsLoading(false);
        return;
      }
      updateStore({ ...application, ...values });
      posthog.capture('application_updated', { source: values.source || 'direct' });
    } else {
      const { error } = await createApplication(values);
      if (error) {
        setServerError(error);
        setIsLoading(false);
        return;
      }
      posthog.capture('application_created', { source: values.source || 'direct' });
    }

    onSuccess();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="company">{tForm('company')}</FieldLabel>
          <Input
            id="company"
            placeholder="Doctrine"
            aria-invalid={!!form.formState.errors.company}
            {...form.register('company')}
          />
          {form.formState.errors.company && (
            <FieldError>{form.formState.errors.company.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="role">{tForm('role')}</FieldLabel>
          <Input
            id="role"
            placeholder="Frontend Developer"
            aria-invalid={!!form.formState.errors.role}
            {...form.register('role')}
          />
          {form.formState.errors.role && (
            <FieldError>{form.formState.errors.role.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="location">{tForm('location')}</FieldLabel>
          <Input
            id="location"
            placeholder="Paris"
            aria-invalid={!!form.formState.errors.location}
            {...form.register('location')}
          />
          {form.formState.errors.location && (
            <FieldError>{form.formState.errors.location.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="source">{tForm('source')}</FieldLabel>
          <Input
            id="source"
            placeholder="LinkedIn"
            aria-invalid={!!form.formState.errors.source}
            {...form.register('source')}
          />
          {form.formState.errors.source && (
            <FieldError>{form.formState.errors.source.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="salary">{tForm('salary')}</FieldLabel>
          <Input
            id="salary"
            placeholder="45k"
            aria-invalid={!!form.formState.errors.salary}
            {...form.register('salary')}
          />
          {form.formState.errors.salary && (
            <FieldError>{form.formState.errors.salary.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="applied_at">{tForm('applied_at')}</FieldLabel>
          <Input
            id="applied_at"
            type="date"
            aria-invalid={!!form.formState.errors.applied_at}
            {...form.register('applied_at')}
          />
          {form.formState.errors.applied_at && (
            <FieldError>{form.formState.errors.applied_at.message}</FieldError>
          )}
        </Field>

        {isEditing && (
          <Field>
            <FieldLabel htmlFor="status">{tForm('status')}</FieldLabel>
            <Select
              defaultValue={application?.status ?? 'sent'}
              onValueChange={(value) => form.setValue('status', value as ApplicationStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sent">{tStatus('sent')}</SelectItem>
                <SelectItem value="in_progress">{tStatus('inProgress')}</SelectItem>
                <SelectItem value="interview">{tStatus('interview')}</SelectItem>
                <SelectItem value="offer">{tStatus('offer')}</SelectItem>
                <SelectItem value="rejected">{tStatus('rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="notes">{tForm('notes')}</FieldLabel>
          <Textarea id="notes" placeholder="Notes..." rows={3} {...form.register('notes')} />
          {form.formState.errors.notes && (
            <FieldError>{form.formState.errors.notes.message}</FieldError>
          )}
        </Field>

        {serverError && <FieldError>{serverError}</FieldError>}

        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? tAction('loadingButton')
              : isEditing
                ? tAction('updateButton')
                : tAction('submitButton')}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
