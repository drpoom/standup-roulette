<template>
  <div class="sensei-avatar">
    <img :src="imageSrc" :alt="`Sensei ${expression}`" class="sensei-img" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import normalImg from '../assets/sensei/sensei_normal.png'
import angryImg from '../assets/sensei/sensei_angry.png'
import satisfiedImg from '../assets/sensei/sensei_satisfied.png'

const props = defineProps({ expression: { type: String, default: 'normal' } })

const imageSrc = computed(() => {
  const sprites = {
    normal: normalImg,
    angry: angryImg,
    satisfied: satisfiedImg,
    // Backward compatibility with old names
    default: normalImg,
    stern: angryImg,
    pleased: satisfiedImg
  }
  return sprites[props.expression] || sprites.normal
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