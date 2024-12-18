<template>
  <LayoutPrimitive :as class="layout-box">
    <slot />
  </LayoutPrimitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from "~/components/layout/Primitive.vue";

export type BoxProps = PrimitiveProps;
export interface BoxSlots {
  default: () => unknown;
}
</script>

<script setup lang="ts">
defineProps<BoxProps>();
defineSlots<BoxSlots>();
</script>

<style>
.layout-box {
  display: flex;
}
</style>
