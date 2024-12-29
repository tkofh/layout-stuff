export interface SparseResponsiveMap<V> {
  readonly mobile: V;
  readonly tablet?: V | null | undefined;
  readonly laptop?: V | null | undefined;
  readonly desktop?: V | null | undefined;
}

export interface PartialResponsiveMap<V> {
  readonly mobile: V;
  readonly tablet: V | null;
  readonly laptop: V | null;
  readonly desktop: V | null;
}

export interface ResponsiveMap<V> {
  readonly mobile: V;
  readonly tablet: V;
  readonly laptop: V;
  readonly desktop: V;
}

export type BreakpointName = "mobile" | "tablet" | "laptop" | "desktop";
export type BreakpointsExcept<B extends BreakpointName> = Exclude<
  BreakpointName,
  B
>;
export type ResponsiveValue<V> = V | SparseResponsiveMap<V>;

export type PartialResponsiveMapWithKey<K extends string, V> = K extends unknown
  ? Omit<
      { [P in K]: V } & {
        [P in `${K}-${BreakpointsExcept<"mobile">}`]: V | null;
      },
      never
    >
  : never;

export type ResponsiveMapWithKey<K extends string, V> = K extends unknown
  ? { [P in K]: V } & {
      [P in `${K}-${BreakpointsExcept<"mobile">}`]: V;
    }
  : never;

export function isSparseResponsiveMap<V>(
  value: unknown,
): value is SparseResponsiveMap<V> {
  return isRecord(value) && hasProperty(value, "mobile");
}

export function normalizeResponsive<V>(
  input: ResponsiveValue<V>,
): PartialResponsiveMap<V> {
  if (isSparseResponsiveMap(input)) {
    return {
      mobile: input.mobile,
      tablet: input.tablet ?? null,
      laptop: input.laptop ?? null,
      desktop: input.desktop ?? null,
    };
  }

  return {
    mobile: input,
    tablet: null,
    laptop: null,
    desktop: null,
  };
}

export function fillResponsive<V>(
  input: PartialResponsiveMap<V> | ResponsiveMap<V>,
): ResponsiveMap<V> {
  return {
    mobile: input.mobile,
    tablet: input.tablet ?? input.mobile,
    laptop: input.laptop ?? input.tablet ?? input.mobile,
    desktop: input.desktop ?? input.laptop ?? input.tablet ?? input.mobile,
  };
}

export function compactResponsive<V>(
  input: PartialResponsiveMap<V> | ResponsiveMap<V>,
): PartialResponsiveMap<V> {
  return {
    mobile: input.mobile,
    tablet: input.tablet === input.mobile ? null : input.tablet,
    laptop: input.laptop === input.tablet ? null : input.laptop,
    desktop: input.desktop === input.laptop ? null : input.desktop,
  };
}

export function responsiveToAttributes<const K extends string, V>(
  key: K,
  input: PartialResponsiveMap<V>,
): PartialResponsiveMapWithKey<K, V>;
export function responsiveToAttributes<const K extends string, V>(
  key: K,
  input: ResponsiveMap<V>,
): ResponsiveMapWithKey<K, V>;
export function responsiveToAttributes<V>(
  key: string,
  input: PartialResponsiveMap<V> | ResponsiveMap<V>,
) {
  return {
    [key]: input.mobile,
    [`${key}-tablet`]: input.tablet,
    [`${key}-laptop`]: input.laptop,
    [`${key}-desktop`]: input.desktop,
  };
}

type ValueMapper<V> = (value: V, key: BreakpointName) => unknown;

export function mapResponsive<V, M extends ValueMapper<NoInfer<V>>>(
  input: PartialResponsiveMap<V>,
  mapper: M,
): PartialResponsiveMap<ReturnType<M>>;
export function mapResponsive<V, M extends ValueMapper<NoInfer<V>>>(
  input: ResponsiveMap<V>,
  mapper: M,
): ResponsiveMap<ReturnType<M>>;
export function mapResponsive<V>(
  input: PartialResponsiveMap<V> | ResponsiveMap<V>,
  mapper: ValueMapper<V>,
) {
  return {
    mobile: mapper(input.mobile, "mobile"),
    tablet: input.tablet === null ? null : mapper(input.tablet, "tablet"),
    laptop: input.laptop === null ? null : mapper(input.laptop, "laptop"),
    desktop: input.desktop === null ? null : mapper(input.desktop, "desktop"),
  };
}
