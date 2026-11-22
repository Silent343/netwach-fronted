import { Component, input, output, signal } from '@angular/core';
import { deviceName, deviceType, deviceVendor } from '../../core/device-identity';
import { Device, deviceTypes, DeviceType, DeviceUpdate } from '../../core/models';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.html',
  styleUrl: './device-card.css',
})
export class DeviceCard {
  readonly device = input.required<Device>();
  readonly lastDisconnect = input<string | null>(null);
  readonly update = output<DeviceUpdate>();

  protected readonly editing = signal(false);
  protected readonly name = deviceName;
  protected readonly type = deviceType;
  protected readonly vendor = deviceVendor;
  protected readonly typeOptions = Object.entries(deviceTypes);

  protected saveIdentity(event: SubmitEvent, alias: string, model: string, type: string): void {
    event.preventDefault();
    this.update.emit({
      mac: this.device().mac_address,
      alias: alias.trim() || null,
      modelOverride: model.trim() || null,
      typeOverride: (type || null) as DeviceType | null,
    });
    this.editing.set(false);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  protected toggleTrusted(): void {
    this.update.emit({
      mac: this.device().mac_address,
      reviewStatus: this.device().review_status === 'trusted' ? 'pending' : 'trusted',
    });
  }

  protected setReviewStatus(reviewStatus: Device['review_status']): void {
    this.update.emit({ mac: this.device().mac_address, reviewStatus });
  }

  protected silence(): void {
    this.update.emit({ mac: this.device().mac_address, silenceHours: 24 });
  }

  protected typeLabel(type: string): string {
    return deviceTypes[type as DeviceType] ?? 'Dispositivo';
  }

  protected model(): string | null {
    return this.device().model_override || this.device().device_model || null;
  }

  protected nameSourceLabel(): string {
    const source = this.device().name_source;
    if (source) {
      return { upnp: 'UPnP', mdns: 'mDNS', dhcp: 'DHCP', reverse_dns: 'DNS inverso', local: 'Equipo local' }[source];
    }
    return this.vendor(this.device()) ? 'Fabricante (MAC)' : 'MAC';
  }

  protected isSilenced(): boolean {
    const until = this.device().silenced_until;
    return !!until && new Date(until).getTime() > Date.now();
  }

  protected relativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'justo ahora';
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `hace ${days} d`;
  }
}
