import { Injectable, signal } from '@angular/core';

export type LiveStatus = 'connecting' | 'open' | 'closed';

export interface ScanCompletedMessage {
  type: 'scan_completed';
  device_count: number;
  devices: string[];
}

const WS_URL = 'ws://localhost:8000/ws/live';
const RECONNECT_DELAY_MS = 2000;

@Injectable({ providedIn: 'root' })
export class LiveService {
  readonly status = signal<LiveStatus>('connecting');
  readonly lastScan = signal<ScanCompletedMessage | null>(null);

  private socket?: WebSocket;

  connect(): void {
    this.socket = new WebSocket(WS_URL);
    this.status.set('connecting');

    this.socket.onopen = () => this.status.set('open');

    this.socket.onclose = () => {
      this.status.set('closed');
      setTimeout(() => this.connect(), RECONNECT_DELAY_MS);
    };

    this.socket.onerror = () => this.socket?.close();

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.type === 'scan_completed') {
          this.lastScan.set(data as ScanCompletedMessage);
        }
      } catch {
        // mensaje mal formado, lo ignoramos
      }
    };
  }
}
