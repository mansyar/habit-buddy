import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_TIMEOUT = 10000; // 10 seconds

export async function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number = SUPABASE_TIMEOUT,
): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Network request timed out'));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([Promise.resolve(promise), timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}
