<template>
  <LayoutRoot>
    <LayoutStack frame="md" space="md">
      <LayoutStack
        v-for="section in sections"
        :key="`section-${section}`"
        space="md"
      >
        <LayoutSticky stick="both">
          <LayoutBox height="40">
            <AppPlaceholder :label="`Section ${section}`" />
          </LayoutBox>
        </LayoutSticky>

        <LayoutStack
          v-for="subSection in subSections"
          :key="`section-${section}.${subSection}`"
          space="md"
        >
          <LayoutSticky stick="start">
            <LayoutBox height="20">
              <AppPlaceholder
                :label="`Section ${section}.${subSection} Header`"
              />
            </LayoutBox>
          </LayoutSticky>

          <LayoutBox aspect-ratio="2">
            <AppPlaceholder
              :label="`Section ${section}.${subSection} Content`"
            />
          </LayoutBox>

          <LayoutSticky stick="start">
            <LayoutBox height="20">
              <AppPlaceholder
                :label="`Section ${section}.${subSection} Footer`"
              />
            </LayoutBox>
          </LayoutSticky>
        </LayoutStack>
      </LayoutStack>
      <LayoutBox aspect-ratio="1 / 2">
        <AppPlaceholder label="Filler" />
      </LayoutBox>
    </LayoutStack>
  </LayoutRoot>
</template>

<script setup lang="ts">
const sections = 2;

const subSections = 3;
</script>

<style>
@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }
}
</style>
