// Mock data for the Greenarms platform

export interface Plant {
  id: string;
  name: string;
  timezone: string;
  tariff_zone: string | null;
  created_at: string;
}

export interface Device {
  id: string;
  plant_id: string;
  name: string;
  serial_number: string;
  status: "active" | "inactive";
  role: "master" | "slave" | "standalone";
  master_device_id: string | null;
  firmware_version: string | null;
  sdk_device_id: string | null;
  last_seen_at: string | null;
  decision: "CHARGING" | "DISCHARGING" | "NEUTRAL" | "UNKNOWN" | null;
  effective_status: "CHARGING" | "DISCHARGING" | "NEUTRAL" | "UNKNOWN" | null;
  power_kw: number | null;
  soc_percent: number | null;
  commissioning_status: "pending" | "discovering" | "verifying" | "testing" | "registered" | "failed" | null;
  commissioned_at: string | null;
}

export interface Alarm {
  id: string;
  device_id: string;
  code: string;
  category: "comms" | "telemetry" | "safety" | "dispatch" | "device" | "security";
  severity: "info" | "warning" | "error" | "critical";
  status: "open" | "acknowledged" | "resolved" | "suppressed";
  occurrences: number;
  first_seen: string;
  last_seen: string;
  message: string;
}

export interface Price {
  id: string;
  effective_at: string;
  plant_id: string | null;
  device_id: string | null;
  scope: "device" | "plant" | "country-wide";
  price: number;
  currency: string;
  source: "manual" | "schedule_generator" | "api_import" | "csv_import";
  status: "pending" | "dispatched";
}

export interface Schedule {
  id: string;
  effective_date: string;
  scope_type: "global" | "plant" | "device";
  plant_id: string | null;
  device_id: string | null;
  timezone: string;
  version: number;
  is_active: boolean;
  status: "draft" | "validated" | "dispatched";
  completeness: number; // 0-96
}

export interface DispatchLog {
  id: string;
  timestamp: string;
  plant_id: string;
  device_id: string;
  price: number | null;
  result: "success" | "failed";
  acknowledged: boolean;
  error: string | null;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  ip_address: string;
}

// Mock Plants
export const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Brooklyn Solar Farm",
    timezone: "America/New_York",
    tariff_zone: "NYISO-ZONE-A",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Austin Battery Hub",
    timezone: "America/Chicago",
    tariff_zone: "ERCOT-HOUSTON",
    created_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "3",
    name: "Phoenix Energy Center",
    timezone: "America/Phoenix",
    tariff_zone: null,
    created_at: "2025-01-10T00:00:00Z",
  },
];

// Mock Devices
export const mockDevices: Device[] = [
  {
    id: "1",
    plant_id: "1",
    name: "BKN-INV-001",
    serial_number: "SN001234567",
    status: "active",
    role: "master",
    master_device_id: null,
    firmware_version: "v2.1.3",
    sdk_device_id: "sdk-001",
    last_seen_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    decision: "CHARGING",
    effective_status: "CHARGING",
    power_kw: 150.5,
    soc_percent: 65,
    commissioning_status: "registered",
    commissioned_at: "2025-01-02T10:00:00Z",
  },
  {
    id: "2",
    plant_id: "1",
    name: "BKN-INV-002",
    serial_number: "SN001234568",
    status: "active",
    role: "slave",
    master_device_id: "1",
    firmware_version: "v2.1.3",
    sdk_device_id: "sdk-002",
    last_seen_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    decision: null,
    effective_status: "CHARGING",
    power_kw: 145.2,
    soc_percent: 62,
    commissioning_status: "registered",
    commissioned_at: "2025-01-02T10:30:00Z",
  },
  {
    id: "4",
    plant_id: "1",
    name: "BKN-INV-003",
    serial_number: "SN001234569",
    status: "active",
    role: "slave",
    master_device_id: "1",
    firmware_version: "v2.1.3",
    sdk_device_id: "sdk-003",
    last_seen_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    decision: null,
    effective_status: "CHARGING",
    power_kw: 148.0,
    soc_percent: 63,
    commissioning_status: "registered",
    commissioned_at: "2025-01-03T09:00:00Z",
  },
  {
    id: "5",
    plant_id: "1",
    name: "BKN-INV-004",
    serial_number: "SN001234570",
    status: "inactive",
    role: "slave",
    master_device_id: "1",
    firmware_version: "v2.1.0",
    sdk_device_id: "sdk-004",
    last_seen_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    decision: null,
    effective_status: "NEUTRAL",
    power_kw: 0,
    soc_percent: 0,
    commissioning_status: "registered",
    commissioned_at: "2025-01-04T11:00:00Z",
  },
  {
    id: "6",
    plant_id: "1",
    name: "BKN-BAT-001",
    serial_number: "SN001234999",
    status: "active",
    role: "standalone",
    master_device_id: null,
    firmware_version: "v1.0.5",
    sdk_device_id: "sdk-005",
    last_seen_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    decision: "DISCHARGING",
    effective_status: "DISCHARGING",
    power_kw: 50.0,
    soc_percent: 85,
    commissioning_status: "registered",
    commissioned_at: "2025-01-05T14:00:00Z",
  },
  {
    id: "3",
    plant_id: "1",
    name: "BKN-INV-003",
    serial_number: "SN001234569",
    status: "active",
    role: "standalone",
    master_device_id: null,
    firmware_version: "v2.0.5",
    sdk_device_id: "sdk-003",
    last_seen_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    decision: "NEUTRAL",
    effective_status: "NEUTRAL",
    power_kw: 0,
    soc_percent: 80,
    commissioning_status: "registered",
    commissioned_at: "2025-01-03T09:00:00Z",
  },
  {
    id: "4",
    plant_id: "2",
    name: "AUS-INV-001",
    serial_number: "SN002345678",
    status: "active",
    role: "master",
    master_device_id: null,
    firmware_version: "v2.2.0",
    sdk_device_id: "sdk-004",
    last_seen_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    decision: "DISCHARGING",
    effective_status: "DISCHARGING",
    power_kw: -200.8,
    soc_percent: 55,
    commissioning_status: "registered",
    commissioned_at: "2025-01-06T08:00:00Z",
  },
  {
    id: "5",
    plant_id: "2",
    name: "AUS-INV-002",
    serial_number: "SN002345679",
    status: "inactive",
    role: "slave",
    master_device_id: "4",
    firmware_version: "v2.2.0",
    sdk_device_id: null,
    last_seen_at: null,
    decision: null,
    effective_status: "DISCHARGING",
    power_kw: null,
    soc_percent: null,
    commissioning_status: "pending",
    commissioned_at: null,
  },
  {
    id: "6",
    plant_id: "3",
    name: "PHX-INV-001",
    serial_number: "SN003456789",
    status: "active",
    role: "standalone",
    master_device_id: null,
    firmware_version: "v2.1.8",
    sdk_device_id: "sdk-006",
    last_seen_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    decision: "CHARGING",
    effective_status: "CHARGING",
    power_kw: 175.3,
    soc_percent: 70,
    commissioning_status: "registered",
    commissioned_at: "2025-01-11T12:00:00Z",
  },
];

// Mock Alarms
export const mockAlarms: Alarm[] = [
  {
    id: "1",
    device_id: "3",
    code: "OFFLINE",
    category: "comms",
    severity: "error",
    status: "open",
    occurrences: 3,
    first_seen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    last_seen: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    message: "Device has not reported telemetry for over 30 minutes",
  },
  {
    id: "2",
    device_id: "5",
    code: "DEVICE_FAULT",
    category: "device",
    severity: "critical",
    status: "open",
    occurrences: 1,
    first_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    message: "Internal device fault detected",
  },
  {
    id: "3",
    device_id: "6",
    code: "SOC_LOW",
    category: "telemetry",
    severity: "warning",
    status: "acknowledged",
    occurrences: 5,
    first_seen: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    message: "State of charge below threshold",
  },
];

// Mock Prices
export const mockPrices: Price[] = [
  {
    id: "1",
    effective_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    plant_id: "1",
    device_id: null,
    scope: "plant",
    price: 0.15,
    currency: "USD",
    source: "manual",
    status: "pending",
  },
  {
    id: "2",
    effective_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    plant_id: null,
    device_id: null,
    scope: "country-wide",
    price: 0.12,
    currency: "USD",
    source: "schedule_generator",
    status: "dispatched",
  },
  {
    id: "3",
    effective_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    plant_id: "2",
    device_id: "4",
    scope: "device",
    price: 0.18,
    currency: "USD",
    source: "api_import",
    status: "pending",
  },
];

// Mock Schedules
export const mockSchedules: Schedule[] = [
  {
    id: "1",
    effective_date: "2026-01-21",
    scope_type: "global",
    plant_id: null,
    device_id: null,
    timezone: "UTC",
    version: 1,
    is_active: true,
    status: "validated",
    completeness: 96,
  },
  {
    id: "2",
    effective_date: "2026-01-22",
    scope_type: "plant",
    plant_id: "1",
    device_id: null,
    timezone: "America/New_York",
    version: 1,
    is_active: false,
    status: "draft",
    completeness: 72,
  },
  {
    id: "3",
    effective_date: "2026-01-21",
    scope_type: "device",
    plant_id: "2",
    device_id: "4",
    timezone: "America/Chicago",
    version: 2,
    is_active: true,
    status: "dispatched",
    completeness: 96,
  },
];

// Mock Dispatch Logs
export const mockDispatchLogs: DispatchLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    plant_id: "1",
    device_id: "1",
    price: 0.15,
    result: "success",
    acknowledged: true,
    error: null,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    plant_id: "2",
    device_id: "4",
    price: 0.12,
    result: "success",
    acknowledged: true,
    error: null,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    plant_id: "1",
    device_id: "3",
    price: null,
    result: "failed",
    acknowledged: false,
    error: "Network timeout",
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    user: "admin@greenarms.com",
    action: "Manual Dispatch",
    description: "Applied CHARGING decision to device BKN-INV-001",
    ip_address: "192.168.1.100",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: "admin@greenarms.com",
    action: "Plant Created",
    description: "Created plant: Phoenix Energy Center",
    ip_address: "192.168.1.100",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: "operator@greenarms.com",
    action: "Login",
    description: "User logged in successfully",
    ip_address: "192.168.1.105",
  },
];
