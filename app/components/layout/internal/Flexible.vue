<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

function flexibleStyle(grow?: FlexRatio, shrink?: FlexRatio) {
  return {
    ...responsiveToAttributes("--layout-grow", normalizeResponsive(grow)),
    ...responsiveToAttributes("--layout-shrink", normalizeResponsive(shrink)),
  };
}

export type FlexRatio = ResponsiveValue<number | `${number}`>;

export interface FlexibleProps {
  grow?: FlexRatio;
  shrink?: FlexRatio;
}

export type FlexibleSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { grow, shrink } = defineProps<FlexibleProps>();
defineSlots<FlexibleSlots>();

const style = computed(() => flexibleStyle(grow, shrink));
</script>

<template>
  <RadixSlot :style class="layout-flexible">
    <slot />
  </RadixSlot>
</template>

<style>
@property --layout-grow {
  syntax: "*";
  inherits: false;
}

@property --layout-grow-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-grow-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-grow-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-grow-current {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

@property --layout-shrink {
  syntax: "*";
  inherits: false;
}

@property --layout-shrink-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-shrink-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-shrink-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-shrink-current {
  syntax: "<number>";
  inherits: false;
  initial-value: 1;
}

@layer layout.init {
  .layout-flexible {
    --layout-grow-current: var(--layout-grow);
    --layout-shrink-current: var(--layout-shrink);

    @container style(--media-gte-tablet: true) {
      --layout-grow-tablet: var(--layout-grow);
      --layout-shrink-tablet: var(--layout-shrink);
      --layout-grow-current: var(--layout-grow-tablet);
      --layout-shrink-current: var(--layout-shrink-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-grow-laptop: var(--layout-grow-tablet);
      --layout-shrink-laptop: var(--layout-shrink-tablet);
      --layout-grow-current: var(--layout-grow-laptop);
      --layout-shrink-current: var(--layout-shrink-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-grow-desktop: var(--layout-grow-laptop);
      --layout-shrink-desktop: var(--layout-shrink-laptop);
      --layout-grow-current: var(--layout-grow-desktop);
      --layout-shrink-current: var(--layout-shrink-desktop);
    }
  }
}

@layer layout.trait {
  .layout-flexible {
    flex: var(--layout-grow-current) var(--layout-shrink-current) auto;
  }
}
</style>
