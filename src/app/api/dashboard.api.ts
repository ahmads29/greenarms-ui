import client from './client';
import { DashboardMetrics, PowerFlowData } from '@/app/types/api/Dashboard.types';

// Dashboard API endpoints (Placeholders)

/**
 * Get overview metrics for the dashboard
 * Real endpoint: GET /dashboard/metrics
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  throw new Error("Dashboard API not implemented yet");
  // return client.get('/dashboard/metrics');
};

/**
 * Get real-time power flow data
 * Real endpoint: GET /dashboard/power-flow
 */
export const getPowerFlow = async (): Promise<PowerFlowData> => {
  throw new Error("Dashboard API not implemented yet");
  // return client.get('/dashboard/power-flow');
};
