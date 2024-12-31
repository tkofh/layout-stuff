<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

export type UnwrappableSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineSlots<UnwrappableSlots>();
</script>

<template>
  <RadixSlot data-layout-unwrappable>
    <slot />
  </RadixSlot>
</template>

<style>
@layer components.layout.override {
  [data-layout-fillable~="unwrap"] > [data-layout-unwrappable],
  [data-layout-fillable~="unwrap"][data-layout-unwrappable] {
    max-inline-size: 100%;
    inline-size: max-content;
  }
}
</style>
