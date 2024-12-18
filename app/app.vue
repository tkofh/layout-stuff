<template>
  <LayoutRoot>
    <LayoutAreas large="x" small="y">
      <template #top>
        <AppPlaceholder label="Header" />
      </template>

      <template #main>
        <LayoutAreas>
          <template #left>
            <AppPlaceholder label="Sidebar" />
          </template>
          <template #top>
            <AppPlaceholder label="Search Area" />
          </template>

          <template #main>
            <AppPlaceholder label="Main Content" height="200dvh" />
          </template>
        </LayoutAreas>
      </template>

      <template #bottom>
        <AppPlaceholder label="Footer" />
      </template>

      <template #right>
        <AppPlaceholder label="Right Sidebar" />
      </template>
    </LayoutAreas>
  </LayoutRoot>
</template>

<style>
body {
  background-color: var(--gray-1);
  color: var(--gray-12);
}
</style>
