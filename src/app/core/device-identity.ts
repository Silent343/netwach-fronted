import { Device } from './models';

export function deviceType(device: Device): string {
  return device.type_override ?? device.device_type;
}

export function deviceVendor(device: Device): string | null {
  const vendor = device.vendor?.trim();
  return vendor && vendor.toLowerCase() !== device.mac_address.toLowerCase() ? vendor : null;
}

export function deviceName(device: Device): string {
  const type = deviceType(device);
  return device.alias || device.model_override || device.device_model
    || (type === 'mobile' ? null : device.hostname)
    || (type === 'router' ? 'Router de la red' : deviceVendor(device))
    || device.ip_address;
}
