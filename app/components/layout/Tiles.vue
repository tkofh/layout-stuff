<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutAligned, {
  type Align2dProps,
} from "~/components/layout/internal/Aligned.vue";
import InternalLayoutSpaced, {
  type SpaceProps,
} from "~/components/layout/internal/Spaced.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";

const TILE_COUNT = Symbol.for("layout.tiles.count") as InjectionKey<
  MaybeRefOrGetter<ResponsiveMap<number>>
>;

function provideTileCount(count: MaybeRefOrGetter<ResponsiveMap<number>>) {
  provide(TILE_COUNT, count);
}

const defaultTileCount = fillResponsive(normalizeResponsive(1));

export function useTileCount(): MaybeRefOrGetter<ResponsiveMap<number>> {
  return inject(TILE_COUNT, defaultTileCount);
}

export interface TilesProps
  extends PrimitiveProps<ContentSectioningTag>,
    FrameProps,
    SpaceProps,
    Align2dProps {
  columns?: ResponsiveValue<number | `${number}`>;
  dense?: boolean;
}

export type TilesSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { columns, dense } = defineProps<TilesProps>();
defineSlots<TilesSlots>();

const count = computed(() =>
  mapResponsive(fillResponsive(normalizeResponsive(columns)), (value) =>
    Math.max(1, Number.isFinite(Number(value)) ? Number(value) : 1),
  ),
);

const style = computed(() =>
  responsiveToAttributes("--layout-tiles", compactResponsive(count.value)),
);

const data = useDataString(() => ({
  dense,
}));

provideTileCount(count);

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutAligned = InternalLayoutAligned;
const LayoutSpaced = InternalLayoutSpaced;
const LayoutFrame = InternalLayoutFrame;
</script>

<template>
  <LayoutFrame
    as="slot"
    :frame
    :frame-y
    :frame-x
    :frame-top
    :frame-right
    :frame-bottom
    :frame-left
  >
    <LayoutAligned :align :align-y mode="grid">
      <LayoutSpaced :space mode="gap">
        <LayoutPrimitive :as class="layout-tiles" :data-tiles="data" :style>
          <slot />
        </LayoutPrimitive>
      </LayoutSpaced>
    </LayoutAligned>
  </LayoutFrame>
</template>

<style>
@property --layout-tiles {
  syntax: "*";
  inherits: false;
}

@property --layout-tiles-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-tiles-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-tiles-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-tiles-current {
  syntax: "<integer>";
  inherits: false;
  initial-value: 1;
}

@layer layout.init {
  .layout-tiles {
    --layout-tiles-current: var(--layout-tiles);

    @container style(--media-gte-tablet: true) {
      --layout-tiles-tablet: var(--layout-tiles);
      --layout-tiles-current: var(--layout-tiles-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-tiles-laptop: var(--layout-tiles-tablet);
      --layout-tiles-current: var(--layout-tiles-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-tiles-desktop: var(--layout-tiles-laptop);
      --layout-tiles-current: var(--layout-tiles-desktop);
    }
  }
}

@layer layout.component {
  .layout-tiles {
    /* this is just a guess, based on putting it in a stack */
    inline-size: 100%;
    display: block grid;
    grid-template-columns: repeat(var(--layout-tiles-current), 1fr);
    grid-auto-flow: row;

    &[data-tiles~="dense"] {
      grid-auto-flow: row dense;
    }

    & > :not(.layout-tile) {
      display: none;
    }
  }
}
</style>
