<template>
  <LayoutPrimitive
    :as
    class="layout-scroll"
    :class="{
      'layout-scroll-vertical': direction === 'vertical',
      'layout-scroll-horizontal': direction === 'horizontal',
    }"
  >
    <div class="layout-scroll-area">
      <slot />
    </div>
  </LayoutPrimitive>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";

export interface ScrollProps extends PrimitiveProps {
  direction?: "vertical" | "horizontal";
}
</script>

<script setup lang="ts">
defineProps<ScrollProps>();
defineSlots<PrimitiveSlots>();
</script>

<style>
.layout-scroll {
  display: block;
}

.layout-scroll-area {
  min-inline-size: fit-content;
  overflow: clip;
}
</style>
