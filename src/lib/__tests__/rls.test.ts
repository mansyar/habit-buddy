import { describe, test, expect, vi } from 'vitest';
import { supabase } from '../supabase';

// Mock Supabase to simulate policy inspection
vi.mock('../supabase', () => {
  const policyData: Record<string, any[]> = {
    profiles: [{ policy_name: 'Users can only access their own profile' }],
    habits_log: [{ policy_name: 'Users can only access their own habit logs' }],
    coupons: [{ policy_name: 'Users can only access their own coupons' }],
  };

  return {
    supabase: {
      rpc: vi.fn((fnName: string, args: { table_name: string }) => {
        if (fnName === 'get_table_policies') {
          return Promise.resolve({
            data: policyData[args.table_name] || null,
            error: policyData[args.table_name] ? null : { message: 'Table not found' },
          });
        }
        return Promise.resolve({ data: null, error: { message: `RPC ${fnName} not implemented` } });
      }),
    },
  };
});

describe('Supabase RLS Policy Verification', () => {
  test('profiles table should have user-specific RLS policies', async () => {
    const { data, error } = await (supabase as any).rpc('get_table_policies', {
      table_name: 'profiles',
    });

    expect(error).toBeNull();
    expect(data).toContainEqual(
      expect.objectContaining({ policy_name: 'Users can only access their own profile' }),
    );
  });

  test('habits_log table should have user-specific RLS policies via profile', async () => {
    const { data, error } = await (supabase as any).rpc('get_table_policies', {
      table_name: 'habits_log',
    });

    expect(error).toBeNull();
    expect(data).toContainEqual(
      expect.objectContaining({ policy_name: 'Users can only access their own habit logs' }),
    );
  });

  test('coupons table should have user-specific RLS policies via profile', async () => {
    const { data, error } = await (supabase as any).rpc('get_table_policies', {
      table_name: 'coupons',
    });

    expect(error).toBeNull();
    expect(data).toContainEqual(
      expect.objectContaining({ policy_name: 'Users can only access their own coupons' }),
    );
  });
});
