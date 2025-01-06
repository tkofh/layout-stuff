<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

function bleedEdgeStyles(key: string, value: Space) {
  return responsiveToAttributes(
    key,
    mapResponsive(normalizeResponsive(value), (value) => SPACE_SCALE[value]),
  );
}

function bleedStyles(
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
    Object.assign(output, bleedEdgeStyles("--bleed-top", top));
  }
  if (hasRight) {
    Object.assign(output, bleedEdgeStyles("--bleed-right", right));
  }
  if (hasBottom) {
    Object.assign(output, bleedEdgeStyles("--bleed-bottom", bottom));
  }
  if (hasLeft) {
    Object.assign(output, bleedEdgeStyles("--bleed-left", left));
  }

  if (hasX && !hasXComponents) {
    Object.assign(output, bleedEdgeStyles("--bleed-x", x));
  }
  if (hasY && !hasYComponents) {
    Object.assign(output, bleedEdgeStyles("--bleed-y", y));
  }

  if (hasAll && hasUnassignedComponents) {
    Object.assign(output, bleedEdgeStyles("--bleed", all));
  }

  return output;
}

export interface BleedProps {
  bleed?: Space;
  bleedX?: Space;
  bleedY?: Space;
  bleedTop?: Space;
  bleedRight?: Space;
  bleedBottom?: Space;
  bleedLeft?: Space;
}

export type BleedSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<BleedProps>();
defineSlots<BleedSlots>();

const style = computed(() =>
  bleedStyles(
    props.bleed,
    props.bleedX,
    props.bleedY,
    props.bleedTop,
    props.bleedRight,
    props.bleedBottom,
    props.bleedLeft,
  ),
);
</script>

<template>
  <RadixSlot :style data-bleed>
    <slot />
  </RadixSlot>
</template>

<style>
@property --bleed {
  syntax: "*";
  inherits: false;
}

@property --bleed-tablet {
  syntax: "*";
  inherits: false;
}

@property --bleed-laptop {
  syntax: "*";
  inherits: false;
}

@property --bleed-desktop {
  syntax: "*";
  inherits: false;
}

@property --bleed-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --bleed-x {
  syntax: "*";
  inherits: false;
}

@property --bleed-x-tablet {
  syntax: "*";
  inherits: false;
}

@property --bleed-x-laptop {
  syntax: "*";
  inherits: false;
}

@property --bleed-x-desktop {
  syntax: "*";
  inherits: false;
}

@property --bleed-x-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --bleed-y {
  syntax: "*";
  inherits: false;
}

@property --bleed-y-tablet {
  syntax: "*";
  inherits: false;
}

@property --bleed-y-laptop {
  syntax: "*";
  inherits: false;
}

@property --bleed-y-desktop {
  syntax: "*";
  inherits: false;
}

@property --bleed-y-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --bleed-top {
  syntax: "*";
  inherits: false;
}

@property --bleed-top-tablet {
  syntax: "*";
  inherits: false;
}

@property --bleed-top-laptop {
  syntax: "*";
  inherits: false;
}

@property --bleed-top-desktop {
  syntax: "*";
  inherits: false;
}

@property --bleed-top-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --bleed-right {
  syntax: "*";
  inherits: false;
}

@property --bleed-right-tablet {
  syntax: "*";
  inherits: false;
}

@property --bleed-right-laptop {
  syntax: "*";
  inherits: false;
}

@property --bleed-right-desktop {
  syntax: "*";
  inherits: false;
}

@property --bleed-right-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --bleed-bottom {
  syntax: "*";
  inherits: false;
}

@property --bleed-bottom-tablet {
  syntax: "*";
  inherits: false;
}

@property --bleed-bottom-laptop {
  syntax: "*";
  inherits: false;
}

@property --bleed-bottom-desktop {
  syntax: "*";
  inherits: false;
}

@property --bleed-bottom-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --bleed-left {
  syntax: "*";
  inherits: false;
}

@property --bleed-left-tablet {
  syntax: "*";
  inherits: false;
}

@property --bleed-left-laptop {
  syntax: "*";
  inherits: false;
}

@property --bleed-left-desktop {
  syntax: "*";
  inherits: false;
}

@property --bleed-left-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@layer layout.init {
  [data-bleed] {
    --bleed-actual: max(var(--bleed), 0px);
    --bleed-x-actual: max(var(--bleed-x, var(--bleed-actual)), 0px);
    --bleed-y-actual: max(var(--bleed-y, var(--bleed-actual)), 0px);
    --bleed-top-actual: max(var(--bleed-top, var(--bleed-y-actual)), 0px);
    --bleed-right-actual: max(var(--bleed-right, var(--bleed-x-actual)), 0px);
    --bleed-bottom-actual: max(var(--bleed-bottom, var(--bleed-y-actual)), 0px);
    --bleed-left-actual: max(var(--bleed-left, var(--bleed-x-actual)), 0px);

    @container style(--media-gte-tablet: true) {
      --bleed-tablet: var(--bleed);
      --bleed-x-tablet: var(--bleed-x, var(--bleed-tablet));
      --bleed-y-tablet: var(--bleed-y, var(--bleed-tablet));
      --bleed-top-tablet: var(--bleed-top, var(--bleed-y-tablet));
      --bleed-right-tablet: var(--bleed-right, var(--bleed-x-tablet));
      --bleed-bottom-tablet: var(--bleed-bottom, var(--bleed-y-tablet));
      --bleed-left-tablet: var(--bleed-left, var(--bleed-x-tablet));
      --bleed-actual: max(var(--bleed-tablet), 0px);
      --bleed-x-actual: max(var(--bleed-x-tablet, var(--bleed-actual)), 0px);
      --bleed-y-actual: max(var(--bleed-y-tablet, var(--bleed-actual)), 0px);
      --bleed-top-actual: max(
        var(--bleed-top-tablet, var(--bleed-y-actual)),
        0px
      );
      --bleed-right-actual: max(
        var(--bleed-right-tablet, var(--bleed-x-actual)),
        0px
      );
      --bleed-bottom-actual: max(
        var(--bleed-bottom-tablet, var(--bleed-y-actual)),
        0px
      );
      --bleed-left-actual: max(
        var(--bleed-left-tablet, var(--bleed-x-actual)),
        0px
      );
    }

    @container style(--media-gte-laptop: true) {
      --bleed-laptop: var(--bleed-tablet);
      --bleed-x-laptop: var(--bleed-x-tablet, var(--bleed-laptop));
      --bleed-y-laptop: var(--bleed-y-tablet, var(--bleed-laptop));
      --bleed-top-laptop: var(--bleed-top-tablet, var(--bleed-y-laptop));
      --bleed-right-laptop: var(--bleed-right-tablet, var(--bleed-x-laptop));
      --bleed-bottom-laptop: var(--bleed-bottom-tablet, var(--bleed-y-laptop));
      --bleed-left-laptop: var(--bleed-left-tablet, var(--bleed-x-laptop));
      --bleed-actual: max(var(--bleed-laptop), 0px);
      --bleed-x-actual: max(var(--bleed-x-laptop, var(--bleed-actual)), 0px);
      --bleed-y-actual: max(var(--bleed-y-laptop, var(--bleed-actual)), 0px);
      --bleed-top-actual: max(
        var(--bleed-top-laptop, var(--bleed-y-actual)),
        0px
      );
      --bleed-right-actual: max(
        var(--bleed-right-laptop, var(--bleed-x-actual)),
        0px
      );
      --bleed-bottom-actual: max(
        var(--bleed-bottom-laptop, var(--bleed-y-actual)),
        0px
      );
      --bleed-left-actual: max(
        var(--bleed-left-laptop, var(--bleed-x-actual)),
        0px
      );
    }

    @container style(--media-eq-desktop: true) {
      --bleed-desktop: var(--bleed-laptop);
      --bleed-x-desktop: var(--bleed-x-laptop, var(--bleed-desktop));
      --bleed-y-desktop: var(--bleed-y-laptop, var(--bleed-desktop));
      --bleed-top-desktop: var(--bleed-top-laptop, var(--bleed-y-desktop));
      --bleed-right-desktop: var(--bleed-right-laptop, var(--bleed-x-desktop));
      --bleed-bottom-desktop: var(
        --bleed-bottom-laptop,
        var(--bleed-y-desktop)
      );
      --bleed-left-desktop: var(--bleed-left-laptop, var(--bleed-x-desktop));
      --bleed-actual: max(var(--bleed-desktop), 0px);
      --bleed-x-actual: max(var(--bleed-x-desktop, var(--bleed-actual)), 0px);
      --bleed-y-actual: max(var(--bleed-y-desktop, var(--bleed-actual)), 0px);
      --bleed-top-actual: max(
        var(--bleed-top-desktop, var(--bleed-y-actual)),
        0px
      );
      --bleed-right-actual: max(
        var(--bleed-right-desktop, var(--bleed-x-actual)),
        0px
      );
      --bleed-bottom-actual: max(
        var(--bleed-bottom-desktop, var(--bleed-y-actual)),
        0px
      );
      --bleed-left-actual: max(
        var(--bleed-left-desktop, var(--bleed-x-actual)),
        0px
      );
    }
  }
}

@layer layout.trait {
  [data-bleed] {
    margin: calc(-1 * var(--bleed-top-actual))
      calc(-1 * var(--bleed-right-actual)) calc(-1 * var(--bleed-bottom-actual))
      calc(-1 * var(--bleed-left-actual));

    &[data-sized] {
      --inline-size-adjustment: calc(
        var(--bleed-left-actual) + var(--bleed-right-actual)
      );
      --block-size-adjustment: calc(
        var(--bleed-top-actual) + var(--bleed-bottom-actual)
      );
    }
  }
}
</style>
