import { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>
  );
}
