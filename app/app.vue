<template>
  <LayoutRoot>
    <LayoutStack space="md" frame="md">
      <LayoutBox height="sm">
        <AppPlaceholder label="Filler 0" />
      </LayoutBox>

      <LayoutSticky stick="both">
        <LayoutBox height="20">
          <AppPlaceholder label="Sticky 0" />
        </LayoutBox>
      </LayoutSticky>

      <LayoutBox height="sm">
        <AppPlaceholder label="Filler 1" />
      </LayoutBox>

      <LayoutSticky stick="both">
        <LayoutBox height="20">
          <AppPlaceholder label="Sticky 1" />
        </LayoutBox>
      </LayoutSticky>

      <LayoutBox height="sm">
        <AppPlaceholder label="Filler 2" />
      </LayoutBox>

      <LayoutScroll direction="horizontal">
        <LayoutAreas large="x">
          <template #top>
            <LayoutSticky>
              <LayoutBox height="40">
                <AppPlaceholder label="Horizontal Section Top" />
              </LayoutBox>
            </LayoutSticky>
          </template>
          <template #left>
            <LayoutBox width="40">
              <AppPlaceholder label="Horizontal Section Left" />
            </LayoutBox>
          </template>
          <template #right>
            <LayoutBox width="40">
              <AppPlaceholder label="Horizontal Section Right" />
            </LayoutBox>
          </template>
          <template #main>
            <LayoutInline space="sm">
              <LayoutBox v-for="i in 10" :key="`item-${i}`" width="40">
                <AppPlaceholder :label="`Horizontal Section Main Item ${i}`" />
              </LayoutBox>
            </LayoutInline>
          </template>
        </LayoutAreas>
      </LayoutScroll>

      <LayoutScroll direction="horizontal">
        <LayoutInline space="sm">
          <LayoutBox v-for="i in 5" :key="`item-${i}`" width="40">
            <AppPlaceholder :label="`Horizontal Section Main Item ${i}`" />
          </LayoutBox>

          <LayoutSticky>
            <LayoutBox width="40">
              <AppPlaceholder label="Horizontal Section Sticky 1" />
            </LayoutBox>
          </LayoutSticky>

          <LayoutBox v-for="i in 5" :key="`item-${i}`" width="40">
            <AppPlaceholder :label="`Horizontal Section Main Item ${i}`" />
          </LayoutBox>

          <LayoutSticky>
            <LayoutBox width="40">
              <AppPlaceholder label="Horizontal Section Sticky 2" />
            </LayoutBox>
          </LayoutSticky>

          <LayoutBox v-for="i in 5" :key="`item-${i}`" width="40">
            <AppPlaceholder :label="`Horizontal Section Main Item ${i}`" />
          </LayoutBox>
        </LayoutInline>
      </LayoutScroll>

      <LayoutInline space="sm">
        <LayoutBox v-for="i in 10" :key="`item-${i}`" width="40">
          <AppPlaceholder :label="`Horizontal Section Main Item ${i}`" />
        </LayoutBox>
      </LayoutInline>

      <LayoutSticky stick="both">
        <LayoutBox height="20">
          <AppPlaceholder label="Sticky 2" />
        </LayoutBox>
      </LayoutSticky>

      <LayoutBox height="sm">
        <AppPlaceholder label="Filler 3" />
      </LayoutBox>

      <LayoutSticky stick="both">
        <LayoutBox height="20">
          <AppPlaceholder label="Sticky 3" />
        </LayoutBox>
      </LayoutSticky>

      <LayoutBox height="sm">
        <AppPlaceholder label="Filler 4" />
      </LayoutBox>

      <LayoutSticky stick="both">
        <LayoutBox height="20">
          <AppPlaceholder label="Sticky 4" />
        </LayoutBox>
      </LayoutSticky>

      <LayoutBox height="sm">
        <AppPlaceholder label="Filler 5" />
      </LayoutBox>
    </LayoutStack>
  </LayoutRoot>
</template>

<script setup lang="ts"></script>

<style>
@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }
}
</style>
