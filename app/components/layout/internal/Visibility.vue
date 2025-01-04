<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

export interface HideAboveProps {
  hideAbove?: BreakpointsExcept<"desktop">;
}

export interface HideBelowProps {
  hideBelow?: BreakpointsExcept<"mobile">;
}

export interface VisibilityProps extends HideAboveProps, HideBelowProps {}

export type VisibilitySlots = PrimitiveSlots;
</script>

<script setup lang="ts">
defineProps<VisibilityProps>();
defineSlots<VisibilitySlots>();
</script>

<template>
  <RadixSlot :data-hide-above="hideAbove" :data-hide-below="hideBelow">
    <slot />
  </RadixSlot>
</template>

<style>
@layer layout.trait {
  @container style(--media-lt-tablet: true) {
    [data-hide-below="tablet"] {
      display: none;
    }
  }

  @container style(--media-lt-laptop: true) {
    [data-hide-below="laptop"] {
      display: none;
    }
  }

  @container style(--media-lt-desktop: true) {
    [data-hide-below="desktop"] {
      display: none;
    }
  }

  @container style(--media-gt-mobile: true) {
    [data-hide-above="mobile"] {
      display: none;
    }
  }

  @container style(--media-gt-tablet: true) {
    [data-hide-above="tablet"] {
      display: none;
    }
  }

  @container style(--media-gt-laptop: true) {
    [data-hide-above="laptop"] {
      display: none;
    }
  }
}
</style>
