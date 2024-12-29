<template>
  <LayoutRoot>
    <LayoutStack space="md" frame="md">
      <LayoutSticky edge="start">
        <LayoutBox height="40">
          <AppPlaceholder label="Sticky 1" />
        </LayoutBox>
      </LayoutSticky>
      <LayoutBox aspect-ratio="1">
        <AppPlaceholder label="Filler 1" />
      </LayoutBox>
      <LayoutSticky edge="start">
        <LayoutBox height="40">
          <AppPlaceholder label="Sticky 2" />
        </LayoutBox>
      </LayoutSticky>
      <LayoutBox aspect-ratio="1">
        <AppPlaceholder label="Filler 2" />
      </LayoutBox>
    </LayoutStack>
  </LayoutRoot>
</template>

<style>
@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }
}
</style>
