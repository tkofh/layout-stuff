<template>
  <component :is="as">
    <slot />
  </component>
</template>

<script lang="ts">
export type PrimitiveTag =
  | "div"
  | "section"
  | "article"
  | "main"
  | "header"
  | "footer"
  | "aside"
  | "nav";

export interface PrimitiveProps {
  /**
   * @default 'div'
   */
  as?: PrimitiveTag;
}
export interface PrimitiveSlots {
  default?: () => unknown;
}
</script>

<script lang="ts" setup>
const { as = "div" } = defineProps<PrimitiveProps>();
defineSlots<PrimitiveSlots>();
</script>
