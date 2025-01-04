<template>
  <LayoutRoot>
    <LayoutColumns collapse-below="tablet">
      <LayoutColumn width="2/5" height="40">
        <AppPlaceholder label="2/5" />
      </LayoutColumn>
      <LayoutColumn width="content" height="40" hide-above="laptop">
        <LayoutBox height="40" aspect="2">
          <AppPlaceholder label="Content" />
        </LayoutBox>
      </LayoutColumn>
      <LayoutColumn width="fluid" height="40">
        <AppPlaceholder label="fluid" />
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
