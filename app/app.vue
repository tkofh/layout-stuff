<template>
  <LayoutRoot>
    <LayoutAreas>
      <template #left>
        <LayoutBox width="96">
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
              Normalized Lightness:
              <output>{{ otherState.base }}</output>
            </p>
            <p>
              Normal:
              <output>{{ otherState.normal }}</output>
            </p>
            <p>
              Reverse:
              <output>{{ otherState.reverse }}</output>
            </p>
            <!--            <p>-->
            <!--              Lighter:-->
            <!--              <output>{{ otherState.lighter }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Darker:-->
            <!--              <output>{{ otherState.darker }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Lighter Exists:-->
            <!--              <output>{{ otherState.lighterExists }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Darker Exists:-->
            <!--              <output>{{ otherState.darkerExists }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Force Darker:-->
            <!--              <output>{{ otherState.forceDarker }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Prefer Darker:-->
            <!--              <output>{{ otherState.preferDarker }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Auto:-->
            <!--              <output>{{ otherState.auto }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Prefer Lighter:-->
            <!--              <output>{{ otherState.preferLighter }}</output>-->
            <!--            </p>-->
            <!--            <p>-->
            <!--              Force Lighter:-->
            <!--              <output>{{ otherState.forceLighter }}</output>-->
            <!--            </p>-->
          </LayoutStack>
        </LayoutBox>
      </template>
      <template #main>
        <LayoutLayers align="center" align-y="center" style="block-size: 100%">
          <LayoutLayer
            ref="el"
            class="surface elevate test color corner stroke"
            :style="{
              '--hue': state.hue,
              '--chroma': state.chroma,
              '--lightness': lightness,
              '--contrast': contrast,
              '--polarity': state.direction,
            }"
          />
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
  direction: 0,
})
const otherState = reactive({
  base: 0,
  normal: 0,
  reverse: 0,
  lightness: 0,
  lighter: 0,
  darker: 0,
  lighterExists: 0,
  darkerExists: 0,
  forceDarker: 0,
  preferDarker: 0,
  auto: 0,
  preferLighter: 0,
  forceLighter: 0,
})

const lightness = computed(() => Math.max(0, Math.min(1, state.lightness * 0.01)))
const contrast = computed(() => Math.max(0, Math.min(1, state.contrast * 0.01)))

const el = useTemplateRef('el')

watch(
  [state, el],
  () => {
    if (el.value) {
      const style = getComputedStyle(el.value.$el)
      otherState.base = Number(Number(style.getPropertyValue('--i-lightness-base')).toFixed(3))
      otherState.normal = Number(Number(style.getPropertyValue('--i-lightness-normal')).toFixed(3))
      otherState.reverse = Number(Number(style.getPropertyValue('--i-lightness-reverse')).toFixed(3))
      otherState.lightness = Number(Number(style.getPropertyValue('--i-lightness')).toFixed(3))
      otherState.lighter = Number(Number(style.getPropertyValue('--i-lightness-lighter')).toFixed(3))
      otherState.darker = Number(Number(style.getPropertyValue('--i-lightness-darker')).toFixed(3))
      otherState.lighterExists = Number(Number(style.getPropertyValue('--i-lightness-lighter-exists')).toFixed(3))
      otherState.darkerExists = Number(Number(style.getPropertyValue('--i-lightness-darker-exists')).toFixed(3))
      otherState.forceDarker = Number(Number(style.getPropertyValue('--i-polarity-force-darker')).toFixed(3))
      otherState.preferDarker = Number(Number(style.getPropertyValue('--i-polarity-prefer-darker')).toFixed(3))
      otherState.auto = Number(Number(style.getPropertyValue('--i-polarity-auto')).toFixed(3))
      otherState.preferLighter = Number(Number(style.getPropertyValue('--i-polarity-prefer-lighter')).toFixed(3))
      otherState.forceLighter = Number(Number(style.getPropertyValue('--i-polarity-force-lighter')).toFixed(3))
    }
  },
  { deep: true, flush: 'post' },
)
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
    --thickness-top: 10;
    --thickness-right: 10;
    --thickness-bottom: 10;
    --thickness-left: 10;
    --hue: 200;
    --chroma: 20;
    --lightness: 0;
    --contrast: 5;
    --polarity: var(--c-polarity-force-lighter);
    --app-lightness-min: 0;
    --app-lightness-max: 1;
    --lightness-fallback: 0;
    --lightness-p0: var(--app-lightness-min);
    --lightness-p1: calc(var(--app-lightness-min) / 3 + var(--app-lightness-max) * 2 / 3);
    --lightness-p2: calc(var(--app-lightness-min) * 2 / 3 + var(--app-lightness-max) / 3);
    --lightness-p3: var(--app-lightness-max);

    background-color: var(--o-color-base);
    border-color: var(--o-color);
    block-size: 30rem;
    aspect-ratio: 1;
  }
}
</style>
