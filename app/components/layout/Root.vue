<template>
  <LayoutPrimitive
    ref="root"
    :as
    class="layout-root layout-scroll-vertical"
    :data-layout-mounted="isMounted"
    data-allow-mismatch="style"
    :style
  >
    <slot />
  </LayoutPrimitive>
</template>

<script setup lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";

defineProps<PrimitiveProps>();
defineSlots<PrimitiveSlots>();

const root = templateRef<HTMLElement>("root");

const { height } = useElementSize(root);
const { y } = useWindowScroll();

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
@property --layout-scroll {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-scroll-length {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-scroll-top {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-scroll-bottom {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

.layout-root {
  min-block-size: 100dvb;
  display: block grid;
  grid-template: minmax(auto, 1fr) / 1fr;
  place-items: stretch;
  contain: content;

  --layout-scroll-top: max(0px, var(--layout-scroll));
  --layout-scroll-bottom: max(
    0px,
    var(--layout-scroll-length) - var(--layout-scroll) - 100dvb
  );
}
</style>
