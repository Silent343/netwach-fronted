import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ApiService } from './core/api.service';
import { LiveService } from './core/live.service';
import { Device, DeviceUpdate, PresenceSnapshot, ScanEvent } from './core/models';
import { DeviceList } from './features/device-list/device-list';
import { ActivityLog } from './features/activity-log/activity-log';
import { NetworkTopology } from './features/network-topology/network-topology';

type Tab = 'devices' | 'topology' | 'activity';

@Component({
  selector: 'app-root',
  imports: [DeviceList, NetworkTopology, ActivityLog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly live = inject(LiveService);

  protected readonly devices = signal<Device[]>([]);
  protected readonly events = signal<ScanEvent[]>([]);
  protected readonly presence = signal<PresenceSnapshot[]>([]);
  protected readonly activeTab = signal<Tab>('devices');

  protected readonly deviceCount = computed(() => this.devices().length);
  protected readonly onlineCount = computed(() => this.devices().filter((d) => d.is_online).length);
  protected readonly offlineCount = computed(() => this.devices().filter((d) => !d.is_online).length);
  protected readonly unconfirmedCount = computed(() => this.devices().filter((d) => d.review_status === 'pending').length);

  protected readonly statusLabel = computed(() => {
    switch (this.live.status()) {
      case 'open':
        return 'en vivo';
      case 'connecting':
        return 'conectando…';
      default:
        return 'sin conexión';
    }
  });

  constructor() {
    // Cada vez que el backend avisa que terminó un escaneo, refrescamos
    effect(() => {
      if (this.live.lastScan()) {
        this.refreshDevices();
        this.refreshEvents();
        this.refreshPresence();
      }
    });
  }

  ngOnInit(): void {
    this.live.connect();
    this.refreshDevices();
    this.refreshEvents();
    this.refreshPresence();
  }

  protected setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  protected onDeviceUpdate(update: DeviceUpdate): void {
    this.api
      .updateDevice(update.mac, {
        ...(update.alias !== undefined ? { alias: update.alias } : {}),
        ...(update.reviewStatus !== undefined ? { review_status: update.reviewStatus } : {}),
        ...(update.silenceHours !== undefined
          ? { silenced_until: new Date(Date.now() + update.silenceHours * 3_600_000).toISOString() }
          : {}),
      })
      .subscribe((updated) => {
        this.devices.update((list) => list.map((d) => (d.mac_address === updated.mac_address ? updated : d)));
      });
  }

  private refreshDevices(): void {
    this.api.getDevices().subscribe((devices) => this.devices.set(devices));
  }

  private refreshEvents(): void {
    this.api.getEvents(250).subscribe((events) => this.events.set(events));
  }

  private refreshPresence(): void {
    this.api.getPresenceHistory().subscribe((snapshots) => this.presence.set(snapshots));
  }
}
