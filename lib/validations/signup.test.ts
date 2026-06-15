import { createSignupSchema } from '@/lib/validations/signup';

const t = (key: string) => key;
const schema = createSignupSchema(t);

describe('signupSchema', () => {
  it("rejette si le nom d'affichage fait moins de 2 caractères", () => {
    const result = schema.safeParse({
      displayName: 'J',
      email: 'john@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un email invalide', () => {
    const result = schema.safeParse({
      displayName: 'John Doe',
      email: 'pasunemail',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejette si les mots de passe ne correspondent pas', () => {
    const result = schema.safeParse({
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'Password1!',
      confirmPassword: 'Différent1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejette si le mot de passe fait moins de 8 caractères', () => {
    const result = schema.safeParse({
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'Passw1!',
      confirmPassword: 'Passw1!',
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le mot de passe n'a pas de caractère spécial", () => {
    const result = schema.safeParse({
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le mot de passe n'a pas de majuscule", () => {
    const result = schema.safeParse({
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'password1!',
      confirmPassword: 'password1!',
    });
    expect(result.success).toBe(false);
  });

  it("rejette si le mot de passe n'a pas de chiffre", () => {
    const result = schema.safeParse({
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'Password!',
      confirmPassword: 'Password!',
    });
    expect(result.success).toBe(false);
  });

  it('accepte si toutes les données sont valides', () => {
    const result = schema.safeParse({
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });
    expect(result.success).toBe(true);
  });
});
