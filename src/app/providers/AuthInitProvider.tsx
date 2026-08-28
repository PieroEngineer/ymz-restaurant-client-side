import { useEffect, type ReactNode } from 'react';
import { Amplify } from 'aws-amplify';

/**
 * Initializes AWS Amplify JS v6 with Cognito User Pool details.
 * Reads environment variables configured in Vite (.env / .env.local).
 */
const configureAmplify = (): void => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      },
    },
  });
};

interface Props {
  children: ReactNode;
}

export const AuthInitProvider = ({ children }: Props) => {
  useEffect(() => {
    // Configure Amplify once during app mount
    configureAmplify();
  }, []);

  return <>{children}</>;
};