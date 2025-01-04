<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
} from "~/components/layout/internal/Primitive.vue";
import type { Align2dProps } from "~/components/layout/internal/Aligned.vue";
import InternalLayoutContainer, {
  type SpaceProps,
  type CollapseBelowProps,
  type ReverseProps,
} from "~/components/layout/internal/Container2.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutWrap from "~/components/layout/internal/Wrap.vue";

export interface InlineProps
  extends PrimitiveProps,
    FrameProps,
    CollapseBelowProps,
    SpaceProps,
    Align2dProps,
    ReverseProps {}

export type InlineSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<InlineProps>();
defineSlots<InlineSlots>();

const LayoutFrame = InternalLayoutFrame;
const LayoutContainer = InternalLayoutContainer;
const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutWrap = InternalLayoutWrap;
</script>

<template>
  <LayoutFrame
    as="slot"
    :frame
    :frame-y
    :frame-x
    :frame-top
    :frame-right
    :frame-bottom
    :frame-left
  >
    <LayoutContainer
      axis="row"
      items="independent"
      :collapse-below
      :align
      :align-y
      :space
      :reverse
      wrap
    >
      <LayoutWrap role="unwrappable">
        <LayoutPrimitive :as class="layout-inline">
          <slot />
        </LayoutPrimitive>
      </LayoutWrap>
    </LayoutContainer>
  </LayoutFrame>
</template>
