import client from './client';
import { Plant, PlantSummary } from '@/app/types/api/Plant.types';

// Plants API endpoints (Placeholders)

/**
 * Get list of all plants
 * Real endpoint: GET /plants
 */
export const getPlants = async (): Promise<PlantSummary[]> => {
  throw new Error("Plants API not implemented yet");
  // return client.get('/plants');
};

/**
 * Get details for a specific plant
 * Real endpoint: GET /plants/:id
 */
export const getPlantDetails = async (id: string): Promise<Plant> => {
  throw new Error("Plants API not implemented yet");
  // return client.get(`/plants/${id}`);
};
