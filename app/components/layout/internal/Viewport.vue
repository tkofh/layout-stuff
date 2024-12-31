<script lang="ts">
import type { MaybeComputedElementRef } from "@vueuse/core";
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";
import type { MaybeRefOrGetter } from "vue";

export type ScrollDirection = "vertical" | "horizontal";

const SCROLL_DIRECTION = Symbol.for("layout.scroll.direction") as InjectionKey<
  MaybeRefOrGetter<ScrollDirection>
>;

export function provideScrollDirection(
  direction: MaybeRefOrGetter<ScrollDirection>,
) {
  provide(SCROLL_DIRECTION, direction);
}

export function useScrollDirection() {
  return inject(SCROLL_DIRECTION, "vertical");
}

const defaultViewports = new Set<MaybeComputedElementRef>(null);

const ALL_VIEWPORTS = Symbol.for("layout.viewport.all") as InjectionKey<
  Set<MaybeComputedElementRef>
>;

const NEAREST_VIEWPORT = Symbol.for(
  "layout.viewport.nearest",
) as InjectionKey<MaybeComputedElementRef>;

export function provideViewport(viewport: MaybeComputedElementRef) {
  const all = inject(ALL_VIEWPORTS, defaultViewports);

  provide(ALL_VIEWPORTS, all.union(new Set([viewport])));
  provide(NEAREST_VIEWPORT, viewport);
}

export function useAllViewports() {
  return inject(ALL_VIEWPORTS, defaultViewports);
}

export function useNearestViewport() {
  return inject(NEAREST_VIEWPORT, null);
}

export function useNearestViewportElement(): MaybeComputedElementRef {
  const nearest = useNearestViewport();

  if (nearest === null) {
    return () => (import.meta.client ? document.body : null);
  }
  return () =>
    unrefElement(nearest) ?? (import.meta.client ? document.body : null);
}

export type VisibilityProbeMode = "root" | "nearest" | "all";

export type DirectedVisibilityState =
  | "before-viewport"
  | "visible"
  | "after-viewport"
  | "disabled";
export type VisibilityState = "visible" | "invisible" | "disabled";

export interface UseVisibilityProbeOptions {
  enabled?: MaybeRefOrGetter<boolean>;
  margin?: number;
  threshold?: number;
}

function latestEntry(entries: IntersectionObserverEntry[]) {
  let entry;
  let time = 0;
  for (const e of entries) {
    if (e.time > time || !entry) {
      entry = e;
      time = entry.time;
    }
  }
  return entry;
}

function visibilityStateFromEntry(entry: IntersectionObserverEntry) {
  return entry.isIntersecting ? "visible" : "invisible";
}

function directionalVisibilityStateFromEntry(
  entry: IntersectionObserverEntry,
  direction: ScrollDirection,
) {
  if (entry.isIntersecting) {
    return "visible";
  }

  if (direction === "vertical") {
    if (
      entry.boundingClientRect.y <
      (entry.rootBounds?.height ?? window.innerHeight) / 2
    ) {
      return "before-viewport";
    } else {
      return "after-viewport";
    }
  } else {
    if (
      entry.boundingClientRect.x <
      (entry.rootBounds?.width ?? window.innerWidth) / 2
    ) {
      return "before-viewport";
    } else {
      return "after-viewport";
    }
  }
}

function useProbeIntersectionObserver(
  probe: MaybeComputedElementRef,
  root: MaybeComputedElementRef,
  enabled: MaybeRefOrGetter<boolean>,
  rootMargin: number,
  threshold: number,
  callback: (entry: IntersectionObserverEntry) => void,
) {
  const observer = useIntersectionObserver(
    probe,
    (entries) => {
      const entry = latestEntry(entries);

      if (!entry) {
        return;
      }

      callback(entry);
    },
    {
      root,
      rootMargin: `${rootMargin}px`,
      threshold,
      immediate: true,
    },
  );

  watch(
    () => toValue(enabled),
    (enabled) => {
      if (enabled) {
        observer.resume();
      } else {
        observer.pause();
      }
    },
    {
      immediate: true,
    },
  );
}

export function useVisibilityProbe<M extends VisibilityProbeMode>(
  probe: MaybeComputedElementRef,
  mode: M,
  options: UseVisibilityProbeOptions,
): M extends "all"
  ? Readonly<Ref<VisibilityState>>
  : Readonly<Ref<DirectedVisibilityState>> {
  const { enabled = true, margin = -2, threshold = 0.5 } = options;

  if (typeof enabled === "boolean" && !enabled) {
    return ref("disabled");
  }

  const normalizedThreshold = Math.min(1, Math.max(0, threshold));

  if (mode === "all") {
    const roots = useAllViewports();
    const states = ref(new Map<MaybeComputedElementRef, VisibilityState>());

    for (const root of roots) {
      useProbeIntersectionObserver(
        probe,
        root,
        enabled,
        margin,
        normalizedThreshold,
        (entry) => {
          states.value.set(root, visibilityStateFromEntry(entry));
        },
      );
    }

    return computed(() => {
      if (!toValue(enabled)) {
        return "disabled";
      }

      if (states.value.size === 0) {
        return "invisible";
      }

      for (const value of states.value.values()) {
        if (value === "invisible") {
          return "invisible";
        }
      }

      return "visible";
    }) as never;
  }

  const root = mode === "root" ? null : useNearestViewport();
  const scrollDirection = mode === "root" ? "vertical" : useScrollDirection();

  const state = ref<DirectedVisibilityState>("before-viewport");

  useProbeIntersectionObserver(
    probe,
    root,
    enabled,
    margin,
    normalizedThreshold,
    (entry) => {
      state.value = directionalVisibilityStateFromEntry(
        entry,
        toValue(scrollDirection),
      );
    },
  );

  watchEffect(() => {
    if (!toValue(enabled)) {
      state.value = "disabled";
    }
  });

  return state as never;
}

export function useStickyElement(id: string) {
  useChild<string>("sticky-neighbors", id);
}

function defineCustomProperty(name: string, inherits = false) {
  return `@property ${name} { syntax: "<length>"; inherits: ${String(inherits)}; initial-value: 0; }`;
}

function assignCustomProperty(name: string, value: string) {
  return `  ${name}: ${value};`;
}

export interface ViewportProps {
  direction?: ScrollDirection;
}

export type ViewportSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { direction = "vertical" } = defineProps<ViewportProps>();
defineSlots<ViewportSlots>();

const id = useId();

const viewport = useDataString(() => ({
  [id]: true,
  [direction]: true,
}));

const { inputs: ids } = useChildren<string>("sticky-neighbors");

const stylesheet = computed(() => {
  const rules = [] as Array<string>;
  const peerAssignments = [] as Array<string>;

  for (const [index, current] of ids.value.entries()) {
    const previous = ids.value[index - 1] ?? null;
    const next = ids.value[index + 1] ?? null;

    rules.push(
      defineCustomProperty(`--layout-sticky-${current}-size`, true),
      defineCustomProperty(`--layout-sticky-${current}-start`),
      defineCustomProperty(`--layout-sticky-${current}-end`),
      `[data-sticky~="${current}"] {`,
      assignCustomProperty(
        "--layout-sticky-peer-start",
        `var(--layout-sticky-${current}-start)`,
      ),
      assignCustomProperty(
        "--layout-sticky-peer-end",
        `var(--layout-sticky-${current}-end)`,
      ),
      `}`,
    );

    if (previous) {
      peerAssignments.push(
        assignCustomProperty(
          `--layout-sticky-${current}-start`,
          `calc(var(--layout-sticky-${previous}-start) + var(--layout-sticky-${previous}-size))`,
        ),
      );
    }
    if (next) {
      peerAssignments.push(
        assignCustomProperty(
          `--layout-sticky-${current}-end`,
          `calc(var(--layout-sticky-${next}-end) + var(--layout-sticky-${next}-size))`,
        ),
      );
    }
  }

  rules.push(`[data-viewport~=${id}] [data-sticky] {`, ...peerAssignments, "}");

  return rules.join("\n");
});
</script>

<template>
  <RadixSlot :data-viewport="viewport">
    <slot />
    <ClientOnly>
      <Teleport to="#teleports">
        <RadixPrimitive as="style">
          {{ stylesheet }}
        </RadixPrimitive>
      </Teleport>
    </ClientOnly>
  </RadixSlot>
</template>

<style>
@property --layout-scroll {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-scroll-length {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-scroll-start {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-scroll-end {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-scroll-viewport {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 0;
}

@layer trait {
  [data-viewport] {
    --layout-scroll-start: max(0px, var(--layout-scroll));
    --layout-scroll-end: max(
      0px,
      var(--layout-scroll-length) - var(--layout-scroll-viewport) -
        var(--layout-scroll)
    );
  }
}
</style>
