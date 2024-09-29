export function mapOf<T extends { id: string }>(arr: T[]) {
  const map = new Map<string, T>();
  arr.forEach((el) => map.set(el.id, el));
  return map;
}
