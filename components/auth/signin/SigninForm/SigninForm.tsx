'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/actions/auth/signin/signin';
import { createSigninSchema, SigninSchema } from '@/lib/validations/singin';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SigninForm() {
  const router = useRouter();
  const t = useTranslations('auth.signin.errors');
  const tForm = useTranslations('auth.signin.form');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SigninSchema>({
    resolver: zodResolver(createSigninSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: SigninSchema) {
    setIsLoading(true);
    setServerError(null);

    const { error } = await signIn(values.email, values.password);

    if (error) {
      setServerError(
        error.includes('Invalid login credentials') ? t('invalidCredentials') : t('genericError')
      );
      setIsLoading(false);
      return;
    }

    posthog.capture('user_signed_in');
    router.push('/dashboard');
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">{tForm('emailLabel')}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={tForm('emailPlaceholder')}
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">{tForm('passwordLabel')}</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            aria-invalid={!!form.formState.errors.password}
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          )}
        </Field>

        {serverError && <FieldError>{serverError}</FieldError>}

        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? tForm('loadingButton') : tForm('submitButton')}
          </Button>
          <FieldDescription className="text-center">
            {tForm('noAccount')}{' '}
            <a href="/signup" className="text-primary hover:underline">
              {tForm('signupLink')}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
