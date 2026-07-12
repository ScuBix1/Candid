import { createApplicationSchema } from './application';

const t = (key: string, values?: Record<string, string | number | Date>) => {
  if (values?.max) return `Maximum ${values.max} caractères`;
  return key;
};

const schema = createApplicationSchema(t);

const validBase = {
  company: 'Doctrine',
  role: 'Frontend Developer',
  applied_at: '2026-06-16',
};

describe('createApplicationSchema', () => {
  // ===========================
  // Cas valides
  // ===========================

  it('accepte si toutes les données requises sont valides', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepte avec tous les champs optionnels remplis', () => {
    const result = schema.safeParse({
      ...validBase,
      location: 'Paris',
      source: 'LinkedIn',
      salary: '45k',
      notes: 'Très bonne opportunité',
    });
    expect(result.success).toBe(true);
  });

  it('accepte les champs optionnels avec chaîne vide', () => {
    const result = schema.safeParse({
      ...validBase,
      location: '',
      source: '',
      salary: '',
      notes: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepte sans les champs optionnels', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepte company avec exactement 100 caractères', () => {
    const result = schema.safeParse({
      ...validBase,
      company: 'A'.repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it('accepte role avec exactement 100 caractères', () => {
    const result = schema.safeParse({
      ...validBase,
      role: 'A'.repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it('accepte location avec exactement 100 caractères', () => {
    const result = schema.safeParse({
      ...validBase,
      location: 'A'.repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it('accepte salary avec exactement 50 caractères', () => {
    const result = schema.safeParse({
      ...validBase,
      salary: 'A'.repeat(50),
    });
    expect(result.success).toBe(true);
  });

  it('accepte notes avec exactement 2000 caractères', () => {
    const result = schema.safeParse({
      ...validBase,
      notes: 'A'.repeat(2000),
    });
    expect(result.success).toBe(true);
  });

  // ===========================
  // Champs requis manquants
  // ===========================

  it('rejette si company est vide', () => {
    const result = schema.safeParse({ ...validBase, company: '' });
    expect(result.success).toBe(false);
  });

  it('rejette si company est absent', () => {
    const result = schema.safeParse({ role: 'Frontend Developer', applied_at: '2026-06-16' });
    expect(result.success).toBe(false);
  });

  it('rejette si role est vide', () => {
    const result = schema.safeParse({ ...validBase, role: '' });
    expect(result.success).toBe(false);
  });

  it('rejette si role est absent', () => {
    const result = schema.safeParse({ company: 'Doctrine', applied_at: '2026-06-16' });
    expect(result.success).toBe(false);
  });

  it('rejette si applied_at est vide', () => {
    const result = schema.safeParse({ ...validBase, applied_at: '' });
    expect(result.success).toBe(false);
  });

  it('rejette si applied_at est absent', () => {
    const result = schema.safeParse({ company: 'Doctrine', role: 'Frontend Developer' });
    expect(result.success).toBe(false);
  });

  // ===========================
  // Dépassement de longueur
  // ===========================

  it('rejette si company dépasse 100 caractères', () => {
    const result = schema.safeParse({ ...validBase, company: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejette si role dépasse 100 caractères', () => {
    const result = schema.safeParse({ ...validBase, role: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejette si location dépasse 100 caractères', () => {
    const result = schema.safeParse({ ...validBase, location: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejette si source dépasse 100 caractères', () => {
    const result = schema.safeParse({ ...validBase, source: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejette si salary dépasse 50 caractères', () => {
    const result = schema.safeParse({ ...validBase, salary: 'A'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('rejette si notes dépasse 2000 caractères', () => {
    const result = schema.safeParse({ ...validBase, notes: 'A'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  // ===========================
  // Messages d'erreur
  // ===========================

  it('retourne le bon message si company est vide', () => {
    const result = schema.safeParse({ ...validBase, company: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('companyRequired');
    }
  });

  it('retourne le bon message si company dépasse 100 caractères', () => {
    const result = schema.safeParse({ ...validBase, company: 'A'.repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Maximum 100 caractères');
    }
  });

  it('retourne le bon message si notes dépasse 2000 caractères', () => {
    const result = schema.safeParse({ ...validBase, notes: 'A'.repeat(2001) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Maximum 2000 caractères');
    }
  });
});
