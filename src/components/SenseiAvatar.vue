<template>
  <svg class="sensei" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
    <!-- Face -->
    <circle cx="48" cy="50" r="34" fill="#F5F1E8" stroke="#0D0D0F" stroke-width="3"/>

    <!-- Default: smirk + half-lid eyes -->
    <template v-if="expression === 'default'">
      <path d="M28 42 Q36 38 44 42" stroke="#0D0D0F" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M52 42 Q60 38 68 42" stroke="#0D0D0F" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M36 62 Q48 70 60 62" stroke="#0D0D0F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </template>

    <!-- Pleased: wide grin + sparkle eyes -->
    <template v-else-if="expression === 'pleased'">
      <path d="M28 44 L34 38 L40 44" stroke="#0D0D0F" stroke-width="2.5" fill="#D4AF37" stroke-linejoin="round"/>
      <path d="M56 44 L62 38 L68 44" stroke="#0D0D0F" stroke-width="2.5" fill="#D4AF37" stroke-linejoin="round"/>
      <path d="M32 62 Q48 76 64 62" stroke="#0D0D0F" stroke-width="2.5" fill="#C41E3A" stroke-linecap="round"/>
      <line x1="32" y1="62" x2="64" y2="62" stroke="#0D0D0F" stroke-width="2"/>
    </template>

    <!-- Stern: glare + furrowed brow -->
    <template v-else>
      <circle cx="36" cy="44" r="5" fill="#0D0D0F"/>
      <circle cx="60" cy="44" r="5" fill="#0D0D0F"/>
      <line x1="24" y1="34" x2="44" y2="38" stroke="#0D0D0F" stroke-width="3" stroke-linecap="round"/>
      <line x1="72" y1="34" x2="52" y2="38" stroke="#0D0D0F" stroke-width="3" stroke-linecap="round"/>
      <line x1="38" y1="64" x2="58" y2="64" stroke="#0D0D0F" stroke-width="3" stroke-linecap="round"/>
    </template>

    <!-- Brows (default + pleased only) -->
    <template v-if="expression !== 'stern'">
      <line x1="26" y1="34" x2="44" y2="32" stroke="#0D0D0F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="52" y1="32" x2="70" y2="34" stroke="#0D0D0F" stroke-width="2.5" stroke-linecap="round"/>
    </template>

    <!-- Headband -->
    <rect x="14" y="22" width="68" height="6" rx="3" fill="#C41E3A" stroke="#0D0D0F" stroke-width="1.5"/>
    <circle cx="74" cy="25" r="4" fill="#D4AF37" stroke="#0D0D0F" stroke-width="1"/>
  </svg>
</template>

<script setup>
defineProps({ expression: { type: String, default: 'default' } })
</script>

<style scoped>
.sensei {
  width: 96px;
  height: 96px;
  animation: bob 3s ease-in-out infinite;
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}
@media (prefers-reduced-motion: reduce) {
  .sensei { animation: none; }
}
</style>