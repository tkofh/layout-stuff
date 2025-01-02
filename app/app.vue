<template>
  <LayoutRoot>
    <LayoutStack frame="md" space="md">
      <LayoutScroll direction="horizontal">
        <LayoutInline space="md">
          <LayoutBox
            v-for="index in 10"
            :key="`index-${index}`"
            aspect="1"
            width="80"
          >
            <AppPlaceholder :label="`Section ${index}`" />
          </LayoutBox>
        </LayoutInline>
      </LayoutScroll>
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
