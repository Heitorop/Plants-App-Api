export const parseTtlToMs = (ttl: string): number => {
  // If ttl is a number string, treat as seconds
  if (/^\d+$/.test(ttl)) {
    return parseInt(ttl, 10) * 1000;
  }
  // If ttl ends with 's', treat as seconds
  if (/^\d+s$/.test(ttl)) {
    return parseInt(ttl, 10) * 1000;
  }
  // If ttl ends with 'm', treat as minutes
  if (/^\d+m$/.test(ttl)) {
    return parseInt(ttl, 10) * 60 * 1000;
  }
  // If ttl ends with 'h', treat as hours
  if (/^\d+h$/.test(ttl)) {
    return parseInt(ttl, 10) * 60 * 60 * 1000;
  }
  // Default: 1 hour
  return 60 * 60 * 1000;
};
