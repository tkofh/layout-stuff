<template>
  <LayoutContainerTrait :space :align>
    <LayoutFrameTrait
      :frame
      :frame-y
      :frame-x
      :frame-top
      :frame-right
      :frame-bottom
      :frame-left
    >
      <LayoutPrimitive :as class="layout-stack">
        <slot />
      </LayoutPrimitive>
    </LayoutFrameTrait>
  </LayoutContainerTrait>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";
import type {
  AlignProps,
  SpaceProps,
} from "~/components/layout/container/Trait.vue";
import type { FrameProps } from "~/components/layout/frame/Trait.vue";

export interface StackProps
  extends PrimitiveProps,
    AlignProps,
    SpaceProps,
    FrameProps {}

export type StackSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<StackProps>();
defineSlots<StackSlots>();
</script>

<style>
@layer components.layout {
  .layout-stack {
    display: block flex;
    flex-direction: column;
    gap: var(--layout-space-current);
    justify-content: flex-start;
    align-items: var(--layout-align-current);
  }
}
</style>
