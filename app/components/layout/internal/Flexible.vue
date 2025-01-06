<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

function flexibleStyle(grow?: FlexRatio, shrink?: FlexRatio) {
  return {
    ...responsiveToAttributes("--grow", normalizeResponsive(grow)),
    ...responsiveToAttributes("--shrink", normalizeResponsive(shrink)),
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
@property --grow {
  syntax: "*";
  inherits: false;
}

@property --grow-tablet {
  syntax: "*";
  inherits: false;
}

@property --grow-laptop {
  syntax: "*";
  inherits: false;
}

@property --grow-desktop {
  syntax: "*";
  inherits: false;
}

@property --grow-actual {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

@property --shrink {
  syntax: "*";
  inherits: false;
}

@property --shrink-tablet {
  syntax: "*";
  inherits: false;
}

@property --shrink-laptop {
  syntax: "*";
  inherits: false;
}

@property --shrink-desktop {
  syntax: "*";
  inherits: false;
}

@property --shrink-actual {
  syntax: "<number>";
  inherits: false;
  initial-value: 1;
}

@layer layout.init {
  .layout-flexible {
    --grow-actual: var(--grow);
    --shrink-actual: var(--shrink);

    @container style(--media-gte-tablet: true) {
      --grow-tablet: var(--grow);
      --shrink-tablet: var(--shrink);
      --grow-actual: var(--grow-tablet);
      --shrink-actual: var(--shrink-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --grow-laptop: var(--grow-tablet);
      --shrink-laptop: var(--shrink-tablet);
      --grow-actual: var(--grow-laptop);
      --shrink-actual: var(--shrink-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --grow-desktop: var(--grow-laptop);
      --shrink-desktop: var(--shrink-laptop);
      --grow-actual: var(--grow-desktop);
      --shrink-actual: var(--shrink-desktop);
    }
  }
}

@layer layout.trait {
  .layout-flexible {
    flex: var(--grow-actual) var(--shrink-actual) auto;
  }
}
</style>
