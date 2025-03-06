import './styles.css'
import {
  type ResponsiveVerticalAlign,
  type ResponsiveHorizontalAlign,
  alignToFlexAlign,
  alignYToFlexAlign,
} from './lib'

export type {
  FlexAlign,
  VerticalAlign,
  HorizontalAlign,
  ResponsiveVerticalAlign,
  ResponsiveHorizontalAlign,
} from './lib'

export interface AlignProps<T = never> {
  align?: ResponsiveHorizontalAlign<T>
}

export interface AlignYProps<T = never> {
  alignY?: ResponsiveVerticalAlign<T>
}

export interface Align2dProps<T = never> extends AlignProps<T>, AlignYProps<T> {}

export interface AlignedProps extends Align2dProps<'auto'> {
  mode?: 'self' | 'column' | 'grid'
}

export function useAlign(props: AlignedProps) {}
