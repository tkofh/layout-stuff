// Assume these variables are provided with appropriate numerical values:
const iChromaRemapped = 0.226524
const iHue = 0
const iLightness = 0.5
const apca_t = 0.0735
const iContrast = 0
const ep = 0.0000001
const iPolarityForceDark = 1
const iPolarityPreferDark = 0
const iPolarityPreferLight = 0
const iPolarityForceLight = 0

// Helper function to mimic clamp(min, value, max)
const clamp = (min: number, value: number, max: number) => Math.min(Math.max(value, min), max)

// Compute lightness factors
const iLightnessK1 = iChromaRemapped * (
  0.3963377774 * Math.cos(iHue * Math.PI * 2) +
  0.2158037573 * Math.sin(iHue * Math.PI * 2)
)

const iLightnessK2 = iChromaRemapped * (
  -0.1055613458 * Math.cos(iHue * Math.PI * 2) -
  0.0638541728 * Math.sin(iHue * Math.PI * 2)
)

const iLightnessK3 = iChromaRemapped * (
  -0.0894841775 * Math.cos(iHue * Math.PI * 2) -
  1.291485548 * Math.sin(iHue * Math.PI * 2)
)

// Compute iLightnessY from the adjusted lightness
const iLightnessY =
  -0.040774541 * Math.pow(iLightness + iLightnessK1, 3) +
  1.112492185 * Math.pow(iLightness + iLightnessK2, 3) +
  -0.071717644 * Math.pow(iLightness + iLightnessK3, 3)

// Contrast normal minimum and adjustment value
const iContrastNormalMin =
  Math.pow(
    Math.abs(Math.pow(iLightnessY, 0.56) - ((apca_t + 0.027) / 1.14)),
    1 / 0.57
  ) *
  Math.sign(Math.pow(iLightnessY, 0.56) - ((apca_t + 0.027) / 1.14))

const iContrastNormalV =
  -1 * Math.abs(
    (Math.pow(Math.abs(iContrastNormalMin), 0.43) * apca_t) / 0.6498
  )

// Contrast reverse minimum and adjustment value
const iContrastReverseMin =
  Math.pow(
    Math.abs(Math.pow(iLightnessY, 0.65) + ((apca_t + 0.027) / 1.14)),
    1 / 0.62
  ) *
  Math.sign(Math.pow(iLightnessY, 0.65) + ((apca_t + 0.027) / 1.14))

const iContrastReverseV =
  -1 * Math.abs(
    (Math.pow(Math.abs(iContrastReverseMin), 0.38) * -1 * apca_t) / 0.7068
  )

// Contrast normal calculation
const iContrastNormal =
  Math.min(1, Math.max(0, Math.sign(iContrast - apca_t) + 1)) *
  Math.pow(
    Math.abs(
      Math.pow(iLightnessY, 0.56) - ((iContrast + 0.027) / 1.14)
    ),
    1 / 0.57
  ) *
  Math.sign(
    Math.pow(iLightnessY, 0.56) - ((iContrast + 0.027) / 1.14)
  ) +
  (1 - Math.min(1, Math.max(0, Math.sign(iContrast - apca_t) + 1))) *
  (
    iLightnessY +
    (-3 * iLightnessY + 3 * iContrastNormalMin - iContrastNormalV) *
    Math.pow(iContrast / apca_t, 2) +
    (2 * iLightnessY - 2 * iContrastNormalMin + iContrastNormalV) *
    Math.pow(iContrast / apca_t, 3)
  )

// Contrast reverse calculation
const iContrastReverse =
  Math.min(1, Math.max(0, Math.sign(iContrast - apca_t) + 1)) *
  Math.pow(
    Math.pow(iLightnessY, 0.65) - (((-1 * iContrast) - 0.027) / 1.14),
    1 / 0.62
  ) +
  (1 - Math.min(1, Math.max(0, Math.sign(iContrast - apca_t) + 1))) *
  (
    iLightnessY +
    (-3 * iLightnessY + 3 * iContrastReverseMin - iContrastReverseV) *
    Math.pow(iContrast / apca_t, 2) +
    (2 * iLightnessY - 2 * iContrastReverseMin + iContrastReverseV) *
    Math.pow(iContrast / apca_t, 3)
  )

// Gating multipliers for contrast normal and reverse
const iContrastNormalGate =
  (Math.sign(iContrastNormal + ep) + Math.sign(1 - ep - iContrastNormal)) / 2

const iContrastReverseGate =
  (Math.sign(iContrastReverse + ep) + Math.sign(1 - ep - iContrastReverse)) / 2

// Combined contrast value using clamp functions
const innerClamp1 = clamp(
  0,
  iPolarityForceDark +
  iPolarityPreferDark *
  (iContrastReverseGate + (1 - iContrastReverseGate) * (1 - iContrastNormalGate)) +
  iPolarityPreferLight * (1 - iContrastNormalGate) * iContrastReverseGate,
  1
)

const innerClamp2 = clamp(
  0,
  iPolarityForceLight +
  iPolarityPreferLight *
  (iContrastNormalGate + (1 - iContrastNormalGate) * (1 - iContrastReverseGate)) +
  iPolarityPreferDark * (1 - iContrastReverseGate) * iContrastNormalGate,
  1
)

const iContrastY = clamp(
  0,
  innerClamp1 * iContrastReverse + innerClamp2 * iContrastNormal,
  1
)

// Contrast coefficients
const iContrastB = 3 * (
  -0.040774541 * iLightnessK1 +
  1.112492185 * iLightnessK2 -
  0.071717644 * iLightnessK3
)

const iContrastC = 3 * (
  -0.040774541 * Math.pow(iLightnessK1, 2) +
  1.112492185 * Math.pow(iLightnessK2, 2) -
  0.071717644 * Math.pow(iLightnessK3, 2)
)

const iContrastP = (3 * iContrastC - Math.pow(iContrastB, 2)) / 3

const iContrastQ = (
  2 * Math.pow(iContrastB, 3) -
  9 * iContrastB * iContrastC +
  27 * (
    -0.040774541 * Math.pow(iLightnessK1, 3) +
    1.112492185 * Math.pow(iLightnessK2, 3) -
    0.071717644 * Math.pow(iLightnessK3, 3) -
    iContrastY
  )
) / 27

// Final contrast lightness value
const iContrastLightness =
  Math.pow(
    Math.abs(
      iContrastQ / -2 +
      Math.sqrt(
        Math.pow(iContrastQ / 2, 2) +
        Math.pow(iContrastP / 3, 3)
      )
    ),
    1 / 3
  ) -
  Math.pow(
    Math.abs(
      iContrastQ / -2 -
      Math.sqrt(
        Math.pow(iContrastQ / 2, 2) +
        Math.pow(iContrastP / 3, 3)
      )
    ),
    1 / 3
  ) -
  iContrastB / 3


console.log({
  iLightnessK1,
  iLightnessK2,
  iLightnessK3,
  iLightnessY,
  iContrastNormalMin,
  iContrastNormalV,
  iContrastReverseMin,
  iContrastReverseV,
  iContrastNormal,
  iContrastReverse,
  iContrastNormalGate,
  iContrastReverseGate,
  iContrastY,
  iContrastB,
  iContrastC,
  iContrastP,
  iContrastQ,
  iContrastLightness
})
// Now you have all values computed as JavaScript math expressions:
// iLightnessK1, iLightnessK2, iLightnessK3, iLightnessY,
// iContrastNormalMin, iContrastNormalV, iContrastReverseMin, iContrastReverseV,
// iContrastNormal, iContrastReverse, iContrastNormalGate, iContrastReverseGate,
// iContrastY, iContrastB, iContrastC, iContrastP, iContrastQ, and iContrastLightness.
