<template>
  <LayoutRoot>
    <LayoutLayers>
      <LayoutLayer>
        <LayoutColumns space="sm" reverse collapse-below="laptop" align="right">
          <LayoutColumn width="fluid">
            <AppPlaceholder label="Fluid" />
          </LayoutColumn>
          <LayoutColumn width="content">
            <LayoutBox width="32">
              <AppPlaceholder label="Content" />
            </LayoutBox>
          </LayoutColumn>
        </LayoutColumns>
      </LayoutLayer>

      <LayoutLayer layer="-1">
        <LayoutColumns space="sm" reverse collapse-below="laptop" align="right">
          <LayoutColumn width="content">
            <LayoutBox aspect="1" height="80">
              <AppPlaceholder label="Content" />
            </LayoutBox>
          </LayoutColumn>
        </LayoutColumns>
      </LayoutLayer>
    </LayoutLayers>
  </LayoutRoot>
</template>

<script setup lang="ts"></script>

<style>
@layer app {
  body {
    background-color: var(--gray-1);
    color: var(--gray-12);
  }
}
</style>
