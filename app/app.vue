<template>
  <LayoutRoot>
    <LayoutAreas>
      <template #left>
        <LayoutBox width="96">
          <LayoutStack>
            <label>
              Polarity
              <input v-model="state.polarity" type="number" min="0" step="1" max="4" >
            </label>
            <label>
              Contrast
              <input v-model="state.contrast" type="number" min="0" max="100" step="1" >
            </label>
            <label>
              Hue
              <input v-model="state.hue" type="number" min="0" max="360" step="1" >
            </label>
            <label>
              Chroma
              <input v-model="state.chroma" type="number" min="0" max="100" step="1" >
            </label>
            <label>
              Lightness
              <input v-model="state.lightness" type="number" min="0" max="100" step="1" >
            </label>
          </LayoutStack>
        </LayoutBox>
      </template>
      <template #main>
        <LayoutLayers align="center" align-y="center" style="block-size: 100%">
          <LayoutLayer
            ref="el"
            class="surface elevate test color contrast corner stroke"
            :style="{
              '--hue': state.hue,
              '--chroma': state.chroma,
              '--lightness': lightness,
              '--contrast': contrast,
              '--polarity': state.polarity,
            }"
          >
            <p>Hello world!</p>
          </LayoutLayer>
        </LayoutLayers>
      </template>
    </LayoutAreas>
  </LayoutRoot>
</template>

<script setup lang="ts">
const state = reactive({
  contrast: 0,
  hue: 250,
  chroma: 50,
  lightness: 50,
  polarity: 0,
})

const lightness = computed(() => Math.max(0, Math.min(1, state.lightness * 0.01)))
const contrast = computed(() => Math.max(0, Math.min(1, state.contrast * 0.01)))
</script>

<style>
@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }

  .test {
    --radius-tr: 48;
    --radius-br: 48;
    --radius-bl: 48;
    --radius-tl: 48;
    --diffusion: 16;
    --bevel: 2;
    --thickness-top: 0;
    --thickness-right: 0;
    --thickness-bottom: 0;
    --thickness-left: 0;
    --hue: 200;
    --chroma: 20;
    --lightness: 0;
    --contrast: 5;
    --polarity: var(--polarity-force-dark);
    --app-lightness-min: 0;
    --app-lightness-max: 1;
    --lightness-p0: var(--app-lightness-min);
    --lightness-p1: calc(var(--app-lightness-min) / 3 + var(--app-lightness-max) * 2 / 3);
    --lightness-p2: calc(var(--app-lightness-min) * 2 / 3 + var(--app-lightness-max) / 3);
    --lightness-p3: var(--app-lightness-max);

    background-color: var(--o-color);
    border-color: var(--o-color-contrast);
    color: var(--o-color-contrast);
    block-size: 30rem;
    aspect-ratio: 1;
    font-size: 1.5rem;
    text-align: center;
    display: block flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
