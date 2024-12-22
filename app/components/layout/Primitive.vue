<template>
  <component :is>
    <slot />
  </component>
</template>

<script lang="ts"></script>

<script lang="ts" setup>
import { RadixSlot } from "#components";
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

const { as = "div" } = defineProps<PrimitiveProps>();
defineSlots<PrimitiveSlots>();
const is = computed(() => (as === "slot" ? RadixSlot : as));
</script>
