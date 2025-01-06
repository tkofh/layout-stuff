<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";

export interface BlockProps extends PrimitiveProps, FrameProps {
  size?: BlockSize;
}

export type BlockSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<BlockProps>();
defineSlots<BlockSlots>();

const style = computed(() => ({
  "--block-area": BLOCK_SIZE_SCALE[props.size ?? "content"],
}));

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutFrame = InternalLayoutFrame;
</script>

<template>
  <LayoutFrame
    :frame
    :frame-x
    :frame-y
    :frame-top
    :frame-right
    :frame-bottom
    :frame-left
  >
    <LayoutPrimitive :as class="layout-block" :style>
      <slot />
    </LayoutPrimitive>
  </LayoutFrame>
</template>

<style>
@property --block-area {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@layer layout.component {
  .layout-block {
    container: block / inline-size;
    display: block grid;
    grid:
      auto-flow / 1fr [content-start] minmax(auto, var(--block-area))
      [content-end] 1fr;

    & > * {
      grid-column: content;
    }
  }
}
</style>
