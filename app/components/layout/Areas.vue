<template>
  <LayoutPrimitive :as class="layout-areas" :style>
    <RadixSlot
      v-if="slots.top"
      ref="top"
      class="layout-area"
      :data-layout-area="areas.top"
    >
      <slot name="top" />
    </RadixSlot>
    <RadixSlot
      v-if="slots.left"
      ref="left"
      class="layout-area"
      :data-layout-area="areas.left"
    >
      <slot name="left" />
    </RadixSlot>
    <RadixSlot
      v-if="slots.right"
      ref="right"
      class="layout-area"
      :data-layout-area="areas.right"
    >
      <slot name="right" />
    </RadixSlot>
    <RadixSlot class="layout-area" data-layout-area="main">
      <slot name="main">
        <AppPlaceholder label="Main" />
      </slot>
    </RadixSlot>
    <RadixSlot
      v-if="slots.bottom"
      ref="bottom"
      class="layout-area"
      :data-layout-area="areas.bottom"
    >
      <slot name="bottom" />
    </RadixSlot>
  </LayoutPrimitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from "~/components/layout/Primitive.vue";

const defaultSmall = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
  x: "y",
  y: "x",
} as const;

export type AreaAxis = "x" | "y";
export type AreaEdge = "top" | "right" | "bottom" | "left";
export type AreaLarge = AreaEdge | AreaAxis;
export type AreaSmall<L extends AreaLarge> = L extends AreaAxis
  ? Exclude<AreaAxis, L>
  : Exclude<AreaEdge, L>;

export interface AreaProps<L extends AreaLarge> extends PrimitiveProps {
  large?: L;
  small?: AreaSmall<L>;
}

export interface AreasSlots {
  top?: () => unknown;
  left?: () => unknown;
  right?: () => unknown;
  bottom?: () => unknown;
  main?: () => unknown;
}
</script>

<script setup lang="ts" generic="L extends AreaLarge">
const props = defineProps<AreaProps<L>>();
const slots = defineSlots<AreasSlots>();

const areas = computed(() => {
  const large = props.large ?? "top";
  const small =
    props.small == null || props.small === large
      ? defaultSmall[large]
      : props.small;

  if (large === "x") {
    return {
      top: "top",
      right: "right start end",
      bottom: "bottom",
      left: "left start end",
    };
  } else if (large === "y") {
    return {
      top: "top start end",
      right: "right",
      bottom: "bottom start end",
      left: "left",
    };
  } else if (large === "top") {
    if (small === "left") {
      return {
        top: "top start end",
        right: "right end",
        bottom: "bottom start",
        left: "left",
      };
    } else if (small === "bottom") {
      return {
        top: "top start end",
        right: "right end",
        bottom: "bottom",
        left: "left end",
      };
    } else {
      return {
        top: "top start end",
        right: "right",
        bottom: "bottom end",
        left: "left end",
      };
    }
  } else if (large === "right") {
    if (small === "top") {
      return {
        top: "top",
        right: "right start end",
        bottom: "bottom start",
        left: "left start",
      };
    } else if (small === "left") {
      return {
        top: "top start",
        right: "right start end",
        bottom: "bottom start",
        left: "left",
      };
    } else {
      return {
        top: "top start",
        right: "right start end",
        bottom: "bottom",
        left: "left end",
      };
    }
  } else if (large === "bottom") {
    if (small === "right") {
      return {
        top: "top end",
        right: "right",
        bottom: "bottom start end",
        left: "left start",
      };
    } else if (small === "top") {
      return {
        top: "top",
        right: "right start",
        bottom: "bottom start end",
        left: "left start",
      };
    } else {
      return {
        top: "top start",
        right: "right start",
        bottom: "bottom start end",
        left: "left",
      };
    }
  } else {
    if (small === "bottom") {
      return {
        top: "top end",
        right: "right end",
        bottom: "bottom",
        left: "left start end",
      };
    } else if (small === "right") {
      return {
        top: "top end",
        right: "right",
        bottom: "bottom end",
        left: "left start end",
      };
    } else {
      return {
        top: "top",
        right: "right start",
        bottom: "bottom end",
        left: "left start end",
      };
    }
  }
});

const top = templateRef<HTMLElement>("top");
const right = templateRef<HTMLElement>("right");
const bottom = templateRef<HTMLElement>("bottom");
const left = templateRef<HTMLElement>("left");

const defaultSize = { height: 0, width: 0 } as const;
const sizeOptions = { box: "border-box" } as const;

const { height: topSize } = useElementSize(top, defaultSize, sizeOptions);
const { width: rightSize } = useElementSize(right, defaultSize, sizeOptions);
const { height: bottomSize } = useElementSize(bottom, defaultSize, sizeOptions);
const { width: leftSize } = useElementSize(left, defaultSize, sizeOptions);

const style = computed(() => ({
  "--layout-areas-size-top":
    topSize.value !== 0 ? `${topSize.value}px` : undefined,
  "--layout-areas-size-right":
    rightSize.value !== 0 ? `${rightSize.value}px` : undefined,
  "--layout-areas-size-bottom":
    bottomSize.value !== 0 ? `${bottomSize.value}px` : undefined,
  "--layout-areas-size-left":
    leftSize.value !== 0 ? `${leftSize.value}px` : undefined,
}));
</script>

<style>
@property --layout-areas-size-top {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-areas-size-right {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-areas-size-bottom {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-areas-size-right {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-sticky-clip-start {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-sticky-clip-end {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-sticky-area-size {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

.layout-areas {
  --layout-areas-size-top: initial;
  --layout-areas-size-right: initial;
  --layout-areas-size-bottom: initial;
  --layout-areas-size-left: initial;

  display: block grid;
  block-size: 100%;
  inline-size: 100%;
  grid-template: auto minmax(auto, 1fr) auto / auto 1fr auto;
  place-items: stretch;

  [data-viewport~="vertical"] & {
    &
      > .layout-sticky:is(
        [data-layout-area~="left"],
        [data-layout-area~="right"]
      ) {
      --layout-sticky-clip-start: max(
        var(--layout-sticky-start-offset),
        var(--layout-areas-size-top) - var(--layout-scroll-start)
      );
      --layout-sticky-clip-end: max(
        var(--layout-sticky-end-offset),
        var(--layout-areas-size-bottom) - var(--layout-scroll-end)
      );
    }

    &:has(> .layout-sticky[data-layout-area~="top"][data-layout-area~="start"])
      > .layout-sticky[data-layout-area~="left"],
    &:has(> .layout-sticky[data-layout-area~="top"][data-layout-area~="end"])
      > .layout-sticky[data-layout-area~="right"] {
      --layout-sticky-start-offset: var(--layout-areas-size-top);
    }

    &:has(
        > .layout-sticky[data-layout-area~="bottom"][data-layout-area~="start"]
      )
      > .layout-sticky[data-layout-area~="left"],
    &:has(> .layout-sticky[data-layout-area~="bottom"][data-layout-area~="end"])
      > .layout-sticky[data-layout-area~="right"] {
      --layout-sticky-end-offset: var(--layout-areas-size-bottom);
    }
  }

  [data-viewport~="horizontal"] & {
    &
      > .layout-sticky:is(
        [data-layout-area~="top"],
        [data-layout-area~="bottom"]
      ) {
      --layout-sticky-clip-start: max(
        var(--layout-sticky-start-offset),
        var(--layout-areas-size-top) - var(--layout-scroll-start)
      );
      --layout-sticky-clip-end: max(
        var(--layout-sticky-end-offset),
        var(--layout-areas-size-bottom) - var(--layout-scroll-end)
      );
    }

    &:has(> .layout-sticky[data-layout-area~="left"][data-layout-area~="start"])
      > .layout-sticky[data-layout-area~="top"],
    &:has(> .layout-sticky[data-layout-area~="left"][data-layout-area~="end"])
      > .layout-sticky[data-layout-area~="bottom"] {
      --layout-sticky-start-offset: var(--layout-areas-size-left);
    }

    &:has(
        > .layout-sticky[data-layout-area~="right"][data-layout-area~="start"]
      )
      > .layout-sticky[data-layout-area~="top"],
    &:has(> .layout-sticky[data-layout-area~="right"][data-layout-area~="end"])
      > .layout-sticky[data-layout-area~="bottom"] {
      --layout-sticky-end-offset: var(--layout-areas-size-right);
    }
  }
}

.layout-area {
  z-index: 0;

  &[data-layout-area~="top"] {
    grid-row: 1 / 2;
    grid-column: 2 / 3;

    &[data-layout-area~="start"] {
      grid-column-start: 1;
    }

    &[data-layout-area~="end"] {
      grid-column-end: 4;
    }
  }

  &[data-layout-area~="right"] {
    grid-row: 2 / 3;
    grid-column: 3 / 4;

    &[data-layout-area~="start"] {
      grid-row-start: 1;
    }

    &[data-layout-area~="end"] {
      grid-row-end: 4;
    }
  }

  &[data-layout-area~="bottom"] {
    grid-row: 3 / 4;
    grid-column: 2 / 3;

    &[data-layout-area~="start"] {
      grid-column-start: 1;
    }

    &[data-layout-area~="end"] {
      grid-column-end: 4;
    }
  }

  &[data-layout-area~="left"] {
    grid-row: 2 / 3;
    grid-column: 1 / 2;

    &[data-layout-area~="start"] {
      grid-row-start: 1;
    }

    &[data-layout-area~="end"] {
      grid-row-end: 4;
    }
  }

  &[data-layout-area="main"] {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
  }

  &.layout-sticky {
    z-index: 1;

    [data-viewport~="vertical"]
      &:is([data-layout-area~="left"], [data-layout-area~="right"]) {
      --layout-sticky-area-size: calc(
        var(--layout-scroll-viewport) - var(--layout-sticky-clip-start) -
          var(--layout-sticky-clip-end)
      );

      block-size: var(--layout-sticky-area-size);
      margin-block-end: calc(-1 * var(--layout-sticky-area-size));

      [data-layout-mounted="false"] & {
        z-index: -1;

        --layout-sticky-start: unset !important;
        --layout-sticky-end: unset !important;
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    [data-viewport~="horizontal"]
      &:is([data-layout-area~="top"], [data-layout-area~="bottom"]) {
      --layout-sticky-area-size: calc(
        var(--layout-scroll-viewport) - var(--layout-sticky-clip-start) -
          var(--layout-sticky-clip-end)
      );

      inline-size: var(--layout-sticky-area-size);
      margin-inline-end: calc(-1 * var(--layout-sticky-area-size));

      [data-layout-mounted="false"] & {
        z-index: -1;

        --layout-sticky-start: unset !important;
        --layout-sticky-end: unset !important;
      }
    }
  }
}

.layout-areas > :not(.layout-area),
:not(.layout-areas) > .layout-area {
  display: none;
}
</style>
