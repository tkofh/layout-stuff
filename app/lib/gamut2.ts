import Color from 'colorjs.io'

function round(x: number, p: number) {
  return Math.round(x * 10 ** p) / 10 ** p
}

function* range(start: number, end: number, step = 1, precision = 2) {
  for (let i = start; i <= end; i += step) {
    yield round(i, precision)
  }
}

for (const l of range(0, 1, 0.1)) {
  for (const c of range(0, 0.5, 0.1)) {
    for (const h of range(0, 1, 0.1)) {
      const color = new Color('oklch', [l, c, h * 360]).toGamut({ space: 'p3' })

      console.log(`l: ${l} c: ${c} h: ${round(h * 360, 2)} color: ${color.oklch.map((x) => round(x, 4)).join(', ')}`)
    }
  }
}
