export interface Device {
  id: string;
  site: string;
  site_name: string;
  name: string;
  serial_number: string;
  imei?: string;
  firmware_version?: string;
  sdk_device_id?: string;
  status: string;
  last_seen_at?: string;
  role: string;
  master_device?: string;
  master_device_name?: string;
  slave_count?: number;
  min_soc?: string;
  max_soc?: string;
  max_charge_power?: string;
  max_discharge_power?: string;
  max_charge_current?: string;
  max_discharge_current?: string;
  temperature_lockout_min?: string;
  temperature_lockout_max?: string;
  commissioning_status?: string;
  commissioning_error?: string;
  commissioned_at?: string;
  latest_decision?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface PaginatedDevices {
  count: number;
  next?: string;
  previous?: string;
  results: Device[];
}

export interface CreateDeviceRequest {
  site: string;
  name: string;
  serial_number: string;
  role: string;
  status: string;
}

export interface UpdateDeviceRequest extends Partial<Device> {}
