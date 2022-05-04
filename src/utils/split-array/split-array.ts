
export function splitArray<T>(array: T[], chunkSize: number): T[][] {
  const result = [];
  let index = 0;

  if (chunkSize === 0) {
    return [];
  }

  while (index < array.length) {
    result.push(array.slice(index, (index += chunkSize)));
  }

  return result;
}