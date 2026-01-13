import supabase from './supabaseClient';

// Use this function to get the session, and send auth info to backend
// to verify the user before the API call
export async function apiFetch(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });
}