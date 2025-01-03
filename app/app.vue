<template>
  <LayoutRoot>
    <LayoutScroll direction="horizontal">
      <LayoutAreas large="right" small="bottom">
        <template #left>
          <LayoutSticky>
            <LayoutBox width="40">
              <AppPlaceholder label="Left" />
            </LayoutBox>
          </LayoutSticky>
        </template>

        <template #top>
          <LayoutSticky>
            <LayoutBox height="40">
              <AppPlaceholder label="Top" />
            </LayoutBox>
          </LayoutSticky>
        </template>

        <template #bottom>
          <LayoutSticky>
            <LayoutBox height="40">
              <AppPlaceholder label="Bottom" />
            </LayoutBox>
          </LayoutSticky>
        </template>

        <template #right>
          <LayoutBox width="40">
            <AppPlaceholder label="Right" />
          </LayoutBox>
        </template>

        <template #main>
          <LayoutInline frame="md" space="md">
            <LayoutBox
              v-for="i in 10"
              :key="`item-${i}`"
              aspect="2"
              height="40"
            >
              <AppPlaceholder :label="`Item ${i}`" />
            </LayoutBox>
          </LayoutInline>
        </template>
      </LayoutAreas>
    </LayoutScroll>
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
