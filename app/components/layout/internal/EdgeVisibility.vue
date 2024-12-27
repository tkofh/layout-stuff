<script lang="ts">
import InternalLayoutPrimitive, {
  type PrimitiveProps,
  type ContentSectioningTag,
} from "~/components/layout/internal/Primitive.vue";
import {
  useViewport,
  type Viewport,
} from "~/components/layout/internal/Viewport.vue";
import type { ShallowRef } from "vue";

function useEdgeObserver(
  probe: Readonly<ShallowRef<HTMLElement | null>>,
  viewport: Viewport,
  target: Ref<Set<Viewport>>,
) {
  const root = toValue(viewport);
  useIntersectionObserver(
    probe,
    (entries) => {
      let isIntersecting = target.value.has(root);

      let time = 0;
      for (const entry of entries) {
        if (entry.time > time) {
          isIntersecting = entry.isIntersecting;
          time = entry.time;
        }
      }

      if (isIntersecting) {
        target.value.add(root);
      } else {
        target.value.delete(root);
      }
    },
    {
      root,
      rootMargin: "-1px",
      threshold: 0.5,
      immediate: true,
    },
  );

  tryOnScopeDispose(() => {
    target.value.delete(root);
  });
}

export interface EdgeVisibilityProps
  extends PrimitiveProps<ContentSectioningTag> {
  viewport?: "root" | "nearest" | "both";
}

export interface EdgeVisibilitySlots {
  default?: (args: { startVisible: boolean; endVisible: boolean }) => unknown;
}

export interface EdgeVisibilityEvents {
  (event: "onUpdateStart" | "onUpdateEnd", value: boolean): void;
}
</script>

<script setup lang="ts">
const props = defineProps<EdgeVisibilityProps>();
defineSlots<EdgeVisibilitySlots>();
const emit = defineEmits<EdgeVisibilityEvents>();
defineOptions({
  name: "LayoutEdgeVisibility",
});

const LayoutPrimitive = InternalLayoutPrimitive;

const startViewports = ref(new Set<Viewport>());
const endViewports = ref(new Set<Viewport>());

const startVisible = computed(() => startViewports.value.size > 0);
const endVisible = computed(() => endViewports.value.size > 0);

watch(startVisible, (value) => emit("onUpdateStart", value), {
  immediate: true,
});
watch(endVisible, (value) => emit("onUpdateEnd", value), { immediate: true });

if (import.meta.client) {
  const probeStart = useTemplateRef<HTMLElement>("probeStart");
  const probeEnd = useTemplateRef<HTMLElement>("probeEnd");

  const viewport = useViewport();

  watchEffect((onCleanup) => {
    const viewportName = props.viewport ?? "both";

    const scope = effectScope(false);

    onCleanup(() => {
      scope.stop();
    });

    if (viewportName === "nearest" || viewportName === "both") {
      scope.run(() => {
        useEdgeObserver(probeStart, viewport, startViewports);
        useEdgeObserver(probeEnd, viewport, endViewports);
      });
    }

    if (
      (viewportName === "root" || viewportName === "both") &&
      toValue(viewport) !== document
    ) {
      scope.run(() => {
        useEdgeObserver(probeStart, document, startViewports);
        useEdgeObserver(probeEnd, document, endViewports);
      });
    }
  });
}
</script>

<template>
  <LayoutPrimitive :as data-layout-edge-visibility>
    <span ref="probeStart" data-edge-probe="start" />
    <slot :start-visible :end-visible />
    <span ref="probeEnd" data-edge-probe="end" />
  </LayoutPrimitive>
</template>

<style>
@property --layout-viewport-edges-start-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@property --layout-viewport-edges-end-offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 0;
}

@layer trait {
  [data-layout-edge-visibility] {
    --layout-viewport-edges-start-offset: initial;
    --layout-viewport-edges-end-offset: initial;

    [data-edge-probe] {
      --layout-viewport-edges-start-offset: inherit;
      --layout-viewport-edges-end-offset: inherit;

      position: absolute;
      pointer-events: none;
      z-index: -1;

      [data-viewport~="vertical"] & {
        block-size: 1px;
        inset-inline: 0;

        &[data-edge-probe="start"] {
          inset-block-start: calc(
            -1 * var(--layout-viewport-edges-start-offset)
          );
        }

        &[data-edge-probe="end"] {
          inset-block-end: calc(-1 * var(--layout-viewport-edges-end-offset));
        }
      }

      [data-viewport~="horizontal"] & {
        inline-size: 1px;
        inset-block: 0;

        &[data-edge-probe="start"] {
          inset-inline-start: calc(
            -1 * var(--layout-viewport-edges-start-offset)
          );
        }

        &[data-edge-probe="end"] {
          inset-inline-end: calc(-1 * var(--layout-viewport-edges-end-offset));
        }
      }
    }
  }
}
</style>
