<script setup lang="ts">
defineProps<{ section: string | number; subSection: string | number }>();
</script>

<template>
  <LayoutSticky stick="both">
    <LayoutBox aspect-ratio="1" width="80">
      <AppPlaceholder :label="`Section ${section}.${subSection} Sidebar`" />
    </LayoutBox>
  </LayoutSticky>
  <LayoutBox
    v-for="index in 5"
    :key="`index-${index}`"
    aspect-ratio="1"
    width="80"
  >
    <AppPlaceholder
      :label="`Section ${section}.${subSection} Content ${index}`"
    />
  </LayoutBox>
</template>
