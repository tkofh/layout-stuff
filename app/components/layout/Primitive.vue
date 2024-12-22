<template>
  <component :is>
    <slot />
  </component>
</template>

<script lang="ts">
import Slot from "./Slot";

export type ContentSectioningTag =
  | "div"
  | "address"
  | "article"
  | "aside"
  | "footer"
  | "header"
  | "hgroup"
  | "main"
  | "nav"
  | "section"
  | "search";

export type PrimitiveTag = ContentSectioningTag | "slot";

export interface PrimitiveProps<T extends PrimitiveTag = PrimitiveTag> {
  /**
   * @default 'div'
   */
  as?: T;
}
export interface PrimitiveSlots {
  default?: () => unknown;
}
</script>

<script lang="ts" setup>
const { as = "div" } = defineProps<PrimitiveProps>();
defineSlots<PrimitiveSlots>();
const is = computed(() => (as === "slot" ? Slot : as));
</script>
