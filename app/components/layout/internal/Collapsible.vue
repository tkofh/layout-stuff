<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";
import InternalLayoutAligned, {
  type Align2dProps,
  reverseAlign,
} from "~/components/layout/internal/Aligned.vue";

export type CollapseBelow = BreakpointsExcept<"mobile"> | "none";

const COLLAPSE_BELOW = Symbol.for("layout.collapse-below") as InjectionKey<
  MaybeRefOrGetter<CollapseBelow>
>;

function provideCollapseBelow(collapseBelow: MaybeRefOrGetter<CollapseBelow>) {
  provide(COLLAPSE_BELOW, collapseBelow);
}

export function useCollapseBelow() {
  return inject(COLLAPSE_BELOW, "none");
}

export interface CollapsibleProps extends Align2dProps {
  collapseBelow?: CollapseBelow;
  reverse?: boolean;
  wrap?: boolean;
}

export type CollapsibleSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const {
  collapseBelow = "none",
  reverse,
  align = "left",
  wrap = false,
} = defineProps<CollapsibleProps>();
defineSlots<CollapsibleSlots>();

const effectiveAlign = computed(() =>
  compactResponsive(
    mapResponsive(
      fillResponsive(normalizeResponsive(align)),
      (value, breakpoint) =>
        breakpoint !== "mobile" && reverse ? reverseAlign(value) : value,
    ),
  ),
);

provideCollapseBelow(collapseBelow);

const data = useDataString(() => ({
  reverse,
  wrap,
  [collapseBelow]: true,
}));

const LayoutAligned = InternalLayoutAligned;
</script>

<template>
  <LayoutAligned :align="effectiveAlign" :align-y>
    <RadixSlot :data-collapsible="data">
      <slot />
    </RadixSlot>
  </LayoutAligned>
</template>

<style>
@property --layout-collapsible-row {
  syntax: "row | row-reverse";
  inherits: false;
  initial-value: row;
}

@property --layout-collapsible-wrap {
  syntax: "wrap | nowrap";
  inherits: false;
  initial-value: nowrap;
}

@layer layout.init {
  [data-collapsible~="reverse"] {
    @container style(--media-gte-tablet: true) {
      --layout-collapsible-row: row-reverse;
    }
  }
}

@layer layout.trait {
  [data-collapsible] {
    display: block flex;
    inline-size: 100%;

    &[data-collapsible~="none"] {
      flex-flow: var(--layout-collapsible-row) var(--layout-collapsible-wrap);
      justify-content: var(--layout-align-current, start);
      align-items: var(--layout-align-y-current, start);
    }

    &:not([data-collapsible~="none"]) {
      flex-flow: column nowrap;
      align-items: var(--layout-align-current, start);
      justify-content: start;
    }

    @container style(--media-gte-tablet: true) {
      &[data-collapsible~="tablet"] {
        flex-flow: var(--layout-collapsible-row) var(--layout-collapsible-wrap);
        justify-content: var(--layout-align-current, start);
        align-items: var(--layout-align-y-current, start);
      }
    }

    @container style(--media-gte-laptop: true) {
      &[data-collapsible~="laptop"] {
        flex-flow: var(--layout-collapsible-row) var(--layout-collapsible-wrap);
        justify-content: var(--layout-align-current, start);
        align-items: var(--layout-align-y-current, start);
      }
    }

    @container style(--media-eq-desktop: true) {
      &[data-collapsible~="desktop"] {
        flex-flow: var(--layout-collapsible-row) var(--layout-collapsible-wrap);
        justify-content: var(--layout-align-current, start);
        align-items: var(--layout-align-y-current, start);
      }
    }
  }
}
</style>
