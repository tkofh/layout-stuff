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
    <LayoutContainer :align :align-y :space :collapse-below>
      <LayoutWrap role="unwrappable">
        <LayoutPrimitive :as class="layout-inline">
          <slot />
        </LayoutPrimitive>
      </LayoutWrap>
    </LayoutContainer>
  </LayoutFrame>
</template>

<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutContainer, {
  type Align2dProps,
  type SpaceProps,
  type CollapseBelowProps,
} from "~/components/layout/internal/Container.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutWrap from "~/components/layout/internal/Wrap.vue";

export interface InlineProps
  extends PrimitiveProps,
    FrameProps,
    CollapseBelowProps,
    SpaceProps,
    Align2dProps {}

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

<style>
@layer layout.component {
  .layout-inline {
    display: block flex;
    flex-flow: var(--layout-collapse-below-direction-current) wrap;
    gap: var(--layout-space-current);
    justify-content: var(--layout-align-current);
    align-items: var(--layout-align-y-current);
  }
}
</style>
