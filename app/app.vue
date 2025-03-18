<template>
  <LayoutRoot>
    <LayoutAreas>
      <template #left>
        <LayoutBox width="64">
          <LayoutStack>
            <label>
              Polarity
              <input v-model="state.polarity" type="number" min="0" step="1" max="3" >
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
      <!--      <template #top>-->
      <!--        <LayoutBox style="padding: 1rem">-->
      <!--          <label style="display: block; inline-size: 100%">-->
      <!--            T Value {{ t }}-->
      <!--            <input v-model.number="t" type="range" min="0" max="1" step="0.001" style="inline-size: 100%" >-->
      <!--          </label>-->
      <!--        </LayoutBox>-->
      <!--      </template>-->
      <template #main>
        <LayoutLayers align="center" align-y="center" style="block-size: 100%">
          <LayoutLayer>
            <LayoutBox width="sm" aspect="1">
              <!--              <svg xmlns="http://www.w3.org/2000/svg" viewBox="46 60 51 51">-->
              <!--                <path :d="path" stroke="white" stroke-width="0.1" fill="none" />-->
              <!--                <circle-->
              <!--                  :cx="(gamutHead?.x ?? 0) * 100"-->
              <!--                  :cy="100 - (gamutHead?.y ?? 0) * 100"-->
              <!--                  r="0.6"-->
              <!--                  fill="rgb(255 0 0 / 0.3)"-->
              <!--                />-->
              <!--                <circle :cx="peakHead.x * 100" :cy="100 - peakHead.y * 100" r="0.5" fill="rgb(0 190 0 / 0.3)" />-->
              <!--                <circle-->
              <!--                  :cx="(gamutHead?.x ?? 0) * 100"-->
              <!--                  :cy="100 - (gamutHead?.y ?? 0) * 100"-->
              <!--                  r="0.2"-->
              <!--                  fill="rgb(255 0 0)"-->
              <!--                />-->
              <!--                <circle :cx="peakHead.x * 100" :cy="100 - peakHead.y * 100" r="0.2" fill="rgb(0 190 0)" />-->
              <!--              </svg>-->
            </LayoutBox>
          </LayoutLayer>

          <LayoutLayer
            ref="el"
            class="surface elevate test color contrast corner stroke"
            :style="{
              '--hue': state.hue,
              '--chroma': state.chroma,
              '--lightness': state.lightness,
              '--contrast': state.contrast,
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
// import * as QuadraticPath2d from 'curvy/path/quadratic2d'
// import * as Vector2 from 'curvy/vector2'
// import { generateColorData } from '~/lib/color'
// import { gamut, gamutVelocityT } from '~/lib/gamut'
import Color from 'colorjs.io'

const state = reactive({
  contrast: 0,
  hue: 250,
  chroma: 50,
  lightness: 50,
  polarity: 0,
})
const el = useTemplateRef<HTMLElement>('el')

const styleColor = ref('transparent')
const color = computed(() => new Color(styleColor.value))
const styleContrastColor = ref('transparent')
const contrastColor = computed(() => new Color(styleContrastColor.value))
const computedContrast = computed(() => color.value.contrast(contrastColor.value, 'APCA'))
// watch(
//   state,
//   () => {
//     const style = getComputedStyle(unrefElement(el)!)
//     styleColor.value = style.getPropertyValue('--o-color')
//     styleContrastColor.value = style.getPropertyValue('--o-color-contrast')
//   },
//   { flush: 'post' },
// )

watchEffect(() => {
  console.log(color.value)
  console.log(contrastColor.value)
  console.log(computedContrast.value)
  console.log('-------')
})

// const peaks = generateColorData()
// const path = `M ${peaks[0]![0] * 100},${100 - peaks[0]![1] * 100} L ${peaks
//   .slice(1)
//   .map(
//     ({ x, y }, i) =>
//       `${x * 50 + (peaks[i - 1]?.[0] ?? x) * 25 + (peaks[i + 1]?.[0] ?? x) * 25},${
//         100 - (y * 50 + (peaks[i - 1]?.[1] ?? y) * 25 + (peaks[i + 1]?.[1] ?? y) * 25)
//       }`,
//   )
//   .join(' ')} Z`

// const t = ref(Number(window.localStorage.getItem('t') ?? 0))
// watchEffect(() => {
//   window.localStorage.setItem('t', t.value.toString())
// })
// const phase = 0.078

// const gamutHead = computed(() => {
//   return QuadraticPath2d.solve(gamut, (phase + gamutVelocityT(t.value)) % 1)
// })
//
// const peakHead = computed(() => {
//   const p = peaks[Math.round(peaks.length * t.value)] ?? peaks[0]!
//   return Vector2.make(p[0], p[1])
// })
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

  svg {
    outline: 1px solid white;
  }
}
</style>
