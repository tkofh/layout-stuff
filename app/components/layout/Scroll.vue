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
            <LayoutWrap role="should-unwrap">
              <slot />
            </LayoutWrap>
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
  provideScrollDirection,
  type ViewportProps,
} from "~/components/layout/internal/Viewport.vue";
import InternalLayoutSized, {
  type SizedProps,
} from "~/components/layout/internal/Sized.vue";
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutWrap from "~/components/layout/internal/Wrap.vue";

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
const LayoutWrap = InternalLayoutWrap;

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

provideScrollDirection(direction);

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
@layer layout.component {
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
