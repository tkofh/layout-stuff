<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import type { AlignProps } from "~/components/layout/internal/Aligned.vue";
import InternalLayoutContainer, {
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
    <LayoutContainer axis="column" :align :space>
      <LayoutPrimitive :as class="layout-stack">
        <slot />
      </LayoutPrimitive>
    </LayoutContainer>
  </LayoutFrame>
</template>
