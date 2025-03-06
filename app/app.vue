<template>
  <LayoutRoot>
    <LayoutAreas>
      <template #left>
        <LayoutStack>
          <label>
            Contrast Direction
            <input v-model="state.direction" type="number" min="-2" max="2" step="1" >
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
          <p>
            Lighter:
            <output>{{ otherState.lighter }}</output>
          </p>
          <p>
            Darker:
            <output>{{ otherState.darker }}</output>
          </p>
          <p>
            Lighter Exists:
            <output>{{ otherState.lighterExists }}</output>
          </p>
          <p>
            Darker Exists:
            <output>{{ otherState.darkerExists }}</output>
          </p>
          <p>
            Lightness:
            <output>{{ otherState.lightness }}</output>
          </p>
          <p>
            Force Darker:
            <output>{{ otherState.forceDarker }}</output>
          </p>
          <p>
            Prefer Darker:
            <output>{{ otherState.preferDarker }}</output>
          </p>
          <p>
            Auto:
            <output>{{ otherState.auto }}</output>
          </p>
          <p>
            Prefer Lighter:
            <output>{{ otherState.preferLighter }}</output>
          </p>
          <p>
            Force Lighter:
            <output>{{ otherState.forceLighter }}</output>
          </p>
        </LayoutStack>
      </template>
      <template #main>
        <LayoutLayers align="center" align-y="center" style="block-size: 100%">
          <LayoutLayer
            ref="el"
            class="surface diffuse elevate test color corner"
            :style="{
              '--hue': state.hue,
              '--chroma': state.chroma,
              '--lightness': state.lightness,
              '--contrast': state.contrast,
              '--contrast-direction': state.direction,
            }"
          />
        </LayoutLayers>
      </template>
    </LayoutAreas>
  </LayoutRoot>
</template>

<script setup lang="ts">
const state = reactive({
  contrast: 5,
  hue: 200,
  chroma: 20,
  lightness: 60,
  direction: 0,
})
const otherState = reactive({
  lighter: 0,
  darker: 0,
  lighterExists: 0,
  darkerExists: 0,
  lightness: 0,
  forceDarker: 0,
  preferDarker: 0,
  auto: 0,
  preferLighter: 0,
  forceLighter: 0,
})

const el = useTemplateRef('el')

watch(
  [state, el],
  () => {
    if (el.value) {
      console.log('going')
      const style = getComputedStyle(el.value.$el)
      otherState.lighter = Number(style.getPropertyValue('--i-lightness-lighter'))
      otherState.darker = Number(style.getPropertyValue('--i-lightness-darker'))
      otherState.lighterExists = Number(style.getPropertyValue('--i-lightness-lighter-exists'))
      otherState.darkerExists = Number(style.getPropertyValue('--i-lightness-darker-exists'))
      otherState.lightness = Number(style.getPropertyValue('--i-lightness'))
      otherState.forceDarker = Number(style.getPropertyValue('--i-contrast-direction-force-darker'))
      otherState.preferDarker = Number(
        style.getPropertyValue('--i-contrast-direction-prefer-darker'),
      )
      otherState.auto = Number(style.getPropertyValue('--i-contrast-direction-auto'))
      otherState.preferLighter = Number(
        style.getPropertyValue('--i-contrast-direction-prefer-lighter'),
      )
      otherState.forceLighter = Number(
        style.getPropertyValue('--i-contrast-direction-force-lighter'),
      )
    }
  },
  { deep: true, flush: 'post' },
)
</script>

<style>
@property --i-stroke-color-top {
  inherits: true;
  initial-value: transparent;
  syntax: '<color>';
}

@property --i-stroke-color-right {
  inherits: true;
  initial-value: transparent;
  syntax: '<color>';
}

@property --i-stroke-color-bottom {
  inherits: true;
  initial-value: transparent;
  syntax: '<color>';
}

@property --i-stroke-color-left {
  inherits: true;
  initial-value: transparent;
  syntax: '<color>';
}

@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }

  .diffuse.test {
    --fill-color: var(--o-color-base);
    --stroke-color: var(--o-color);
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
    --hue: 200;
    --chroma: 20;
    --lightness: 60;
    --contrast: 5;
    --contrast-direction: var(--c-contrast-direction-force-lighter);
    --app-lightness-min: 5;
    --app-lightness-max: 90;
    --lightness-fallback: 0;
    --lightness-p0: var(--app-lightness-min);
    --lightness-p1: calc(var(--app-lightness-min) / 3 + var(--app-lightness-max) * 2 / 3);
    --lightness-p2: calc(var(--app-lightness-min) * 2 / 3 + var(--app-lightness-max) / 3);
    --lightness-p3: var(--app-lightness-max);
    --i-stroke-color-top: var(--stroke-color);
    --i-stroke-color-right: var(--stroke-color);
    --i-stroke-color-bottom: var(--stroke-color);
    --i-stroke-color-left: var(--stroke-color);

    block-size: 30rem;
    aspect-ratio: 1;
  }
}
</style>
