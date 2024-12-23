<template>
  <LayoutPrimitive :as class="layout-frame" :style>
    <slot />
  </LayoutPrimitive>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";

export interface FrameProps extends PrimitiveProps {
  frame?: number | `${number}`;
}
</script>

<script setup lang="ts">
const { frame = 0 } = defineProps<FrameProps>();
defineSlots<PrimitiveSlots>();

const style = computed(() => ({
  "--layout-frame": `${frame}rem`,
}));
</script>

<style>
@property --layout-frame {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@layer components.layout {
  .layout-frame {
    padding: var(--layout-frame);
  }
}
</style>
