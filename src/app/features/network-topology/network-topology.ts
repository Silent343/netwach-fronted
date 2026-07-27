import { Component, computed, input } from '@angular/core';
import { Device } from '../../core/models';

interface TopologyNode {
  device: Device;
  x: number;
  y: number;
}

@Component({
  selector: 'app-network-topology',
  templateUrl: './network-topology.html',
  styleUrl: './network-topology.css',
})
export class NetworkTopology {
  readonly devices = input.required<Device[]>();

  protected readonly nodes = computed<TopologyNode[]>(() => {
    const devices = this.devices();
    const total = devices.length;
    if (!total) return [];

    return devices.map((device, index) => {
      const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
      // Una elipse aprovecha mejor el ancho disponible que un círculo rígido.
      return {
        device,
        x: 500 + Math.cos(angle) * 340,
        y: 290 + Math.sin(angle) * 190,
      };
    });
  });

  protected readonly onlineCount = computed(() => this.devices().filter((d) => d.is_online).length);

  protected label(device: Device): string {
    return device.alias || device.hostname || device.vendor || device.ip_address;
  }

  protected title(device: Device): string {
    const state = device.is_online ? 'online' : 'desconectado';
    return `${this.label(device)} — ${device.ip_address} — ${state}`;
  }

}
