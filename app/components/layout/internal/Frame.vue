<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

function frameEdgeStyles(key: string, value: Space) {
  return responsiveToAttributes(
    key,
    mapResponsive(normalizeResponsive(value), (value) => SPACE_SCALE[value]),
  );
}

function frameStyles(
  all: Space | undefined,
  x: Space | undefined,
  y: Space | undefined,
  top: Space | undefined,
  right: Space | undefined,
  bottom: Space | undefined,
  left: Space | undefined,
): Record<string, string> {
  const hasAll = all !== undefined;
  const hasX = x !== undefined;
  const hasY = y !== undefined;
  const hasTop = top !== undefined;
  const hasRight = right !== undefined;
  const hasBottom = bottom !== undefined;
  const hasLeft = left !== undefined;

  const hasXComponents = hasLeft && hasRight;
  const hasYComponents = hasTop && hasBottom;
  const hasAnyX = hasX || hasXComponents;
  const hasAnyY = hasY || hasYComponents;

  const hasUnassignedComponents = !hasAnyX || !hasAnyY;

  const output = {} as Record<string, string>;

  if (hasTop) {
    Object.assign(output, frameEdgeStyles("--frame-top", top));
  }
  if (hasRight) {
    Object.assign(output, frameEdgeStyles("--frame-right", right));
  }
  if (hasBottom) {
    Object.assign(output, frameEdgeStyles("--frame-bottom", bottom));
  }
  if (hasLeft) {
    Object.assign(output, frameEdgeStyles("--frame-left", left));
  }

  if (hasX && !hasXComponents) {
    Object.assign(output, frameEdgeStyles("--frame-x", x));
  }
  if (hasY && !hasYComponents) {
    Object.assign(output, frameEdgeStyles("--frame-y", y));
  }

  if (hasAll && hasUnassignedComponents) {
    Object.assign(output, frameEdgeStyles("--frame", all));
  }

  return output;
}

export interface FrameProps {
  frame?: Space;
  frameX?: Space;
  frameY?: Space;
  frameTop?: Space;
  frameRight?: Space;
  frameBottom?: Space;
  frameLeft?: Space;
}

export type FrameSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<FrameProps>();
defineSlots<FrameSlots>();

const style = computed(() =>
  frameStyles(
    props.frame,
    props.frameX,
    props.frameY,
    props.frameTop,
    props.frameRight,
    props.frameBottom,
    props.frameLeft,
  ),
);
</script>

<template>
  <RadixSlot :style data-framed>
    <slot />
  </RadixSlot>
</template>

<style>
@property --frame {
  syntax: "*";
  inherits: false;
}

@property --frame-tablet {
  syntax: "*";
  inherits: false;
}

@property --frame-laptop {
  syntax: "*";
  inherits: false;
}

@property --frame-desktop {
  syntax: "*";
  inherits: false;
}

@property --frame-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --frame-x {
  syntax: "*";
  inherits: false;
}

@property --frame-x-tablet {
  syntax: "*";
  inherits: false;
}

@property --frame-x-laptop {
  syntax: "*";
  inherits: false;
}

@property --frame-x-desktop {
  syntax: "*";
  inherits: false;
}

@property --frame-x-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --frame-y {
  syntax: "*";
  inherits: false;
}

@property --frame-y-tablet {
  syntax: "*";
  inherits: false;
}

@property --frame-y-laptop {
  syntax: "*";
  inherits: false;
}

@property --frame-y-desktop {
  syntax: "*";
  inherits: false;
}

@property --frame-y-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --frame-top {
  syntax: "*";
  inherits: false;
}

@property --frame-top-tablet {
  syntax: "*";
  inherits: false;
}

@property --frame-top-laptop {
  syntax: "*";
  inherits: false;
}

@property --frame-top-desktop {
  syntax: "*";
  inherits: false;
}

@property --frame-top-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --frame-right {
  syntax: "*";
  inherits: false;
}

@property --frame-right-tablet {
  syntax: "*";
  inherits: false;
}

@property --frame-right-laptop {
  syntax: "*";
  inherits: false;
}

@property --frame-right-desktop {
  syntax: "*";
  inherits: false;
}

@property --frame-right-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --frame-bottom {
  syntax: "*";
  inherits: false;
}

@property --frame-bottom-tablet {
  syntax: "*";
  inherits: false;
}

@property --frame-bottom-laptop {
  syntax: "*";
  inherits: false;
}

@property --frame-bottom-desktop {
  syntax: "*";
  inherits: false;
}

@property --frame-bottom-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --frame-left {
  syntax: "*";
  inherits: false;
}

@property --frame-left-tablet {
  syntax: "*";
  inherits: false;
}

@property --frame-left-laptop {
  syntax: "*";
  inherits: false;
}

@property --frame-left-desktop {
  syntax: "*";
  inherits: false;
}

@property --frame-left-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@layer layout.init {
  [data-framed] {
    --frame-actual: var(--frame);
    --frame-x-actual: var(--frame-x, var(--frame-actual));
    --frame-y-actual: var(--frame-y, var(--frame-actual));
    --frame-top-actual: var(--frame-top, var(--frame-y-actual));
    --frame-right-actual: var(--frame-right, var(--frame-x-actual));
    --frame-bottom-actual: var(--frame-bottom, var(--frame-y-actual));
    --frame-left-actual: var(--frame-left, var(--frame-x-actual));

    @container style(--media-gte-tablet: true) {
      --frame-tablet: var(--frame);
      --frame-x-tablet: var(--frame-x, var(--frame-tablet));
      --frame-y-tablet: var(--frame-y, var(--frame-tablet));
      --frame-top-tablet: var(--frame-top, var(--frame-y-tablet));
      --frame-right-tablet: var(--frame-right, var(--frame-x-tablet));
      --frame-bottom-tablet: var(--frame-bottom, var(--frame-y-tablet));
      --frame-left-tablet: var(--frame-left, var(--frame-x-tablet));
      --frame-actual: var(--frame-tablet);
      --frame-x-actual: var(--frame-x-tablet, var(--frame-actual));
      --frame-y-actual: var(--frame-y-tablet, var(--frame-actual));
      --frame-top-actual: var(--frame-top-tablet, var(--frame-y-actual));
      --frame-right-actual: var(--frame-right-tablet, var(--frame-x-actual));
      --frame-bottom-actual: var(--frame-bottom-tablet, var(--frame-y-actual));
      --frame-left-actual: var(--frame-left-tablet, var(--frame-x-actual));
    }

    @container style(--media-gte-laptop: true) {
      --frame-laptop: var(--frame-tablet);
      --frame-x-laptop: var(--frame-x-tablet, var(--frame-laptop));
      --frame-y-laptop: var(--frame-y-tablet, var(--frame-laptop));
      --frame-top-laptop: var(--frame-top-tablet, var(--frame-y-laptop));
      --frame-right-laptop: var(--frame-right-tablet, var(--frame-x-laptop));
      --frame-bottom-laptop: var(--frame-bottom-tablet, var(--frame-y-laptop));
      --frame-left-laptop: var(--frame-left-tablet, var(--frame-x-laptop));
      --frame-actual: var(--frame-laptop);
      --frame-x-actual: var(--frame-x-laptop, var(--frame-actual));
      --frame-y-actual: var(--frame-y-laptop, var(--frame-actual));
      --frame-top-actual: var(--frame-top-laptop, var(--frame-y-actual));
      --frame-right-actual: var(--frame-right-laptop, var(--frame-x-actual));
      --frame-bottom-actual: var(--frame-bottom-laptop, var(--frame-y-actual));
      --frame-left-actual: var(--frame-left-laptop, var(--frame-x-actual));
    }

    @container style(--media-eq-desktop: true) {
      --frame-desktop: var(--frame-laptop);
      --frame-x-desktop: var(--frame-x-laptop, var(--frame-desktop));
      --frame-y-desktop: var(--frame-y-laptop, var(--frame-desktop));
      --frame-top-desktop: var(--frame-top-laptop, var(--frame-y-desktop));
      --frame-right-desktop: var(--frame-right-laptop, var(--frame-x-desktop));
      --frame-bottom-desktop: var(
        --frame-bottom-laptop,
        var(--frame-y-desktop)
      );
      --frame-left-desktop: var(--frame-left-laptop, var(--frame-x-desktop));
      --frame-actual: var(--frame-desktop);
      --frame-x-actual: var(--frame-x-desktop, var(--frame-actual));
      --frame-y-actual: var(--frame-y-desktop, var(--frame-actual));
      --frame-top-actual: var(--frame-top-desktop, var(--frame-y-actual));
      --frame-right-actual: var(--frame-right-desktop, var(--frame-x-actual));
      --frame-bottom-actual: var(--frame-bottom-desktop, var(--frame-y-actual));
      --frame-left-actual: var(--frame-left-desktop, var(--frame-x-actual));
    }
  }
}

@layer layout.trait {
  [data-framed] {
    padding: var(--frame-top-actual) var(--frame-right-actual)
      var(--frame-bottom-actual) var(--frame-left-actual);
  }
}
</style>
