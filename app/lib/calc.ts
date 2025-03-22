const chroma = 0.226524
const hue = 0

const la = 0.3963377774 * chroma * Math.cos(hue * Math.PI * 2)
const lb = 0.2158037573 * chroma * Math.sin(hue * Math.PI * 2)
const ma = -0.1055613458 * chroma * Math.cos(hue * Math.PI * 2)
const mb = -0.0638541728 * chroma * Math.sin(hue * Math.PI * 2)
const sa = -0.0894841775 * chroma * Math.cos(hue * Math.PI * 2)
const sb = -1.291485548 * chroma * Math.sin(hue * Math.PI * 2)

const dl = la + lb
const dm = ma + mb
const ds = sa + sb

const rl = 4.0767416360759583
const rm = -3.3077115392580629
const rs = 0.2309699031821043
const gl = -1.2684379732850315
const gm = 2.6097573492876882
const gs = -0.341319376002657
const bl = -0.0041960761386756
const bm = -0.7034186179359362
const bs = 1.7076146940746117
const yr = 0.2126
const yg = 0.7152
const yb = 0.0722

const cl = yr * rl + yg * gl + yb * bl
const cm = yr * rm + yg * gm + yb * bm
const cs = yr * rs + yg * gs + yb * bs

const c2 = 3 * (cl * dl + cm * dm + cs * ds)
const c1 = 3 * (cl * dl ** 2 + cm * dm ** 2 + cs * ds ** 2)
const c0 = cl * dl ** 3 + cm * dm ** 3 + cs * ds ** 3

const y = (l: number) => c0 + c1 * l + c2 * l ** 2 + l ** 3

const l = 0.5
const y0 = y(l)

const p = (3 * c1 - c2 ** 2) / 3
const q = (2 * c2 ** 3 - 9 * c2 * c1 + 27 * (c0 - y0)) / 27
const d = (p / 3) ** 3 + (q / 2) ** 2

if (d > 0) {
  console.log(Math.cbrt(-q / 2 + Math.sqrt(d)) + Math.cbrt(-q / 2 - Math.sqrt(d)) - c2 / 3)
} else {
  console.log(-c2 / 3)
}

console.log({
  cl,
  cm,
  cs,
})
