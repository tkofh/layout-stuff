<script lang="ts">
import { useResponsiveValue } from "~/components/layout/Root.vue";
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import {
  useVisibilityProbe,
  useScrollDirection,
  useStickyNeighbors,
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

function stickyStaticStylesheet(id: string) {
  return [
    `.layout-sticky[data-sticky-id="${id}"] {`,
    `  --layout-sticky-start-peer-offset: var(--layout-sticky-${id}-start);`,
    `  --layout-sticky-end-peer-offset: var(--layout-sticky-${id}-end);`,
    `}`,
  ].join("\n");
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
const neighbors = useStickyNeighbors(id);

const state = useDataString(() => ({
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
const size = computed(() =>
  toValue(direction) === "vertical" ? height.value : width.value,
);

const style = computed(() => stickyStyle(stick));

const stylesheet = computed(() => {
  const rules = [stickyStaticStylesheet(id)] as Array<string>;

  const next = neighbors.value.next;
  if (next !== null) {
    rules.push(
      `:root { --layout-sticky-${next}-start: calc(var(--layout-sticky-${id}-start) + ${size.value}px); }`,
    );
  }

  const previous = neighbors.value.previous;
  if (previous !== null) {
    rules.push(
      `:root { --layout-sticky-${previous}-end: calc(var(--layout-sticky-${id}-end) + ${size.value}px); }`,
    );
  }

  return rules.join("\n");
});
</script>

<template>
  <LayoutPrimitive
    ref="self"
    :as
    class="layout-sticky"
    :style
    :data-sticky-id="id"
    :data-sticky-state="state"
  >
    <span ref="start" class="layout-sticky-edge" data-edge="start" />
    <slot :is-stuck :is-stuck-start :is-stuck-end />
    <span ref="end" class="layout-sticky-edge" data-edge="end" />
    <ClientOnly>
      <Teleport to="#teleports">
        <RadixPrimitive as="style">
          {{ stylesheet }}
        </RadixPrimitive>
      </Teleport>
    </ClientOnly>
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

@property --layout-sticky-start-peer-offset {
  syntax: "<length>";
  inherits: true;
  initial-value: 0;
}

@property --layout-sticky-end-peer-offset {
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

@layer components.layout {
  :has(> .layout-sticky) {
    --layout-sticky-start-ancestor-offset: 0;
    --layout-sticky-end-ancestor-offset: 0;
  }

  .layout-sticky {
    --layout-sticky-start-offset-sum: calc(
      var(--layout-sticky-start-offset) + var(--layout-sticky-start-peer-offset)
    );
    --layout-sticky-end-offset-sum: calc(
      var(--layout-sticky-end-offset) + var(--layout-sticky-end-peer-offset)
    );

    position: sticky;

    [data-viewport~="vertical"] & {
      inline-size: 100%;
      inset-block: var(
          --layout-sticky-start,
          var(--layout-sticky-start-offset-sum)
        )
        var(--layout-sticky-end, var(--layout-sticky-end-offset-sum));
    }

    [data-viewport~="horizontal"] & {
      inset-inline: var(
          --layout-sticky-start,
          var(--layout-sticky-start-offset-sum)
        )
        var(--layout-sticky-end, var(--layout-sticky-end-offset-sum));
    }
  }

  .layout-sticky-edge {
    --layout-sticky-start-offset-sum: inherit;
    --layout-sticky-end-offset-sum: inherit;

    position: absolute;
    pointer-events: none;
    z-index: -1;

    [data-viewport~="vertical"] & {
      inline-size: 100%;
      block-size: 1px;

      &[data-edge="start"] {
        inset-block-start: calc(-1 * var(--layout-sticky-start-offset-sum));
      }

      &[data-edge="end"] {
        inset-block-end: calc(-1 * var(--layout-sticky-end-offset-sum));
      }
    }

    [data-viewport~="horizontal"] & {
      inline-size: 1px;
      block-size: 100%;

      &[data-edge="start"] {
        inset-inline-start: calc(-1 * var(--layout-sticky-start-offset-sum));
      }

      &[data-edge="end"] {
        inset-inline-end: calc(-1 * var(--layout-sticky-end-offset-sum));
      }
    }
  }
}
</style>
