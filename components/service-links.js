export const serviceId = name => `service-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
