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
    --hue: 146;
    --chroma: 48;
    --lightness: 60;
    --contrast: 10;
    --lightness-invert: var(--c-lightness-invert-force-darker);
    --app-lightness-min: 5;
    --app-lightness-max: 90;
    --lightness-p0: var(--app-lightness-min);
    --lightness-p1: calc(var(--app-lightness-min) / 3 + var(--app-lightness-max) * 2 / 3);
    --lightness-p2: calc(var(--app-lightness-min) * 2 / 3 + var(--app-lightness-max) / 3);
    --lightness-p3: var(--app-lightness-max);

    block-size: 30rem;
    aspect-ratio: 1;
  }
}
</style>
