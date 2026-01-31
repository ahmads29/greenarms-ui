export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  verification_token: string;
}

export interface RegisterResponse {
  access: string;
  refresh: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp_code: string;
}

export interface VerifyOtpResponse {
  verification_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}
