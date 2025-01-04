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
  type AlignedProps,
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
  useContainerCollapseBelow,
  type CollapseBelow,
} from "~/components/layout/internal/Container2.vue";
import { smallerBreakpoint } from "~/utils/responsive";

export type ColumnWidth = SizeKey | RelativeSizeKey | "fluid" | "content";

function columnStyle(
  width: ResponsiveValue<ColumnWidth>,
  columnsAlign: AlignedHorizontalAlignment,
  collapseBelow: CollapseBelow,
) {
  const normalizedWidth = normalizeResponsive(width);
  const result = {
    ...responsiveToAttributes(
      "--layout-column-grow",
      mapResponsive(normalizedWidth, (value) => {
        if (value === "fluid") {
          return "1";
        }
        return "0";
      }),
    ),
    ...responsiveToAttributes(
      "--layout-column-shrink",
      mapResponsive(normalizedWidth, (value) => {
        if (value === "fluid" || value === "content") {
          return "1";
        }
        return "0";
      }),
    ),
    ...responsiveToAttributes(
      "--layout-column-width",
      mapResponsive(normalizedWidth, (value) => {
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
      }),
    ),
  };

  if (collapseBelow !== "none") {
    Object.assign(
      result,
      responsiveToAttributes(
        "--layout-column-collapsed-display",
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
    AlignedProps,
    VisibilityProps,
    Omit<SizedProps, "width" | "maxWidth" | "minWidth"> {
  width?: ResponsiveValue<ColumnWidth>;
}

export type ColumnSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const {
  width = "fluid",
  align = "auto",
  alignY = "auto",
} = defineProps<ColumnProps>();
defineSlots<ColumnSlots>();

const columnsAlign = useColumnsAlign();
const collapseBelow = useContainerCollapseBelow();

const style = computed(() =>
  columnStyle(width, toValue(columnsAlign), toValue(collapseBelow)),
);

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutFrame = InternalLayoutFrame;
const LayoutSized = InternalLayoutSized;
const LayoutVisibility = InternalLayoutVisibility;
const LayoutAligned = InternalLayoutAligned;
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
        <LayoutAligned :align :align-y>
          <LayoutPrimitive :as class="layout-column" :style>
            <slot />
          </LayoutPrimitive>
        </LayoutAligned>
      </LayoutVisibility>
    </LayoutSized>
  </LayoutFrame>
</template>

<style>
@property --layout-column-width {
  syntax: "*";
  inherits: false;
}

@property --layout-column-width-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-column-width-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-width-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-width-current {
  syntax: "<length-percentage> | min-content";
  inherits: false;
  initial-value: 0;
}

@property --layout-column-grow {
  syntax: "*";
  inherits: false;
}

@property --layout-column-grow-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-column-grow-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-grow-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-grow-current {
  syntax: "<integer>";
  inherits: false;
  initial-value: 0;
}

@property --layout-column-shrink {
  syntax: "*";
  inherits: false;
}

@property --layout-column-shrink-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-column-shrink-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-shrink-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-column-shrink-current {
  syntax: "<integer>";
  inherits: false;
  initial-value: 0;
}

@property --layout-column-collapsed-display {
  syntax: "*";
  inherits: false;
}

@property --layout-column-collapsed-display-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-column-collapsed-display-laptop {
  syntax: "*";
  inherits: false;
}

@layer layout.component {
  .layout-column {
    --layout-column-grow-current: var(--layout-column-grow);
    --layout-column-shrink-current: var(--layout-column-shrink);
    --layout-column-collapsed-display-current: var(
      --layout-column-collapsed-display
    );
    --layout-size-width: var(--layout-column-width-current);

    .layout-columns:not([data-container~="collapsible"]) > & {
      --layout-size-width: var(--layout-column-width-current);

      flex: var(--layout-column-grow-current)
        var(--layout-column-shrink-current) var(--layout-size-width-current);
    }

    .layout-columns[data-container~="collapsible"] > & {
      --layout-size-width: 100%;

      flex: 0 0 100%;

      .layout-columns[data-container~="tablet"] > & {
        @container style(--media-lt-tablet: true) {
          display: var(--layout-column-collapsed-display-current);
          flex-flow: row nowrap;
          justify-content: var(--layout-align-current, start);
        }
      }

      .layout-columns[data-container~="laptop"] > & {
        @container style(--media-lt-laptop: true) {
          display: var(--layout-column-collapsed-display-current);
          flex-flow: row nowrap;
          justify-content: var(--layout-align-current, start);
        }
      }

      .layout-columns[data-container~="desktop"] > & {
        @container style(--media-lt-desktop: true) {
          display: var(--layout-column-collapsed-display-current);
          flex-flow: row nowrap;
          justify-content: var(--layout-align-current, start);
        }
      }
    }

    @container style(--media-gte-tablet: true) {
      --layout-column-width-tablet: var(--layout-column-width);
      --layout-column-width-current: var(--layout-column-width-tablet);
      --layout-column-grow-tablet: var(--layout-column-grow);
      --layout-column-grow-current: var(--layout-column-grow-tablet);
      --layout-column-shrink-tablet: var(--layout-column-shrink);
      --layout-column-shrink-current: var(--layout-column-shrink-tablet);
      --layout-column-collapsed-display-tablet: var(
        --layout-column-collapsed-display
      );
      --layout-column-collapsed-display-current: var(
        --layout-column-collapsed-display-tablet
      );

      .layout-columns[data-container~="collapsible"][data-layout~="tablet"]
        > & {
        --layout-size-width: var(--layout-column-width-current);

        flex: var(--layout-column-grow-current)
          var(--layout-column-shrink-current) var(--layout-size-width);
      }
    }

    @container style(--media-gte-laptop: true) {
      --layout-column-width-laptop: var(--layout-column-width-tablet);
      --layout-column-width-current: var(--layout-column-width-laptop);
      --layout-column-grow-laptop: var(--layout-column-grow-tablet);
      --layout-column-grow-current: var(--layout-column-grow-laptop);
      --layout-column-shrink-laptop: var(--layout-column-shrink-tablet);
      --layout-column-shrink-current: var(--layout-column-shrink-laptop);
      --layout-column-collapsed-display-laptop: var(
        --layout-column-collapsed-display-tablet
      );
      --layout-column-collapsed-display-current: var(
        --layout-column-collapsed-display-laptop
      );

      .layout-columns[data-container~="collapsible"][data-layout~="laptop"]
        > & {
        --layout-size-width: var(--layout-column-width-current);

        flex: var(--layout-column-grow-current)
          var(--layout-column-shrink-current) var(--layout-size-width);
      }
    }

    @container style(--media-gte-desktop: true) {
      --layout-column-width-desktop: var(--layout-column-width-laptop);
      --layout-column-width-current: var(--layout-column-width-desktop);
      --layout-column-grow-desktop: var(--layout-column-grow-laptop);
      --layout-column-grow-current: var(--layout-column-grow-desktop);
      --layout-column-shrink-desktop: var(--layout-column-shrink-laptop);
      --layout-column-shrink-current: var(--layout-column-shrink-desktop);

      .layout-columns[data-container~="collapsible"][data-layout~="desktop"]
        > & {
        --layout-size-width: var(--layout-column-width-current);

        flex: var(--layout-column-grow-current)
          var(--layout-column-shrink-current) var(--layout-size-width);
      }
    }
  }
}
</style>
