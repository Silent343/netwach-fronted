import { Component, input, output } from '@angular/core';
import { Device, DeviceUpdate, ScanEvent } from '../../core/models';
import { DeviceCard } from '../device-card/device-card';

@Component({
  selector: 'app-device-list',
  imports: [DeviceCard],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css',
})
export class DeviceList {
  readonly devices = input.required<Device[]>();
  readonly events = input<ScanEvent[]>([]);
  readonly deviceUpdate = output<DeviceUpdate>();

  protected lastDisconnect(macAddress: string): string | null {
    return this.events().find((event) => event.mac_address === macAddress && event.event_type === 'offline')?.timestamp ?? null;
  }
}
