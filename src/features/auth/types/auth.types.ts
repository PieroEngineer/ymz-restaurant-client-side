export interface SignUpPayload {
  // username: string;
  email: string;
  password: string;
//   phoneNumber?: string;
}

export interface SignInPayload {
  email: string; // Used as the login identifier
  password: string;
}

export interface AuthUser {
  userId: string;
//   username: string;
  email?: string;
}