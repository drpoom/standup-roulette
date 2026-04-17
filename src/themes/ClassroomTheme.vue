<template>
  <div class="classroom-scene h-screen w-full p-4 flex flex-col justify-center items-center relative">

    <!-- ====== INTRO CUTSCENE ====== -->
    <div v-if="showIntro" class="classroom-intro">
      <div v-if="introPhase >= 1" class="phase-kanji">教室</div>
      <div v-if="introPhase >= 2" class="phase-subtitle">
        <span>先生が見ているぞ。</span>
        <span class="en">The teacher is watching.</span>
      </div>
      <div v-if="introPhase >= 3" class="phase-title">STANDUP ROULETTE</div>
    </div>

    <!-- ====== EFFECTS LAYERS ====== -->
    <div v-if="feedback === 'praise'" class="classroom-gold-burst active"></div>
    <div v-if="feedback === 'punish'" class="classroom-chalk-burst active"></div>
    <div v-if="appState === 'finished'" class="classroom-sakura active"></div>

    <!-- ====== EXIT BUTTON ====== -->
    <button v-show="!showIntro" @click="stopMeeting" class="absolute top-6 left-6 z-50 px-4 py-2 bg-[#2C4A1E]/90 hover:bg-[#C41E3A]/20 text-[#2C4A1E] hover:text-[#C41E3A] border-2 border-[#2C4A1E] hover:border-[#C41E3A] font-bold rounded transition-colors" style="font-family: 'Noto Sans JP', sans-serif;">
      <XIcon class="w-4 h-4 inline mr-2" />退出
    </button>

    <!-- ====== MAIN PANEL ====== -->
    <div v-show="!showIntro" class="relative w-full max-w-5xl h-[85vh] bg-[#FFF8E7]/95 rounded-lg border-4 border-[#8B6914] flex flex-col items-center justify-between p-10 overflow-hidden shadow-[inset_0_0_30px_rgba(139,105,20,0.15)]">

      <!-- Wooden frame top bar -->
      <div class="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#8B6914] via-[#C4A35A] to-[#8B6914]"></div>

      <!-- ====== FINISHED STATE ====== -->
      <div v-if="appState === 'finished'" class="z-10 text-center animate-fade-in text-[#2C4A1E] p-12 bg-[#FFF8E7]/90 border-4 border-[#8B6914] rounded-xl max-w-2xl w-full shadow-lg">
        <h2 class="text-7xl font-bold mb-6 kanji-warm" style="font-family: 'Shippori Mincho', serif;">終業</h2>
        <p class="text-3xl text-[#8B6914] mb-8">お疲れ様でした！ <span class="text-[#2C4A1E]/60 text-xl">Class Dismissed!</span></p>

        <div class="bg-[#2C4A1E]/10 border-2 border-[#8B6914]/30 p-6 rounded-lg mb-8">
          <p class="text-sm text-[#2C4A1E]/60 uppercase tracking-widest mb-2">Survivors:</p>
          <div class="flex justify-center flex-wrap gap-3">
            <div v-for="p in survivors" :key="p.id" class="w-12 h-12 rounded-full border-2 border-[#8B6914] overflow-hidden" :title="p.name">
              <img :src="p.avatar" class="w-full h-full bg-[#FFF8E7]" />
            </div>
            <div v-if="survivors.length === 0" class="text-[#C41E3A] font-bold uppercase tracking-widest py-2">No survivors!</div>
          </div>
        </div>

        <button @click="stopMeeting" class="px-8 py-3 bg-[#2C4A1E] hover:bg-[#2C4A1E]/80 text-[#FFF8E7] font-bold rounded-lg text-xl transition-colors" style="font-family: 'Noto Sans JP', sans-serif;">
          ホームに戻る
        </button>
      </div>

      <!-- ====== ACTIVE GAME ====== -->
      <div v-else class="w-full flex-grow flex flex-col justify-between h-full items-center relative">

        <!-- Feedback overlay -->
        <div v-if="feedback" class="absolute inset-0 z-50 flex items-center justify-center animate-bounce-in pointer-events-none">
          <div v-if="feedback === 'praise'" class="text-[8rem] font-bold rotate-[-15deg] px-8 py-4 border-8 rounded-2xl bg-[#FFF8E7]/80 backdrop-blur-sm text-[#8B6914] border-[#8B6914]" style="font-family: 'Shippori Mincho', serif;">
            すごい!
          </div>
          <div v-else class="classroom-stamp active">罰</div>
        </div>

        <!-- Speaker label + Timer row -->
        <div class="w-full flex justify-between items-start">
          <div class="text-left text-[#2C4A1E] tracking-widest border-b-2 border-[#8B6914]/40 pb-2" style="font-family: 'Shippori Mincho', serif; font-size: 1.5rem;">
            発表者 <span class="text-[#2C4A1E]/50 text-sm">(SPEAKER)</span>
          </div>
          <div class="text-right font-mono text-5xl"
               :class="timeRemaining <= 10 ? 'text-[#C41E3A] timer-pulse' : (timeRemaining <= 30 ? 'text-[#8B6914]' : 'text-[#2C4A1E]')"
               style="font-family: 'Noto Sans JP', monospace;">
            {{ activeParticipant ? formatTime(timeRemaining) : '--:--' }}
          </div>
        </div>

        <!-- Active participant area -->
        <div v-if="activeParticipant" class="flex flex-col items-center flex-grow justify-center mt-4">
          <div class="relative mb-6">
            <div class="w-28 h-28 rounded-full border-4 border-[#8B6914] p-1 shadow-[0_4px_15px_rgba(139,105,20,0.3)] overflow-hidden bg-[#FFF8E7]">
              <SenseiAvatar :expression="senseiExpression" />
            </div>
            <!-- Timer warning badge -->
            <div v-if="timeRemaining > 0 && timeRemaining <= 10" class="absolute -top-3 -right-3 bg-[#C41E3A] text-[#FFF8E7] w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg animate-pulse">
              !!
            </div>
          </div>
          <h2 class="text-5xl font-bold text-[#2C4A1E]" style="font-family: 'Noto Sans JP', sans-serif;">
            {{ activeParticipant.name }}<span class="text-3xl text-[#8B6914] ml-2">さん</span>
          </h2>
        </div>

        <!-- No participant -->
        <div v-else class="flex flex-col items-center flex-grow justify-center mt-4">
          <div class="w-28 h-28 rounded-full border-4 border-[#8B6914]/30 flex items-center justify-center mb-6 bg-[#FFF8E7]">
            <SenseiAvatar expression="normal" />
          </div>
          <h2 class="text-4xl font-bold text-[#2C4A1E]/40" style="font-family: 'Noto Sans JP', sans-serif;">待機中...</h2>
        </div>

        <!-- Turn controls (active) -->
        <div v-if="turnState === 'active' && activeParticipant" class="flex gap-6 mt-10 mb-4 w-full justify-center">
          <button @click="handleDone" class="px-10 py-4 bg-[#2C4A1E] hover:bg-[#2C4A1E]/80 text-[#FFF8E7] font-bold rounded-2xl text-2xl transition-all shadow-md" style="font-family: 'Noto Sans JP', sans-serif;">
            完了 (Done)
          </button>
        </div>

        <!-- Selection controls -->
        <div v-else class="flex flex-col gap-6 mt-10 mb-4 bg-[#FFF8E7] p-6 rounded-xl border-2 border-[#8B6914]/30 w-full max-w-3xl shadow-sm">
          <!-- Ready to start -->
          <div v-if="activeParticipant && turnState === 'ready_to_start_turn'" class="flex flex-col items-center gap-6">
            <div class="p-4 border-2 border-[#8B6914] bg-[#8B6914]/10 rounded-lg text-center w-full">
              <div class="text-5xl font-bold text-[#8B6914] font-mono leading-none animate-pulse">READY!</div>
            </div>
            <button @click="startTurn()" class="w-full py-4 bg-[#8B6914] hover:bg-[#8B6914]/80 text-[#FFF8E7] font-bold rounded-2xl text-2xl transition-all shadow-md" style="font-family: 'Noto Sans JP', sans-serif;">
              始めて！ {{ activeParticipant.name }}!
            </button>
          </div>

          <!-- Default selection -->
          <div v-else class="flex flex-col gap-6">
            <div class="flex justify-center items-center gap-6">
              <button @click="selectNextPerson()" :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                class="px-6 py-3 bg-[#2C4A1E]/10 hover:bg-[#2C4A1E]/20 text-[#2C4A1E] font-bold rounded text-lg whitespace-nowrap border-2 border-[#2C4A1E]/30 transition-colors">
                {{ activeParticipant ? 'Next (Random)' : 'Start (Random)' }}
              </button>
              <div class="flex gap-3 items-center pl-4 border-l-2 border-[#8B6914]/30 overflow-x-auto custom-scrollbar">
                <span class="text-[#2C4A1E]/40 text-sm whitespace-nowrap">Or pick:</span>
                <div v-for="p in availableParticipants" :key="p.id" class="group relative flex-none">
                  <button @click="selectNextPerson(p.id)" :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                    class="w-10 h-10 rounded-full border-2 border-[#8B6914]/40 overflow-hidden hover:scale-110 transition-transform"
                    :class="{'border-[#8B6914] ring-2 ring-[#8B6914]/30': p.id === activeParticipantId}" :title="p.name">
                    <img :src="p.avatar" class="w-full h-full bg-[#FFF8E7]" />
                  </button>
                  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#2C4A1E] text-[#FFF8E7] text-xs px-2 py-1 rounded border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">{{ p.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add latecomer -->
          <div class="flex gap-2 mt-2 max-w-md mx-auto w-full">
            <input v-model="newPersonName" @keyup.enter="addLatecomer" placeholder="遅刻した生徒..." class="flex-grow bg-[#FFF8E7] border-2 border-[#8B6914]/30 rounded px-4 py-2 text-[#2C4A1E] focus:border-[#8B6914] focus:outline-none placeholder-[#2C4A1E]/30" style="font-family: 'Noto Sans JP', sans-serif;" />
            <button @click="addLatecomer" class="px-4 py-2 bg-[#8B6914] hover:bg-[#8B6914]/80 text-[#FFF8E7] border border-[#8B6914] rounded font-bold transition-colors" style="font-family: 'Noto Sans JP', sans-serif;">追加</button>
          </div>
        </div>
      </div>

      <!-- Desk queue at bottom -->
      <div v-show="!showIntro && turnState !== 'ready_to_start_turn'" class="absolute -bottom-24 w-full px-12 flex justify-center gap-4">
        <div v-for="p in availableParticipants" :key="p.id" class="flex flex-col items-center group mt-4">
          <div class="w-16 h-16 bg-[#FFF8E7] border-4 border-[#8B6914]/50 rounded shadow-lg overflow-hidden group-hover:-translate-y-2 transition-transform cursor-help" :title="p.name">
            <img :src="p.avatar" class="w-full h-full" />
          </div>
          <div class="w-20 h-6 bg-[#8B6914]/30 border-t-2 border-[#8B6914]/50 shadow-md mt-1 rounded-sm flex items-center justify-center text-[10px] text-[#2C4A1E]/60 font-mono overflow-hidden whitespace-nowrap px-1">
            {{ p.name }}
          </div>
        </div>
      </div>

    </div>

    <!-- BGM toggle -->
    <button v-show="!showIntro" @click="toggleBgm" class="absolute bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-[#2C4A1E]/80 hover:bg-[#2C4A1E] text-[#FFF8E7] flex items-center justify-center text-lg transition-colors shadow-lg" :title="bgmPlaying ? 'BGM OFF' : 'BGM ON'">
      {{ bgmPlaying ? '🎵' : '🔇' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import useStandup from '../composables/useStandup'
import { X as XIcon } from 'lucide-vue-next'
import SenseiAvatar from '../components/SenseiAvatar.vue'
import { playClassroomIntro, playClassroomPraise, playClassroomPunish, playClassroomSelect, playClassroomTimer30, playClassroomTimer10 } from '../utils/audio'
// BGM imported via Vite asset pipeline
import bgmFile from '../assets/sensei/classroom_bgm.mp3'

const {
  appState, activeParticipant, availableParticipants, turnState,
  timeRemaining, endTurn, selectNextPerson, startTurn,
  stopMeeting, addParticipant, activeParticipantId, survivors
} = useStandup()

// Intro state
const showIntro = ref(true)
const introPhase = ref(0)

// Game state
const feedback = ref(null)
const newPersonName = ref('')

// BGM
const bgmAudio = ref(null)
const bgmPlaying = ref(false)

// Sensei expression — timer urgency overrides mood (intentional)
const senseiExpression = computed(() => {
  if (timeRemaining.value <= 10 && timeRemaining.value > 0) return 'angry'
  if (feedback.value === 'praise') return 'satisfied'
  if (feedback.value === 'punish') return 'angry'
  return 'normal'
})

// Intro sequence
onMounted(() => {
  playClassroomIntro()
  introPhase.value = 1
  setTimeout(() => (introPhase.value = 2), 2000)
  setTimeout(() => (introPhase.value = 3), 4000)
  setTimeout(() => (showIntro.value = false), 5000)

  // Start BGM after intro finishes (user has interacted by then)
  bgmAudio.value = new Audio(bgmFile)
  bgmAudio.value.loop = true
  bgmAudio.value.volume = 0.3
  setTimeout(() => {
    bgmAudio.value?.play().then(() => {
      bgmPlaying.value = true
    }).catch(() => {
      // Autoplay blocked — user must click 🔇 toggle
    })
  }, 5200)
})

onUnmounted(() => {
  if (bgmAudio.value) {
    bgmAudio.value.pause()
    bgmAudio.value = null
  }
})

function toggleBgm() {
  if (!bgmAudio.value) return
  if (bgmPlaying.value) {
    bgmAudio.value.pause()
    bgmPlaying.value = false
  } else {
    bgmAudio.value.play()
    bgmPlaying.value = true
  }
}

function formatTime(seconds) {
  if (seconds < 0) return '∞'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function addLatecomer() {
  if (newPersonName.value.trim()) {
    addParticipant(newPersonName.value)
    newPersonName.value = ''
  }
}

function handleDone() {
  if (timeRemaining.value > 0 || timeRemaining.value === -1) {
    playClassroomPraise()
    showFeedback('praise')
  } else {
    endTurn('done')
  }
}

// Watch timer for auto-elimination + audio cues
watch(timeRemaining, (newVal, oldVal) => {
  if (newVal === 0 && oldVal > 0) {
    playClassroomPunish()
    showFeedback('punish')
    endTurn('eliminated')
  } else if (newVal === 30 && oldVal > 30) {
    playClassroomTimer30()
  } else if (newVal === 10 && oldVal > 10) {
    playClassroomTimer10()
  }
})

function showFeedback(type) {
  if (feedback.value) return
  feedback.value = type
  setTimeout(() => {
    feedback.value = null
    endTurn(type === 'praise' ? 'done' : 'eliminated')
  }, 1500)
}
</script>

<style scoped>
@import './classroom-assets.css';

/* ====== INTRO ====== */
.classroom-intro {
  position: fixed; inset: 0; z-index: 10001;
  background: #FFF8E7;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.phase-kanji {
  font-family: 'Shippori Mincho', 'Noto Serif JP', serif;
  font-size: 6rem; color: #2C4A1E;
  animation: fadeIn 0.8s ease-out;
}
.phase-subtitle {
  font-family: 'Noto Sans JP', sans-serif;
  color: #2C4A1E; font-size: 1.2rem; margin-top: 1.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  animation: fadeIn 0.6s ease-out;
}
.phase-subtitle .en { font-size: 0.95rem; opacity: 0.7; }
.phase-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 3rem; font-weight: 900; color: #C41E3A;
  margin-top: 2rem; letter-spacing: 0.15em;
  animation: slam 0.3s ease-out;
}

/* ====== ANIMATIONS ====== */
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slam { from { transform: scale(2.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes timer-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes fade-in-anim { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
.timer-pulse { animation: timer-pulse 0.5s ease-in-out infinite; }
.animate-fade-in { animation: fade-in-anim 0.6s ease-out forwards; }

/* ====== SCROLLBAR ====== */
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #FFF8E7; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #8B6914; border-radius: 2px; }

/* ====== REDUCED MOTION ====== */
@media (prefers-reduced-motion: reduce) {
  .timer-pulse { animation: none; }
  .animate-bounce-in { animation: none; opacity: 1; }
  .animate-fade-in { animation: none; opacity: 1; }
  .phase-kanji, .phase-subtitle, .phase-title { animation: none; }
}
</style>