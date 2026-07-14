import { getTranslations } from 'next-intl/server';

type Feature = {
  icon: string;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="flex flex-col gap-3 p-6 border border-border rounded-xl bg-background">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export default async function Features() {
  const t = await getTranslations('landing.features');

  const features: Feature[] = [
    {
      icon: '📋',
      title: t('kanban.title'),
      description: t('kanban.description'),
    },
    {
      icon: '🔔',
      title: t('reminders.title'),
      description: t('reminders.description'),
    },
    {
      icon: '✨',
      title: t('ai.title'),
      description: t('ai.description'),
    },
  ];

  return (
    <section className="px-6 py-16 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-foreground">{t('title')}</h2>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
