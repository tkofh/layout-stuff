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
  type StickyElement,
  type ViewportEdge,
} from "~/components/layout/internal/Viewport.vue";
import { useDataString } from "~/composables/useDataString";

function stickyStyle(element: StickyElement) {
  return {
    ...responsiveToAttributes(
      "--layout-sticky-start",
      mapResponsive(compactResponsive(element.start), (value) =>
        value === "auto" ? "auto" : `${value}px`,
      ),
    ),
    ...responsiveToAttributes(
      "--layout-sticky-end",
      mapResponsive(compactResponsive(element.end), (value) =>
        value === "auto" ? "auto" : `${value}px`,
      ),
    ),

    "--layout-sticky-start-layer": element.startLayer,
    "--layout-sticky-end-layer": element.endLayer,
  };
}

export interface LayoutStickyProps
  extends PrimitiveProps<ContentSectioningTag> {
  stick?: ResponsiveValue<ViewportEdge>;
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

const state = useDataString(() => ({
  scrolling: !isStuck.value,
  stuck: isStuck.value,
  start: isStuckStart.value,
  end: isStuckEnd.value,
}));

const self = useTemplateRef<HTMLElement>("self");
const { width, height } = useElementSize(self, undefined, {
  box: "content-box",
});
const direction = useScrollDirection();
const size = computed(() =>
  toValue(direction) === "vertical" ? height.value : width.value,
);

const offsets = useStickyElement(size, stick);
const style = computed(() => stickyStyle(offsets.value));
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
  syntax: "<length> | auto";
  inherits: false;
  initial-value: auto;
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
  syntax: "<length> | auto";
  inherits: false;
  initial-value: auto;
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

@property --layout-sticky-start-layer {
  syntax: "<integer>";
  inherits: false;
  initial-value: 0;
}

@property --layout-sticky-end-layer {
  syntax: "<integer>";
  inherits: false;
  initial-value: 0;
}

@layer layout.component {
  .layout-sticky {
    --layout-sticky-start-current: var(--layout-sticky-start);
    --layout-sticky-end-current: var(--layout-sticky-end);
    --layout-sticky-start-offset: var(--layout-sticky-start-current);
    --layout-sticky-end-offset: var(--layout-sticky-end-current);

    @container style(--media-gte-tablet: true) {
      --layout-sticky-start-tablet: var(--layout-sticky-start);
      --layout-sticky-end-tablet: var(--layout-sticky-end);
      --layout-sticky-start-current: var(--layout-sticky-start-tablet);
      --layout-sticky-end-current: var(--layout-sticky-end-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-sticky-start-laptop: var(--layout-sticky-start-tablet);
      --layout-sticky-end-laptop: var(--layout-sticky-end-tablet);
      --layout-sticky-start-current: var(--layout-sticky-start-laptop);
      --layout-sticky-end-current: var(--layout-sticky-end-laptop);
    }

    @container style(--media-gte-desktop: true) {
      --layout-sticky-start-desktop: var(--layout-sticky-start-laptop);
      --layout-sticky-end-desktop: var(--layout-sticky-end-laptop);
      --layout-sticky-start-current: var(--layout-sticky-start-desktop);
      --layout-sticky-end-current: var(--layout-sticky-end-desktop);
    }

    position: sticky;
    z-index: 1;

    &[data-sticky~="start"] {
      z-index: var(--layout-sticky-start-layer);
    }

    &[data-sticky~="end"] {
      z-index: var(--layout-sticky-end-layer);
    }

    [data-viewport~="vertical"] & {
      inline-size: 100%;
      inset-block: var(--layout-sticky-start-current)
        var(--layout-sticky-end-current);
      inset-inline: initial;
    }

    [data-viewport~="horizontal"] & {
      inline-size: unset;
      inset-inline: var(--layout-sticky-start-current)
        var(--layout-sticky-end-current);
      inset-block: initial;
    }
  }

  .layout-sticky-edge {
    --layout-sticky-start-offset: inherit;
    --layout-sticky-end-offset: inherit;

    position: absolute;
    pointer-events: none;
    z-index: -1;

    [data-viewport~="vertical"] & {
      block-size: 1px;
      inline-size: auto;

      &[data-edge="start"] {
        inset-block: calc(-1 * var(--layout-sticky-start-offset)) auto;
        inset-inline: 0;
      }

      &[data-edge="end"]:not([data-edge~="start"]) {
        inset-block: auto calc(-1 * var(--layout-sticky-end-offset));
        inset-inline: 0;
      }
    }

    [data-viewport~="horizontal"] & {
      block-size: auto;
      inline-size: 1px;

      &[data-edge="start"] {
        inset-inline: calc(-1 * var(--layout-sticky-start-offset)) auto;
        inset-block: 0;
      }

      &[data-edge="end"]:not([data-edge~="start"]) {
        inset-inline: auto calc(-1 * var(--layout-sticky-end-offset));
        inset-block: 0;
      }
    }
  }
}
</style>
