<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutAligned, {
  type AlignProps,
} from "~/components/layout/internal/Aligned.vue";
import InternalLayoutSpaced, {
  type SpaceProps,
} from "~/components/layout/internal/Spaced.vue";

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
const LayoutAligned = InternalLayoutAligned;
const LayoutSpaced = InternalLayoutSpaced;
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
    <LayoutAligned :align align-y="top" mode="column">
      <LayoutSpaced :space mode="gap">
        <LayoutPrimitive :as class="layout-stack">
          <slot />
        </LayoutPrimitive>
      </LayoutSpaced>
    </LayoutAligned>
  </LayoutFrame>
</template>

<style>
@layer layout.component {
  .layout-stack {
    display: block flex;
    flex-flow: column nowrap;
  }
}
</style>
