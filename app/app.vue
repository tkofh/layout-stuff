<template>
  <LayoutRoot>
    <LayoutColumns align="left" collapse-below="laptop">
      <LayoutColumn width="1/2" height="40">
        <AppPlaceholder label="1/2" />
      </LayoutColumn>
      <LayoutColumn width="1/2" height="40">
        <AppPlaceholder label="1/2" />
      </LayoutColumn>
    </LayoutColumns>
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
