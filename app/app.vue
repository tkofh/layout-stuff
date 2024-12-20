<template>
  <LayoutRoot>
    <LayoutAreas large="y">
      <!--        <LayoutSticky>-->
      <template #top>
        <AppPlaceholder label="Header" height="20rem" />
      </template>
      <!--        </LayoutSticky>-->

      <template #main>
        <LayoutFrame frame="1">
          <LayoutStack space="1">
            <AppPlaceholder
              v-for="i in 5"
              :key="`${i}-placeholder`"
              :label="i"
              width="100%"
              aspect-ratio="16 / 9"
            />
          </LayoutStack>
        </LayoutFrame>
      </template>

      <!--        <LayoutSticky>-->
      <template #bottom>
        <AppPlaceholder label="Footer" height="20rem" />
      </template>
      <!--        </LayoutSticky>-->

      <template #left>
        <LayoutSticky>
          <AppPlaceholder label="Left Sidebar" height="100%" />
        </LayoutSticky>
      </template>
    </LayoutAreas>
  </LayoutRoot>
</template>

<style>
@property --testing {
  syntax: "*";
  inherits: false;
}

@property --other {
  syntax: "*";
  inherits: false;
}

@property --computed {
  syntax: "hello | foo | bar | third";
  inherits: false;
  initial-value: third;
}

body {
  background-color: var(--gray-1);
  color: var(--gray-12);

  --other: unset;
  --testing: foo;
  --computed: var(--testing, hello);
}

@media (width >= 768px) {
  body {
    --testing: var(--other);
  }
}

@media (width >= 1200px) {
  body {
    --testing: bar;
  }
}
</style>
