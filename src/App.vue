<template>
  <div class="min-h-screen bg-slate-900 text-slate-200 font-sans transition-colors duration-500">
    <Dashboard v-if="appState === 'setup'" />
    <ThemeProvider v-else />
  </div>
</template>

<script setup>
import useStandup from './composables/useStandup';
import Dashboard from './components/Dashboard.vue';
import ThemeProvider from './components/ThemeProvider.vue';

const { appState } = useStandup();
</script>
