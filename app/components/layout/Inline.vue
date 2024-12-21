<template>
  <LayoutPrimitive :as class="layout-inline" :style>
    <slot />
  </LayoutPrimitive>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";

export interface InlineProps extends PrimitiveProps {
  align?: "left" | "center" | "right";
  alignY?: "top" | "center" | "bottom";
  space?: number | `${number}`;
}

export type InlineSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<InlineProps>();
defineSlots<InlineSlots>();

const style = computed(() => ({
  "--layout-inline-align": props.align,
  "--layout-inline-align-y": props.alignY,
}));
</script>

<style>
@property --layout-inline-align {
  syntax: "flex-start | center | flex-end";
  inherits: true;
  initial-value: "flex-start";
}

@property --layout-inline-align-y {
  syntax: "flex-start | center | flex-end";
  inherits: true;
  initial-value: "flex-start";
}

.layout-inline {
  display: block flex;
  flex-flow: row wrap;
}
</style>
