<template>
  <LayoutPrimitive :as class="layout-root layout-box">
    <slot />
  </LayoutPrimitive>
</template>

<script setup lang="ts">
import type { PrimitiveProps } from "~/components/layout/Primitive.vue";

defineProps<PrimitiveProps>();
</script>

<style>
.layout-root {
  min-block-size: 100dvb;
  display: block grid;
  grid-template: minmax(auto, 1fr) / 1fr;
  place-items: stretch;
  contain: content;
}
</style>
