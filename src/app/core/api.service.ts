import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device, PresenceSnapshot, ScanEvent } from './models';

// Ajusta esto cuando despliegues el backend en otro host (ej. Tailscale).
const API_BASE_URL = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  getDevices() {
    return this.http.get<Device[]>(`${API_BASE_URL}/devices`);
  }

  getEvents(limit = 50) {
    return this.http.get<ScanEvent[]>(`${API_BASE_URL}/events`, { params: { limit } });
  }

  getPresenceHistory(limit = 48) {
    return this.http.get<PresenceSnapshot[]>(`${API_BASE_URL}/analytics/presence`, { params: { limit } });
  }

  updateDevice(mac: string, payload: {
    alias?: string | null;
    review_status?: Device['review_status'];
    silenced_until?: string | null;
  }) {
    return this.http.patch<Device>(`${API_BASE_URL}/devices/${mac}`, payload);
  }
}
