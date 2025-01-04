<template>
  <LayoutRoot>
    <LayoutTiles columns="3" align-y="bottom">
      <LayoutBox height="40">
        <AppPlaceholder label="1" />
      </LayoutBox>
      <LayoutBox height="20">
        <AppPlaceholder label="1" />
      </LayoutBox>
    </LayoutTiles>
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
