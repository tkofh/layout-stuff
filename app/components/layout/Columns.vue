<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutAligned, {
  type AlignedHorizontalAlignment,
} from "~/components/layout/internal/Aligned.vue";
import InternalLayoutCollapsible, {
  type CollapsibleProps,
} from "~/components/layout/internal/Collapsible.vue";
import InternalLayoutSpaced, {
  type SpaceProps,
} from "~/components/layout/internal/Spaced.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutWrap from "~/components/layout/internal/Wrap.vue";
import type { MaybeRefOrGetter } from "vue";

export interface ColumnsProps
  extends PrimitiveProps<ContentSectioningTag>,
    FrameProps,
    CollapsibleProps,
    SpaceProps {}

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
const LayoutCollapsible = InternalLayoutCollapsible;
const LayoutFrame = InternalLayoutFrame;
const LayoutWrap = InternalLayoutWrap;
const LayoutAligned = InternalLayoutAligned;
const LayoutSpaced = InternalLayoutSpaced;

provideColumnsAlign(() => align);
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
    <LayoutCollapsible :wrap="false" :reverse :align :align-y :collapse-below>
      <LayoutWrap role="unwrappable">
        <LayoutAligned :align :align-y mode="column">
          <LayoutSpaced :space mode="gap">
            <LayoutPrimitive :as class="layout-columns">
              <slot />
            </LayoutPrimitive>
          </LayoutSpaced>
        </LayoutAligned>
      </LayoutWrap>
    </LayoutCollapsible>
  </LayoutFrame>
</template>

<style>
@layer layout.component {
  .layout-columns > :not(.layout-column) {
    display: none;
  }
}
</style>
