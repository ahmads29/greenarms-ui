import client from './client';
import { PaginatedDeviceStatuses } from '@/app/types/api/Status.types';

/**
 * Get device statuses
 * Endpoint: GET /status/
 */
export const getDeviceStatuses = async (params?: { page?: number }): Promise<PaginatedDeviceStatuses> => {
  const response = await client.get<PaginatedDeviceStatuses>('/status/', { params });
  return response.data;
};
