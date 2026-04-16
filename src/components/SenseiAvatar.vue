<template>
  <div class="sensei-avatar">
    <img :src="imageSrc" :alt="`Sensei ${expression}`" class="sensei-img" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import defaultImg from '../assets/sensei/sensei_default.png'
import pleasedImg from '../assets/sensei/sensei_pleased.png'
import sternImg from '../assets/sensei/sensei_stern.png'

const props = defineProps({ expression: { type: String, default: 'default' } })

const imageSrc = computed(() => {
  const sprites = {
    default: defaultImg,
    pleased: pleasedImg,
    stern: sternImg
  }
  return sprites[props.expression] || sprites.default
})
</script>

<style scoped>
.sensei-avatar {
  width: 96px;
  height: 96px;
  overflow: hidden;
  border-radius: 50%;
  animation: bob 3s ease-in-out infinite;
}
.sensei-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}
@media (prefers-reduced-motion: reduce) {
  .sensei-avatar { animation: none; }
}
</style>