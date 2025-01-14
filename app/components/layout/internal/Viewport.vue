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

export function useScrollDirection(): MaybeRefOrGetter<ScrollDirection> {
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

// export function useNearestViewportElement(): MaybeComputedElementRef {
//   const nearest = useNearestViewport();
//
//   if (nearest === null) {
//     return () => (import.meta.client ? document.body : null);
//   }
//   return () =>
//     unrefElement(nearest) ?? (import.meta.client ? document.body : null);
// }

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

export type ViewportEdgeName = "start" | "end" | "both" | "none" | "cross";
export type ViewportEdge = ResponsiveValue<ViewportEdgeName>;

export interface StickyElementInput {
  size: number;
  edge: ResponsiveMap<ViewportEdgeName>;
}

export interface StickyElement {
  start: ResponsiveMap<number | "auto">;
  end: ResponsiveMap<number | "auto">;
  startLayer: number;
  endLayer: number;
}

const defaultStickyElement = {
  start: fillResponsive(normalizeResponsive(0)),
  end: fillResponsive(normalizeResponsive(0)),
  startLayer: 100,
  endLayer: 99,
} satisfies StickyElement;

export function useStickyElement(
  size: MaybeRefOrGetter<number>,
  edge: MaybeRefOrGetter<ViewportEdge>,
) {
  return useChild<StickyElementInput, StickyElement>(
    "viewport",
    () => ({
      size: toValue(size),
      edge: fillResponsive(normalizeResponsive(toValue(edge))),
    }),
    defaultStickyElement,
  );
}

export interface ViewportProps {
  direction?: ScrollDirection;
}

export type ViewportSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { direction = "vertical" } = defineProps<ViewportProps>();
defineSlots<ViewportSlots>();

const viewport = useDataString(() => ({
  [direction]: true,
}));

useChildren<StickyElementInput, StickyElement>("viewport", (children) => {
  for (const [index, child] of children.entries()) {
    const edge = fillResponsive(normalizeResponsive(child.input.value.edge));

    const before = Array.from(child.before());
    const after = Array.from(child.after());

    const start = mapResponsive(edge, (value, breakpoint) => {
      if (value === "end" || value === "none") {
        return "auto";
      }

      let offset = 0;

      for (const other of before) {
        const { edge, size } = other.input.value;
        if (edge[breakpoint] === "start" || edge[breakpoint] === "both") {
          offset += size;
        }
      }

      if (value === "cross") {
        for (const other of child.siblings.slice(
          child.siblings.indexOf(child) + 1,
        )) {
          const { edge, size } = other.input.value;
          if (edge[breakpoint] === "start" || edge[breakpoint] === "both") {
            offset += size;
          }
        }
      }

      return offset;
    });
    const end = mapResponsive(edge, (value, breakpoint) => {
      if (value === "start" || value === "none") {
        return "auto";
      }

      let offset = 0;

      for (const other of after) {
        const { edge, size } = other.input.value;
        if (edge[breakpoint] === "end" || edge[breakpoint] === "both") {
          offset += size;
        }
      }

      if (value === "cross") {
        for (const other of child.siblings.slice(
          0,
          child.siblings.indexOf(child),
        )) {
          const { edge, size } = other.input.value;
          if (edge[breakpoint] === "end" || edge[breakpoint] === "both") {
            offset += size;
          }
        }
      }

      return offset;
    });

    child.output!.value = {
      start,
      end,
      startLayer: children.length * 2 - index,
      endLayer: index + 1,
    };
  }
});
</script>

<template>
  <RadixSlot :data-viewport="viewport" class="layout-viewport">
    <slot />
  </RadixSlot>
</template>

<style>
@property --scroll {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --scroll-length {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --scroll-start {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --scroll-end {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --scroll-viewport {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 0;
}

@layer layout.init {
  .layout-viewport {
    --scroll-start: max(0px, var(--scroll));
    --scroll-end: max(
      0px,
      var(--scroll-length) - var(--scroll-viewport) - var(--scroll)
    );
  }
}
</style>
