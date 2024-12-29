<script lang="ts">
import { useBreakpoint } from "~/components/layout/Root.vue";
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import { useVisibilityProbe } from "~/components/layout/internal/Viewport.vue";

const startLookup = {
  start: undefined,
  end: "auto",
  both: undefined,
  none: "auto",
} as const;
const endLookup = {
  start: "auto",
  end: undefined,
  both: undefined,
  none: "auto",
} as const;

function stickyStyle(edge: ViewportEdge) {
  const filled = fillResponsive(normalizeResponsive(edge));
  return {
    ...responsiveToAttributes(
      "--layout-sticky-start",
      mapResponsive(filled, (value) => startLookup[value]),
    ),
    ...responsiveToAttributes(
      "--layout-sticky-end",
      mapResponsive(filled, (value) => endLookup[value]),
    ),
  };
}

export type ViewportEdge = ResponsiveValue<"start" | "end" | "both" | "none">;

export interface LayoutStickyProps
  extends PrimitiveProps<ContentSectioningTag> {
  edge?: ViewportEdge;
}

export interface LayoutStickySlots {
  default?: (args: {
    isStuck: boolean;
    isStuckStart: boolean;
    isStuckEnd: boolean;
  }) => unknown;
}
</script>

<script setup lang="ts">
const props = defineProps<LayoutStickyProps>();
defineSlots<LayoutStickySlots>();

const LayoutPrimitive = InternalLayoutPrimitive;

const edge = computed(() =>
  fillResponsive(normalizeResponsive(props.edge ?? "both")),
);

const breakpoint = useBreakpoint();

const currentEdge = computed(() => edge.value[toValue(breakpoint)]);

const startEnabled = computed(
  () => currentEdge.value === "start" || currentEdge.value === "both",
);
const start = useTemplateRef<HTMLElement>("start");
const startState = useVisibilityProbe(start, "nearest", {
  enabled: startEnabled,
});

const endEnabled = computed(
  () => currentEdge.value === "end" || currentEdge.value === "both",
);
const end = useTemplateRef<HTMLElement>("end");
const endState = useVisibilityProbe(end, "nearest", { enabled: endEnabled });

const isStuckStart = computed(
  () => startEnabled.value && startState.value === "before-viewport",
);
const isStuckEnd = computed(
  () => endEnabled.value && endState.value === "after-viewport",
);

const isStuck = computed(() => isStuckStart.value || isStuckEnd.value);

const stickyState = computed(() => {
  if (isStuck.value) {
    let result = "stuck";

    if (isStuckStart.value) {
      result += " start";
    }

    if (isStuckEnd.value) {
      result += " end";
    }

    return result;
  }

  return "scrolling";
});

const id = useId();

const style = computed(() => stickyStyle(edge.value));
</script>

<template>
  <LayoutPrimitive
    :id
    :as
    class="layout-sticky"
    :style
    :data-sticky-state="stickyState"
  >
    <span ref="start" class="layout-sticky-edge" data-edge="start" />
    <slot :is-stuck :is-stuck-start :is-stuck-end />
    <span ref="end" class="layout-sticky-edge" data-edge="end" />
  </LayoutPrimitive>
</template>

<style>
@property --layout-sticky-start {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-current {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-end-current {
  syntax: "*";
  inherits: false;
}

@property --layout-sticky-start-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-sticky-end-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@layer components.layout {
  .layout-sticky {
    --layout-viewport-edges-start-offset: var(--layout-sticky-start-offset);
    --layout-viewport-edges-end-offset: var(--layout-sticky-end-offset);

    position: sticky;

    [data-viewport~="vertical"] & {
      inline-size: 100%;
      inset-block: var(--layout-sticky-start, var(--layout-sticky-start-offset))
        var(--layout-sticky-end, var(--layout-sticky-end-offset));
    }

    [data-viewport~="horizontal"] & {
      inset-inline: var(
          --layout-sticky-start,
          var(--layout-sticky-start-offset)
        )
        var(--layout-sticky-end, var(--layout-sticky-end-offset));
    }
  }

  .layout-sticky-edge {
    position: absolute;
    pointer-events: none;
    z-index: -1;

    [data-viewport~="vertical"] & {
      inline-size: 100%;
      block-size: 1px;

      &[data-edge="start"] {
        inset-block-start: calc(-1 * var(--layout-sticky-start-offset));
      }

      &[data-edge="end"] {
        inset-block-end: calc(-1 * var(--layout-sticky-end-offset));
      }
    }

    [data-viewport~="horizontal"] & {
      inline-size: 1px;
      block-size: 100%;

      &[data-edge="start"] {
        inset-inline-start: calc(-1 * var(--layout-sticky-start-offset));
      }

      &[data-edge="end"] {
        inset-inline-end: calc(-1 * var(--layout-sticky-end-offset));
      }
    }
  }
}
</style>
