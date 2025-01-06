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
import InternalLayoutVisibility, {
  type VisibilityProps,
} from "~/components/layout/internal/Visibility.vue";

function stickyStyle(element: StickyElement) {
  return {
    ...responsiveToAttributes(
      "--sticky-start",
      mapResponsive(compactResponsive(element.start), (value) =>
        value === "auto" ? "auto" : `${value}px`,
      ),
    ),
    ...responsiveToAttributes(
      "--sticky-end",
      mapResponsive(compactResponsive(element.end), (value) =>
        value === "auto" ? "auto" : `${value}px`,
      ),
    ),

    "--sticky-start-layer": element.startLayer,
    "--sticky-end-layer": element.endLayer,
  };
}

export interface LayoutStickyProps
  extends PrimitiveProps<ContentSectioningTag>,
    VisibilityProps {
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
const props = defineProps<LayoutStickyProps>();
defineSlots<LayoutStickySlots>();

const LayoutPrimitive = InternalLayoutPrimitive;
const LayoutVisibility = InternalLayoutVisibility;

const attrs = useAttrs();

const stick = computed(() => {
  if (
    "data-layout-area" in attrs &&
    typeof attrs["data-layout-area"] === "string"
  ) {
    const area = attrs["data-layout-area"];
    if (area === "main") {
      return "none";
    }

    if (area.includes("inline")) {
      return "cross";
    } else if (area.includes("top") || area.includes("left")) {
      return "start";
    } else if (area.includes("bottom") || area.includes("right")) {
      return "end";
    }
  }

  return props.stick ?? "start";
});

const edge = useResponsiveValue(stick);

const start = useTemplateRef<HTMLElement>("start");
const startState = useVisibilityProbe(start, "nearest", {
  enabled: () =>
    edge.value === "start" || edge.value === "both" || edge.value === "cross",
});

const end = useTemplateRef<HTMLElement>("end");
const endState = useVisibilityProbe(end, "nearest", {
  enabled: () =>
    edge.value === "end" || edge.value === "both" || edge.value === "cross",
});

const isStuckStart = computed(() => startState.value === "before-viewport");
const isStuckEnd = computed(() => endState.value === "after-viewport");
const isStuck = computed(() => isStuckStart.value || isStuckEnd.value);

const state = useDataString(() => ({
  scrolling: !isStuck.value,
  stuck: isStuck.value,
  start: isStuckStart.value,
  end: isStuckEnd.value,
  cross: edge.value === "cross",
}));

const self = useTemplateRef<HTMLElement>("self");
const { width, height } = useElementSize(self, undefined, {
  box: "content-box",
});
const direction = toRef(useScrollDirection());

const size = computed(() =>
  direction.value === "vertical" ? height.value : width.value,
);

const offsets = useStickyElement(size, stick);
const style = computed(() => stickyStyle(offsets.value));
</script>

<template>
  <LayoutVisibility :hide-above :hide-below>
    <LayoutPrimitive
      ref="self"
      :as
      class="layout-sticky"
      :style
      :data-sticky="state"
      :data-scroll-direction="direction"
    >
      <span ref="start" class="layout-sticky-edge" data-edge="start" />
      <slot :is-stuck :is-stuck-start :is-stuck-end />
      <span ref="end" class="layout-sticky-edge" data-edge="end" />
    </LayoutPrimitive>
  </LayoutVisibility>
</template>

<style>
@property --sticky-start {
  syntax: "*";
  inherits: false;
}

@property --sticky-start-tablet {
  syntax: "*";
  inherits: false;
}

@property --sticky-start-laptop {
  syntax: "*";
  inherits: false;
}

@property --sticky-start-desktop {
  syntax: "*";
  inherits: false;
}

@property --sticky-start-actual {
  syntax: "<length> | auto";
  inherits: false;
  initial-value: auto;
}

@property --sticky-end {
  syntax: "*";
  inherits: false;
}

@property --sticky-end-tablet {
  syntax: "*";
  inherits: false;
}

@property --sticky-end-laptop {
  syntax: "*";
  inherits: false;
}

@property --sticky-end-desktop {
  syntax: "*";
  inherits: false;
}

@property --sticky-end-actual {
  syntax: "<length> | auto";
  inherits: false;
  initial-value: auto;
}

@property --sticky-start-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --sticky-end-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --sticky-start-layer {
  syntax: "<integer>";
  inherits: false;
  initial-value: 0;
}

@property --sticky-end-layer {
  syntax: "<integer>";
  inherits: false;
  initial-value: 0;
}

@property --sticky-cross-clip-start {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --sticky-cross-clip-end {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --sticky-cross-size {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@layer layout.init {
  .layout-sticky {
    --sticky-start-actual: var(--sticky-start);
    --sticky-end-actual: var(--sticky-end);
    --sticky-start-offset: var(--sticky-start-actual);
    --sticky-end-offset: var(--sticky-end-actual);
    --sticky-cross-size: calc(
      var(--scroll-viewport) -
        max(var(--sticky-start-offset), var(--sticky-cross-clip-start)) -
        max(var(--sticky-end-offset), var(--sticky-cross-clip-end))
    );

    @container style(--media-gte-tablet: true) {
      --sticky-start-tablet: var(--sticky-start);
      --sticky-end-tablet: var(--sticky-end);
      --sticky-start-actual: var(--sticky-start-tablet);
      --sticky-end-actual: var(--sticky-end-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --sticky-start-laptop: var(--sticky-start-tablet);
      --sticky-end-laptop: var(--sticky-end-tablet);
      --sticky-start-actual: var(--sticky-start-laptop);
      --sticky-end-actual: var(--sticky-end-laptop);
    }

    @container style(--media-gte-desktop: true) {
      --sticky-start-desktop: var(--sticky-start-laptop);
      --sticky-end-desktop: var(--sticky-end-laptop);
      --sticky-start-actual: var(--sticky-start-desktop);
      --sticky-end-actual: var(--sticky-end-desktop);
    }
  }
}

@layer layout.component {
  .layout-sticky {
    position: sticky;
    z-index: 1;

    &[data-sticky~="start"] {
      z-index: var(--sticky-start-layer);
    }

    &[data-sticky~="end"] {
      z-index: var(--sticky-end-layer);
    }

    [data-layout-mounted="false"] &[data-sticky~="inline"] {
      z-index: -1;

      --sticky-start-actual: auto;
      --sticky-end-actual: auto;
    }

    &[data-scroll-direction~="vertical"] {
      inline-size: 100%;
      inset-block: var(--sticky-start-actual) var(--sticky-end-actual);

      &[data-sticky~="cross"] {
        block-size: var(--sticky-cross-size);
        margin-block-end: calc(-1 * var(--sticky-cross-size));
      }
    }

    &[data-scroll-direction~="horizontal"] {
      block-size: 100%;
      inset-inline: var(--sticky-start-actual) var(--sticky-end-actual);

      &[data-sticky~="cross"] {
        inline-size: var(--sticky-cross-size);
        margin-inline-end: calc(-1 * var(--sticky-cross-size));
      }
    }
  }

  .layout-sticky-edge {
    --sticky-start-offset: inherit;
    --sticky-end-offset: inherit;

    position: absolute;
    pointer-events: none;
    z-index: -1;

    [data-scroll-direction~="vertical"] > & {
      block-size: 1px;
      inline-size: auto;
      inset-inline: 0;

      &[data-edge="start"] {
        inset-block: calc(-1 * var(--sticky-start-offset)) auto;
      }

      &[data-edge="end"]:not([data-edge~="start"]) {
        inset-block: auto calc(-1 * var(--sticky-end-offset));
      }
    }

    [data-scroll-direction~="horizontal"] > & {
      block-size: auto;
      inline-size: 1px;
      inset-block: 0;

      &[data-edge="start"] {
        inset-inline: calc(-1 * var(--sticky-start-offset)) auto;
      }

      &[data-edge="end"]:not([data-edge~="start"]) {
        inset-inline: auto calc(-1 * var(--sticky-end-offset));
      }
    }
  }
}
</style>
