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
        "--space",
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
@property --space {
  syntax: "*";
  inherits: false;
}

@property --space-tablet {
  syntax: "*";
  inherits: false;
}

@property --space-laptop {
  syntax: "*";
  inherits: false;
}

@property --space-desktop {
  syntax: "*";
  inherits: false;
}

@property --space-actual {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@layer layout.init {
  [data-spaced] {
    --space-actual: var(--space);

    @container style(--media-gte-tablet: true) {
      --space-tablet: var(--space);
      --space-actual: var(--space-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --space-laptop: var(--space-tablet);
      --space-actual: var(--space-laptop);
    }

    @container style(--media-gte-desktop: true) {
      --space-desktop: var(--space-laptop);
      --space-actual: var(--space-desktop);
    }
  }
}

@layer layout.trait {
  [data-spaced~="gap"] {
    gap: var(--space-actual);
  }

  [data-spaced~="margin"] {
    margin: var(--space-actual);
  }
}
</style>
