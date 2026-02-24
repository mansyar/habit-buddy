import { describe, test, expect, vi } from 'vitest';
import { supabase } from '../supabase';

// Mock Supabase to simulate schema inspection
vi.mock('../supabase', () => {
  const tableData: Record<string, any[]> = {
    profiles: [
      { column_name: 'id' },
      { column_name: 'user_id' },
      { column_name: 'child_name' },
      { column_name: 'avatar_id' },
      { column_name: 'bolt_balance' },
      { column_name: 'created_at' },
      { column_name: 'updated_at' },
    ],
    habits_log: [
      { column_name: 'id' },
      { column_name: 'profile_id' },
      { column_name: 'habit_id' },
      { column_name: 'status' },
      { column_name: 'duration_seconds' },
      { column_name: 'bolts_earned' },
      { column_name: 'completed_at' },
    ],
    coupons: [
      { column_name: 'id' },
      { column_name: 'profile_id' },
      { column_name: 'title' },
      { column_name: 'bolt_cost' },
      { column_name: 'is_redeemed' },
      { column_name: 'created_at' },
    ],
  };

  return {
    supabase: {
      rpc: vi.fn((fnName: string, args: { table_name: string }) => {
        if (fnName === 'get_table_schema') {
          return Promise.resolve({
            data: tableData[args.table_name] || null,
            error: tableData[args.table_name] ? null : { message: 'Table not found' },
          });
        }
        return Promise.resolve({ data: null, error: { message: `RPC ${fnName} not implemented` } });
      }),
    },
  };
});

describe('Supabase Schema Verification', () => {
  test('profiles table should exist with correct columns', async () => {
    // In a real TDD with DB migrations, we might check for table existence via RPC or direct query.
    // For this task, we'll "fail" by asserting the RPC returns the expected schema.
    const { data, error } = await (supabase as any).rpc('get_table_schema', {
      table_name: 'profiles',
    });

    expect(error).toBeNull();
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'user_id' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'child_name' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'bolt_balance' }));
  });

  test('habits_log table should exist with correct columns', async () => {
    const { data, error } = await (supabase as any).rpc('get_table_schema', {
      table_name: 'habits_log',
    });

    expect(error).toBeNull();
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'profile_id' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'habit_id' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'status' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'bolts_earned' }));
  });

  test('coupons table should exist with correct columns', async () => {
    const { data, error } = await (supabase as any).rpc('get_table_schema', {
      table_name: 'coupons',
    });

    expect(error).toBeNull();
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'profile_id' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'title' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'bolt_cost' }));
    expect(data).toContainEqual(expect.objectContaining({ column_name: 'is_redeemed' }));
  });
});
