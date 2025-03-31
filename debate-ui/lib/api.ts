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

// API URL from environment variable
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
    // Simple URL construction that works both locally and in production
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${apiUrl}/debate?query=${encodedQuery}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error submitting debate question:', error);
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
