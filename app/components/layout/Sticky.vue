<template>
  <LayoutPrimitive :id :as class="layout-sticky" :style>
    <slot />
  </LayoutPrimitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from "~/components/layout/Primitive.vue";
import { fillResponsive, responsiveToAttributes } from "~/utils/responsive";

const startLookup = {
  start: undefined,
  end: "auto",
  both: undefined,
  none: "auto",
} as const;
const endLookup = {
  start: "auto",
  end: undefined,
  both: undefined,
  none: "auto",
} as const;

function stickyStyle(edge: StickyEdge) {
  const filled = fillResponsive(normalizeResponsive(edge));
  return {
    ...responsiveToAttributes(
      "--layout-sticky-start",
      mapResponsive(filled, (value) => startLookup[value]),
    ),
    ...responsiveToAttributes(
      "--layout-sticky-end",
      mapResponsive(filled, (value) => endLookup[value]),
    ),
  };
}

export type StickyEdge = ResponsiveValue<"start" | "end" | "both" | "none">;

export interface LayoutStickyProps extends PrimitiveProps {
  edge?: StickyEdge;
}

export interface LayoutStickySlots {
  default: () => unknown;
}
</script>

<script setup lang="ts">
const { edge = "both" } = defineProps<LayoutStickyProps>();
defineSlots<LayoutStickySlots>();

const id = useId();

const style = computed(() => stickyStyle(edge));
</script>

<style>
@property --layout-sticky-start {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-current {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-current {
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

@layer components.layout {
  .layout-sticky {
    position: sticky;

    [data-viewport~="vertical"] & {
      inset-block: var(--layout-sticky-start, var(--layout-sticky-start-offset))
        var(--layout-sticky-end, var(--layout-sticky-end-offset));
    }

    [data-viewport~="horizontal"] & {
      inset-inline: var(
          --layout-sticky-start,
          var(--layout-sticky-start-offset)
        )
        var(--layout-sticky-end, var(--layout-sticky-end-offset));
    }
  }
}
</style>
