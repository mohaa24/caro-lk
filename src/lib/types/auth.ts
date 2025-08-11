// User types based on API schema

export type UserType = 'Individual' | 'Dealership';

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  user_type?: UserType;
  business_name?: string | null;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  password: string;
}

export interface UserCreateWithDealer extends UserCreate {
  dealer_profile?: DealerProfileCreate;
}

export interface UserRead {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  user_type: UserType;
  business_name?: string | null;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface DealerProfileCreate {
  business_id?: string | null;
  business_name?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  website?: string | null;
  description?: string | null;
}

export interface DealerProfileOut extends DealerProfileCreate {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface DealerProfileSummary {
  id: number;
  business_name?: string | null;
  city?: string | null;
  province?: string | null;
}

export interface UserSummary {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  user_type: UserType;
  business_name?: string | null;
}

// Authentication response types
export interface AuthResponse {
  user: UserRead;
  token: Token;
}

// Error types
export interface ApiError {
  detail: string;
  code?: string;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}
