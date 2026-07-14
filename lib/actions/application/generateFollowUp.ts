'use server';

import { createClient } from '@/lib/supabase/server';
import { ApplicationCard } from '@/types/application';
import Groq from 'groq-sdk';
import { revalidatePath } from 'next/cache';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateFollowUp(application: ApplicationCard): Promise<{
  email: string | null;
  error: string | null;
  remainingGenerations: number;
  lastGeneratedEmail: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return {
      email: null,
      error: 'Unauthorized',
      remainingGenerations: 0,
      lastGeneratedEmail: null,
    };

  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_generations_count')
    .eq('id', user.id)
    .single();

  if (!profile)
    return {
      email: null,
      error: 'Profile not found',
      remainingGenerations: 0,
      lastGeneratedEmail: null,
    };

  const { data: app } = await supabase
    .from('applications')
    .select('last_generated_email')
    .eq('id', application.id)
    .eq('user_id', user.id)
    .single();

  if (!app)
    return {
      email: null,
      error: 'Application not found',
      remainingGenerations: 0,
      lastGeneratedEmail: null,
    };

  const MAX_FREE_GENERATIONS = 3;
  const remainingGenerations = MAX_FREE_GENERATIONS - (profile.ai_generations_count ?? 0);

  if (remainingGenerations <= 0) {
    return {
      email: null,
      error: 'NO_GENERATIONS_LEFT',
      remainingGenerations: 0,
      lastGeneratedEmail: app.last_generated_email ?? null,
    };
  }

  const prompt = `Tu es un assistant qui aide les candidats à rédiger des emails de relance professionnels.

Génère un email de relance court et professionnel en français pour :
- Entreprise : ${application.company}
- Poste : ${application.role}
- Date de candidature : ${application.applied_at}
${application.location ? `- Lieu : ${application.location}` : ''}

L'email doit :
- Faire 3-4 phrases maximum
- Être poli et professionnel
- Rappeler la candidature
- Exprimer l'intérêt pour le poste
- Demander un retour

Ne génère que l'email, sans objet, sans commentaire ni explication.`;

  try {
    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const email = result.choices[0].message.content ?? '';

    await supabase
      .from('profiles')
      .update({ ai_generations_count: (profile.ai_generations_count ?? 0) + 1 })
      .eq('id', user.id);

    await supabase
      .from('applications')
      .update({ last_generated_email: email })
      .eq('id', application.id)
      .eq('user_id', user.id);

    revalidatePath('/dashboard');

    return {
      email,
      error: null,
      remainingGenerations: remainingGenerations - 1,
      lastGeneratedEmail: email,
    };
  } catch (error) {
    console.error('Groq generation failed:', error);
    return {
      email: null,
      error: 'GENERATION_FAILED',
      remainingGenerations,
      lastGeneratedEmail: app.last_generated_email ?? null,
    };
  }
}
