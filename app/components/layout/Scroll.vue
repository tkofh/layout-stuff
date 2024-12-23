<template>
  <RadixScrollAreaRoot class="layout-scroll" as-child>
    <LayoutTraitViewport :direction>
      <LayoutBox
        as="slot"
        :width
        :min-width
        :max-width
        :height
        :min-height
        :max-height
        :aspect-ratio
      >
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
      </LayoutBox>
    </LayoutTraitViewport>
  </RadixScrollAreaRoot>
</template>

<script lang="ts">
import type { ViewportProps } from "~/components/layout/trait/Viewport.vue";
import { RadixScrollAreaViewport } from "#components";
import type { BoxProps, BoxSlots } from "~/components/layout/Box.vue";

export function provideScrollPosition(scroll: ComputedRef<number>) {
  provide(Symbol.for("layout.scroll"), scroll);
}

export function useScrollPosition() {
  return inject(Symbol.for("layout.scroll")) as ComputedRef<number>;
}

export interface ScrollProps extends BoxProps, ViewportProps {}

export interface ScrollSlots extends BoxSlots {
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

const scroll = computed(() => (direction === "vertical" ? y.value : x.value));

provideScrollPosition(scroll);

const style = computed(() => ({
  "--layout-scroll-length":
    direction === "vertical"
      ? `${scrollBlockLength.value}px`
      : `${scrollInlineLength.value}px`,
  "--layout-scroll-viewport":
    direction === "vertical"
      ? `${viewportBlockSize.value}px`
      : `${viewportInlineSize.value}px`,
  "--layout-scroll": `${scroll.value}px`,
}));
</script>

<style>
.layout-scroll {
  --layout-viewport-block-size: 100%;
  --layout-viewport-inline-size: 100%;

  display: block;
  isolation: isolate;
  contain: content;

  &[data-viewport~="horizontal"] {
    container-type: inline-size;
  }

  &[data-viewport~="vertical"] {
    container-type: size;
  }
}

.layout-scroll-area {
  overflow: clip;

  [data-viewport~="horizontal"] & {
    min-block-size: 100%;
  }
}
</style>
