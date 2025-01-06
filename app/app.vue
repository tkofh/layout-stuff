<template>
  <LayoutRoot>
    <LayoutStack frame="md" space="md">
      <LayoutBox>
        <AppPlaceholder label="Box" />
      </LayoutBox>

      <LayoutBox bleed-x="md">
        <AppPlaceholder label="Box" />
      </LayoutBox>

      <LayoutBox>
        <AppPlaceholder label="Box" />
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
