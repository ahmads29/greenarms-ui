export interface CreateSiteRequest {
  name: string;
  country: string;
  state: string;
  timezone?: string;
  tariff_zone?: string;
  uses_dynamic_tariff?: boolean;
}

export interface Site {
  id: string;
  name: string;
  country: string;
  state: string;
  timezone: string;
  tariff_zone: string;
  uses_dynamic_tariff: boolean;
  device_count: number;
  created_at: string;
  updated_at: string;
}
