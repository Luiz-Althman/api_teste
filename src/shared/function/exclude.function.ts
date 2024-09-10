export function exclude<DataKeys, Key extends keyof DataKeys>(
  dataKeys: DataKeys,
  keys: Key[],
): Omit<DataKeys, Key> {
  const result = { ...dataKeys }; // Cria uma cópia do objeto
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
