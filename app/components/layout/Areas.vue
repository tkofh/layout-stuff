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
      class="layout-area"
      :data-layout-area="areas.left"
    >
      <slot name="left" />
    </RadixSlot>
    <RadixSlot
      v-if="slots.right"
      class="layout-area"
      :data-layout-area="areas.right"
    >
      <slot name="right" />
    </RadixSlot>
    <RadixSlot ref="main" class="layout-area" data-layout-area="main">
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
export type AreaSmall<L extends AreaLarge> = Exclude<AreaEdge, L>;

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
const main = templateRef<HTMLElement>("main");
const bottom = templateRef<HTMLElement>("bottom");

const defaultSize = { height: 0, width: 0 } as const;
const sizeOptions = { box: "border-box" } as const;

const { height: topHeight } = useElementSize(top, defaultSize, sizeOptions);
const { height: mainHeight } = useElementSize(main, defaultSize, sizeOptions);
const { height: bottomHeight } = useElementSize(
  bottom,
  defaultSize,
  sizeOptions,
);

const style = computed(() => ({
  "--layout-areas-size-top": `${topHeight.value}px`,
  "--layout-areas-size-main": `${mainHeight.value}px`,
  "--layout-areas-size-bottom": `${bottomHeight.value}px`,
}));
</script>

<style>
@property --layout-areas-size-top {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-areas-size-main {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-areas-size-bottom {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-sticky-clip-top {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-sticky-clip-bottom {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

.layout-areas {
  --layout-areas-size-top: initial;
  --layout-areas-size-main: initial;
  --layout-areas-size-bottom: initial;

  display: block grid;
  block-size: 100%;
  inline-size: 100%;
  grid-template: auto minmax(auto, 1fr) auto / auto 1fr auto;
  place-items: stretch;

  &:has(> [data-layout-area~="top"][data-layout-area~="start"])
    > .layout-sticky[data-layout-area~="left"],
  &:has(> [data-layout-area~="top"][data-layout-area~="end"])
    > .layout-sticky[data-layout-area~="right"] {
    --layout-sticky-clip-top: max(
      var(--layout-sticky-start-offset),
      var(--layout-areas-size-top) - var(--layout-scroll-top)
    );
  }

  &:has(> [data-layout-area~="bottom"][data-layout-area~="start"])
    > .layout-sticky[data-layout-area~="left"],
  &:has(> [data-layout-area~="bottom"][data-layout-area~="end"])
    > .layout-sticky[data-layout-area~="right"] {
    --layout-sticky-clip-bottom: max(
      var(--layout-sticky-end-offset),
      var(--layout-areas-size-bottom) - var(--layout-scroll-bottom)
    );
  }

  &:has(> .layout-sticky[data-layout-area~="top"][data-layout-area~="start"])
    > .layout-sticky[data-layout-area~="left"],
  &:has(> .layout-sticky[data-layout-area~="top"][data-layout-area~="end"])
    > .layout-sticky[data-layout-area~="right"] {
    --layout-sticky-start-offset: var(--layout-areas-size-top);
  }

  &:has(> .layout-sticky[data-layout-area~="bottom"][data-layout-area~="start"])
    > .layout-sticky[data-layout-area~="left"],
  &:has(> .layout-sticky[data-layout-area~="bottom"][data-layout-area~="end"])
    > .layout-sticky[data-layout-area~="right"] {
    --layout-sticky-end-offset: var(--layout-areas-size-bottom);
  }
}

.layout-root[data-layout-mounted="false"]
  .layout-areas
  > .layout-sticky:is([data-layout-area~="left"], [data-layout-area~="right"]) {
  --layout-sticky-start: unset !important;
  --layout-sticky-end: unset !important;
}

.layout-area {
  z-index: 0;

  &.layout-sticky {
    z-index: 1;

    &:is([data-layout-area~="left"], [data-layout-area~="right"]) {
      block-size: calc(
        100dvb - var(--layout-sticky-clip-top) -
          var(--layout-sticky-clip-bottom)
      );
    }
  }

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
}

.layout-areas > :not(.layout-area),
:not(.layout-areas) > .layout-area {
  display: none;
}
</style>
