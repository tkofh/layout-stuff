<template>
  <LayoutSized
    :width
    :height
    :aspect-ratio
    :min-width
    :min-height
    :max-width
    :max-height
  >
    <LayoutFrame
      :frame
      :frame-y
      :frame-x
      :frame-top
      :frame-right
      :frame-bottom
      :frame-left
    >
      <LayoutPrimitive :as class="layout-box">
        <slot />
      </LayoutPrimitive>
    </LayoutFrame>
  </LayoutSized>
</template>

<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutSized, {
  type SizedProps,
} from "~/components/layout/internal/Sized.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";

export interface BoxProps extends PrimitiveProps, SizedProps, FrameProps {}

export type BoxSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<BoxProps>();
defineSlots<BoxSlots>();

const LayoutFrame = InternalLayoutFrame;
const LayoutSized = InternalLayoutSized;
const LayoutPrimitive = InternalLayoutPrimitive;
</script>

<style>
@layer layout.component {
  .layout-box {
    display: block flow-root;
  }
}
</style>
