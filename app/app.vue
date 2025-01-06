<template>
  <LayoutRoot>
    <LayoutBlock size="page" frame-x="sm">
      <LayoutSpread>
        <LayoutColumns space="xs">
          <LayoutColumn width="content">
            <LayoutBox width="10" aspect="1">
              <AppPlaceholder />
            </LayoutBox>
          </LayoutColumn>
          <LayoutColumn width="content">
            <LayoutBox width="10" aspect="1">
              <AppPlaceholder />
            </LayoutBox>
          </LayoutColumn>
          <LayoutColumn width="content">
            <LayoutBox width="10" aspect="1">
              <AppPlaceholder />
            </LayoutBox>
          </LayoutColumn>
        </LayoutColumns>

        <LayoutColumns space="xs" align="right">
          <LayoutColumn width="content">
            <LayoutBox width="10" aspect="1">
              <AppPlaceholder />
            </LayoutBox>
          </LayoutColumn>
          <LayoutColumn width="content">
            <LayoutBox width="10" aspect="1">
              <AppPlaceholder />
            </LayoutBox>
          </LayoutColumn>
          <LayoutColumn width="content">
            <LayoutBox width="10" aspect="1">
              <AppPlaceholder />
            </LayoutBox>
          </LayoutColumn>
        </LayoutColumns>
      </LayoutSpread>
    </LayoutBlock>
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
