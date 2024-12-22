<template>
  <RadixScrollAreaRoot class="layout-scroll" as-child>
    <LayoutTraitViewport :direction>
      <RadixScrollAreaViewport ref="viewport" as-child :style>
        <LayoutPrimitive ref="area" :as class="layout-scroll-area">
          <slot />
        </LayoutPrimitive>
        <RadixScrollAreaScrollbar
          :orientation="direction"
          class="layout-scroll-bar"
        >
          <RadixScrollAreaThumb class="layout-scroll-thumb" />
        </RadixScrollAreaScrollbar>
        <slot name="indicators" />
      </RadixScrollAreaViewport>
    </LayoutTraitViewport>
  </RadixScrollAreaRoot>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";
import type { ViewportProps } from "~/components/layout/trait/Viewport.vue";
import { RadixScrollAreaViewport } from "#components";

export interface ScrollProps extends PrimitiveProps, ViewportProps {}

export interface ScrollSlots extends PrimitiveSlots {
  indicators?: () => unknown;
}
</script>

<script setup lang="ts">
const { direction = "vertical" } = defineProps<ScrollProps>();
defineSlots<ScrollSlots>();

const area = useTemplateRef<HTMLElement>("area");
const viewport =
  useTemplateRef<InstanceType<typeof RadixScrollAreaViewport>>("viewport");

const viewportElement = computed(() => viewport.value?.viewportElement);

const defaultSize = { width: 0, height: 0 } as const;
const options = { box: "border-box" } as const;

const { width: scrollInlineLength, height: scrollBlockLength } = useElementSize(
  area,
  defaultSize,
  options,
);
const { width: viewportInlineSize, height: viewportBlockSize } = useElementSize(
  viewportElement,
  defaultSize,
  options,
);

const { x, y } = useScroll(viewportElement);

const style = computed(() => ({
  "--layout-scroll-length":
    direction === "vertical"
      ? `${scrollBlockLength.value}px`
      : `${scrollInlineLength.value}px`,
  "--layout-scroll-viewport":
    direction === "vertical"
      ? `${viewportBlockSize.value}px`
      : `${viewportInlineSize.value}px`,
  "--layout-scroll": direction === "vertical" ? `${y.value}px` : `${x.value}px`,
}));
</script>

<style>
.layout-scroll {
  --layout-viewport-block-size: 100%;
  --layout-viewport-inline-size: 100%;

  block-size: 100%;
  inline-size: 100%;
  display: block;
  isolation: isolate;
}

.layout-scroll-area {
  overflow: clip;
}
</style>
