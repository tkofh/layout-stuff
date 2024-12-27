<template>
  <LayoutViewportTrait direction="vertical">
    <LayoutPrimitive
      ref="root"
      :as
      class="layout-root"
      :data-layout-mounted="isMounted"
      data-allow-mismatch="style"
      :style
    >
      <slot />
    </LayoutPrimitive>
  </LayoutViewportTrait>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";
import {
  provideScrollPosition,
  provideScrollArea,
  provideScrollDirection,
} from "~/components/layout/Scroll.vue";
import { provideViewport } from "~/components/layout/viewport/Trait.vue";
import type { MaybeRefOrGetter } from "vue";

function provideBreakpoint(breakpoint: MaybeRefOrGetter) {
  provide(Symbol.for("layout.breakpoint"), breakpoint);
}

export function useBreakpoint() {
  return inject(
    Symbol.for("layout.breakpoint"),
  ) as MaybeRefOrGetter<BreakpointName>;
}
</script>

<script setup lang="ts">
defineProps<PrimitiveProps>();
defineSlots<PrimitiveSlots>();

const root = templateRef<HTMLElement>("root");

const { height } = useElementSize(root);
const { y } = useWindowScroll();
const { width: windowWidth } = useWindowSize();

provideBreakpoint(
  computed(() =>
    windowWidth.value >= 1440
      ? "desktop"
      : windowWidth.value >= 1024
        ? "laptop"
        : windowWidth.value >= 768
          ? "tablet"
          : "mobile",
  ),
);

provideScrollPosition(y as ComputedRef<number>);
provideScrollDirection("vertical");
provideScrollArea(
  computed(() => {
    if (import.meta.server) return null;

    return document.body;
  }),
);

if (import.meta.client) {
  provideViewport(document);
} else {
  provideViewport(null);
}

const style = computed(() => ({
  "--layout-scroll": `${y.value}px`,
  "--layout-scroll-length": `${height.value}px`,
}));

const isMounted = ref(false);
onMounted(() => {
  nextTick(() => {
    isMounted.value = true;
  });
});

onPrehydrate(() => {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.style.setProperty("--layout-scroll", `${window.scrollY}px`);
    document.body.style.setProperty(
      "--layout-scroll-length",
      `${document.documentElement.scrollHeight}px`,
    );
  });
});
</script>

<style>
@layer components.layout {
  .layout-root {
    min-block-size: 100dvb;
    display: block grid;
    grid-template: minmax(auto, 1fr) / 1fr;
    place-items: stretch;
    contain: content;

    --layout-scroll-viewport: 100dvb;
  }
}
</style>
