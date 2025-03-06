<template>
  <LayoutRoot>
    <LayoutLayers align="center" align-y="center" style="block-size: 100%">
      <LayoutLayer class="surface diffuse elevate test color corner" />
    </LayoutLayers>
  </LayoutRoot>
</template>

<script setup lang="ts"></script>

<style>
@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }

  .diffuse.test {
    --fill-color: purple;
    --stroke-color: blue;
    --radius-tr: 48;
    --radius-br: 48;
    --radius-bl: 48;
    --radius-tl: 48;
    --diffusion: 16;
    --bevel: 2;
    --thickness-top: 10;
    --thickness-right: 10;
    --thickness-bottom: 10;
    --thickness-left: 10;

    block-size: 30rem;
    aspect-ratio: 1;
  }
}
</style>
