<script lang="ts">
import InternalLayoutEdgeVisibility, {
  type EdgeVisibilityProps,
} from "~/components/layout/internal/EdgeVisibility.vue";
import { useBreakpoint } from "~/components/layout/Root.vue";
import { fillResponsive, responsiveToAttributes } from "~/utils/responsive";

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
  extends Omit<EdgeVisibilityProps, "viewport"> {
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

const LayoutEdgeVisibility = InternalLayoutEdgeVisibility;

const edge = computed(() =>
  fillResponsive(normalizeResponsive(props.edge ?? "both")),
);

const breakpoint = useBreakpoint();

const currentEdge = computed(() => edge.value[toValue(breakpoint)]);

const startStuck = ref(false);
const endStuck = ref(false);

const isStuckStart = computed(
  () =>
    (currentEdge.value === "start" || currentEdge.value === "both") &&
    startStuck.value,
);
const isStuckEnd = computed(
  () =>
    (currentEdge.value === "end" || currentEdge.value === "both") &&
    endStuck.value,
);

const isStuck = computed(() => isStuckStart.value || isStuckEnd.value);

const onUpdateStart = (value: boolean) => {
  startStuck.value = !value;
};

const onUpdateEnd = (value: boolean) => {
  endStuck.value = !value;
};

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
  <LayoutEdgeVisibility
    :id
    :as
    class="layout-sticky"
    :style
    viewport="nearest"
    :data-sticky-state="stickyState"
    @on-update-start="onUpdateStart"
    @on-update-end="onUpdateEnd"
  >
    <slot :is-stuck :is-stuck-start :is-stuck-end />
  </LayoutEdgeVisibility>
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
}
</style>
