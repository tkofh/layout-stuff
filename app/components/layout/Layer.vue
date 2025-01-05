<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";

export interface LayerProps extends PrimitiveProps {
  layer?: ResponsiveValue<number | `${number}` | "auto">;
}

export type LayerSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<LayerProps>();
defineSlots<LayerSlots>();

const style = computed(() => ({
  ...responsiveToAttributes(
    "--layout-layer",
    compactResponsive(
      mapResponsive(
        fillResponsive(normalizeResponsive(props.layer)),
        (value) =>
          value === "auto"
            ? "auto"
            : Number.isFinite(Number(value))
              ? Math.round(Number(value))
              : "auto",
      ),
    ),
  ),
}));

const LayoutPrimitive = InternalLayoutPrimitive;
</script>

<template>
  <LayoutPrimitive :as class="layout-layer" :style>
    <slot />
  </LayoutPrimitive>
</template>

<style>
@property --layout-layer {
  syntax: "*";
  inherits: false;
}

@property --layout-layer-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-layer-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-layer-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-layer-current {
  syntax: "<integer> | auto";
  inherits: false;
  initial-value: auto;
}

@layer layout.init {
  .layout-layer {
    --layout-layer-current: var(--layout-layer);

    @container style(--media-gte-tablet: true) {
      --layout-layer-tablet: var(--layout-layer);
      --layout-layer-current: var(--layout-layer-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-layer-laptop: var(--layout-layer-tablet);
      --layout-layer-current: var(--layout-layer-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-layer-desktop: var(--layout-layer-laptop);
      --layout-layer-current: var(--layout-layer-desktop);
    }
  }
}

@layer layout.component {
  .layout-layer {
    grid-area: main;
    z-index: var(--layout-layer-current);

    :not(.layout-layers) > & {
      display: none;
    }
  }
}
</style>
