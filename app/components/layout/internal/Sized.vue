<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

function sizeStyles(
  width: Size | undefined,
  height: Size | undefined,
  aspect: AspectRatio | undefined,
  minWidth: Size | undefined,
  minHeight: Size | undefined,
  maxWidth: ResponsiveValue<SizeKey | "none"> | undefined,
  maxHeight: ResponsiveValue<SizeKey | "none"> | undefined,
): Record<string, string> {
  const hasWidth = width !== undefined;
  const hasHeight = height !== undefined;
  const hasAspectRatio = aspect !== undefined;

  const output = {} as Record<string, string>;

  if (hasWidth) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-size-width",
        mapResponsive(normalizeResponsive(width), (value) => SIZE_SCALE[value]),
      ),
    );
  } else if (!hasHeight || !hasAspectRatio) {
    Object.assign(output, { "--layout-size-width": "100%" });
  }

  if (hasHeight) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-size-height",
        mapResponsive(
          normalizeResponsive(height),
          (value) => SIZE_SCALE[value],
        ),
      ),
    );
  } else if (!hasWidth || !hasAspectRatio) {
    Object.assign(output, { "--layout-size-height": "100%" });
  }

  if (hasAspectRatio) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-size-aspect",
        normalizeResponsive(aspect),
      ),
    );
  }

  if (minWidth !== undefined) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-size-min-width",
        mapResponsive(
          normalizeResponsive(minWidth),
          (value) => SIZE_SCALE[value],
        ),
      ),
    );
  }

  if (minHeight !== undefined) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-size-min-height",
        mapResponsive(
          normalizeResponsive(minHeight),
          (value) => SIZE_SCALE[value],
        ),
      ),
    );
  }

  if (maxWidth !== undefined) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-size-max-width",
        mapResponsive(normalizeResponsive(maxWidth), (value) =>
          value === "none" ? "none" : SIZE_SCALE[value],
        ),
      ),
    );
  }

  if (maxHeight !== undefined) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-size-max-height",
        mapResponsive(normalizeResponsive(maxHeight), (value) =>
          value === "none" ? "none" : SIZE_SCALE[value],
        ),
      ),
    );
  }

  return output;
}

export type AspectRatio = ResponsiveValue<
  number | `${number}` | `${number} / ${number}`
>;

export interface SizedProps {
  width?: Size;
  height?: Size;
  aspect?: AspectRatio;
  minWidth?: Size;
  minHeight?: Size;
  maxWidth?: ResponsiveValue<SizeKey | "none">;
  maxHeight?: ResponsiveValue<SizeKey | "none">;
}

export type SizedSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<SizedProps>();
defineSlots<SizedSlots>();

const style = computed(() =>
  sizeStyles(
    props.width,
    props.height,
    props.aspect,
    props.minWidth,
    props.minHeight,
    props.maxWidth,
    props.maxHeight,
  ),
);
</script>

<template>
  <RadixSlot :style class="layout-sized">
    <slot />
  </RadixSlot>
</template>

<style>
@property --layout-size-width {
  syntax: "*";
  inherits: false;
}

@property --layout-size-width-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-size-width-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-width-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-width-current {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --layout-size-height {
  syntax: "*";
  inherits: false;
}

@property --layout-size-height-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-size-height-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-height-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-height-current {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --layout-size-aspect {
  syntax: "*";
  inherits: false;
}

@property --layout-size-aspect-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-size-aspect-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-aspect-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-aspect-current {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-width {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-width-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-width-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-width-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-width-current {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --layout-size-min-height {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-height-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-height-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-height-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-min-height-current {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --layout-size-max-width {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-width-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-width-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-width-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-width-current {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --layout-size-max-height {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-height-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-height-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-height-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-size-max-height-current {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@layer layout.trait {
  .layout-sized {
    --layout-size-width-current: var(--layout-size-width);
    --layout-size-height-current: var(--layout-size-height);
    --layout-size-aspect-current: var(--layout-size-aspect);
    --layout-size-min-width-current: var(--layout-size-min-width);
    --layout-size-min-height-current: var(--layout-size-min-height);
    --layout-size-max-width-current: var(--layout-size-max-width);
    --layout-size-max-height-current: var(--layout-size-max-height);

    block-size: var(--layout-size-height-current);
    inline-size: var(--layout-size-width-current);
    aspect-ratio: var(--layout-size-aspect-current);
    min-block-size: var(--layout-size-min-height-current);
    min-inline-size: var(--layout-size-min-width-current);
    max-block-size: var(--layout-size-max-height-current);
    max-inline-size: var(--layout-size-max-width-current);

    @container style(--media-gte-tablet: true) {
      --layout-size-width-tablet: var(--layout-size-width);
      --layout-size-height-tablet: var(--layout-size-height);
      --layout-size-aspect-tablet: var(--layout-size-aspect);
      --layout-size-min-width-tablet: var(--layout-size-min-width);
      --layout-size-min-height-tablet: var(--layout-size-min-height);
      --layout-size-max-width-tablet: var(--layout-size-max-width);
      --layout-size-max-height-tablet: var(--layout-size-max-height);
      --layout-size-width-current: var(--layout-size-width-tablet);
      --layout-size-height-current: var(--layout-size-height-tablet);
      --layout-size-aspect-current: var(--layout-size-aspect-tablet);
      --layout-size-min-width-current: var(--layout-size-min-width-tablet);
      --layout-size-min-height-current: var(--layout-size-min-height-tablet);
      --layout-size-max-width-current: var(--layout-size-max-width-tablet);
      --layout-size-max-height-current: var(--layout-size-max-height-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-size-width-laptop: var(--layout-size-width-tablet);
      --layout-size-height-laptop: var(--layout-size-height-tablet);
      --layout-size-aspect-laptop: var(--layout-size-aspect-tablet);
      --layout-size-min-width-laptop: var(--layout-size-min-width-tablet);
      --layout-size-min-height-laptop: var(--layout-size-min-height-tablet);
      --layout-size-max-width-laptop: var(--layout-size-max-width-tablet);
      --layout-size-max-height-laptop: var(--layout-size-max-height-tablet);
      --layout-size-width-current: var(--layout-size-width-laptop);
      --layout-size-height-current: var(--layout-size-height-laptop);
      --layout-size-aspect-current: var(--layout-size-aspect-laptop);
      --layout-size-min-width-current: var(--layout-size-min-width-laptop);
      --layout-size-min-height-current: var(--layout-size-min-height-laptop);
      --layout-size-max-width-current: var(--layout-size-max-width-laptop);
      --layout-size-max-height-current: var(--layout-size-max-height-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-size-width-desktop: var(--layout-size-width-laptop);
      --layout-size-height-desktop: var(--layout-size-height-laptop);
      --layout-size-aspect-desktop: var(--layout-size-aspect-laptop);
      --layout-size-min-width-desktop: var(--layout-size-min-width-laptop);
      --layout-size-min-height-desktop: var(--layout-size-min-height-laptop);
      --layout-size-max-width-desktop: var(--layout-size-max-width-laptop);
      --layout-size-max-height-desktop: var(--layout-size-max-height-laptop);
      --layout-size-width-current: var(--layout-size-width-desktop);
      --layout-size-height-current: var(--layout-size-height-desktop);
      --layout-size-aspect-current: var(--layout-size-aspect-desktop);
      --layout-size-min-width-current: var(--layout-size-min-width-desktop);
      --layout-size-min-height-current: var(--layout-size-min-height-desktop);
      --layout-size-max-width-current: var(--layout-size-max-width-desktop);
      --layout-size-max-height-current: var(--layout-size-max-height-desktop);
    }
  }
}
</style>
