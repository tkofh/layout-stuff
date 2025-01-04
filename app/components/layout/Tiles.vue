<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import type { Align2dProps } from "~/components/layout/internal/Aligned.vue";
import InternalLayoutContainer, {
  type SpaceProps,
} from "~/components/layout/internal/Container.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";

export interface TilesProps
  extends PrimitiveProps<ContentSectioningTag>,
    FrameProps,
    SpaceProps,
    Align2dProps {
  columns?: ResponsiveValue<number | `${number}`>;
}

export type TilesSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<TilesProps>();
defineSlots<TilesSlots>();

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutContainer = InternalLayoutContainer;
const LayoutFrame = InternalLayoutFrame;
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
    <LayoutContainer axis="row" :items="columns" wrap :align :align-y :space>
      <LayoutPrimitive :as class="layout-tiles">
        <slot />
      </LayoutPrimitive>
    </LayoutContainer>
  </LayoutFrame>
</template>

<style>
@layer layout.component {
  .layout-tiles > :not(.layout-tile) {
    outline: red 2px;
  }
}
</style>
