export function useDataString(
  data: MaybeRefOrGetter<Record<string | number, boolean>>,
) {
  return computed(() => {
    let result = "";
    const value = toValue(data);
    for (const key in value) {
      if (value[key]) {
        result += ` ${key}`;
      }
    }

    return result.slice(1);
  });
}
