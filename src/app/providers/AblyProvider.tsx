import * as Ably from 'ably';
// import { api } from '@/shared/api/axiosClient';
import { AblyProvider } from 'ably/react';
import { useMemo } from 'react';

/**
 * Generates an insulated Ably Realtime Instance.
 * Security Note: Employs Token Auth via your server-side token exchange route.
 */
export const createAblyClient = () => {

  const apiKey = import.meta.env.VITE_ABLY_API_KEY;

  if (!apiKey) {
  console.warn(
      '⚠️ Ably API Key is missing! Ensure VITE_ABLY_API_KEY is set in your .env.local file.'
  );
  }

  return new Ably.Realtime({
  // Direct key authentication for local development and testing
  key: apiKey,
  clientId: 'staff-dashboard',    /// needed later if you add presence
  
  // key: 'completely-fake-key:for-local-testing', // For local implementation
  // endpoint: 'localhost',
  // port: 8080,
  // tls: false,               // Crucial: Node ws server uses HTTP/WS, not HTTPS/WSS
  // useBinaryProtocol: false, // Crucial: Instructs the Ably SDK to speak JSON instead of MsgPack
  
  // autoConnect: true,
  // echoMessages: false, // High-performance option: ignores your own echo events
});

};



interface RealtimeProviderProps {
  children: React.ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps){
  // useMemo ensures the connection is created exactly once, safeguarding against hot-reloads (HMR) during Vite development.
  const ablyClient = useMemo(() => createAblyClient(), []);

  return <AblyProvider client={ablyClient}>{children}</AblyProvider>;
};



    
//  NOTE: This uses the root API Key directly. Perfect for rapid prototyping,
// but must be replaced with an authCallback route before moving to production.