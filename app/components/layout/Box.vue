<template>
  <LayoutPrimitive :as class="layout-box" :style>
    <slot />
  </LayoutPrimitive>
</template>

<script lang="ts">
import type {
  PrimitiveProps,
  PrimitiveSlots,
} from "~/components/layout/Primitive.vue";

function parseLength(length?: Length): string | undefined {
  if (length === undefined) return undefined;
  if (typeof length === "number") return `${length}px`;

  const parsed = Number(length);
  if (Number.isFinite(parsed)) {
    return `${parsed}px`;
  }

  return length;
}

export type LengthUnit = "px" | "rem" | "%" | "dvb" | "dvi";
export type Length = number | `${number}` | `${number}${LengthUnit}`;

export interface BoxProps extends PrimitiveProps {
  width?: Length;
  height?: Length;
  aspectRatio?: number | `${number}` | `${number} / ${number}`;
  minWidth?: Length;
  minHeight?: Length;
  maxWidth?: Length;
  maxHeight?: Length;
}

export type BoxSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<BoxProps>();

const width = computed(() =>
  props.width !== undefined
    ? props.width
    : props.height === undefined || props.aspectRatio === undefined
      ? "100%"
      : undefined,
);
const height = computed(() =>
  props.height !== undefined
    ? props.height
    : props.width === undefined || props.aspectRatio === undefined
      ? "100%"
      : undefined,
);
defineSlots<BoxSlots>();

const style = computed(() => ({
  "--layout-box-min-block-size": parseLength(props.minHeight),
  "--layout-box-min-inline-size": parseLength(props.minWidth),
  "--layout-box-max-block-size": parseLength(props.maxHeight),
  "--layout-box-max-inline-size": parseLength(props.maxWidth),
  "--layout-box-block-size": parseLength(height.value),
  "--layout-box-inline-size": parseLength(width.value),
  "--layout-box-aspect-ratio": props.aspectRatio,
}));
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
