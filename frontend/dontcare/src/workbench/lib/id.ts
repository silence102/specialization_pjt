export function createId(prefix: string): string {
  // crypto.randomUUID가 있으면 사용
  if ('randomUUID' in crypto && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  const rand = Math.floor(Math.random() * 1e9)
    .toString(36)
    .padStart(6, '0');
  return `${prefix}_${Date.now()}_${rand}`;
}
