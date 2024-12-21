<template>
  <LayoutTraitViewport direction="vertical">
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
  </LayoutTraitViewport>
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
.layout-root {
  min-block-size: 100dvb;
  display: block grid;
  grid-template: minmax(auto, 1fr) / 1fr;
  place-items: stretch;
  contain: content;

  --layout-scroll-viewport: 100dvb;
}
</style>
