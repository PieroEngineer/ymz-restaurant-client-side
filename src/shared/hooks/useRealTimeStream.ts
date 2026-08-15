import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface StreamConfig {
  channel: string;
  eventKey: string;
  queryKey: unknown[];
}

export function useRealTimeStream({ channel, eventKey, queryKey }: StreamConfig) {  // TODO: Unnused?
  const queryClient = useQueryClient();

  useEffect(() => {
    // Points to your local mock SSE script server endpoint
    const mockSseUrl = import.meta.env.VITE_MOCK_SSE_URL || 'http://localhost:4000/stream';
    
    // Connect to the stream
    const eventSource = new EventSource(`${mockSseUrl}?channel=${channel}`);

    // Listen for incoming real-time server updates
    eventSource.addEventListener(eventKey, (event) => {
      try {
        const freshData = JSON.parse(event.data);
        
        // Dynamically inject the streaming data straight into TanStack's client cache
        queryClient.setQueryData(queryKey, freshData);
        
      } catch (error) {
        console.error('❌ Failed parsing stream payload:', error);
      }
    });

    eventSource.onerror = (err) => {
      console.warn('📡 Live stream interrupted. Reconnecting automatically...', err);
    };

    // Clean up the network connection socket when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [channel, eventKey, queryKey, queryClient]);
}