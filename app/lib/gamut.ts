import * as Quadratic from 'curvy/polynomial/quadratic'
import * as Cubic from 'curvy/polynomial/cubic'
import * as QuadraticCurve2d from 'curvy/curve/quadratic2d'
import * as QuadraticPath2d from 'curvy/path/quadratic2d'
import * as Matrix4x4 from 'curvy/matrix4x4'
import * as Matrix3x3 from 'curvy/matrix3x3'
import * as Vector4 from 'curvy/vector4'
import * as Vector3 from 'curvy/vector3'
import * as Vector2 from 'curvy/vector2'
import * as Bezier2d from 'curvy/splines/bezier2d'
import { lerp, clamp } from 'curvy/utils'

const quadBezier = Matrix3x3.matrix3x3(1, 0, 0, -2, 2, 0, 1, -2, 1)

// https://www.desmos.com/calculator/5epwhxkzpe
export const gamut = QuadraticPath2d.fromCurves(
  QuadraticCurve2d.fromPolynomials(
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.723, 0.6503, 0.6479)).pipe(Quadratic.fromVector),
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.3585, 0.2785, 0.2983)).pipe(Quadratic.fromVector),
  ),

  QuadraticCurve2d.fromPolynomials(
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.6479, 0.79, 0.964)).pipe(Quadratic.fromVector),
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.2983, 0.1277, 0.245)).pipe(Quadratic.fromVector),
  ),

  QuadraticCurve2d.fromPolynomials(
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.964, 0.8942, 0.848)).pipe(Quadratic.fromVector),
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.245, 0.2765, 0.367)).pipe(Quadratic.fromVector),
  ),

  QuadraticCurve2d.fromPolynomials(
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.848, 0.861, 0.8889)).pipe(Quadratic.fromVector),
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.367, 0.227, 0.2059)).pipe(Quadratic.fromVector),
  ),

  QuadraticCurve2d.fromPolynomials(
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.8889, 0.7155, 0.4672)).pipe(Quadratic.fromVector),
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.2059, 0.131, 0.321)).pipe(Quadratic.fromVector),
  ),

  QuadraticCurve2d.fromPolynomials(
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.4672, 0.5149, 0.723)).pipe(Quadratic.fromVector),
    Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0.321, 0.2788, 0.3585)).pipe(Quadratic.fromVector),
  ),
)

// f(0.08) = 1 / 7
// f(0.307) = 2 / 7
// f(0.405) = 3 / 7
// f(0.537) = 4 / 7
// f(0.734) = 5 / 7
// f(0.921) = 6 / 7

// const v1 = 0.088
// const v2 = 0.256
// const v3 = 0.96
// const v4 = 0.97
// const v5 = 0.98
// const v6 = 0.99
//
// const v0_1 = lerp(0, 0, v1)
// const v1_2 = lerp(0, v1, v2)
// const v2_3 = lerp(0, v2, v3)
// const v3_4 = lerp(0, v3, v4)
// const v4_5 = lerp(0, v4, v5)
// const v5_6 = lerp(0, v5, v6)
// const v6_7 = lerp(0, v6, 1)

const p0 = Vector2.zero
const p1 = Vector2.make(0.088, 0.097)
const p2 = Vector2.make(0.307, 0.256)
const p3 = Vector2.make(0.405, 0.422)
const p4 = Vector2.make(0.537, 0.588)
const p5 = Vector2.make(0.658, 0.672)
const p6 = Vector2.make(0.734, 0.756)
const p7 = Vector2.make(0.921, 0.922)
const p8 = Vector2.make(1)

const heaviside = (n: number, inclusive = true) => (inclusive ? Math.ceil : Math.floor)(0.5 * (Math.sign(n) + 1))

const v0 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.3, 0.6, 1)).pipe(Cubic.fromVector)
const v1 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.45, 0.525, 1)).pipe(Cubic.fromVector)
const v2 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.25, 0.5, 1)).pipe(Cubic.fromVector)
const v3 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.6, 0.8, 1)).pipe(Cubic.fromVector)
const v4 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.425, 0.71, 1)).pipe(Cubic.fromVector)
const v5 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.3, 0.3, 1)).pipe(Cubic.fromVector)
const v6 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.35, 0.61, 1)).pipe(Cubic.fromVector)
const v7 = Matrix4x4.vectorProductLeft(Bezier2d.characteristic, Vector4.make(0, 0.34, 0.7, 1)).pipe(Cubic.fromVector)

export function gamutVelocityT(t: number) {
  return (
    heaviside(t - p0.x) * (Cubic.solve(v0, clamp((t - p0.x) / (p1.x - p0.x), 0, 1)) * (p1.y - p0.y)) +
    heaviside(t - p1.x) * (Cubic.solve(v1, clamp((t - p1.x) / (p2.x - p1.x), 0, 1)) * (p2.y - p1.y)) +
    heaviside(t - p2.x) * (Cubic.solve(v2, clamp((t - p2.x) / (p3.x - p2.x), 0, 1)) * (p3.y - p2.y)) +
    heaviside(t - p3.x) * (Cubic.solve(v3, clamp((t - p3.x) / (p4.x - p3.x), 0, 1)) * (p4.y - p3.y)) +
    heaviside(t - p4.x) * (Cubic.solve(v4, clamp((t - p4.x) / (p5.x - p4.x), 0, 1)) * (p5.y - p4.y)) +
    heaviside(t - p5.x) * (Cubic.solve(v5, clamp((t - p5.x) / (p6.x - p5.x), 0, 1)) * (p6.y - p5.y)) +
    heaviside(t - p6.x) * (Cubic.solve(v6, clamp((t - p6.x) / (p7.x - p6.x), 0, 1)) * (p7.y - p6.y)) +
    heaviside(t - p7.x) * (Cubic.solve(v7, clamp((t - p7.x) / (p8.x - p7.x), 0, 1)) * (p8.y - p7.y))
  )
}

//
// export const gamutVelocity = QuadraticPath2d.fromCurves(
//   QuadraticCurve2d.fromPolynomials(
//     Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(0, v0_1, v1)).pipe(Quadratic.fromVector),
//     Quadratic.make(0, 1, 0),
//   ),
//   QuadraticCurve2d.fromPolynomials(
//     Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(v1, v1_2, v2)).pipe(Quadratic.fromVector),
//     Quadratic.make(1, 1, 0),
//   ),
//   QuadraticCurve2d.fromPolynomials(
//     Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(v2, v2_3, v3)).pipe(Quadratic.fromVector),
//     Quadratic.make(2, 1, 0),
//   ),
//   QuadraticCurve2d.fromPolynomials(
//     Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(v3, v3_4, v4)).pipe(Quadratic.fromVector),
//     Quadratic.make(3, 1, 0),
//   ),
//   QuadraticCurve2d.fromPolynomials(
//     Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(v4, v4_5, v5)).pipe(Quadratic.fromVector),
//     Quadratic.make(4, 1, 0),
//   ),
//   QuadraticCurve2d.fromPolynomials(
//     Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(v5, v5_6, v6)).pipe(Quadratic.fromVector),
//     Quadratic.make(5, 1, 0),
//   ),
//   QuadraticCurve2d.fromPolynomials(
//     Matrix3x3.vectorProductLeft(quadBezier, Vector3.make(v6, v6_7, 1)).pipe(Quadratic.fromVector),
//     Quadratic.make(6, 1, 0),
//   ),
// )
