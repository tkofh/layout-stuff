<template>
  <LayoutRoot>
    <LayoutAreas large="y">
      <template #top>
        <LayoutBox height="20rem">
          <AppPlaceholder label="Header" />
        </LayoutBox>
      </template>

      <template #bottom>
        <LayoutBox height="20rem">
          <AppPlaceholder label="Footer" />
        </LayoutBox>
      </template>

      <template #main>
        <LayoutBox width="100%" min-height="0" max-height="100%">
          <LayoutStack space="1">
            <LayoutBox width="100%" aspect-ratio="1">
              <AppPlaceholder label="1" />
            </LayoutBox>
            <LayoutBox width="100%" aspect-ratio="1">
              <AppPlaceholder label="2" />
            </LayoutBox>
            <LayoutBox width="100%" aspect-ratio="1">
              <AppPlaceholder label="3" />
            </LayoutBox>
          </LayoutStack>
        </LayoutBox>
      </template>

      <template #left>
        <LayoutSticky>
          <LayoutScroll direction="vertical">
            <LayoutAreas large="y">
              <template #top>
                <LayoutSticky>
                  <LayoutBox height="5rem" width="100%">
                    <AppPlaceholder label="Top Sidebar" />
                  </LayoutBox>
                </LayoutSticky>
              </template>

              <template #bottom>
                <LayoutBox height="5rem" width="100%">
                  <AppPlaceholder label="Top Sidebar" />
                </LayoutBox>
              </template>

              <template #right>
                <LayoutSticky>
                  <AppPlaceholder label="Right Sidebar" />
                </LayoutSticky>
              </template>

              <template #main>
                <LayoutStack>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                  <LayoutBox height="10rem" width="100%">
                    <AppPlaceholder label="Left Sidebar" />
                  </LayoutBox>
                </LayoutStack>
              </template>
            </LayoutAreas>
          </LayoutScroll>
        </LayoutSticky>
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
