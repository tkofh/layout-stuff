import * as Vector2 from 'curvy/vector2'

function inGamut(hue: number, chroma: number, lightness: number) {
  const theta = (hue * Math.PI) / 180
  const a = chroma * Math.cos(theta)
  const b = chroma * Math.sin(theta)

  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3

  const rlin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const glin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const blin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const x = rlin * 0.4124564 + glin * 0.3575761 + blin * 0.1804375
  const y = rlin * 0.2126729 + glin * 0.7151522 + blin * 0.072175
  const z = rlin * 0.0193339 + glin * 0.119192 + blin * 0.9503041

  const p3r = x * 2.493496911941425 - y * 0.9313836179191239 - z * 0.40271078445071684
  const p3g = -x * 0.8294889695615747 + y * 1.7626640603183463 + z * 0.023624685841943577
  const p3b = x * 0.03584583024378447 - y * 0.07617238926804182 + z * 0.9568845240076872

  return p3r >= 0 && p3r <= 1 && p3g >= 0 && p3g <= 1 && p3b >= 0 && p3b <= 1
}

export function generateColorData() {
  // const start = performance.now()
  // const data: Array<Array<number>> = []

  const peaks: Array<Vector2.Vector2> = []

  for (let hue = 0; hue < 360 * 4; hue += 1) {
    // const lc: Array<number> = []

    let peakChroma = 0
    let peakLightness = 0

    for (let lightness = 0; lightness <= 1000; lightness += 1) {
      let chroma0 = 0
      let chroma1 = 1000
      while (chroma1 - chroma0 > 1) {
        const chroma = (chroma0 + chroma1) / 2
        if (inGamut(hue / 4, chroma / 1000, lightness / 1000)) {
          chroma0 = chroma
        } else {
          chroma1 = chroma
        }
      }
      // lc.push(chroma0)

      if (chroma0 > peakChroma) {
        peakChroma = chroma0
        peakLightness = lightness
      }
    }
    // data.push(lc)

    peaks.push(Vector2.make(peakLightness / 1000, peakChroma / 1000))
  }

  return peaks
}
