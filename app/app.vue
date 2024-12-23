<template>
  <LayoutRoot>
    <LayoutAreas large="y">
      <template #top>
        <LayoutBox height="10rem">
          <AppPlaceholder label="Section A Header" />
        </LayoutBox>
      </template>

      <template #left>
        <LayoutSticky>
          <LayoutBox width="30rem" height="100%">
            <LayoutScroll direction="vertical">
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
                    <LayoutBox width="10rem" height="100%">
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
          </LayoutBox>
        </LayoutSticky>
      </template>

      <template #main>
        <LayoutBox width="100%">
          <LayoutStack space="1" style="padding: 1rem">
            <LayoutBox>
              <LayoutScroll direction="horizontal">
                <LayoutAreas large="x">
                  <template #top>
                    <LayoutSticky>
                      <LayoutBox width="100%" height="10rem">
                        <AppPlaceholder label="Horizontal Section Top" />
                      </LayoutBox>
                    </LayoutSticky>
                  </template>

                  <template #left>
                    <LayoutBox width="10rem" height="100%">
                      <AppPlaceholder label="Horizontal Section Left" />
                    </LayoutBox>
                  </template>

                  <template #right>
                    <LayoutBox width="10rem" height="100%">
                      <AppPlaceholder label="Horizontal Section Right" />
                    </LayoutBox>
                  </template>

                  <template #main>
                    <LayoutInline space="1">
                      <LayoutBox
                        v-for="i in 10"
                        :key="`item-${i}`"
                        width="10rem"
                        height="100%"
                      >
                        <AppPlaceholder
                          :label="`Horizontal Section Main Item ${i}`"
                        />
                      </LayoutBox>
                    </LayoutInline>
                  </template>
                </LayoutAreas>
              </LayoutScroll>
            </LayoutBox>
            <LayoutBox width="100%" aspect-ratio="1">
              <AppPlaceholder label="Filler" />
            </LayoutBox>
          </LayoutStack>
        </LayoutBox>
      </template>

      <template #bottom>
        <LayoutBox height="10rem">
          <AppPlaceholder label="Section A Footer" />
        </LayoutBox>
      </template>
    </LayoutAreas>
  </LayoutRoot>
</template>

<script setup lang="ts"></script>
<style>
body {
  background-color: var(--gray-1);
  color: var(--gray-12);
}
</style>
