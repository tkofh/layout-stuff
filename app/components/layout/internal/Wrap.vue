<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

export interface WrapProps {
  role: "should-unwrap" | "unwrappable";
}

export type WrapSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { role } = defineProps<WrapProps>();
defineSlots<WrapSlots>();
</script>

<template>
  <RadixSlot
    :class="{
      'layout-should-unwrap': role === 'should-unwrap',
      'layout-unwrappable': role === 'unwrappable',
    }"
  >
    <slot />
  </RadixSlot>
</template>

<style>
@layer layout.override {
  .layout-should-unwrap > .layout-unwrappable,
  .layout-should-unwrap.layout-unwrappable {
    max-inline-size: 100%;
    inline-size: max-content;
  }
}
</style>
