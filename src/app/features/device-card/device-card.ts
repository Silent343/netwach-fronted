import { Component, input, output, signal } from '@angular/core';
import { Device, DeviceUpdate } from '../../core/models';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.html',
  styleUrl: './device-card.css',
})
export class DeviceCard {
  readonly device = input.required<Device>();
  readonly lastDisconnect = input<string | null>(null);
  readonly update = output<DeviceUpdate>();

  protected readonly editingAlias = signal(false);
  protected readonly aliasDraft = signal('');

  protected startEditAlias(): void {
    this.aliasDraft.set(this.device().alias ?? '');
    this.editingAlias.set(true);
  }

  protected saveAlias(): void {
    this.update.emit({ mac: this.device().mac_address, alias: this.aliasDraft().trim() || null });
    this.editingAlias.set(false);
  }

  protected cancelEdit(): void {
    this.editingAlias.set(false);
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
    return {
      router: 'router', printer: 'impresora', tv: 'TV', mobile: 'móvil', computer: 'computadora',
      speaker: 'altavoz', camera: 'cámara', iot: 'IoT', unknown: 'dispositivo',
    }[type] ?? ' - ';
  }

  protected modelLabel(): string {
    const device = this.device();
    return device.alias || device.hostname || ` ${device.mac_address.slice(-8)}`;
  }
  


  protected isSilenced(): boolean {
    const until = this.device().silenced_until;
    return !!until && new Date(until).getTime() > Date.now();
  }

  protected onAliasInput(event: Event): void {
    this.aliasDraft.set((event.target as HTMLInputElement).value);
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
