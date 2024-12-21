<template>
  <LayoutPrimitive :id :as class="layout-sticky" :style>
    <slot />
  </LayoutPrimitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from "~/components/layout/Primitive.vue";

const startLookup = {
  start: undefined,
  end: "auto",
  both: undefined,
  none: "auto",
  auto: undefined,
} as const;
const endLookup = {
  start: "auto",
  end: undefined,
  both: undefined,
  none: "auto",
  auto: undefined,
} as const;

export interface StickyProps extends PrimitiveProps {
  edge?: "start" | "end" | "both" | "none" | "auto";
}
export interface StickySlots {
  default: () => unknown;
}
</script>

<script setup lang="ts">
const { edge = "auto" } = defineProps<StickyProps>();
defineSlots<StickySlots>();

const id = useId();

const style = computed(() => ({
  "--layout-sticky-start": startLookup[edge],
  "--layout-sticky-end": endLookup[edge],
}));
</script>

<style>
@property --layout-sticky-start {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-sticky-end-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

.layout-sticky {
  position: sticky;

  [data-viewport~="vertical"] & {
    inset-block: var(--layout-sticky-start, var(--layout-sticky-start-offset))
      var(--layout-sticky-end, var(--layout-sticky-end-offset));
  }

  [data-viewport~="horizontal"] & {
    inset-inline: var(--layout-sticky-start, var(--layout-sticky-start-offset))
      var(--layout-sticky-end, var(--layout-sticky-end-offset));
  }
}
</style>
