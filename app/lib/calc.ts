const chroma = 0
const hue = 0

const la = 0.3963377773761749 * chroma * Math.cos(hue * Math.PI * 2)
const lb = 0.2158037573099136 * chroma * Math.sin(hue * Math.PI * 2)
const ma = -0.1055613458156586 * chroma * Math.cos(hue * Math.PI * 2)
const mb = -0.0638541728258133 * chroma * Math.sin(hue * Math.PI * 2)
const sa = -0.0894841775298119 * chroma * Math.cos(hue * Math.PI * 2)
const sb = -1.2914855480194092 * chroma * Math.sin(hue * Math.PI * 2)

const dl = la + lb
const dm = ma + mb
const ds = sa + sb

const cl = -0.0405757452148008
const cm = 1.112286803280317
const cs = -0.0717110580655164

const c2 = 3 * (cl * dl + cm * dm + cs * ds)
const c1 = 3 * (cl * dl ** 2 + cm * dm ** 2 + cs * ds ** 2)
const c0 = cl * dl ** 3 + cm * dm ** 3 + cs * ds ** 3

const y = (l: number) => c0 + c1 * l + c2 * l ** 2 + l ** 3

const l = 0.5
const y0 = y(l)

console.log({ y0 })

const p = (3 * c1 - c2 ** 2) / 3
const q = (2 * c2 ** 3 - 9 * c2 * c1 + 27 * (c0 - y0)) / 27
const d = (p / 3) ** 3 + (q / 2) ** 2

if (d > 0) {
  console.log(Math.cbrt(-q / 2 + Math.sqrt(d)) + Math.cbrt(-q / 2 - Math.sqrt(d)) - c2 / 3)
} else {
  console.log(-c2 / 3)
}
