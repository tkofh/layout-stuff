<template>
  <div class="app-placeholder">
    <svg>
      <line x1="0%" y1="0%" x2="100%" y2="100%" />
      <line x1="0%" y1="100%" x2="100%" y2="0%" />
    </svg>
    <code>{{ label }}</code>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string | number;
}>();
</script>

<style>
@layer components.app.base {
  .app-placeholder {
    display: grid;
    grid: "main" 1fr / 1fr;
    block-size: 100%;
    inline-size: 100%;
    min-block-size: 0;
    min-inline-size: 0;
    overflow: clip;
    border: 1px solid var(--gray-6);
    background-color: var(--gray-3);
    color: var(--gray-11);

    & svg {
      grid-area: main;
      place-self: stretch;
    }

    & line {
      stroke: var(--gray-6);
      stroke-width: 2px;
    }

    & code {
      text-align: center;
      text-wrap: pretty;
      place-self: center;
      grid-area: main;
      font-size: 1rem;
      font-weight: bold;
      text-shadow: 0 0 0.5rem color(from var(--gray-3) xyz x y z / 50%);
    }
  }
}
</style>
