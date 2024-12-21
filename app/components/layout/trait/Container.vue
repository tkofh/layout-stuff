<template>
  <RadixSlot :style data-layout-container>
    <slot />
  </RadixSlot>
</template>

<script lang="ts">
export type Align = "left" | "center" | "right";
export type AlignY = "top" | "center" | "bottom";
export type Space = number | `${number}` | `${number}${"px" | "rem"}`;

const alignLookup = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

const alignYLookup = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
} as const;

function frameStyles(
  all: Space | undefined,
  x: Space | undefined,
  y: Space | undefined,
  top: Space | undefined,
  right: Space | undefined,
  bottom: Space | undefined,
  left: Space | undefined,
) {
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
    output["--layout-frame-top"] = `${top}rem`;
  }
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

export interface AlignProps {
  align?: Align;
}

export interface Align2dProps extends AlignProps {
  alignY?: AlignY;
}

export interface SpaceProps {
  space?: Space;
}

export interface Space2dProps extends SpaceProps {
  spaceY?: Space;
}

export interface ContainerProps
  extends FrameProps,
    Align2dProps,
    Space2dProps {}

export interface ContainerSlots {
  default?: () => unknown;
}
</script>

<script setup lang="ts">
const { align, alignY, space, spaceY } = defineProps<ContainerProps>();
defineSlots<ContainerSlots>();
defineOptions({ inheritAttrs: false });
const style = computed(() => ({
  "--layout-align":
    align && align in alignLookup ? alignLookup[align] : undefined,
  "--layout-align-y":
    alignY && alignY in alignYLookup ? alignYLookup[alignY] : undefined,
  "--layout-space": space
    ? Number.isFinite(Number(space))
      ? `${space}rem`
      : space
    : undefined,
  "--layout-space-y": spaceY
    ? Number.isFinite(Number(spaceY))
      ? `${spaceY}rem`
      : spaceY
    : undefined,
}));
</script>

<style>
@property --layout-align {
  syntax: "flex-start | center | flex-end";
  inherits: false;
  initial-value: "flex-start";
}

@property --layout-align-y {
  syntax: "flex-start | center | flex-end";
  inherits: false;
  initial-value: "flex-start";
}

@property --layout-space {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-space-y {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

[data-layout-container] {
  --layout-space-y: var(--layout-space);
}
</style>
