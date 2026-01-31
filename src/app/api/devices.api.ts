import client from './client';
import { Device, PaginatedDevices, CreateDeviceRequest, UpdateDeviceRequest, DeviceCommissionStatus, DeviceGroupInfo } from '@/app/types/api/Devices.types';

// Devices API endpoints

/**
 * Get device group info
 * Endpoint: GET /devices/:id/group_info/
 */
export const getDeviceGroupInfo = async (id: string): Promise<DeviceGroupInfo> => {
  const response = await client.get<DeviceGroupInfo>(`/devices/${id}/group_info/`);
  return response.data;
};

/**
 * Get list of all devices
 * Endpoint: GET /devices/
 */
export const getDevices = async (params?: { 
  site?: number | string;
  role?: string;
  status?: string;
  page?: number;
  search?: string;
}): Promise<PaginatedDevices> => {
  const response = await client.get<PaginatedDevices>('/devices/', { params });
  return response.data;
};

/**
 * Get details for a specific device
 * Endpoint: GET /devices/:id/
 */
export const getDeviceDetails = async (id: string): Promise<Device> => {
  const response = await client.get<Device>(`/devices/${id}/`);
  return response.data;
};

/**
 * Create a new device
 * Endpoint: POST /devices/
 */
export const createDevice = async (data: CreateDeviceRequest): Promise<Device> => {
  const response = await client.post<Device>('/devices/', data);
  return response.data;
};

/**
 * Update a device
 * Endpoint: PUT /devices/:id/
 */
export const updateDevice = async (id: string, data: UpdateDeviceRequest): Promise<Device> => {
  const response = await client.put<Device>(`/devices/${id}/`, data);
  return response.data;
};

/**
 * Delete a device
 * Endpoint: DELETE /devices/:id/
 */
export const deleteDevice = async (id: string): Promise<void> => {
  await client.delete(`/devices/${id}/`);
};
