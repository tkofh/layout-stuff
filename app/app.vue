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
          <LayoutSticky stick="both">
            <LayoutBox height="20">
              <AppPlaceholder
                :label="`Section ${section}.${subSection} Header`"
              />
            </LayoutBox>
          </LayoutSticky>

          <LayoutScroll direction="horizontal">
            <LayoutInline space="md">
              <LayoutBox
                v-for="index in 5"
                :key="`index-${index}`"
                aspect="1"
                width="80"
              >
                <AppPlaceholder
                  :label="`Section ${section}.${subSection} Content ${index}`"
                />
              </LayoutBox>
              <AppScrollContent :section :sub-section />
              <LayoutSticky stick="both">
                <LayoutBox aspect="1" width="80">
                  <AppPlaceholder
                    :label="`Section ${section}.${subSection} Sidebar`"
                  />
                </LayoutBox>
              </LayoutSticky>
              <LayoutBox
                v-for="index in 5"
                :key="`index-${index}`"
                aspect="1"
                width="80"
              >
                <AppPlaceholder
                  :label="`Section ${section}.${subSection} Content ${index}`"
                />
              </LayoutBox>
            </LayoutInline>
          </LayoutScroll>

          <LayoutSticky stick="both">
            <LayoutBox height="20">
              <AppPlaceholder
                :label="`Section ${section}.${subSection} Footer`"
              />
            </LayoutBox>
          </LayoutSticky>
        </LayoutStack>
      </LayoutStack>
      <LayoutBox aspect="1 / 2">
        <AppPlaceholder label="Filler" />
      </LayoutBox>
    </LayoutStack>
  </LayoutRoot>
</template>

<script setup lang="ts">
const sections = 1;

const subSections = 1;
</script>

<style>
@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }
}
</style>
