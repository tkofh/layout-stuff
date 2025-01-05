<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type PrimitiveSlots,
} from "~/components/layout/internal/Primitive.vue";
import { useTileCount } from "~/components/layout/Tiles.vue";

function normalizeCount(count: ResponsiveValue<number | `${number}`>) {
  return mapResponsive(fillResponsive(normalizeResponsive(count)), (value) =>
    Math.max(1, Number.isFinite(Number(value)) ? Number(value) : 1),
  );
}

export interface TileProps extends PrimitiveProps {
  rows?: ResponsiveValue<number | `${number}`>;
  columns?: ResponsiveValue<number | `${number}`>;
}

export type TileSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<TileProps>();
defineSlots<TileSlots>();

const rows = computed(() => normalizeCount(props.rows ?? 1));
const columns = computed(() => normalizeCount(props.columns ?? 1));
const count = useTileCount();

const effectiveColumns = computed(() =>
  mapResponsive(columns.value, (value, breakpoint) =>
    Math.min(value, toValue(count)[breakpoint]),
  ),
);

const style = computed(() => ({
  ...responsiveToAttributes(
    "--layout-tile-rows",
    compactResponsive(rows.value),
  ),
  ...responsiveToAttributes(
    "--layout-tile-columns",
    compactResponsive(effectiveColumns.value),
  ),
}));

const LayoutPrimitive = InternalLayoutPrimitive;
</script>

<template>
  <LayoutPrimitive :as class="layout-tile" :style>
    <slot />
  </LayoutPrimitive>
</template>

<style>
@property --layout-tile-rows {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-rows-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-rows-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-rows-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-rows-current {
  syntax: "<integer>";
  inherits: false;
  initial-value: 1;
}

@property --layout-tile-columns {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-columns-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-columns-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-columns-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-tile-columns-current {
  syntax: "<integer>";
  inherits: false;
  initial-value: 1;
}

@layer layout.init {
  .layout-tile {
    --layout-tile-rows-current: var(--layout-tile-rows);
    --layout-tile-columns-current: var(--layout-tile-columns);

    @container style(--media-gte-tablet: true) {
      --layout-tile-rows-tablet: var(--layout-tile-rows);
      --layout-tile-columns-tablet: var(--layout-tile-columns);
      --layout-tile-rows-current: var(--layout-tile-rows-tablet);
      --layout-tile-columns-current: var(--layout-tile-columns-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-tile-rows-laptop: var(--layout-tile-rows-tablet);
      --layout-tile-columns-laptop: var(--layout-tile-columns-tablet);
      --layout-tile-rows-current: var(--layout-tile-rows-laptop);
      --layout-tile-columns-current: var(--layout-tile-columns-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-tile-rows-desktop: var(--layout-tile-rows-laptop);
      --layout-tile-columns-desktop: var(--layout-tile-columns-laptop);
      --layout-tile-rows-current: var(--layout-tile-rows-desktop);
      --layout-tile-columns-current: var(--layout-tile-columns-desktop);
    }
  }
}

@layer layout.component {
  .layout-tile {
    grid-row: auto / span var(--layout-tile-rows-current);
    grid-column: auto / span var(--layout-tile-columns-current);

    :not(.layout-tiles) > & {
      display: none;
    }
  }
}
</style>
