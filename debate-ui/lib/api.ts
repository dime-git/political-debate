import { supabase } from './supabase';

// Interface for a debate
export interface Debate {
  id: string;
  query: string;
  right_wing_response: string;
  left_wing_response: string;
  created_at: string;
}

// Interface for API response
export interface DebateResponse {
  'Donald Trump thoughts 🧠:': string;
  'Joe Biden thoughts 🧠: ': string;
}

// API URL from environment variable with fallback to local development
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Submit a new debate question to the API
 * @param query The question to debate
 * @returns The debate responses
 */
export async function submitDebateQuestion(
  query: string
): Promise<DebateResponse> {
  try {
    // Using URLSearchParams to properly handle query parameters
    const params = new URLSearchParams();
    params.append('query', query);

    const url = `${apiUrl}/debate?${params.toString()}`;
    console.log(`Calling API at: ${url}`);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => 'No error details available');
        throw new Error(
          `API error: ${response.status} ${response.statusText}. Details: ${errorText}`
        );
      }

      return response.json();
    } catch (fetchError: unknown) {
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error(
          'Request timeout: The server took too long to respond.'
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error in submitDebateQuestion:', error);
    throw error;
  }
}

/**
 * Fetch recent debates from Supabase
 * @param limit Maximum number of debates to retrieve
 * @returns Array of debates
 */
export async function getRecentDebates(limit = 10): Promise<Debate[]> {
  const { data, error } = await supabase
    .from('debates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching debates:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a specific debate by ID
 * @param id Debate ID
 * @returns Debate object or null if not found
 */
export async function getDebateById(id: string): Promise<Debate | null> {
  const { data, error } = await supabase
    .from('debates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching debate:', error);
    return null;
  }

  return data;
}
