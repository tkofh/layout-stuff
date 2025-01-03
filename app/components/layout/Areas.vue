<template>
  <LayoutPrimitive
    :as
    class="layout-areas"
    :style
    :data-scroll-direction="direction"
  >
    <RadixSlot
      v-if="slots.top"
      ref="top"
      class="layout-area"
      :data-layout-area="topArea"
    >
      <slot name="top" />
    </RadixSlot>
    <RadixSlot
      v-if="slots.left"
      ref="left"
      class="layout-area"
      :data-layout-area="leftArea"
    >
      <slot name="left" />
    </RadixSlot>
    <RadixSlot
      v-if="slots.right"
      ref="right"
      class="layout-area"
      :data-layout-area="rightArea"
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
      :data-layout-area="bottomArea"
    >
      <slot name="bottom" />
    </RadixSlot>
  </LayoutPrimitive>
</template>

<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
} from "~/components/layout/internal/Primitive.vue";
import { useScrollDirection } from "~/components/layout/internal/Viewport.vue";

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

export interface LayoutAreasProps<L extends AreaLarge> extends PrimitiveProps {
  large?: L;
  small?: AreaSmall<L>;
}

export interface LayoutAreasSlots {
  top?: () => unknown;
  left?: () => unknown;
  right?: () => unknown;
  bottom?: () => unknown;
  main?: () => unknown;
}
</script>

<script setup lang="ts" generic="L extends AreaLarge">
const props = defineProps<LayoutAreasProps<L>>();
const slots = defineSlots<LayoutAreasSlots>();

const LayoutPrimitive = InternalLayoutPrimitive;

const direction = toRef(useScrollDirection());

const large = computed(() => (props.large ?? "top") as AreaLarge);
const small = computed(
  () =>
    (props.small == null || props.small === large.value
      ? defaultSmall[large.value]
      : props.small) as AreaSmall<L>,
);

const leftArea = useDataString(() => ({
  left: true,
  x: true,
  start:
    large.value === "x" ||
    large.value === "left" ||
    (large.value === "bottom" && small.value !== "left") ||
    (large.value === "right" && small.value === "top"),
  end:
    large.value === "x" ||
    large.value === "left" ||
    (large.value === "top" && small.value !== "left") ||
    (large.value === "right" && small.value === "bottom"),
  inline: direction.value === "vertical",
}));

const rightArea = useDataString(() => ({
  right: true,
  x: true,
  start:
    large.value === "x" ||
    large.value === "right" ||
    (large.value === "bottom" && small.value !== "right") ||
    (large.value === "left" && small.value === "top"),
  end:
    large.value === "x" ||
    large.value === "right" ||
    (large.value === "top" && small.value !== "right") ||
    (large.value === "left" && small.value === "bottom"),
  inline: direction.value === "vertical",
}));

const topArea = useDataString(() => ({
  top: true,
  y: true,
  start:
    large.value === "y" ||
    large.value === "top" ||
    (large.value === "right" && small.value !== "top") ||
    (large.value === "bottom" && small.value === "left"),
  end:
    large.value === "y" ||
    large.value === "top" ||
    (large.value === "left" && small.value !== "top") ||
    (large.value === "bottom" && small.value === "right"),
  inline: direction.value === "horizontal",
}));

const bottomArea = useDataString(() => ({
  bottom: true,
  y: true,
  start:
    large.value === "y" ||
    large.value === "bottom" ||
    (large.value === "right" && small.value !== "bottom") ||
    (large.value === "top" && small.value === "left"),
  end:
    large.value === "y" ||
    large.value === "bottom" ||
    (large.value === "left" && small.value !== "bottom") ||
    (large.value === "top" && small.value === "right"),
  inline: direction.value === "horizontal",
}));

const top = useTemplateRef("top");
const right = useTemplateRef("right");
const bottom = useTemplateRef("bottom");
const left = useTemplateRef("left");

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

@property --layout-areas-size-left {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-sticky-area-size {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@layer layout.component {
  .layout-areas {
    --layout-areas-size-top: initial;
    --layout-areas-size-right: initial;
    --layout-areas-size-bottom: initial;
    --layout-areas-size-left: initial;

    display: block grid;
    block-size: 100%;
    inline-size: 100%;
    place-items: start stretch;
    contain: paint;
    grid-template: auto minmax(max-content, 1fr) auto / auto 1fr auto;

    &[data-scroll-direction="vertical"]
      > .layout-sticky[data-layout-area~="x"] {
      &:not([data-layout-area~="start"]) {
        --layout-sticky-cross-clip-start: calc(
          var(--layout-areas-size-top) - var(--layout-scroll-start)
        );
      }

      &:not([data-layout-area~="end"]) {
        --layout-sticky-cross-clip-end: calc(
          var(--layout-areas-size-bottom) - var(--layout-scroll-end)
        );
      }

      &[data-layout-area~="start"] {
        --layout-sticky-start-current: 0px;
      }

      &[data-layout-area~="end"] {
        --layout-sticky-end-current: 0px;
      }
    }

    &[data-scroll-direction~="horizontal"]
      > .layout-sticky[data-layout-area~="y"] {
      &:not([data-layout-area~="start"]) {
        --layout-sticky-cross-clip-start: calc(
          var(--layout-areas-size-left) - var(--layout-scroll-start)
        );
      }

      &:not([data-layout-area~="end"]) {
        --layout-sticky-cross-clip-end: calc(
          var(--layout-areas-size-right) - var(--layout-scroll-end)
        );
      }

      &[data-layout-area~="start"] {
        --layout-sticky-start-current: 0px;
      }

      &[data-layout-area~="end"] {
        --layout-sticky-end-current: 0px;
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
  }
}
</style>
