import { z } from 'zod';

export const createSignupSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.email(t('emailInvalid')),
      displayName: z.string().min(2, t('displayNameTooShort')),
      password: z
        .string()
        .min(8, t('passwordTooShort'))
        .regex(/[A-Z]/, t('passwordNoUppercase'))
        .regex(/[0-9]/, t('passwordNoNumber'))
        .regex(/[^a-zA-Z0-9]/, t('passwordNoSpecialChar')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordMismatch'),
      path: ['confirmPassword'],
    });

export type SignupSchema = z.infer<ReturnType<typeof createSignupSchema>>;
