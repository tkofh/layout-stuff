<template>
  <RadixSlot :data-viewport="direction">
    <slot />
  </RadixSlot>
</template>

<script lang="ts">
export type ScrollDirection = "vertical" | "horizontal";
export interface ViewportProps {
  direction?: ScrollDirection;
}
export interface ViewportSlots {
  default?: () => unknown;
}
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
const { direction = "vertical" } = defineProps<ViewportProps>();
defineSlots<ViewportSlots>();
</script>

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

[data-viewport] {
  --layout-scroll-start: max(0px, var(--layout-scroll));
  --layout-scroll-end: max(
    0px,
    var(--layout-scroll-length) - var(--layout-scroll-viewport) -
      var(--layout-scroll)
  );
}
</style>
