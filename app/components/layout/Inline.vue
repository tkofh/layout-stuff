<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutCollapsible, {
  type CollapsibleProps,
} from "~/components/layout/internal/Collapsible.vue";
import InternalLayoutSpaced, {
  type SpaceProps,
} from "~/components/layout/internal/Spaced.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutWrap from "~/components/layout/internal/Wrap.vue";

export interface InlineProps
  extends PrimitiveProps,
    FrameProps,
    CollapsibleProps,
    SpaceProps {}

export type InlineSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<InlineProps>();
defineSlots<InlineSlots>();

const LayoutFrame = InternalLayoutFrame;
const LayoutCollapsible = InternalLayoutCollapsible;
const LayoutSpaced = InternalLayoutSpaced;
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
    <LayoutCollapsible :collapse-below :align :align-y :reverse wrap>
      <LayoutWrap role="unwrappable">
        <LayoutSpaced :space>
          <LayoutPrimitive :as class="layout-inline">
            <slot />
          </LayoutPrimitive>
        </LayoutSpaced>
      </LayoutWrap>
    </LayoutCollapsible>
  </LayoutFrame>
</template>
