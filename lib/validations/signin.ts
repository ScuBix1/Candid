import { z } from 'zod';

export const createSigninSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email(t('emailInvalid')),
    password: z.string().min(1, t('passwordRequired')),
  });

export type SigninSchema = z.infer<ReturnType<typeof createSigninSchema>>;
