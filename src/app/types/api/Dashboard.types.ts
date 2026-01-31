export interface DashboardOverview {
  total_devices: number;
  active_devices: number;
  master_devices: number;
  slave_devices: number;
  standalone_devices: number;
  device_groups: number;
  last_dispatch_time: string | null;
  last_status_update_time: string | null;
  recent_errors_24h: number;
  recent_errors_7d: number;
  has_devices: boolean;
  data_freshness: string;
}

// Keep existing types if any (though file didn't exist)
export interface DashboardMetrics {
  // Placeholder based on dashboard.api.ts usage
  [key: string]: any;
}

export interface PowerFlowData {
  // Placeholder based on dashboard.api.ts usage
  [key: string]: any;
}
