import { z } from 'zod';

type TranslationValues = Record<string, string | number | Date>;

export const createApplicationSchema = (t: (key: string, values?: TranslationValues) => string) =>
  z.object({
    company: z
      .string()
      .min(1, t('companyRequired'))
      .max(100, t('fieldTooLong', { max: 100 })),
    role: z
      .string()
      .min(1, t('roleRequired'))
      .max(100, t('fieldTooLong', { max: 100 })),
    location: z
      .string()
      .max(100, t('fieldTooLong', { max: 100 }))
      .optional(),
    source: z
      .string()
      .max(100, t('fieldTooLong', { max: 100 }))
      .optional(),
    salary: z
      .string()
      .refine((val) => val === '' || val.length <= 50, t('fieldTooLong', { max: 50 }))
      .optional(),
    notes: z
      .string()
      .max(2000, t('fieldTooLong', { max: 2000 }))
      .optional(),
    applied_at: z.string().min(1, t('appliedAtRequired')),
    status: z.enum(['sent', 'in_progress', 'interview', 'offer', 'rejected']).optional(),
  });

export type CreateApplicationSchema = z.infer<ReturnType<typeof createApplicationSchema>>;
