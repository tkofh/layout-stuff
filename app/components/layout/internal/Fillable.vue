<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

export interface FillableProps {
  unwrap?: boolean;
  layout?: boolean;
}

export type UnwrappableSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineSlots<UnwrappableSlots>();
const { unwrap = false, layout = false } = defineProps<FillableProps>();
const fillable = useDataString(() => ({ unwrap, layout }));
</script>

<template>
  <RadixSlot :data-layout-fillable="fillable">
    <slot />
  </RadixSlot>
</template>

<style>
@layer trait {
  [data-layout-fillable~="layout"] {
    max-inline-size: 100%;
    max-block-size: 100%;
    display: block grid;
    grid-template: minmax(auto, 1fr) / 1fr;
    place-items: start stretch;
  }
}
</style>
