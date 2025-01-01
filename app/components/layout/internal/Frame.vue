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
    Object.assign(output, frameEdgeStyles("--layout-frame-top", top));
  }
  if (hasRight) {
    Object.assign(output, frameEdgeStyles("--layout-frame-right", right));
  }
  if (hasBottom) {
    Object.assign(output, frameEdgeStyles("--layout-frame-bottom", bottom));
  }
  if (hasLeft) {
    Object.assign(output, frameEdgeStyles("--layout-frame-left", left));
  }

  if (hasX && !hasXComponents) {
    Object.assign(output, frameEdgeStyles("--layout-frame-x", x));
  }
  if (hasY && !hasYComponents) {
    Object.assign(output, frameEdgeStyles("--layout-frame-y", y));
  }

  if (hasAll && hasUnassignedComponents) {
    Object.assign(output, frameEdgeStyles("--layout-frame", all));
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
  <RadixSlot class="layout-frame" :style>
    <slot />
  </RadixSlot>
</template>

<style>
@property --layout-frame {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-current {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-x {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-x-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-x-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-x-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-x-current {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-y {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-y-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-y-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-y-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-y-current {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-top {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-top-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-top-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-top-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-top-current {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-right {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-right-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-right-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-right-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-right-current {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-bottom {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-bottom-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-bottom-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-bottom-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-bottom-current {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-left {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-left-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-left-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-left-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-frame-left-current {
  syntax: "*";
  inherits: false;
}

@layer layout.trait {
  .layout-frame {
    --layout-frame: unset;
    --layout-frame-tablet: unset;
    --layout-frame-laptop: unset;
    --layout-frame-desktop: unset;
    --layout-frame-x: unset;
    --layout-frame-x-tablet: unset;
    --layout-frame-x-laptop: unset;
    --layout-frame-x-desktop: unset;
    --layout-frame-y: unset;
    --layout-frame-y-tablet: unset;
    --layout-frame-y-laptop: unset;
    --layout-frame-y-desktop: unset;
    --layout-frame-top: unset;
    --layout-frame-top-tablet: unset;
    --layout-frame-top-laptop: unset;
    --layout-frame-top-desktop: unset;
    --layout-frame-right: unset;
    --layout-frame-right-tablet: unset;
    --layout-frame-right-laptop: unset;
    --layout-frame-right-desktop: unset;
    --layout-frame-bottom: unset;
    --layout-frame-bottom-tablet: unset;
    --layout-frame-bottom-laptop: unset;
    --layout-frame-bottom-desktop: unset;
    --layout-frame-left: unset;
    --layout-frame-left-tablet: unset;
    --layout-frame-left-laptop: unset;
    --layout-frame-left-desktop: unset;
    --layout-frame-current: var(--layout-frame);
    --layout-frame-x-current: var(
      --layout-frame-x,
      var(--layout-frame-current)
    );
    --layout-frame-y-current: var(
      --layout-frame-y,
      var(--layout-frame-current)
    );
    --layout-frame-top-current: var(
      --layout-frame-top,
      var(--layout-frame-y-current)
    );
    --layout-frame-right-current: var(
      --layout-frame-right,
      var(--layout-frame-x-current)
    );
    --layout-frame-bottom-current: var(
      --layout-frame-bottom,
      var(--layout-frame-y-current)
    );
    --layout-frame-left-current: var(
      --layout-frame-left,
      var(--layout-frame-x-current)
    );

    padding: var(--layout-frame-top-current) var(--layout-frame-right-current)
      var(--layout-frame-bottom-current) var(--layout-frame-left-current);

    @container style(--media-gte-tablet: true) {
      --layout-frame-tablet: var(--layout-frame);
      --layout-frame-x-tablet: var(
        --layout-frame-x,
        var(--layout-frame-tablet)
      );
      --layout-frame-y-tablet: var(
        --layout-frame-y,
        var(--layout-frame-tablet)
      );
      --layout-frame-top-tablet: var(
        --layout-frame-top,
        var(--layout-frame-y-tablet)
      );
      --layout-frame-right-tablet: var(
        --layout-frame-right,
        var(--layout-frame-x-tablet)
      );
      --layout-frame-bottom-tablet: var(
        --layout-frame-bottom,
        var(--layout-frame-y-tablet)
      );
      --layout-frame-left-tablet: var(
        --layout-frame-left,
        var(--layout-frame-x-tablet)
      );
      --layout-frame-current: var(--layout-frame-tablet);
      --layout-frame-x-current: var(
        --layout-frame-x-tablet,
        var(--layout-frame-current)
      );
      --layout-frame-y-current: var(
        --layout-frame-y-tablet,
        var(--layout-frame-current)
      );
      --layout-frame-top-current: var(
        --layout-frame-top-tablet,
        var(--layout-frame-y-current)
      );
      --layout-frame-right-current: var(
        --layout-frame-right-tablet,
        var(--layout-frame-x-current)
      );
      --layout-frame-bottom-current: var(
        --layout-frame-bottom-tablet,
        var(--layout-frame-y-current)
      );
      --layout-frame-left-current: var(
        --layout-frame-left-tablet,
        var(--layout-frame-x-current)
      );
    }

    @container style(--media-gte-laptop: true) {
      --layout-frame-laptop: var(--layout-frame-tablet);
      --layout-frame-x-laptop: var(
        --layout-frame-x-tablet,
        var(--layout-frame-laptop)
      );
      --layout-frame-y-laptop: var(
        --layout-frame-y-tablet,
        var(--layout-frame-laptop)
      );
      --layout-frame-top-laptop: var(
        --layout-frame-top-tablet,
        var(--layout-frame-y-laptop)
      );
      --layout-frame-right-laptop: var(
        --layout-frame-right-tablet,
        var(--layout-frame-x-laptop)
      );
      --layout-frame-bottom-laptop: var(
        --layout-frame-bottom-tablet,
        var(--layout-frame-y-laptop)
      );
      --layout-frame-left-laptop: var(
        --layout-frame-left-tablet,
        var(--layout-frame-x-laptop)
      );
      --layout-frame-current: var(--layout-frame-laptop);
      --layout-frame-x-current: var(
        --layout-frame-x-laptop,
        var(--layout-frame-current)
      );
      --layout-frame-y-current: var(
        --layout-frame-y-laptop,
        var(--layout-frame-current)
      );
      --layout-frame-top-current: var(
        --layout-frame-top-laptop,
        var(--layout-frame-y-current)
      );
      --layout-frame-right-current: var(
        --layout-frame-right-laptop,
        var(--layout-frame-x-current)
      );
      --layout-frame-bottom-current: var(
        --layout-frame-bottom-laptop,
        var(--layout-frame-y-current)
      );
      --layout-frame-left-current: var(
        --layout-frame-left-laptop,
        var(--layout-frame-x-current)
      );
    }

    @container style(--media-eq-desktop: true) {
      --layout-frame-desktop: var(--layout-frame-laptop);
      --layout-frame-x-desktop: var(
        --layout-frame-x-laptop,
        var(--layout-frame-desktop)
      );
      --layout-frame-y-desktop: var(
        --layout-frame-y-laptop,
        var(--layout-frame-desktop)
      );
      --layout-frame-top-desktop: var(
        --layout-frame-top-laptop,
        var(--layout-frame-y-desktop)
      );
      --layout-frame-right-desktop: var(
        --layout-frame-right-laptop,
        var(--layout-frame-x-desktop)
      );
      --layout-frame-bottom-desktop: var(
        --layout-frame-bottom-laptop,
        var(--layout-frame-y-desktop)
      );
      --layout-frame-left-desktop: var(
        --layout-frame-left-laptop,
        var(--layout-frame-x-desktop)
      );
      --layout-frame-current: var(--layout-frame-desktop);
      --layout-frame-x-current: var(
        --layout-frame-x-desktop,
        var(--layout-frame-current)
      );
      --layout-frame-y-current: var(
        --layout-frame-y-desktop,
        var(--layout-frame-current)
      );
      --layout-frame-top-current: var(
        --layout-frame-top-desktop,
        var(--layout-frame-y-current)
      );
      --layout-frame-right-current: var(
        --layout-frame-right-desktop,
        var(--layout-frame-x-current)
      );
      --layout-frame-bottom-current: var(
        --layout-frame-bottom-desktop,
        var(--layout-frame-y-current)
      );
      --layout-frame-left-current: var(
        --layout-frame-left-desktop,
        var(--layout-frame-x-current)
      );
    }
  }
}
</style>
