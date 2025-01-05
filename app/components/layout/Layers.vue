<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutAligned, {
  type Align2dProps,
} from "~/components/layout/internal/Aligned.vue";

export interface LayersProps extends PrimitiveProps, Align2dProps {}

export type LayersSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<LayersProps>();
defineSlots<LayersSlots>();

const LayoutAligned = InternalLayoutAligned;
const LayoutPrimitive = InternalLayoutPrimitive;
</script>

<template>
  <LayoutAligned :align :align-y mode="grid">
    <LayoutPrimitive :as class="layout-layers">
      <slot />
    </LayoutPrimitive>
  </LayoutAligned>
</template>

<style>
@layer layout.component {
  .layout-layers {
    isolation: isolate;
    display: block grid;
    grid: "main" 1fr / 1fr;

    & > :not(.layout-layer) {
      display: none;
    }
  }
}
</style>
