<script setup lang="ts">
import type { ViewportEdge } from "~/components/layout/Sticky.vue";

const { stick = "both" } = defineProps<{
  section: string | number;
  subSection: string | number;
  stick?: ViewportEdge;
}>();
</script>

<template>
  <LayoutSticky :stick>
    <LayoutBox aspect="1" width="80">
      <AppPlaceholder :label="`Section ${section}.${subSection} Sidebar`" />
    </LayoutBox>
  </LayoutSticky>
  <LayoutBox v-for="index in 5" :key="`index-${index}`" aspect="1" width="80">
    <AppPlaceholder
      :label="`Section ${section}.${subSection} Content ${index}`"
    />
  </LayoutBox>
</template>
