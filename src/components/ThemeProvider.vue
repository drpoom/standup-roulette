<template>
  <component :is="currentComponent" />
</template>

<script setup>
import { computed } from 'vue';
import useStandup from '../composables/useStandup';
import BaseTheme from '../themes/BaseTheme.vue';
import SquidTheme from '../themes/SquidTheme.vue';
import ClassroomTheme from '../themes/ClassroomTheme.vue';

const { settings } = useStandup();

const themes = {
  base: BaseTheme,
  squid: SquidTheme,
  classroom: ClassroomTheme
};

const currentComponent = computed(() => {
  return themes[settings.theme] || BaseTheme;
});
</script>