// API client for Aksesa backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface CreditsBalance {
  free_credits: number;
  premium_credits: number;
  total_credits: number;
  subscription_tier: string;
  is_premium: boolean;
  last_reset: string | null;
  next_reset: string | null;
}

export interface CreditTransaction {
  id: string;
  action: string;
  credits_used: number;
  credits_remaining: number;
  description: string | null;
  created_at: string;
}

export interface CreditsHistory {
  transactions: CreditTransaction[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Get user's credit balance
 */
export async function getCreditsBalance(token: string): Promise<CreditsBalance> {
  const response = await fetch(`${API_BASE_URL}/api/v1/credits/balance`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'Failed to fetch credits balance');
  }

  return response.json();
}

/**
 * Get user's credit transaction history
 */
export async function getCreditsHistory(
  token: string,
  limit: number = 20,
  offset: number = 0
): Promise<CreditsHistory> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/credits/history?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'Failed to fetch credits history');
  }

  return response.json();
}

/**
 * Upgrade user's subscription
 */
export async function upgradeSubscription(
  token: string,
  tier: string,
  credits: number = 0
): Promise<CreditsBalance> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/credits/upgrade?tier=${tier}&credits=${credits}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'Failed to upgrade subscription');
  }

  return response.json();
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'Login failed');
  }

  return response.json();
}

/**
 * Register new user
 */
export async function register(
  email: string,
  password: string,
  name: string,
  businessName?: string,
  phone?: string
): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      name,
      business_name: businessName,
      phone,
    }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'Registration failed');
  }

  return response.json();
}