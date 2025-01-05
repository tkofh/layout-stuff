<template>
  <LayoutRoot>
    <LayoutStack space="xl" align="center">
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
    </LayoutStack>
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
