import type { AuthUser, SignInPayload, SignUpPayload } from '@/features/auth/types/auth.types';
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';
// import type { SignUpPayload, SignInPayload, AuthUser } from '../types/auth.types';

export const authService = {
  /**
   * Registers a new user in Cognito with email and attributes.
   */
  async signUp(payload: SignUpPayload): Promise<boolean> {
    const { isSignUpComplete } = await signUp({
      username: payload.email, // Using email as main Cognito identifier
      password: payload.password,
      options: {
        userAttributes: {
          email: payload.email,
          // preferred_username: payload.username,
        //   ...(payload.phoneNumber && { phone_number: payload.phoneNumber }),
        },
      },
    });

    return isSignUpComplete;
  },

  /**
   * Authenticates user and issues JWT tokens to local browser storage.
   */
  async signIn(payload: SignInPayload): Promise<void> {
    await signIn({
      username: payload.email,
      password: payload.password,
    });
  },

  /**
   * Clears tokens from browser storage and invalidates session.
   */
  async signOut(): Promise<void> {
    await signOut();
  },

  /**
   * Retrieves active session details and identity profile.
   */
  async getCurrentUserProfile(): Promise<AuthUser | null> {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      return {
        userId: user.userId,
        // username: user.username,
        email: attributes.email,
      };
    } catch {
      // User is unauthenticated / Session expired
      return null;
    }
  },

  /**
   * Synchronously or asynchronously fetches current JWT ID Token for API calls.
   */
  async getIdToken(): Promise<string | undefined> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString();
    } catch {
      return undefined;
    }
  },
};