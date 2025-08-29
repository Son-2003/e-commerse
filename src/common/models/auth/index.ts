export interface JWTAuthResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
  tokenType: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface SignInRequest {
  emailOrPhone: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  image: string;
}