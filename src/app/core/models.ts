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
  name_source: 'mdns' | 'dhcp' | 'reverse_dns' | null;
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
  reviewStatus?: Device['review_status'];
  silenceHours?: number;
}

export interface PresenceSnapshot {
  timestamp: string;
  online_count: number;
  device_count: number;
}
