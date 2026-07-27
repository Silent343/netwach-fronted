import { Component, computed, input, signal } from '@angular/core';
import { PresenceSnapshot, ScanEvent } from '../../core/models';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.html',
  styleUrl: './activity-log.css',
})
export class ActivityLog {
  readonly events = input.required<ScanEvent[]>();
  readonly presence = input.required<PresenceSnapshot[]>();
  protected readonly search = signal('');
  protected readonly eventFilter = signal('all');
  protected readonly filteredEvents = computed(() => {
    const search = this.search().trim().toLowerCase();
    const type = this.eventFilter();
    return this.events().filter((event) =>
      (type === 'all' || event.event_type === type)
      && (!search || event.mac_address.toLowerCase().includes(search) || (event.details ?? '').toLowerCase().includes(search))
    );
  });

  protected label(type: string): string {
    switch (type) {
      case 'new_device':
        return 'dispositivo nuevo';
      case 'offline':
        return 'dispositivo desconectado';
      case 'reconnected':
        return 'dispositivo reconectado';
      case 'ip_changed':
        return 'IP actualizada';
      default:
        return type;
    }
  }

  protected formatTime(iso: string): string {
    return new Date(iso).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected onTypeFilter(event: Event): void {
    this.eventFilter.set((event.target as HTMLSelectElement).value);
  }

  protected barHeight(snapshot: PresenceSnapshot): number {
    return snapshot.device_count ? Math.max(6, (snapshot.online_count / snapshot.device_count) * 100) : 0;
  }
}
