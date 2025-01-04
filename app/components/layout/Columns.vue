<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import type {
  Align2dProps,
  AlignedHorizontalAlignment,
} from "~/components/layout/internal/Aligned.vue";
import InternalLayoutContainer, {
  type SpaceProps,
  type CollapseBelowProps,
  type ReverseProps,
} from "~/components/layout/internal/Container.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutWrap from "~/components/layout/internal/Wrap.vue";
import type { MaybeRefOrGetter } from "vue";

export interface ColumnsProps
  extends PrimitiveProps<ContentSectioningTag>,
    FrameProps,
    CollapseBelowProps,
    SpaceProps,
    Align2dProps,
    ReverseProps {}

const COLUMNS_ALIGN = Symbol.for("layout.columns.align") as InjectionKey<
  MaybeRefOrGetter<AlignedHorizontalAlignment>
>;

const defaultColumnsAlign = "left" as const;

function provideColumnsAlign(
  align: MaybeRefOrGetter<AlignedHorizontalAlignment>,
) {
  provide(COLUMNS_ALIGN, align);
}

export function useColumnsAlign() {
  return inject(COLUMNS_ALIGN, defaultColumnsAlign);
}

export type ColumnsSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const { align = defaultColumnsAlign } = defineProps<ColumnsProps>();
defineSlots<ColumnsSlots>();

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutContainer = InternalLayoutContainer;
const LayoutFrame = InternalLayoutFrame;
const LayoutWrap = InternalLayoutWrap;

provideColumnsAlign(align);
</script>

<template>
  <LayoutFrame
    as="slot"
    :frame
    :frame-y
    :frame-x
    :frame-top
    :frame-right
    :frame-bottom
    :frame-left
  >
    <LayoutContainer
      axis="row"
      items="independent"
      :wrap="false"
      :reverse
      :align
      :align-y
      :space
      :collapse-below
    >
      <LayoutWrap role="unwrappable">
        <LayoutPrimitive :as class="layout-columns">
          <slot />
        </LayoutPrimitive>
      </LayoutWrap>
    </LayoutContainer>
  </LayoutFrame>
</template>

<style>
@layer layout.component {
  .layout-columns > :not(.layout-column) {
    display: none;
  }
}
</style>
