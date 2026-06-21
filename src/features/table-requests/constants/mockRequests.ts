import { type TableRequest } from '@/features/table-requests/types';

export const MOCK_TABLE_REQUESTS: TableRequest[] = [
  {
    id: 'req-1',
    title: 'Mesa 4',
    type: 'QUEUED',
    createdAt: new Date().toISOString(),
    referenceTimeMinutes: 3,
    info: [
      { label: 'People', value: '1' },
      { label: 'Expected arrival', value: '7 min' },
      { label: 'Distance', value: '4 km' }
    ],
    statusText: 'Waiting for the customer'
  },
  {
    id: 'req-2',
    title: 'Mesa 12',
    type: 'QUEUED',
    createdAt: new Date().toISOString(),
    referenceTimeMinutes: 5,
    info: [
      { label: 'People', value: '4' },
      { label: 'Expected arrival', value: '12 min' },
      { label: 'Distance', value: '1.2 km' },
      { label: 'Notes', value: 'Requires high chair' } // Extra field to show dynamic height resilience
    ],
    statusText: 'Waiting for the customer'
  },
  {
    id: 'req-3',
    title: 'Terraza 2',
    type: 'QUEUED',
    createdAt: new Date().toISOString(),
    referenceTimeMinutes: 1,
    info: [
      { label: 'People', value: '2' },
      { label: 'Expected arrival', value: '5 min' },
      { label: 'Distance', value: '800 m' }
    ],
    statusText: 'Waiting for the customer'
  }
];