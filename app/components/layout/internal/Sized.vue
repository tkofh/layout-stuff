<script lang="ts">
import type { PrimitiveSlots } from "~/components/layout/internal/Primitive.vue";

function sizeStyles(
  width: Size | undefined | false,
  height: Size | undefined | false,
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
    if (width !== false) {
      Object.assign(
        output,
        responsiveToAttributes(
          "--inline-size",
          mapResponsive(
            normalizeResponsive(width),
            (value) => SIZE_SCALE[value],
          ),
        ),
      );
    }
  } else if (!hasHeight || !hasAspectRatio) {
    Object.assign(output, { "--inline-size": "100%" });
  }

  if (hasHeight) {
    if (height !== false) {
      Object.assign(
        output,
        responsiveToAttributes(
          "--block-size",
          mapResponsive(
            normalizeResponsive(height),
            (value) => SIZE_SCALE[value],
          ),
        ),
      );
    }
  } else if (!hasWidth || !hasAspectRatio) {
    Object.assign(output, { "--block-size": "100%" });
  }

  if (hasAspectRatio) {
    Object.assign(
      output,
      responsiveToAttributes("--aspect", normalizeResponsive(aspect)),
    );
  }

  if (minWidth !== undefined) {
    Object.assign(
      output,
      responsiveToAttributes(
        "--min-inline-size",
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
        "--min-block-size",
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
        "--max-inline-size",
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
        "--max-block-size",
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

export interface DisableableSizedProps
  extends Omit<SizedProps, "width" | "height"> {
  width?: Size | false;
  height?: Size | false;
}

export type SizedSlots = PrimitiveSlots;
</script>

<script setup lang="ts">
const props = defineProps<DisableableSizedProps>();
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
  <RadixSlot :style data-sized>
    <slot />
  </RadixSlot>
</template>

<style>
@property --inline-size {
  syntax: "*";
  inherits: false;
}

@property --inline-size-tablet {
  syntax: "*";
  inherits: false;
}

@property --inline-size-laptop {
  syntax: "*";
  inherits: false;
}

@property --inline-size-desktop {
  syntax: "*";
  inherits: false;
}

@property --inline-size-specified {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --inline-size-actual {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --block-size {
  syntax: "*";
  inherits: false;
}

@property --block-size-tablet {
  syntax: "*";
  inherits: false;
}

@property --block-size-laptop {
  syntax: "*";
  inherits: false;
}

@property --block-size-desktop {
  syntax: "*";
  inherits: false;
}

@property --block-size-specified {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --block-size-actual {
  syntax: "<length-percentage> | auto";
  inherits: false;
  initial-value: auto;
}

@property --aspect {
  syntax: "*";
  inherits: false;
}

@property --aspect-tablet {
  syntax: "*";
  inherits: false;
}

@property --aspect-laptop {
  syntax: "*";
  inherits: false;
}

@property --aspect-desktop {
  syntax: "*";
  inherits: false;
}

@property --aspect-actual {
  syntax: "*";
  inherits: false;
}

@property --min-inline-size {
  syntax: "*";
  inherits: false;
}

@property --min-inline-size-tablet {
  syntax: "*";
  inherits: false;
}

@property --min-inline-size-laptop {
  syntax: "*";
  inherits: false;
}

@property --min-inline-size-desktop {
  syntax: "*";
  inherits: false;
}

@property --min-inline-size-specified {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --min-inline-size-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --min-block-size {
  syntax: "*";
  inherits: false;
}

@property --min-block-size-tablet {
  syntax: "*";
  inherits: false;
}

@property --min-block-size-laptop {
  syntax: "*";
  inherits: false;
}

@property --min-block-size-desktop {
  syntax: "*";
  inherits: false;
}

@property --min-block-size-specified {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --min-block-size-actual {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --max-inline-size {
  syntax: "*";
  inherits: false;
}

@property --max-inline-size-tablet {
  syntax: "*";
  inherits: false;
}

@property --max-inline-size-laptop {
  syntax: "*";
  inherits: false;
}

@property --max-inline-size-desktop {
  syntax: "*";
  inherits: false;
}

@property --max-inline-size-specified {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --max-inline-size-actual {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --max-block-size {
  syntax: "*";
  inherits: false;
}

@property --max-block-size-tablet {
  syntax: "*";
  inherits: false;
}

@property --max-block-size-laptop {
  syntax: "*";
  inherits: false;
}

@property --max-block-size-desktop {
  syntax: "*";
  inherits: false;
}

@property --max-block-size-specified {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --max-block-size-actual {
  syntax: "<length-percentage> | none";
  inherits: false;
  initial-value: none;
}

@property --inline-size-adjustment {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@property --block-size-adjustment {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0;
}

@layer layout.init {
  [data-sized] {
    --inline-size-specified: var(--inline-size);
    --block-size-specified: var(--block-size);
    --aspect-actual: var(--aspect);
    --min-inline-size-specified: var(--min-inline-size);
    --min-block-size-specified: var(--min-block-size);
    --max-inline-size-specified: var(--max-inline-size);
    --max-block-size-specified: var(--max-block-size);
    --inline-size-actual: calc(
      var(--inline-size-specified) + var(--inline-size-adjustment)
    );
    --block-size-actual: calc(
      var(--block-size-specified) + var(--block-size-adjustment)
    );
    --min-inline-size-actual: calc(
      var(--min-inline-size-specified) + var(--inline-size-adjustment)
    );
    --min-block-size-actual: calc(
      var(--min-block-size-specified) + var(--block-size-adjustment)
    );
    --max-inline-size-actual: var(--max-inline-size-specified);
    --max-block-size-actual: var(--max-block-size-specified);

    @container style(--media-gte-tablet: true) {
      --inline-size-tablet: var(--inline-size);
      --block-size-tablet: var(--block-size);
      --aspect-tablet: var(--aspect);
      --min-inline-size-tablet: var(--min-inline-size);
      --min-block-size-tablet: var(--min-block-size);
      --max-inline-size-tablet: var(--max-inline-size);
      --max-block-size-tablet: var(--max-block-size);
      --inline-size-specified: var(--inline-size-tablet);
      --block-size-specified: var(--block-size-tablet);
      --aspect-actual: var(--aspect-tablet);
      --min-inline-size-specified: var(--min-inline-size-tablet);
      --min-block-size-specified: var(--min-block-size-tablet);
      --max-inline-size-specified: var(--max-inline-size-tablet);
      --max-block-size-specified: var(--max-block-size-tablet);
    }

    @container style(--media-gte-laptop: true) {
      --inline-size-laptop: var(--inline-size-tablet);
      --block-size-laptop: var(--block-size-tablet);
      --aspect-laptop: var(--aspect-tablet);
      --min-inline-size-laptop: var(--min-inline-size-tablet);
      --min-block-size-laptop: var(--min-block-size-tablet);
      --max-inline-size-laptop: var(--max-inline-size-tablet);
      --max-block-size-laptop: var(--max-block-size-tablet);
      --inline-size-specified: var(--inline-size-laptop);
      --block-size-specified: var(--block-size-laptop);
      --aspect-actual: var(--aspect-laptop);
      --min-inline-size-specified: var(--min-inline-size-laptop);
      --min-block-size-specified: var(--min-block-size-laptop);
      --max-inline-size-specified: var(--max-inline-size-laptop);
      --max-block-size-specified: var(--max-block-size-laptop);
    }

    @container style(--media-eq-desktop: true) {
      --inline-size-desktop: var(--inline-size-laptop);
      --block-size-desktop: var(--block-size-laptop);
      --aspect-desktop: var(--aspect-laptop);
      --min-inline-size-desktop: var(--min-inline-size-laptop);
      --min-block-size-desktop: var(--min-block-size-laptop);
      --max-inline-size-desktop: var(--max-inline-size-laptop);
      --max-block-size-desktop: var(--max-block-size-laptop);
      --inline-size-specified: var(--inline-size-desktop);
      --block-size-specified: var(--block-size-desktop);
      --aspect-actual: var(--aspect-desktop);
      --min-inline-size-specified: var(--min-inline-size-desktop);
      --min-block-size-specified: var(--min-block-size-desktop);
      --max-inline-size-specified: var(--max-inline-size-desktop);
      --max-block-size-specified: var(--max-block-size-desktop);
    }
  }
}

@layer layout.trait {
  [data-sized] {
    block-size: var(--block-size-actual);
    inline-size: var(--inline-size-actual);
    aspect-ratio: var(--aspect-actual);
    min-block-size: var(--min-block-size-actual);
    min-inline-size: var(--min-inline-size-actual);
    max-block-size: var(--max-block-size-actual);
    max-inline-size: var(--max-inline-size-actual);
  }
}
</style>
