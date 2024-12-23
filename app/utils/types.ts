type StrictRequireKey<T extends object, K extends keyof T> = {
  [P in keyof T & K]-?: Exclude<T[P], undefined>;
} & Omit<T, K>;

type StrictPick<T extends object, K extends PropertyKey> = T extends unknown
  ? K extends keyof T
    ? keyof T extends never
      ? never
      : StrictRequireKey<T, K>
    : never
  : never;

type EntryPairs<O extends object> = {
  [K in keyof O]: [K, O[K]];
}[keyof O];

type NonDistributiveIdentity<T> = Omit<T, never>;

type Identity<T> = T extends unknown ? NonDistributiveIdentity<T> : never;

export type AssertProperty<T extends object, K extends PropertyKey> = Identity<
  [unknown] extends [T]
    ? T & Record<K, unknown>
    : [PropertyKey] extends [keyof T]
      ? T & Record<K, unknown>
      : PropertyKey extends keyof T
        ? never
        : StrictPick<T, K>
>;

export type AssertExtract<T, U> = [unknown] extends [T]
  ? T & U
  : unknown extends T
    ? never
    : Extract<T, U>;

export type Arrayable<T> = T | ReadonlyArray<T>;

export type ValuesOfSet<T> = T extends Set<infer V> ? V : never;

export type Keys<O extends object> = O extends unknown ? keyof O : never;
export type Values<O extends object> = O extends unknown ? O[keyof O] : never;

export type Entries<O extends object> = O extends unknown
  ? EntryPairs<O>
  : never;
