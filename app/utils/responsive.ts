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

export interface MutableResponsiveMap<V> {
  mobile: V;
  tablet: V;
  laptop: V;
  desktop: V;
}

export type BreakpointName = "mobile" | "tablet" | "laptop" | "desktop";
export type BreakpointsExcept<B extends BreakpointName> = Exclude<
  BreakpointName,
  B
>;
export type ResponsiveValue<V> = V | SparseResponsiveMap<V>;

export type ExtractResponsiveValue<
  V extends PartialResponsiveMap<unknown> | ResponsiveValue<unknown>,
> =
  V extends PartialResponsiveMap<infer T>
    ? T
    : V extends SparseResponsiveMap<infer T>
      ? T
      : V;

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

export const breakpoints = new Set([
  "mobile",
  "tablet",
  "laptop",
  "desktop",
] as const);

export function smallerBreakpoint(
  a: BreakpointName,
  b: BreakpointName,
): BreakpointName {
  if (a === "mobile" || b === "mobile") {
    return "mobile";
  }

  if (a === "tablet" || b === "tablet") {
    return "tablet";
  }

  if (a === "laptop" || b === "laptop") {
    return "laptop";
  }

  return "desktop";
}

export function isSparseResponsiveMap<V>(
  value: unknown,
): value is SparseResponsiveMap<V> {
  return isRecord(value) && hasProperty(value, "mobile");
}

export function normalizeResponsive<const V extends ResponsiveValue<unknown>>(
  input: V,
): PartialResponsiveMap<ExtractResponsiveValue<V>> {
  if (isSparseResponsiveMap(input)) {
    return {
      mobile: input.mobile,
      tablet:
        input.tablet == null || input.tablet === input.mobile
          ? null
          : input.tablet,
      laptop:
        input.laptop == null || input.laptop === input.tablet
          ? null
          : input.laptop,
      desktop:
        input.desktop == null || input.desktop === input.laptop
          ? null
          : input.desktop,
    } as never;
  }

  return {
    mobile: input,
    tablet: null,
    laptop: null,
    desktop: null,
  } as never;
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
  input: ResponsiveMap<V>,
): ResponsiveMapWithKey<K, V>;
export function responsiveToAttributes<const K extends string, V>(
  key: K,
  input: PartialResponsiveMap<V>,
): PartialResponsiveMapWithKey<K, V>;
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

type ValueMapper<V extends PartialResponsiveMap<unknown>> = (
  value: ExtractResponsiveValue<V>,
  key: BreakpointName,
) => unknown;

export function mapResponsive<
  V extends ResponsiveMap<unknown>,
  M extends ValueMapper<V>,
>(input: V, mapper: M): ResponsiveMap<ReturnType<M>>;
export function mapResponsive<
  V extends PartialResponsiveMap<unknown>,
  M extends ValueMapper<V>,
>(input: V, mapper: M): PartialResponsiveMap<ReturnType<M>>;
export function mapResponsive<V>(
  input: PartialResponsiveMap<V>,
  mapper: ValueMapper<PartialResponsiveMap<V>>,
) {
  return {
    mobile: mapper(input.mobile as Exclude<V, null>, "mobile"),
    tablet:
      input.tablet === null
        ? null
        : mapper(input.tablet as Exclude<V, null>, "tablet"),
    laptop:
      input.laptop === null
        ? null
        : mapper(input.laptop as Exclude<V, null>, "laptop"),
    desktop:
      input.desktop === null
        ? null
        : mapper(input.desktop as Exclude<V, null>, "desktop"),
  };
}
