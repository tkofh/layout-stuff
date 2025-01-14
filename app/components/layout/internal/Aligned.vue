<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

const alignLookup = {
  left: "start",
  center: "center",
  right: "end",
} as const;

const alignYLookup = {
  top: "start",
  center: "center",
  bottom: "end",
} as const;

export type FlexAlign = "start" | "center" | "end";
export type VerticalAlignment = "top" | "center" | "bottom";
export type HorizontalAlignment = "left" | "center" | "right";

export function alignToFlexAlign(align: HorizontalAlignment): FlexAlign {
  return alignLookup[align];
}

export function alignYToFlexAlign(align: VerticalAlignment): FlexAlign {
  return alignYLookup[align];
}

export function reverseAlign(align: HorizontalAlignment): HorizontalAlignment {
  if (align === "left") {
    return "right";
  }

  if (align === "right") {
    return "left";
  }

  return align;
}

export type AlignedVerticalAlignment<T = never> = ResponsiveValue<
  VerticalAlignment | T
>;
export type AlignedHorizontalAlignment<T = never> = ResponsiveValue<
  HorizontalAlignment | T
>;

export interface AlignProps<T = never> {
  align?: AlignedHorizontalAlignment<T>;
}

export interface AlignYProps<T = never> {
  alignY?: AlignedVerticalAlignment<T>;
}

export interface Align2dProps<T = never>
  extends AlignProps<T>,
    AlignYProps<T> {}

export interface AlignedProps extends Align2dProps<"auto"> {
  mode?: "self" | "column" | "grid";
}

export type AlignedSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { align, alignY, mode } = defineProps<AlignedProps>();
defineSlots<AlignedSlots>();

const style = computed(() => ({
  ...responsiveToAttributes(
    "--layout-align",
    mapResponsive(normalizeResponsive(align ?? "auto"), (value) => {
      if (value === "auto") {
        return "unset";
      }

      return alignToFlexAlign(value);
    }),
  ),
  ...responsiveToAttributes(
    "--layout-align-y",
    mapResponsive(normalizeResponsive(alignY ?? "auto"), (value) => {
      if (value === "auto") {
        return "unset";
      }

      return alignYToFlexAlign(value);
    }),
  ),
}));

const data = useDataString(() => ({
  self: mode === "self",
  column: mode === "column",
  grid: mode === "grid",
}));
</script>

<template>
  <RadixSlot :data-aligned="data" :style>
    <slot />
  </RadixSlot>
</template>

<style>
@property --layout-align {
  syntax: "*";
  inherits: false;
}

@property --layout-align-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-align-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-align-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-align-actual {
  syntax: "start | center | end | normal";
  inherits: false;
  initial-value: normal;
}

@property --layout-align-y {
  syntax: "*";
  inherits: false;
}

@property --layout-align-y-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-align-y-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-align-y-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-align-y-actual {
  syntax: "start | center | end | normal";
  inherits: false;
  initial-value: normal;
}

@layer layout.init {
  [data-aligned] {
    --layout-align-actual: var(--layout-align);
    --layout-align-y-actual: var(--layout-align-y);

    @container style(--media-gte-tablet: true) {
      --layout-align-tablet: var(--layout-align);
      --layout-align-actual: var(--layout-align-tablet);
      --layout-align-y-tablet: var(--layout-align-y);
      --layout-align-y-actual: var(--layout-align-y-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-align-laptop: var(--layout-align-tablet);
      --layout-align-actual: var(--layout-align-laptop);
      --layout-align-y-laptop: var(--layout-align-y-tablet);
      --layout-align-y-actual: var(--layout-align-y-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-align-desktop: var(--layout-align-laptop);
      --layout-align-actual: var(--layout-align-desktop);
      --layout-align-y-desktop: var(--layout-align-y-laptop);
      --layout-align-y-actual: var(--layout-align-y-desktop);
    }
  }
}

@layer layout.trait {
  [data-aligned~="self"] {
    place-self: var(--layout-align-y-actual) var(--layout-align-actual);
  }

  [data-aligned~="column"] {
    align-items: var(--layout-align-actual);
    justify-content: var(--layout-align-y-actual);
  }

  [data-aligned~="grid"] {
    place-items: var(--layout-align-y-actual) var(--layout-align-actual);
  }
}
</style>
