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
import InternalLayoutBleed, {
  type BleedProps,
} from "~/components/layout/internal/Bleed.vue";
import InternalLayoutVisibility, {
  type VisibilityProps,
} from "~/components/layout/internal/Visibility.vue";

export interface BoxProps
  extends PrimitiveProps,
    SizedProps,
    FrameProps,
    BleedProps,
    VisibilityProps {}

export type BoxSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<BoxProps>();
defineSlots<BoxSlots>();

const LayoutFrame = InternalLayoutFrame;
const LayoutBleed = InternalLayoutBleed;
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
      <LayoutBleed
        :bleed
        :bleed-y
        :bleed-x
        :bleed-top
        :bleed-right
        :bleed-bottom
        :bleed-left
      >
        <LayoutVisibility :hide-above :hide-below>
          <LayoutPrimitive :as class="layout-box">
            <slot />
          </LayoutPrimitive>
        </LayoutVisibility>
      </LayoutBleed>
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
