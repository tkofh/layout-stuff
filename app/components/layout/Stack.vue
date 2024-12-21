<template>
  <LayoutPrimitive :as class="layout-stack" :style>
    <slot />
  </LayoutPrimitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from "~/components/layout/Primitive.vue";

const alignLookup = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

export interface StackProps extends PrimitiveProps {
  align?: "left" | "center" | "right";
  space?: number | `${number}`;
}
export interface StackSlots {
  default: () => unknown;
}
</script>

<script setup lang="ts">
const { align = "left", space = "0" } = defineProps<StackProps>();
defineSlots<StackSlots>();

const style = computed(() => ({
  "--layout-stack-align": alignLookup[align],
  "--layout-stack-space": `${space}rem`,
}));
</script>

<style>
@property --layout-stack-align {
  syntax: "flex-start | center | flex-end";
  inherits: false;
  initial-value: flex-start;
}

@property --layout-stack-space {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

.layout-stack {
  inline-size: 100%;
  display: block flex;
  flex-direction: column;
  gap: var(--layout-stack-space);
  align-items: var(--layout-stack-align);
}
</style>
