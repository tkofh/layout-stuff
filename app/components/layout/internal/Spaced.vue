<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

export interface SpaceProps {
  space?: Space;
}

export interface DisableableSpaceProps {
  space?: Space | false;
  mode?: "gap" | "margin";
}

export type SpacedSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { space, mode } = defineProps<DisableableSpaceProps>();
defineSlots<SpacedSlots>();

const style = computed(() =>
  space === false
    ? {}
    : responsiveToAttributes(
        "--layout-space",
        mapResponsive(
          normalizeResponsive(space ?? "none"),
          (value) => SPACE_SCALE[value],
        ),
      ),
);

const data = useDataString(() => ({
  gap: mode === "gap",
  margin: mode === "margin",
}));
</script>

<template>
  <RadixSlot :data-spaced="data" :style>
    <slot />
  </RadixSlot>
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

@layer layout.init {
  [data-spaced] {
    --layout-space-current: var(--layout-space);

    @container style(--media-gte-tablet: true) {
      --layout-space-tablet: var(--layout-space);
      --layout-space-current: var(--layout-space-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-space-laptop: var(--layout-space-tablet);
      --layout-space-current: var(--layout-space-laptop);
    }

    @container style(--media-gte-desktop: true) {
      --layout-space-desktop: var(--layout-space-laptop);
      --layout-space-current: var(--layout-space-desktop);
    }
  }
}

@layer layout.trait {
  [data-spaced~="gap"] {
    gap: var(--layout-space-current);
  }

  [data-spaced~="margin"] {
    margin: var(--layout-space-current);
  }
}
</style>
