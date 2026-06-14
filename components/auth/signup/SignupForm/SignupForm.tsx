'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/actions/auth/signup/signup';
import { createSignupSchema, SignupSchema } from '@/lib/validations/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SignupForm() {
  const router = useRouter();
  const t = useTranslations('auth.signup.errors');
  const tForm = useTranslations('auth.signup.form');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(createSignupSchema(t)),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: SignupSchema) {
    setIsLoading(true);
    setServerError(null);

    const { error } = await signUp(values.email, values.displayName, values.password);

    if (error) {
      setServerError(
        error.includes('already registered') ? t('emailAlreadyUsed') : t('genericError')
      );
      setIsLoading(false);
      return;
    }

    //posthog.capture('user_signed_up', { source: 'direct' });
    router.push('/dashboard');
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="displayName">{tForm('displayNameLabel')}</FieldLabel>
          <Input
            id="displayName"
            placeholder="John Doe"
            aria-invalid={!!form.formState.errors.displayName}
            {...form.register('displayName')}
          />
          {form.formState.errors.displayName && (
            <FieldError>{form.formState.errors.displayName.message}</FieldError>
          )}
        </Field>
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

        <Field>
          <FieldLabel htmlFor="confirmPassword">{tForm('confirmPasswordLabel')}</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            aria-invalid={!!form.formState.errors.confirmPassword}
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword && (
            <FieldError>{form.formState.errors.confirmPassword.message}</FieldError>
          )}
        </Field>

        {serverError && <FieldError>{serverError}</FieldError>}

        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? tForm('loadingButton') : tForm('submitButton')}
          </Button>
          <FieldDescription className="text-center">
            {tForm('alreadyHaveAccount')}{' '}
            <a href="/login" className="text-primary hover:underline">
              {tForm('loginLink')}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
