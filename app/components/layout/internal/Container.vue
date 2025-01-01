<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

export type Align = ResponsiveValue<"left" | "center" | "right">;
export type AlignY = ResponsiveValue<"top" | "center" | "bottom">;

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

function alignStyles(align: Align | undefined) {
  if (align === undefined) return {};

  return responsiveToAttributes(
    "--layout-align",
    mapResponsive(normalizeResponsive(align), (value) => alignLookup[value]),
  );
}

function alignYStyles(alignY: AlignY | undefined) {
  if (alignY === undefined) return {};

  return responsiveToAttributes(
    "--layout-align-y",
    mapResponsive(normalizeResponsive(alignY), (value) => alignYLookup[value]),
  );
}

function spaceStyles(space: Space | undefined) {
  if (space === undefined) return {};

  return responsiveToAttributes(
    "--layout-space",
    mapResponsive(normalizeResponsive(space), (value) => SPACE_SCALE[value]),
  );
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

export interface CollapseBelowProps {
  collapseBelow?: BreakpointsExcept<"mobile">;
}

export interface ContainerProps
  extends Align2dProps,
    SpaceProps,
    CollapseBelowProps {}

export type ContainerSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { align, alignY, space, collapseBelow } = defineProps<ContainerProps>();
defineSlots<ContainerSlots>();
const style = computed(() => ({
  ...alignStyles(align),
  ...alignYStyles(alignY),
  ...spaceStyles(space),
}));
</script>

<template>
  <RadixSlot
    :style
    class="layout-container"
    :data-collapse-below="collapseBelow ?? 'none'"
  >
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

@property --layout-align-current {
  syntax: "flex-start | center | flex-end";
  inherits: false;
  initial-value: flex-start;
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

@property --layout-align-y-current {
  syntax: "flex-start | center | flex-end";
  inherits: false;
  initial-value: flex-start;
}

@property --layout-space {
  syntax: "*";
  inherits: false;
}

@property --layout-space-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-space-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-space-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-space-current {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-collapse-below-direction-initial {
  syntax: "row | column | row-reverse | column-reverse";
  inherits: false;
  initial-value: row;
}

@property --layout-collapse-below-direction-collapsed {
  syntax: "row | column | row-reverse | column-reverse";
  inherits: false;
  initial-value: column;
}

@property --layout-collapse-below-direction-current {
  syntax: "row | column | row-reverse | column-reverse";
  inherits: false;
  initial-value: column;
}

@layer layout.trait {
  .layout-container {
    --layout-align: unset;
    --layout-align-tablet: unset;
    --layout-align-laptop: unset;
    --layout-align-desktop: unset;
    --layout-align-current: var(--layout-align);
    --layout-align-y: unset;
    --layout-align-y-tablet: unset;
    --layout-align-y-laptop: unset;
    --layout-align-y-desktop: unset;
    --layout-align-y-current: var(--layout-align-y);
    --layout-space: unset;
    --layout-space-tablet: unset;
    --layout-space-laptop: unset;
    --layout-space-desktop: unset;
    --layout-space-current: var(--layout-space);
    --layout-collapse-below-direction-initial: initial;
    --layout-collapse-below-direction-collapsed: initial;
    --layout-collapse-below-direction-current: initial;

    &[data-collapse-below="none"] {
      --layout-collapse-below-direction-current: var(
        --layout-collapse-below-direction-initial
      );
    }

    &:not([data-collapse-below="none"]) {
      --layout-collapse-below-direction-current: var(
        --layout-collapse-below-direction-collapsed
      );
    }

    @container style(--media-gte-tablet: true) {
      --layout-align-tablet: var(--layout-align);
      --layout-align-current: var(--layout-align-tablet);
      --layout-align-y-tablet: var(--layout-align-y);
      --layout-align-y-current: var(--layout-align-y-tablet);
      --layout-space-tablet: var(--layout-space);
      --layout-space-current: var(--layout-space-tablet);

      &[data-collapse-below="tablet"] {
        --layout-collapse-below-direction-current: var(
          --layout-collapse-below-direction-initial
        );
      }
    }

    @container style(--media-gte-laptop: true) {
      --layout-align-laptop: var(--layout-align-tablet);
      --layout-align-current: var(--layout-align-laptop);
      --layout-align-y-laptop: var(--layout-align-y-tablet);
      --layout-align-y-current: var(--layout-align-y-laptop);
      --layout-space-laptop: var(--layout-space-tablet);
      --layout-space-current: var(--layout-space-laptop);

      &[data-collapse-below="laptop"] {
        --layout-collapse-below-direction-current: var(
          --layout-collapse-below-direction-initial
        );
      }
    }

    @container style(--media-eq-desktop: true) {
      --layout-align-desktop: var(--layout-align-laptop);
      --layout-align-current: var(--layout-align-desktop);
      --layout-align-y-desktop: var(--layout-align-y-laptop);
      --layout-align-y-current: var(--layout-align-y-desktop);
      --layout-space-desktop: var(--layout-space-laptop);
      --layout-space-current: var(--layout-space-desktop);

      &[data-collapse-below="desktop"] {
        --layout-collapse-below-direction-current: var(
          --layout-collapse-below-direction-initial
        );
      }
    }
  }
}
</style>
