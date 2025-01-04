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
import InternalLayoutVisibility, {
  type VisibilityProps,
} from "~/components/layout/internal/Visibility.vue";

export interface BoxProps
  extends PrimitiveProps,
    SizedProps,
    FrameProps,
    VisibilityProps {}

export type BoxSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<BoxProps>();
defineSlots<BoxSlots>();

const LayoutFrame = InternalLayoutFrame;
const LayoutSized = InternalLayoutSized;
const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutVisibility = InternalLayoutVisibility;
</script>

<template>
  <LayoutSized
    :width
    :height
    :aspect
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
      <LayoutVisibility :hide-above :hide-below>
        <LayoutPrimitive :as class="layout-box">
          <slot />
        </LayoutPrimitive>
      </LayoutVisibility>
    </LayoutFrame>
  </LayoutSized>
</template>

<style>
@layer layout.component {
  .layout-box {
    display: block flow-root;
  }
}
</style>
