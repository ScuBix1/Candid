import { createSigninSchema } from './singin';

const t = (key: string) => key;
const schema = createSigninSchema(t);

describe('signinSchema', () => {
  it('rejette si email est vide', () => {
    const result = schema.safeParse({
      email: '',
      password: 'Password1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un email invalide', () => {
    const result = schema.safeParse({
      email: 'pasunemail',
      password: 'Password1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejette si le mot de passe est vide', () => {
    const result = schema.safeParse({
      email: 'john@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepte si toutes les données sont valides', () => {
    const result = schema.safeParse({
      email: 'john@example.com',
      password: 'Password1!',
    });
    expect(result.success).toBe(true);
  });
});
