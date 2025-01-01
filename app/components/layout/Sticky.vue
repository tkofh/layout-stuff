<script lang="ts">
import { useResponsiveValue } from "~/components/layout/Root.vue";
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import {
  useVisibilityProbe,
  useScrollDirection,
  useStickyElement,
  useNearestViewportElement,
} from "~/components/layout/internal/Viewport.vue";
import { useDataString } from "~/composables/useDataString";

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
  stick?: ViewportEdge;
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
const { stick = "both" } = defineProps<LayoutStickyProps>();
defineSlots<LayoutStickySlots>();

const LayoutPrimitive = InternalLayoutPrimitive;

const edge = useResponsiveValue(() => stick);

const start = useTemplateRef<HTMLElement>("start");
const startState = useVisibilityProbe(start, "nearest", {
  enabled: () => edge.value === "start" || edge.value === "both",
});

const end = useTemplateRef<HTMLElement>("end");
const endState = useVisibilityProbe(end, "nearest", {
  enabled: () => edge.value === "end" || edge.value === "both",
});

const isStuckStart = computed(() => startState.value === "before-viewport");
const isStuckEnd = computed(() => endState.value === "after-viewport");
const isStuck = computed(() => isStuckStart.value || isStuckEnd.value);

const id = useId();
useStickyElement(id);

const state = useDataString(() => ({
  [id]: true,
  scrolling: !isStuck.value,
  stuck: isStuck.value,
  start: isStuckStart.value,
  end: isStuckEnd.value,
}));

const self = useTemplateRef<HTMLElement>("self");
const { width, height } = useElementSize(
  self,
  { width: 0, height: 0 },
  { box: "content-box" },
);
const direction = useScrollDirection();
const size = useCssVar(
  `--layout-sticky-${id}-size`,
  toRef(useNearestViewportElement()),
);
watchEffect(() => {
  size.value = `${toValue(direction) === "vertical" ? height.value : width.value}px`;
});

const style = computed(() => stickyStyle(stick));
</script>

<template>
  <LayoutPrimitive
    ref="self"
    :as
    class="layout-sticky"
    :style
    :data-sticky="state"
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

@property --layout-sticky-peer-start {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-sticky-peer-end {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-sticky-start-offset-sum {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-sticky-end-offset-sum {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@layer layout.component {
  .layout-sticky {
    --layout-sticky-start-offset-sum: calc(
      var(--layout-sticky-start-offset) + var(--layout-sticky-peer-start)
    );
    --layout-sticky-end-offset-sum: calc(
      var(--layout-sticky-end-offset) + var(--layout-sticky-peer-end)
    );

    position: sticky;

    [data-viewport~="vertical"] & {
      inline-size: 100%;
      inset-block: var(
          --layout-sticky-start,
          var(--layout-sticky-start-offset-sum)
        )
        var(--layout-sticky-end, var(--layout-sticky-end-offset-sum));

      /* without unsetting this, sticky elements in horizontal scroll boxes would force inlines to wrap on them */
      inset-inline: initial;
    }

    [data-viewport~="horizontal"] & {
      inline-size: unset;
      inset-inline: var(
          --layout-sticky-start,
          var(--layout-sticky-start-offset-sum)
        )
        var(--layout-sticky-end, var(--layout-sticky-end-offset-sum));
      inset-block: initial;
    }
  }

  .layout-sticky-edge {
    --layout-sticky-start-offset-sum: inherit;
    --layout-sticky-end-offset-sum: inherit;

    position: absolute;
    pointer-events: none;
    z-index: -1;

    [data-viewport~="vertical"] & {
      block-size: 1px;
      inline-size: auto;

      &[data-edge="start"] {
        inset-block: calc(-1 * var(--layout-sticky-start-offset-sum)) auto;
        inset-inline: 0;
      }

      &[data-edge="end"] {
        inset-block: auto calc(-1 * var(--layout-sticky-end-offset-sum));
        inset-inline: 0;
      }
    }

    [data-viewport~="horizontal"] & {
      block-size: auto;
      inline-size: 1px;

      &[data-edge="start"] {
        inset-inline: calc(-1 * var(--layout-sticky-start-offset-sum)) auto;
        inset-block: 0;
      }

      &[data-edge="end"] {
        inset-inline: auto calc(-1 * var(--layout-sticky-end-offset-sum));
        inset-block: 0;
      }
    }
  }
}
</style>
