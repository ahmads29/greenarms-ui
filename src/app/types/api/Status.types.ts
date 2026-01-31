export interface DeviceStatusTelemetry {
  soc: number;
  power_kw: number;
  voltage: number;
  current: number;
  temperature: number;
  faults: any[];
  last_price: number | null;
}

export interface DeviceStatus {
  id: string;
  device: string; // Device UUID
  device_name: string;
  device_serial: string;
  device_role: string;
  is_master: boolean;
  reported_at: string;
  decision: string;
  effective_status: string;
  telemetry: DeviceStatusTelemetry;
  created_at: string;
}

export interface PaginatedDeviceStatuses {
  count: number;
  next: string | null;
  previous: string | null;
  results: DeviceStatus[];
}
