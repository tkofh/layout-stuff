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
    "--layer",
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
@property --layer {
  syntax: "*";
  inherits: false;
}

@property --layer-tablet {
  syntax: "*";
  inherits: false;
}

@property --layer-laptop {
  syntax: "*";
  inherits: false;
}

@property --layer-desktop {
  syntax: "*";
  inherits: false;
}

@property --layer-actual {
  syntax: "<integer> | auto";
  inherits: false;
  initial-value: auto;
}

@layer layout.init {
  .layout-layer {
    --layer-actual: var(--layer);

    @container style(--media-gte-tablet: true) {
      --layer-tablet: var(--layer);
      --layer-actual: var(--layer-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layer-laptop: var(--layer-tablet);
      --layer-actual: var(--layer-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layer-desktop: var(--layer-laptop);
      --layer-actual: var(--layer-desktop);
    }
  }
}

@layer layout.component {
  .layout-layer {
    grid-area: main;
    z-index: var(--layer-actual);

    :not(.layout-layers) > & {
      display: none;
    }
  }
}
</style>
