<template>
  <LayoutPrimitive :as class="layout-areas">
    <RadixSlot v-if="slots.top" class="layout-area" :data-layout-area="top">
      <slot name="top" />
    </RadixSlot>
    <RadixSlot v-if="slots.left" class="layout-area" :data-layout-area="left">
      <slot name="left" />
    </RadixSlot>
    <RadixSlot v-if="slots.right" class="layout-area" :data-layout-area="right">
      <slot name="right" />
    </RadixSlot>
    <RadixSlot class="layout-area" data-layout-area="main">
      <slot name="main">
        <AppPlaceholder label="Main" />
      </slot>
    </RadixSlot>
    <RadixSlot
      v-if="slots.bottom"
      class="layout-area"
      :data-layout-area="bottom"
    >
      <slot name="bottom" />
    </RadixSlot>
  </LayoutPrimitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from "~/components/layout/Primitive.vue";

export type AreaAxis = "x" | "y";
export type AreaLarge = "top" | "left" | AreaAxis;
export type AreaSmall<L extends AreaLarge> = L extends AreaAxis
  ? Exclude<AreaAxis, L>
  : Exclude<"left" | "right" | "bottom", L>;

export interface AreaProps<L extends AreaLarge> extends PrimitiveProps {
  large?: L;
  small?: AreaSmall<L>;
}

export interface AreasSlots {
  top?: () => unknown;
  left?: () => unknown;
  right?: () => unknown;
  bottom?: () => unknown;
  main?: () => unknown;
}
</script>

<script setup lang="ts" generic="L extends AreaLarge">
const { large = "top", small = "bottom" } = defineProps<AreaProps<L>>();
const slots = defineSlots<AreasSlots>();

const top = computed(() =>
  large === "top" || large === "y"
    ? "top-all"
    : large === "x"
      ? "top"
      : "top-right",
);
const left = computed(() =>
  large === "left" || large === "x"
    ? "left-all"
    : large === "y" || small === "left"
      ? "left"
      : "left-bottom",
);
const right = computed(() =>
  large === "x"
    ? "right-all"
    : small === "right" || large === "y"
      ? "right"
      : "right-bottom",
);
const bottom = computed(() =>
  large === "y"
    ? "bottom-all"
    : small === "bottom" || large === "x"
      ? "bottom"
      : "bottom-right",
);
</script>

<style>
.layout-areas {
  display: block grid;
  block-size: 100%;
  inline-size: 100%;
  grid-template:
    [top-all-start top-start top-left-start top-right-start left-all-start left-top-start right-all-start right-top-start] auto
    [top-all-end top-end top-left-end top-right-end main-start left-start left-bottom-start right-start right-bottom-start] minmax(
      auto,
      1fr
    )
    [main-end left-end left-top-end right-end right-top-end bottom-all-start bottom-start bottom-left-start bottom-right-start] auto
    [bottom-all-end bottom-end bottom-left-end bottom-right-end left-all-end left-bottom-end right-all-end right-bottom-end] /
    [left-all-start left-start left-top-start left-bottom-start top-all-start top-left-start bottom-all-start bottom-left start] auto
    [left-all-end left-end left-top-end left-bottom-end main-start top-start top-right-start bottom-start bottom-right-start] 1fr
    [main-end top-end top-left-end bottom-end bottom-left-end right-all-start right-start right-top-start right-bottom-start] auto
    [right-all-end right-end right-top-end right-bottomend top-all-end top-right-end bottom-all-end bottom-right-end end];
  place-items: stretch;
}

.layout-areas > :not(.layout-area),
:not(.layout-areas) > .layout-area {
  display: none;
}

.layout-area {
  &[data-layout-area="top-all"] {
    grid-area: top-all;
  }

  &[data-layout-area="top-left"] {
    grid-area: top-left;
  }

  &[data-layout-area="left-all"] {
    grid-area: left-all;
  }

  &[data-layout-area="left-top"] {
    grid-area: left-top;
  }

  &[data-layout-area="top"] {
    grid-area: top;
  }

  &[data-layout-area="top-right"] {
    grid-area: top-right;
  }

  &[data-layout-area="right-all"] {
    grid-area: right-all;
  }

  &[data-layout-area="right-top"] {
    grid-area: right-top;
  }

  &[data-layout-area="left"] {
    grid-area: left;
  }

  &[data-layout-area="left-bottom"] {
    grid-area: left-bottom;
  }

  &[data-layout-area="right"] {
    grid-area: right;
  }

  &[data-layout-area="right-bottom"] {
    grid-area: right-bottom;
  }

  &[data-layout-area="main"] {
    grid-area: main;
  }

  &[data-layout-area="bottom-all"] {
    grid-area: bottom-all;
  }

  &[data-layout-area="bottom-left"] {
    grid-area: bottom-left;
  }

  &[data-layout-area="bottom"] {
    grid-area: bottom;
  }

  &[data-layout-area="bottom-right"] {
    grid-area: bottom-right;
  }
}
</style>
