<template>
  <RadixScrollAreaRoot class="layout-scroll" as-child>
    <LayoutViewport :direction>
      <LayoutSized
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
      </LayoutSized>
    </LayoutViewport>
  </RadixScrollAreaRoot>
</template>

<script lang="ts">
import { RadixScrollAreaViewport } from "#components";
import InternalLayoutViewport, {
  provideViewport,
  type ViewportProps,
  type ScrollDirection,
} from "~/components/layout/internal/Viewport.vue";
import InternalLayoutSized, {
  type SizedProps,
} from "~/components/layout/internal/Sized.vue";
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import type { MaybeElementRef } from "@vueuse/core";

export function provideScrollArea(area: MaybeElementRef) {
  provide(Symbol.for("layout.scroll.area"), area);
}

export function useScrollArea() {
  return inject(Symbol.for("layout.scroll.area")) as MaybeElementRef;
}

export function provideScrollDirection(
  direction: MaybeRefOrGetter<ScrollDirection>,
) {
  provide(Symbol.for("layout.scroll.direction"), direction);
}

export function useScrollDirection() {
  return inject(
    Symbol.for("layout.scroll.direction"),
    () => "vertical",
  ) as MaybeRefOrGetter<ScrollDirection>;
}

export function provideScrollPosition(scroll: ComputedRef<number>) {
  provide(Symbol.for("layout.scroll.position"), scroll);
}

export function useScrollPosition() {
  return inject(Symbol.for("layout.scroll.position")) as ComputedRef<number>;
}

export interface LayoutScrollProps
  extends PrimitiveProps,
    SizedProps,
    ViewportProps {}

export interface LayoutScrollSlots extends PrimitiveSlots {
  indicators?: () => unknown;
}
</script>

<script setup lang="ts">
const { direction = "vertical" } = defineProps<LayoutScrollProps>();
defineSlots<LayoutScrollSlots>();

const LayoutViewport = InternalLayoutViewport;
const LayoutSized = InternalLayoutSized;
const LayoutPrimitive = InternalLayoutPrimitive;

const area = useTemplateRef<HTMLElement>("area");
const viewport =
  useTemplateRef<InstanceType<typeof RadixScrollAreaViewport>>("viewport");

const viewportElement = computed(() => viewport.value?.viewportElement);

provideViewport(viewportElement);

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

provideScrollArea(area);
provideScrollDirection(direction);
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
@layer components.layout {
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
}
</style>
