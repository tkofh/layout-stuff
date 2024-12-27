<script lang="ts">
import type { MaybeComputedElementRef } from "@vueuse/core";
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

export type ScrollDirection = "vertical" | "horizontal";

export type Viewport = MaybeComputedElementRef | Document;

export function provideViewport(viewport: Viewport) {
  provide(Symbol.for("layout.viewport"), viewport);
}

export function useViewport() {
  return inject(Symbol.for("layout.viewport")) as Viewport;
}

export interface ViewportProps {
  direction?: ScrollDirection;
}

export type ViewportSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { direction = "vertical" } = defineProps<ViewportProps>();
defineSlots<ViewportSlots>();
</script>

<template>
  <RadixSlot :data-viewport="direction">
    <slot />
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
