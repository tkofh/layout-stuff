<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";
import InternalLayoutAligned, {
  reverseAlign,
  type Align2dProps,
} from "~/components/layout/internal/Aligned.vue";

export type ContainerAxis = "row" | "column" | "layer";

export type ContainerItems<A extends ContainerAxis = "row"> =
  | "auto"
  | (A extends "row" ? ResponsiveValue<`${number}` | number> : never);

export interface SpaceProps<A extends ContainerAxis = "row"> {
  space?: A extends "layer" ? "none" : Space;
}

export type CollapseBelow<A extends ContainerAxis = "row"> =
  | "none"
  | (A extends "row" ? BreakpointsExcept<"mobile"> : never);

export interface CollapseBelowProps<A extends ContainerAxis = "row"> {
  collapseBelow?: CollapseBelow<A>;
}

export interface ReverseProps<
  A extends ContainerAxis = "row",
  I extends ContainerItems<A> = "auto",
> {
  reverse?: A extends "row" ? (I extends "auto" ? boolean : false) : false;
}

export interface WrapProps<
  A extends ContainerAxis = "row",
  I extends ContainerItems<A> = "auto",
> {
  wrap?: A extends "row" ? (I extends "auto" ? boolean : true) : false;
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
  I extends ContainerItems<A> = "auto",
> extends Align2dProps,
    SpaceProps<A>,
    CollapseBelowProps<A>,
    ReverseProps<A, I>,
    WrapProps<A, I> {
  axis: A;
  items?: I;
}

export type ContainerSlots = PrimitiveSlots;
</script>

<script
  setup
  lang="ts"
  generic="A extends ContainerAxis, I extends ContainerItems<A>"
>
const {
  axis,
  items = "auto",
  collapseBelow = "none",
  align = "left",
  alignY = "top",
  space = "none",
  reverse = false,
  wrap = undefined,
} = defineProps<ContainerProps<A, I>>();
defineSlots<ContainerSlots>();

const normalizedItems = computed(() =>
  items === "auto" ? "auto" : normalizeResponsive(items),
);

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
      mapResponsive(normalizeResponsive(space), (value) => SPACE_SCALE[value]),
    ),
  };

  if (axis === "row" && normalizedItems.value !== "auto") {
    Object.assign(
      result,
      responsiveToAttributes(
        "--layout-items",
        mapResponsive(normalizedItems.value, (value) =>
          Math.max(1, Number.isFinite(Number(value)) ? Number(value) : 1),
        ),
      ),
    );
  }

  return result;
});

const data = useDataString(() => ({
  [axis]: true,
  auto: normalizedItems.value === "auto",
  fixed: normalizedItems.value !== "auto",
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

@property --layout-items {
  syntax: "*";
  inherits: false;
}

@property --layout-items-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-items-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-items-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-items-current {
  syntax: "<integer>";
  inherits: false;
  initial-value: 1;
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
    --layout-items: unset;
    --layout-items-tablet: unset;
    --layout-items-laptop: unset;
    --layout-items-desktop: unset;
    --layout-items-current: var(--layout-items);

    &[data-container~="row"][data-container~="auto"][data-container~="wrap"] {
      --layout-container-wrap: wrap;
    }

    @container style(--media-gte-tablet: true) {
      --layout-space-tablet: var(--layout-space);
      --layout-space-current: var(--layout-space-tablet);
      --layout-items-tablet: var(--layout-items);
      --layout-items-current: var(--layout-items-tablet);

      &[data-container~="row"][data-container~="auto"][data-container~="reverse"] {
        --layout-container-row-direction: row-reverse;
      }
    }

    @container style(--media-gte-laptop: true) {
      --layout-space-laptop: var(--layout-space-tablet);
      --layout-space-current: var(--layout-space-laptop);
      --layout-items-laptop: var(--layout-items-tablet);
      --layout-items-current: var(--layout-items-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-space-desktop: var(--layout-space-laptop);
      --layout-space-current: var(--layout-space-desktop);
      --layout-items-desktop: var(--layout-items-laptop);
      --layout-items-current: var(--layout-items-desktop);
    }
  }
}

@layer layout.trait {
  .layout-container {
    /* inline, columns, tiles */
    &[data-container~="row"] {
      gap: var(--layout-space-current);

      &[data-container~="fixed"] {
        display: grid;
        grid-template-columns: repeat(var(--layout-items-current), 1fr);
        place-items: var(--layout-align-y-current) var(--layout-align-current);
      }

      &[data-container~="auto"] {
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

    /* stack */
    &[data-container~="column"] {
      inline-size: 100%;
      display: block flex;
      flex-flow: column nowrap;
      align-items: var(--layout-align-current, start);
      justify-content: start;
      gap: var(--layout-space-current);
    }

    /* layers */
    &[data-container~="layer"] {
      display: block grid;
      grid: 1fr / 1fr;

      &[data-container~="uniform"] {
        place-items: stretch;
      }

      &[data-container~="auto"] {
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
