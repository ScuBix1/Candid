'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createApplication } from '@/lib/actions/application/create';
import {
  createApplicationSchema,
  type CreateApplicationSchema,
} from '@/lib/validations/application';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import posthog from 'posthog-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ApplicationFormProps = {
  onSuccess: () => void;
};

export default function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const t = useTranslations('dashboard.application.form.errors');
  const tForm = useTranslations('dashboard.application.form.fields');
  const tAction = useTranslations('dashboard.application.form');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateApplicationSchema>({
    resolver: zodResolver(createApplicationSchema(t)),
    defaultValues: {
      company: '',
      role: '',
      location: '',
      source: '',
      salary: '',
      notes: '',
      applied_at: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: CreateApplicationSchema) {
    setIsLoading(true);
    setServerError(null);

    const { error } = await createApplication(values);

    if (error) {
      setServerError(error);
      setIsLoading(false);
      return;
    }

    posthog.capture('application_created', {
      source: values.source || 'direct',
    });

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
            {isLoading ? tAction('loadingButton') : tAction('submitButton')}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
