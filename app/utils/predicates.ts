import type { AssertExtract, AssertProperty } from "~/utils/types";

export function hasProperty<
  const T extends object,
  const K extends PropertyKey,
>(value: T, key: K): value is AssertProperty<T, K> {
  return key in value && value[key as unknown as keyof T] !== undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(input: unknown): input is Function {
  return typeof input === "function";
}

export function isRecordOrArray<const T>(
  input: T,
): input is AssertExtract<T, Record<PropertyKey, unknown> | Array<unknown>> {
  return typeof input === "object" && input !== null;
}

export function isArray<const T>(
  input: T,
): input is AssertExtract<T, ReadonlyArray<unknown>> {
  return Array.isArray(input);
}

export function isRecord<const T>(
  input: T,
): input is AssertExtract<T, Record<PropertyKey, unknown>> {
  return isRecordOrArray(input) && !isArray(input);
}

export function isObject<const T>(input: T): input is AssertExtract<T, object> {
  return isRecordOrArray(input) || isFunction(input);
}

export function isString<T>(input: T): input is AssertExtract<T, string> {
  return typeof input === "string";
}

export function isNumber<T>(input: T): input is AssertExtract<T, number> {
  return typeof input === "number";
}

export function isBoolean<T>(input: T): input is AssertExtract<T, boolean> {
  return typeof input === "boolean";
}
