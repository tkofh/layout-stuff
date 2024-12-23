<template>
  <LayoutContainerTrait :align :align-y :collapse-below :space>
    <LayoutFrameTrait
      :frame
      :frame-y
      :frame-x
      :frame-top
      :frame-right
      :frame-bottom
      :frame-left
    >
      <LayoutPrimitive :as class="layout-inline">
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
  Align2dProps,
  CollapseBelowProps,
  SpaceProps,
} from "~/components/layout/container/Trait.vue";
import type { FrameProps } from "~/components/layout/frame/Trait.vue";

export interface LayoutInlineProps
  extends PrimitiveProps,
    CollapseBelowProps,
    SpaceProps,
    Align2dProps,
    FrameProps {}

export type LayoutInlineSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<LayoutInlineProps>();
defineSlots<LayoutInlineSlots>();
</script>

<style>
@property --layout-inline-align {
  syntax: "flex-start | center | flex-end";
  inherits: true;
  initial-value: flex-start;
}

@property --layout-inline-align-y {
  syntax: "flex-start | center | flex-end";
  inherits: true;
  initial-value: flex-start;
}

@layer components.layout {
  .layout-inline {
    display: block flex;
    flex-flow: row wrap;
    gap: var(--layout-space-current);
    justify-content: var(--layout-align-current);
    align-items: var(--layout-align-y-current);
  }
}
</style>
