const alignLookup = {
  left: 'start',
  center: 'center',
  right: 'end',
} as const

const alignYLookup = {
  top: 'start',
  center: 'center',
  bottom: 'end',
} as const

export type FlexAlign = 'start' | 'center' | 'end'
export type VerticalAlign = 'top' | 'center' | 'bottom'
export type HorizontalAlign = 'left' | 'center' | 'right'

export function alignToFlexAlign(align: HorizontalAlign): FlexAlign {
  return alignLookup[align]
}

export function alignYToFlexAlign(align: VerticalAlign): FlexAlign {
  return alignYLookup[align]
}

export function reverseAlign(align: HorizontalAlign): HorizontalAlign {
  if (align === 'left') {
    return 'right'
  }

  if (align === 'right') {
    return 'left'
  }

  return align
}

export type ResponsiveVerticalAlign<T = never> = ResponsiveValue<VerticalAlign | T>
export type ResponsiveHorizontalAlign<T = never> = ResponsiveValue<HorizontalAlign | T>
