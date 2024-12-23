<template>
  <RadixSlot data-layout-box :style>
    <slot />
  </RadixSlot>
</template>

<script lang="ts">
import {
  mapResponsive,
  normalizeResponsive,
  responsiveToAttributes,
} from "~/utils/responsive";

function boxStyles(
  width: Size | undefined,
  height: Size | undefined,
  aspectRatio: AspectRatio | undefined,
  minWidth: Size | undefined,
  minHeight: Size | undefined,
  maxWidth: ResponsiveValue<SizeKey | "none"> | undefined,
  maxHeight: ResponsiveValue<SizeKey | "none"> | undefined,
): Record<string, string> {
  const hasWidth = width !== undefined;
  const hasHeight = height !== undefined;
  const hasAspectRatio = aspectRatio !== undefined;

  const output = {} as Record<string, string>;

  if (hasWidth) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-box-width",
        mapResponsive(normalizeResponsive(width), (value) => SIZE_SCALE[value]),
      ),
    );
  } else if (!hasHeight || !hasAspectRatio) {
    Object.assign(output, { "--layout-box-width": "100%" });
  }

  if (hasHeight) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-box-height",
        mapResponsive(
          normalizeResponsive(height),
          (value) => SIZE_SCALE[value],
        ),
      ),
    );
  } else if (!hasWidth || !hasAspectRatio) {
    Object.assign(output, { "--layout-box-height": "100%" });
  }

  if (hasAspectRatio) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-box-aspect",
        normalizeResponsive(aspectRatio),
      ),
    );
  }

  if (minWidth !== undefined) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--layout-box-min-width",
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
        "--layout-box-min-height",
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
        "--layout-box-max-width",
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
        "--layout-box-max-height",
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

export interface BoxProps {
  width?: Size;
  height?: Size;
  aspectRatio?: AspectRatio;
  minWidth?: Size;
  minHeight?: Size;
  maxWidth?: ResponsiveValue<SizeKey | "none">;
  maxHeight?: ResponsiveValue<SizeKey | "none">;
}

export interface BoxSlots {
  default?: () => unknown;
}
</script>

<script setup lang="ts">
const props = defineProps<BoxProps>();
defineSlots<BoxSlots>();

const style = computed(() =>
  boxStyles(
    props.width,
    props.height,
    props.aspectRatio,
    props.minWidth,
    props.minHeight,
    props.maxWidth,
    props.maxHeight,
  ),
);
</script>

<style>
@property --layout-box-width {
  syntax: "*";
  inherits: false;
}

@property --layout-box-width-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-box-width-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-width-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-width-current {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --layout-box-height {
  syntax: "*";
  inherits: false;
}

@property --layout-box-height-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-box-height-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-height-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-height-current {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --layout-box-aspect {
  syntax: "*";
  inherits: false;
}

@property --layout-box-aspect-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-box-aspect-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-aspect-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-aspect-current {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-width {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-width-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-width-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-width-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-width-current {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --layout-box-min-height {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-height-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-height-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-height-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-min-height-current {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --layout-box-max-width {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-width-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-width-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-width-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-width-current {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --layout-box-max-height {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-height-tablet {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-height-laptop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-height-desktop {
  syntax: "*";
  inherits: false;
}

@property --layout-box-max-height-current {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@layer trait {
  [data-layout-box] {
    --layout-box-width-current: var(--layout-box-width);
    --layout-box-height-current: var(--layout-box-height);
    --layout-box-aspect-current: var(--layout-box-aspect);
    --layout-box-min-width-current: var(--layout-box-min-width);
    --layout-box-min-height-current: var(--layout-box-min-height);
    --layout-box-max-width-current: var(--layout-box-max-width);
    --layout-box-max-height-current: var(--layout-box-max-height);

    block-size: var(--layout-box-height-current);
    inline-size: var(--layout-box-width-current);
    aspect-ratio: var(--layout-box-aspect-current);
    min-block-size: var(--layout-box-min-height-current);
    min-inline-size: var(--layout-box-min-width-current);
    max-block-size: var(--layout-box-max-height-current);
    max-inline-size: var(--layout-box-max-width-current);

    @container style(--media-gte-tablet: true) {
      --layout-box-width-tablet: var(--layout-box-width);
      --layout-box-height-tablet: var(--layout-box-height);
      --layout-box-aspect-tablet: var(--layout-box-aspect);
      --layout-box-min-width-tablet: var(--layout-box-min-width);
      --layout-box-min-height-tablet: var(--layout-box-min-height);
      --layout-box-max-width-tablet: var(--layout-box-max-width);
      --layout-box-max-height-tablet: var(--layout-box-max-height);
      --layout-box-width-current: var(--layout-box-width-tablet);
      --layout-box-height-current: var(--layout-box-height-tablet);
      --layout-box-aspect-current: var(--layout-box-aspect-tablet);
      --layout-box-min-width-current: var(--layout-box-min-width-tablet);
      --layout-box-min-height-current: var(--layout-box-min-height-tablet);
      --layout-box-max-width-current: var(--layout-box-max-width-tablet);
      --layout-box-max-height-current: var(--layout-box-max-height-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --layout-box-width-laptop: var(--layout-box-width-tablet);
      --layout-box-height-laptop: var(--layout-box-height-tablet);
      --layout-box-aspect-laptop: var(--layout-box-aspect-tablet);
      --layout-box-min-width-laptop: var(--layout-box-min-width-tablet);
      --layout-box-min-height-laptop: var(--layout-box-min-height-tablet);
      --layout-box-max-width-laptop: var(--layout-box-max-width-tablet);
      --layout-box-max-height-laptop: var(--layout-box-max-height-tablet);
      --layout-box-width-current: var(--layout-box-width-laptop);
      --layout-box-height-current: var(--layout-box-height-laptop);
      --layout-box-aspect-current: var(--layout-box-aspect-laptop);
      --layout-box-min-width-current: var(--layout-box-min-width-laptop);
      --layout-box-min-height-current: var(--layout-box-min-height-laptop);
      --layout-box-max-width-current: var(--layout-box-max-width-laptop);
      --layout-box-max-height-current: var(--layout-box-max-height-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --layout-box-width-desktop: var(--layout-box-width-laptop);
      --layout-box-height-desktop: var(--layout-box-height-laptop);
      --layout-box-aspect-desktop: var(--layout-box-aspect-laptop);
      --layout-box-min-width-desktop: var(--layout-box-min-width-laptop);
      --layout-box-min-height-desktop: var(--layout-box-min-height-laptop);
      --layout-box-max-width-desktop: var(--layout-box-max-width-laptop);
      --layout-box-max-height-desktop: var(--layout-box-max-height-laptop);
      --layout-box-width-current: var(--layout-box-width-desktop);
      --layout-box-height-current: var(--layout-box-height-desktop);
      --layout-box-aspect-current: var(--layout-box-aspect-desktop);
      --layout-box-min-width-current: var(--layout-box-min-width-desktop);
      --layout-box-min-height-current: var(--layout-box-min-height-desktop);
      --layout-box-max-width-current: var(--layout-box-max-width-desktop);
      --layout-box-max-height-current: var(--layout-box-max-height-desktop);
    }
  }
}
</style>
