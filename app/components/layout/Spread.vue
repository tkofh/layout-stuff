<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutAligned, {
  type Align2dProps,
} from "~/components/layout/internal/Aligned.vue";
import InternalLayoutSpaced, {
  type SpaceProps,
} from "~/components/layout/internal/Spaced.vue";

export interface SpreadProps
  extends PrimitiveProps,
    FrameProps,
    Align2dProps,
    SpaceProps {
  direction?: "horizontal" | "vertical";
}

export type SpreadSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { direction = "horizontal" } = defineProps<SpreadProps>();
defineSlots<SpreadSlots>();

const data = useDataString(() => ({
  horizontal: direction === "horizontal",
  vertical: direction === "vertical",
}));

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
    <LayoutAligned :align :align-y>
      <LayoutSpaced :space mode="gap">
        <LayoutPrimitive :as class="layout-spread" :data-spread="data">
          <slot />
        </LayoutPrimitive>
      </LayoutSpaced>
    </LayoutAligned>
  </LayoutFrame>
</template>

<style>
@layer layout.component {
  .layout-spread {
    display: block flex;
    justify-content: space-between;
    inline-size: 100%;

    &[data-spread~="horizontal"] {
      flex-flow: row nowrap;
      align-items: var(--align-y-actual);
    }

    &[data-spread~="vertical"] {
      flex-flow: column nowrap;
      align-items: var(--align-actual);
      block-size: 100%;
    }
  }
}
</style>
