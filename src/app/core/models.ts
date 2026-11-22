export const deviceTypes = {
  laptop: 'Laptop',
  computer: 'Computadora',
  mobile: 'Celular',
  tv: 'TV',
  router: 'Router',
  printer: 'Impresora',
  speaker: 'Altavoz',
  camera: 'Cámara',
  iot: 'IoT',
} as const;

export type DeviceType = keyof typeof deviceTypes;

export interface Device {
  mac_address: string;
  ip_address: string;
  vendor: string | null;
  hostname: string | null;
  alias: string | null;
  is_trusted: boolean;
  is_online: boolean;
  review_status: 'pending' | 'trusted' | 'blocked';
  silenced_until: string | null;
  device_type: string;
  name_source: 'mdns' | 'dhcp' | 'reverse_dns' | 'local' | 'upnp' | null;
  device_model?: string | null;
  model_override?: string | null;
  type_override?: DeviceType | null;
  first_seen: string;
  last_seen: string;
}

export interface ScanEvent {
  id: number | null;
  mac_address: string;
  event_type: string;
  timestamp: string;
  details: string | null;
}

export interface DeviceUpdate {
  mac: string;
  alias?: string | null;
  modelOverride?: string | null;
  typeOverride?: DeviceType | null;
  reviewStatus?: Device['review_status'];
  silenceHours?: number;
}

export interface PresenceSnapshot {
  timestamp: string;
  online_count: number;
  device_count: number;
}
