import client from './client';
import { CreateSiteRequest, Site } from '@/app/types/api/Sites.types';

/**
 * Create a new site (plant)
 * Endpoint: POST /sites/
 */
export const createSite = async (data: CreateSiteRequest): Promise<Site> => {
  const response = await client.post<Site>('/sites/', data);
  return response.data;
};

/**
 * Get all sites
 * Endpoint: GET /sites/
 */
export const getSites = async (): Promise<Site[]> => {
  const response = await client.get<Site[]>('/sites/');
  return response.data;
};

/**
 * Get a single site
 * Endpoint: GET /sites/:id/
 */
export const getSite = async (id: string): Promise<Site> => {
  const response = await client.get<Site>(`/sites/${id}/`);
  return response.data;
};

/**
 * Update a site
 * Endpoint: PUT /sites/:id/
 */
export const updateSite = async (id: string, data: Partial<CreateSiteRequest>): Promise<Site> => {
  const response = await client.put<Site>(`/sites/${id}/`, data);
  return response.data;
};
