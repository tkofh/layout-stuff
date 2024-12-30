<template>
  <LayoutRoot>
    <LayoutStack space="md" frame="md">
      <LayoutBox aspect-ratio="1 / 2">
        <AppPlaceholder label="Filler 0" />
      </LayoutBox>
      <LayoutSticky stick="both">
        <LayoutBox height="40">
          <AppPlaceholder label="Sticky 0" />
        </LayoutBox>
      </LayoutSticky>
      <LayoutBox aspect-ratio="1">
        <AppPlaceholder label="Filler 1" />
      </LayoutBox>
      <LayoutSticky stick="both">
        <LayoutBox height="40">
          <AppPlaceholder label="Sticky 1" />
        </LayoutBox>
      </LayoutSticky>
      <LayoutBox aspect-ratio="1">
        <AppPlaceholder label="Filler 2" />
      </LayoutBox>
      <LayoutSticky stick="both">
        <LayoutBox height="40">
          <AppPlaceholder label="Sticky 2" />
        </LayoutBox>
      </LayoutSticky>
      <LayoutBox aspect-ratio="1 / 2">
        <AppPlaceholder label="Filler 3" />
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
