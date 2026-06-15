'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { SigninForm } from '../SigninForm/SigninForm';

export function SigninCard() {
  const t = useTranslations('auth.signin');

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <SigninForm />
      </CardContent>
    </Card>
  );
}
