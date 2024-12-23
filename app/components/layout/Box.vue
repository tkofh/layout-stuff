<template>
  <LayoutBoxTrait
    :width
    :height
    :aspect-ratio
    :min-width
    :min-height
    :max-width
    :max-height
  >
    <LayoutPrimitive :as>
      <slot />
    </LayoutPrimitive>
  </LayoutBoxTrait>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";
import type { BoxProps } from "~/components/layout/box/Trait.vue";

export interface LayoutBoxProps extends PrimitiveProps, BoxProps {}

export type LayoutBoxSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<LayoutBoxProps>();
defineSlots<LayoutBoxSlots>();
</script>

<style>
@property --layout-box-min-block-size {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --layout-box-min-inline-size {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --layout-box-max-block-size {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --layout-box-max-inline-size {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --layout-box-block-size {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --layout-box-inline-size {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --layout-box-aspect-ratio {
  syntax: "*";
  inherits: false;
  initial-value: none;
}

@layer components.layout {
  .layout-box {
    display: block flow-root;
    block-size: var(--layout-box-block-size);
    inline-size: var(--layout-box-inline-size);
    min-block-size: var(--layout-box-min-block-size);
    min-inline-size: var(--layout-box-min-inline-size);
    max-block-size: var(--layout-box-max-block-size);
    max-inline-size: var(--layout-box-max-inline-size);
    aspect-ratio: var(--layout-box-aspect-ratio);
  }
}
</style>
