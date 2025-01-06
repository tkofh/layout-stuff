<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveSlots,
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import InternalLayoutSized, {
  type SizedProps,
} from "~/components/layout/internal/Sized.vue";
import InternalLayoutAligned, {
  type AlignedHorizontalAlignment,
} from "~/components/layout/internal/Aligned.vue";
import InternalLayoutFrame, {
  type FrameProps,
} from "~/components/layout/internal/Frame.vue";
import InternalLayoutVisibility, {
  type VisibilityProps,
} from "~/components/layout/internal/Visibility.vue";
import { useColumnsAlign } from "~/components/layout/Columns.vue";
import {
  useCollapseBelow,
  type CollapseBelow,
} from "~/components/layout/internal/Collapsible.vue";
import InternalLayoutFlexible from "~/components/layout/internal/Flexible.vue";

export type ColumnWidth = SizeKey | RelativeSizeKey | "fluid" | "content";

function columnStyle(
  width: ResponsiveValue<ColumnWidth>,
  columnsAlign: AlignedHorizontalAlignment,
  collapseBelow: CollapseBelow,
) {
  const result = {
    ...responsiveToAttributes(
      "--layout-size-width",
      compactResponsive(
        mapResponsive(
          fillResponsive(normalizeResponsive(width)),
          (value, breakpoint) => {
            if (
              collapseBelow !== "none" &&
              collapseBelow !== breakpoint &&
              smallerBreakpoint(breakpoint, collapseBelow) === breakpoint
            ) {
              return "100%";
            }

            if (value == null) {
              return undefined;
            }
            if (value === "fluid") {
              return "0%";
            }
            if (value === "content") {
              return "min-content";
            }
            if (value in RELATIVE_SIZE_SCALE) {
              return RELATIVE_SIZE_SCALE[value as RelativeSizeKey];
            }
            if (value in SIZE_SCALE) {
              return SIZE_SCALE[value as SizeKey];
            }

            return value;
          },
        ),
      ),
    ),
  };

  if (collapseBelow !== "none") {
    Object.assign(
      result,
      responsiveToAttributes(
        "--column-collapsed-display",
        mapResponsive(
          normalizeResponsive(columnsAlign),
          (value, breakpoint) => {
            if (
              smallerBreakpoint(breakpoint, collapseBelow) === collapseBelow
            ) {
              return undefined;
            }

            return value === "left" ? "flow-root" : "flex";
          },
        ),
      ),
    );
  }

  return result;
}

export interface ColumnProps
  extends PrimitiveProps<ContentSectioningTag>,
    FrameProps,
    VisibilityProps,
    Omit<SizedProps, "width" | "maxWidth" | "minWidth"> {
  width?: ResponsiveValue<ColumnWidth>;
}

export type ColumnSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<ColumnProps>();
defineSlots<ColumnSlots>();

const columnsAlign = toRef(useColumnsAlign());
const collapseBelow = toRef(useCollapseBelow());

const width = computed(() =>
  fillResponsive(normalizeResponsive(props.width ?? "fluid")),
);

const style = computed(() =>
  columnStyle(width.value, toValue(columnsAlign), toValue(collapseBelow)),
);

const grow = computed(() =>
  compactResponsive(
    mapResponsive(width.value, (value, breakpoint) => {
      if (
        collapseBelow.value !== "none" &&
        collapseBelow.value !== breakpoint &&
        smallerBreakpoint(breakpoint, collapseBelow.value) === breakpoint
      ) {
        return "0";
      }

      if (value === "fluid") {
        return "1";
      }

      return "0";
    }),
  ),
);

const shrink = computed(() =>
  compactResponsive(
    mapResponsive(width.value, (value, breakpoint) => {
      if (
        collapseBelow.value !== "none" &&
        collapseBelow.value !== breakpoint &&
        smallerBreakpoint(breakpoint, collapseBelow.value) === breakpoint
      ) {
        return "0";
      }

      if (value === "fluid" || value === "content") {
        return "1";
      }

      return "0";
    }),
  ),
);

const align = computed(() =>
  compactResponsive(
    mapResponsive(
      fillResponsive(normalizeResponsive(columnsAlign.value)),
      (value, breakpoint) => {
        if (
          collapseBelow.value !== "none" &&
          collapseBelow.value !== breakpoint &&
          smallerBreakpoint(collapseBelow.value, breakpoint) === breakpoint
        ) {
          return value;
        }

        return "auto";
      },
    ),
  ),
);

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutFrame = InternalLayoutFrame;
const LayoutSized = InternalLayoutSized;
const LayoutVisibility = InternalLayoutVisibility;
const LayoutAligned = InternalLayoutAligned;
const LayoutFlexible = InternalLayoutFlexible;
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
    <LayoutSized
      :width="false"
      :height
      :min-height
      :max-height
      :aspect
      min-width="0"
      max-width="none"
    >
      <LayoutVisibility :hide-above :hide-below>
        <LayoutAligned :align>
          <LayoutFlexible :grow :shrink>
            <LayoutPrimitive :as class="layout-column" :style>
              <slot />
            </LayoutPrimitive>
          </LayoutFlexible>
        </LayoutAligned>
      </LayoutVisibility>
    </LayoutSized>
  </LayoutFrame>
</template>

<style>
@property --column-collapsed-display {
  syntax: "*";
  inherits: false;
}

@property --column-collapsed-display-tablet {
  syntax: "*";
  inherits: false;
}

@property --column-collapsed-display-laptop {
  syntax: "*";
  inherits: false;
}

@property --column-collapsed-display-actual {
  syntax: "flow-root | flex";
  inherits: false;
  initial-value: flow-root;
}

@layer layout.init {
  .layout-column {
    --column-collapsed-display-actual: var(--column-collapsed-display);

    @container style(--media-gte-tablet: true) {
      --column-collapsed-display-tablet: var(--column-collapsed-display);
      --column-collapsed-display-actual: var(--column-collapsed-display-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --column-collapsed-display-laptop: var(--column-collapsed-display-tablet);
      --column-collapsed-display-actual: var(--column-collapsed-display-laptop);
    }
  }
}

@layer layout.component {
  .layout-column {
    display: block flow-root;

    @container style(--media-lt-tablet: true) {
      .layout-columns[data-collapsible~="tablet"] > & {
        display: block var(--column-collapsed-display-actual);
        flex-flow: row nowrap;
        justify-content: var(--layout-align-actual, start);
      }
    }

    @container style(--media-lt-laptop: true) {
      .layout-columns[data-collapsible~="laptop"] > & {
        display: block var(--column-collapsed-display-actual);
        flex-flow: row nowrap;
        justify-content: var(--layout-align-actual, start);
      }
    }

    @container style(--media-lt-desktop: true) {
      .layout-columns[data-collapsible~="desktop"] > & {
        display: block var(--column-collapsed-display-actual);
        flex-flow: row nowrap;
        justify-content: var(--layout-align-actual, start);
      }
    }

    :not(.layout-columns) > & {
      display: none;
    }
  }
}
</style>
