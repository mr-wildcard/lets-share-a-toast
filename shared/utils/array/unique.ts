export function unique(value: unknown, index: number, self: unknown[]) {
  return self.indexOf(value) === index;
}
