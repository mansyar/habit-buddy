import { expect, test, vi, describe, beforeEach } from 'vitest';

vi.unmock('../supabase');

// Mock the entire @supabase/supabase-js module BEFORE any imports
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({})),
}));

describe('Supabase Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  test('should initialize with correct URL and Key from environment variables', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test-url.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const { createClient } = await import('@supabase/supabase-js');
    const { supabase } = await import('../supabase');

    expect(createClient).toHaveBeenCalledWith('https://test-url.supabase.co', 'test-anon-key');
    expect(supabase).toBeDefined();
  });

  test('should throw an error if environment variables are missing', async () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = '';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = '';

    // Vitest resetModules might not be enough for some ESM modules,
    // but in a 'run' mode it should work for each test if isolated.
    await expect(import('../supabase')).rejects.toThrow('Missing Supabase URL or Anon Key');
  });
});
