<template>
  <LayoutViewport direction="vertical">
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
  </LayoutViewport>
</template>

<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutViewport from "~/components/layout/internal/Viewport.vue";
import type { MaybeRefOrGetter } from "vue";

const BREAKPOINT = Symbol.for("layout.breakpoint") as InjectionKey<
  MaybeRefOrGetter<BreakpointName>
>;

function provideBreakpoint(breakpoint: MaybeRefOrGetter) {
  provide(BREAKPOINT, breakpoint);
}

export function useBreakpoint() {
  return inject(BREAKPOINT, "mobile");
}

export function useResponsiveValue<T>(
  value: MaybeRefOrGetter<ResponsiveValue<T>>,
) {
  const breakpoint = useBreakpoint();
  return computed<T>(() => {
    const resolved = normalizeResponsive(toValue(value));
    return fillResponsive(resolved)[toValue(breakpoint)];
  });
}
</script>

<script setup lang="ts">
defineProps<PrimitiveProps>();
defineSlots<PrimitiveSlots>();

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutViewport = InternalLayoutViewport;

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

const style = computed(() => ({
  "--layout-scroll": `${y.value}px`,
  "--layout-scroll-length": `${height.value}px`,
}));

const isMounted = ref(false);
onMounted(() => {
  // nextTick(() => {
  isMounted.value = true;
  // });
});

onPrehydrate(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector<HTMLElement>(".layout-root");
    if (root) {
      root.style.setProperty("--layout-scroll", `${window.scrollY}px`);
      root.style.setProperty(
        "--layout-scroll-length",
        `${document.documentElement.scrollHeight}px`,
      );
    }
  });
});
</script>

<style>
@layer components.layout {
  .layout-root {
    min-block-size: 100dvb;
    display: block grid;
    grid-template: minmax(auto, 1fr) / 1fr;
    place-items: start stretch;
    contain: content;

    --layout-scroll-viewport: 100dvb;
  }
}
</style>
