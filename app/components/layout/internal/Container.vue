<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";
import InternalLayoutAligned, {
  reverseAlign,
  type Align2dProps,
} from "~/components/layout/internal/Aligned.vue";

export type ContainerAxis = "row" | "column" | "layer";

export type ContainerItemSize<A extends ContainerAxis = "row"> =
  | "independent"
  | (A extends "column" ? never : "uniform");

export interface SpaceProps<A extends ContainerAxis = "row"> {
  space?: A extends "layer" ? "none" : Space;
}

export interface ColumnsProps<I extends ContainerItemSize = "uniform"> {
  columns?: I extends "uniform" ? ResponsiveValue<number> : 0;
}

export type CollapseBelow<A extends ContainerAxis = "row"> =
  | "none"
  | (A extends "row" ? BreakpointsExcept<"mobile"> : never);

export interface CollapseBelowProps<A extends ContainerAxis = "row"> {
  collapseBelow?: CollapseBelow<A>;
}

export interface ReverseProps<A extends ContainerAxis = "row"> {
  reverse?: A extends "row" ? boolean : false;
}

const CONTAINER_COLLAPSE_BELOW = Symbol.for(
  "layout.container.collapse-below",
) as InjectionKey<MaybeRefOrGetter<CollapseBelow>>;

function provideContainerCollapseBelow(
  collapseBelow: MaybeRefOrGetter<CollapseBelow>,
) {
  provide(CONTAINER_COLLAPSE_BELOW, collapseBelow);
}

export function useContainerCollapseBelow() {
  return inject(CONTAINER_COLLAPSE_BELOW, "none");
}

export interface ContainerProps<
  A extends ContainerAxis = "row",
  I extends ContainerItemSize<A> = "independent",
> extends Align2dProps,
    SpaceProps<A>,
    ColumnsProps<I>,
    CollapseBelowProps<A>,
    ReverseProps<A> {
  axis: A;
  wrap?: A extends "row" ? (I extends "uniform" ? true : boolean) : false;
  items?: I;
}

export type ContainerSlots = PrimitiveSlots;
</script>

<script
  setup
  lang="ts"
  generic="A extends ContainerAxis, I extends ContainerItemSize<A>"
>
const {
  axis,
  items = "independent",
  collapseBelow = "none",
  align = "left",
  alignY = "top",
  space = "none",
  reverse = false,
  wrap = undefined,
  columns = 0,
} = defineProps<ContainerProps<A, I>>();
defineSlots<ContainerSlots>();

const effectiveReverse = computed(
  () => (reverse as unknown) === "" || Boolean(reverse),
);
const effectiveAlign = computed(() =>
  compactResponsive(
    mapResponsive(
      fillResponsive(normalizeResponsive(align)),
      (value, breakpoint) =>
        breakpoint !== "mobile" && effectiveReverse.value
          ? reverseAlign(value)
          : value,
    ),
  ),
);

provideContainerCollapseBelow(collapseBelow);

const style = computed(() => {
  const result = {
    ...responsiveToAttributes(
      "--layout-space",
      mapResponsive(
        normalizeResponsive<SpaceKey>(space),
        (value) => SPACE_SCALE[value],
      ),
    ),
  };

  if (axis === "row" && items === "uniform") {
    Object.assign(
      result,
      responsiveToAttributes(
        "--layout-column-count",
        normalizeResponsive(columns),
      ),
    );
  }

  return result;
});

const data = useDataString(() => ({
  [axis]: true,
  [items]: true,
  collapsible: collapseBelow !== "none",
  [collapseBelow]: collapseBelow !== "none",
  reverse: (reverse as unknown) === "" ? true : Boolean(reverse),
  wrap: Boolean(wrap ?? axis === "row"),
}));

const LayoutAligned = InternalLayoutAligned;
</script>

<template>
  <LayoutAligned
    :align="effectiveAlign"
    :align-y
    :style
    class="layout-container"
    :data-container="data"
  >
    <slot />
  </LayoutAligned>
</template>

<style>
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

@property --layout-column-count {
  syntax: "*";
  inherits: false;
}

@property --layout-column-count-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-column-count-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-count-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-count-current {
  syntax: "<integer>";
  inherits: false;
  initial-value: 0;
}

@property --layout-container-row-direction {
  syntax: "row | row-reverse";
  inherits: false;
  initial-value: row;
}

@property --layout-container-wrap {
  syntax: "wrap | nowrap";
  inherits: false;
  initial-value: nowrap;
}

@layer layout.init {
  .layout-container {
    --layout-space: unset;
    --layout-space-tablet: unset;
    --layout-space-laptop: unset;
    --layout-space-desktop: unset;
    --layout-space-current: var(--layout-space);
    --layout-column-count: unset;
    --layout-column-count-tablet: unset;
    --layout-column-count-laptop: unset;
    --layout-column-count-desktop: unset;
    --layout-column-count-current: var(--layout-column-count);

    &[data-container~="row"][data-container~="independent"][data-container~="wrap"] {
      --layout-container-wrap: wrap;
    }

    @container style(--media-gte-tablet: true) {
      --layout-space-tablet: var(--layout-space);
      --layout-space-current: var(--layout-space-tablet);
      --layout-column-count-tablet: var(--layout-column-count);
      --layout-column-count-current: var(--layout-column-count-tablet);

      &[data-container~="row"][data-container~="independent"][data-container~="reverse"] {
        --layout-container-row-direction: row-reverse;
      }
    }

    @container style(--media-gte-laptop: true) {
      --layout-space-laptop: var(--layout-space-tablet);
      --layout-space-current: var(--layout-space-laptop);
      --layout-column-count-laptop: var(--layout-column-count-tablet);
      --layout-column-count-current: var(--layout-column-count-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-space-desktop: var(--layout-space-laptop);
      --layout-space-current: var(--layout-space-desktop);
      --layout-column-count-desktop: var(--layout-column-count-laptop);
      --layout-column-count-current: var(--layout-column-count-desktop);
    }
  }
}

@layer layout.trait {
  .layout-container {
    &[data-container~="row"] {
      gap: var(--layout-space-current);

      &[data-container~="uniform"] {
        display: grid;
        grid-template-columns: repeat(var(--layout-column-count-current), 1fr);
      }

      &[data-container~="independent"] {
        display: block flex;

        &:not([data-container~="collapsible"]) {
          flex-flow: var(--layout-container-row-direction)
            var(--layout-container-wrap);
          justify-content: var(--layout-align-current, start);
          align-items: var(--layout-align-y-current, start);
        }

        &[data-container~="collapsible"] {
          flex-flow: column nowrap;
          align-items: var(--layout-align-current, start);
          justify-content: start;
          inline-size: 100%;
        }

        @container style(--media-gte-tablet: true) {
          &[data-container~="tablet"] {
            flex-flow: var(--layout-container-row-direction)
              var(--layout-container-wrap);
            justify-content: var(--layout-align-current, start);
            align-items: var(--layout-align-y-current, start);
            inline-size: revert-layer;
          }
        }

        @container style(--media-gte-laptop: true) {
          &[data-container~="laptop"] {
            flex-flow: var(--layout-container-row-direction)
              var(--layout-container-wrap);
            justify-content: var(--layout-align-current, start);
            align-items: var(--layout-align-y-current, start);
            inline-size: revert-layer;
          }
        }

        @container style(--media-eq-desktop: true) {
          &[data-container~="desktop"] {
            flex-flow: var(--layout-container-row-direction)
              var(--layout-container-wrap);
            justify-content: var(--layout-align-current, start);
            align-items: var(--layout-align-y-current, start);
            inline-size: revert-layer;
          }
        }
      }
    }

    &[data-container~="column"] {
      inline-size: 100%;
      display: block flex;
      flex-flow: column nowrap;
      align-items: var(--layout-align-current, start);
      justify-content: start;
      gap: var(--layout-space-current);
    }

    &[data-container~="layer"] {
      display: block grid;
      grid: 1fr / 1fr;

      &[data-container~="uniform"] {
        place-items: stretch;
      }

      &[data-container~="independent"] {
        place-items: var(--layout-align-y-current, start)
          var(--layout-align-current, start);
      }

      & > * {
        grid-row: 1 / span 1;
        grid-column: 1 / span 1;
      }
    }
  }
}
</style>
