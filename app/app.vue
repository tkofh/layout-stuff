<template>
  <LayoutRoot>
    <LayoutAreas large="y">
      <template #top>
        <LayoutBox height="10rem">
          <AppPlaceholder label="Global Header" />
        </LayoutBox>
      </template>

      <template #left>
        <LayoutSticky>
          <LayoutScroll width="30rem" direction="vertical">
            <LayoutAreas large="y">
              <template #top>
                <LayoutSticky>
                  <LayoutBox height="5rem">
                    <AppPlaceholder label="Left Sidebar Header" />
                  </LayoutBox>
                </LayoutSticky>
              </template>

              <template #bottom>
                <LayoutBox height="5rem">
                  <AppPlaceholder label="Left Sidebar Footer" />
                </LayoutBox>
              </template>

              <template #right>
                <LayoutSticky>
                  <LayoutBox width="10rem">
                    <AppPlaceholder label="Left-Right Sidebar" />
                  </LayoutBox>
                </LayoutSticky>
              </template>

              <template #main>
                <LayoutStack>
                  <LayoutBox
                    v-for="i in 10"
                    :key="`left-sidebar-item-${i}`"
                    height="10rem"
                  >
                    <AppPlaceholder :label="`Left-Left Sidebar Item ${i}`" />
                  </LayoutBox>
                </LayoutStack>
              </template>
            </LayoutAreas>
          </LayoutScroll>
        </LayoutSticky>
      </template>

      <template #main>
        <LayoutStack space="md" frame="md">
          <LayoutScroll direction="horizontal">
            <LayoutAreas large="x">
              <template #top>
                <LayoutSticky>
                  <LayoutBox height="10rem">
                    <AppPlaceholder label="Horizontal Section Top" />
                  </LayoutBox>
                </LayoutSticky>
              </template>

              <template #left>
                <LayoutBox width="10rem">
                  <AppPlaceholder label="Horizontal Section Left" />
                </LayoutBox>
              </template>

              <template #right>
                <LayoutBox width="10rem">
                  <AppPlaceholder label="Horizontal Section Right" />
                </LayoutBox>
              </template>

              <template #main>
                <LayoutInline space="sm">
                  <LayoutBox v-for="i in 10" :key="`item-${i}`" width="10rem">
                    <AppPlaceholder
                      :label="`Horizontal Section Main Item ${i}`"
                    />
                  </LayoutBox>
                </LayoutInline>
              </template>
            </LayoutAreas>
          </LayoutScroll>
          <LayoutBox aspect-ratio="1">
            <AppPlaceholder label="Filler" />
          </LayoutBox>
        </LayoutStack>
      </template>

      <template #bottom>
        <LayoutBox height="10rem">
          <AppPlaceholder label="Global Footer" />
        </LayoutBox>
      </template>
    </LayoutAreas>
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
