<template>
  <LayoutFrame
    :frame
    :frame-y
    :frame-x
    :frame-top
    :frame-right
    :frame-bottom
    :frame-left
  >
    <LayoutContainer :align :space>
      <LayoutPrimitive :as class="layout-stack">
        <slot />
      </LayoutPrimitive>
    </LayoutContainer>
  </LayoutFrame>
</template>

<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutContainer, {
  type AlignProps,
  type SpaceProps,
} from "~/components/layout/internal/Container.vue";

export interface StackProps
  extends PrimitiveProps,
    FrameProps,
    AlignProps,
    SpaceProps {}

export type StackSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<StackProps>();
defineSlots<StackSlots>();

const LayoutFrame = InternalLayoutFrame;
const LayoutContainer = InternalLayoutContainer;
const LayoutPrimitive = InternalLayoutPrimitive;
</script>

<style>
@layer components.layout.base {
  .layout-stack {
    max-inline-size: 100%;
    display: block flex;
    flex-flow: column nowrap;
    gap: var(--layout-space-current);
    justify-content: flex-start;
    align-items: var(--layout-align-current);
  }
}
</style>
