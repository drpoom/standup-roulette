<template>
  <div class="dojo-rice-paper h-screen w-full p-4 flex flex-col justify-center items-center relative">

    <!-- ====== INTRO CUTSCENE ====== -->
    <div v-if="showIntro" class="dojo-intro">
      <div v-if="introPhase >= 1" class="phase-kanji">道場</div>
      <div v-if="introPhase >= 2" class="phase-subtitle">
        <span>コードの達人が見ている。</span>
        <span class="en">The Code Master is watching.</span>
      </div>
      <div v-if="introPhase >= 3" class="phase-title">STANDUP ROULETTE</div>
    </div>

    <!-- ====== EFFECTS LAYERS ====== -->
    <div v-if="feedback === 'praise'" class="dojo-gold-burst active"></div>
    <div v-if="feedback === 'punish'" class="dojo-crack-overlay active"></div>
    <div v-if="appState === 'finished'" class="dojo-sakura active"></div>

    <!-- ====== EXIT BUTTON ====== -->
    <button v-show="!showIntro" @click="stopMeeting" class="absolute top-6 left-6 z-50 px-4 py-2 bg-[#0D0D0F] hover:bg-[#C41E3A]/20 text-[#C41E3A] border border-[#C41E3A] font-bold transition-colors">
      <XIcon class="w-4 h-4 inline mr-2" /> EXIT
    </button>

    <!-- ====== MAIN PANEL ====== -->
    <div v-show="!showIntro" class="relative w-full max-w-5xl h-[85vh] bg-[#0D0D0F]/90 rounded border border-[#1E3A5F]/40 flex flex-col items-center justify-between p-10 overflow-hidden">
      <!-- Ranma decorative top bar -->
      <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E3A5F] via-[#D4AF37] to-[#1E3A5F]"></div>

      <!-- ====== FINISHED STATE ====== -->
      <div v-if="appState === 'finished'" class="z-10 text-center animate-fade-in text-[#F5F1E8]/90 p-12 bg-[#0D0D0F]/80 border border-[#1E3A5F]/40 rounded-xl max-w-2xl w-full">
        <h2 class="text-7xl font-bold mb-6 dojo-kanji-glow" style="font-family: 'Shippori Mincho', serif;">終業</h2>
        <p class="text-3xl text-[#D4AF37] mb-8">道場、終了。 <span class="text-[#F5F1E8]/60 text-xl">Dōjō Complete.</span></p>

        <div class="bg-[#1E3A5F]/20 border border-[#1E3A5F]/30 p-6 rounded-lg mb-8">
          <p class="text-sm text-[#F5F1E8]/60 uppercase tracking-widest mb-2">Survivors:</p>
          <div class="flex justify-center flex-wrap gap-3">
            <div v-for="p in survivors" :key="p.id" class="w-12 h-12 rounded-full border-2 border-[#D4AF37] overflow-hidden" :title="p.name">
              <img :src="p.avatar" class="w-full h-full bg-[#0D0D0F]" />
            </div>
            <div v-if="survivors.length === 0" class="text-[#C41E3A] font-bold uppercase tracking-widest py-2">No survivors!</div>
          </div>
        </div>

        <button @click="stopMeeting" class="px-8 py-3 bg-transparent border-2 border-[#F5F1E8]/30 hover:border-[#D4AF37] text-[#F5F1E8] font-bold rounded-lg text-xl transition-colors">
          Return to Dashboard
        </button>
      </div>

      <!-- ====== ACTIVE GAME ====== -->
      <div v-else class="w-full flex-grow flex flex-col justify-between h-full items-center relative">

        <!-- Feedback overlay -->
        <div v-if="feedback" class="absolute inset-0 z-50 flex items-center justify-center animate-bounce-in pointer-events-none">
          <div v-if="feedback === 'praise'" class="text-[8rem] font-bold rotate-[-15deg] px-8 py-4 border-8 rounded-2xl bg-[#0D0D0F]/60 backdrop-blur-sm text-[#D4AF37] border-[#D4AF37]">
            すごい!
          </div>
          <div v-else class="dojo-stamp active">罰</div>
        </div>

        <!-- Speaker label + Timer row -->
        <div class="w-full flex justify-between items-start">
          <div class="text-left text-[#F5F1E8] tracking-widest border-b-2 border-[#1E3A5F]/50 pb-2" style="font-family: 'Shippori Mincho', serif; font-size: 1.5rem;">
            発表者 <span class="text-[#F5F1E8]/50 text-sm">(SPEAKER)</span>
          </div>
          <div class="text-right font-mono text-5xl opacity-90"
               :class="timeRemaining <= 10 ? 'text-[#C41E3A] dojo-timer-pulse' : (timeRemaining <= 30 ? 'text-[#1E3A5F]' : 'text-[#D4AF37]')"
               style="font-family: 'Noto Sans JP', monospace; text-shadow: 0 0 10px currentColor;">
            {{ activeParticipant ? formatTime(timeRemaining) : '--:--' }}
          </div>
        </div>

        <!-- Active participant area -->
        <div v-if="activeParticipant" class="flex flex-col items-center flex-grow justify-center mt-4">
          <div class="relative mb-6">
            <div class="w-24 h-24 rounded-full border-4 border-[#D4AF37] p-1 shadow-[0_0_20px_rgba(212,175,55,0.3)] overflow-hidden bg-[#0D0D0F]">
              <SenseiAvatar :expression="senseiExpression" />
            </div>
            <!-- Timer warning badge -->
            <div v-if="timeRemaining > 0 && timeRemaining <= 10" class="absolute -top-4 -right-4 bg-[#C41E3A] text-[#F5F1E8] w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg animate-pulse">
              !!
            </div>
          </div>
          <h2 class="text-5xl font-bold text-[#F5F1E8]" style="font-family: 'Noto Sans JP', sans-serif;">
            {{ activeParticipant.name }}<span class="text-3xl text-[#D4AF37] ml-2">さん</span>
          </h2>
        </div>

        <!-- No participant -->
        <div v-else class="flex flex-col items-center flex-grow justify-center mt-4">
          <div class="w-24 h-24 rounded-full border-4 border-[#1E3A5F]/50 flex items-center justify-center mb-6 bg-[#0D0D0F]">
            <SenseiAvatar expression="default" />
          </div>
          <h2 class="text-4xl font-bold text-[#F5F1E8]/40" style="font-family: 'Noto Sans JP', sans-serif;">Awaiting Student</h2>
        </div>

        <!-- Turn controls (active) -->
        <div v-if="turnState === 'active' && activeParticipant" class="flex gap-6 mt-10 mb-4 w-full justify-center">
          <button @click="handleDone" class="px-10 py-4 bg-transparent border-4 border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] text-[#D4AF37] font-bold rounded-2xl text-2xl transition-all" style="font-family: 'Shippori Mincho', serif;">
            完了 (Done)
          </button>
        </div>

        <!-- Selection controls -->
        <div v-else class="flex flex-col gap-6 mt-10 mb-4 bg-[#0D0D0F]/80 p-6 rounded-xl border border-[#1E3A5F]/30 w-full max-w-3xl">
          <!-- Ready to start -->
          <div v-if="activeParticipant && turnState === 'ready_to_start_turn'" class="flex flex-col items-center gap-6">
            <div class="p-4 border-2 border-[#D4AF37] bg-[#D4AF37]/10 rounded-lg text-center w-full">
              <div class="text-5xl font-bold text-[#D4AF37] font-mono leading-none animate-pulse">READY!</div>
            </div>
            <button @click="startTurn()" class="w-full py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-[#0D0D0F] font-bold rounded-2xl text-2xl transition-all" style="font-family: 'Shippori Mincho', serif;">
              始めて (START) {{ activeParticipant.name }}!
            </button>
          </div>

          <!-- Default selection -->
          <div v-else class="flex flex-col gap-6">
            <div class="flex justify-center items-center gap-6">
              <button @click="selectNextPerson()" :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                class="px-6 py-3 bg-[#1E3A5F]/30 hover:bg-[#1E3A5F]/50 text-[#F5F1E8] font-bold rounded text-lg whitespace-nowrap border border-[#1E3A5F]/50">
                {{ activeParticipant ? 'Next (Random)' : 'Start (Random)' }}
              </button>
              <div class="flex gap-3 items-center pl-4 border-l border-[#1E3A5F]/30 overflow-x-auto custom-scrollbar">
                <span class="text-[#F5F1E8]/40 text-sm whitespace-nowrap">Or pick:</span>
                <div v-for="p in availableParticipants" :key="p.id" class="group relative flex-none">
                  <button @click="selectNextPerson(p.id)" :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                    class="w-10 h-10 rounded-full border border-[#1E3A5F]/60 overflow-hidden hover:scale-110 transition-transform"
                    :class="{'border-[#D4AF37]': p.id === activeParticipantId}" :title="p.name">
                    <img :src="p.avatar" class="w-full h-full bg-[#0D0D0F]" />
                  </button>
                  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#0D0D0F] text-[#F5F1E8] text-xs px-2 py-1 rounded border border-[#1E3A5F]/40 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">{{ p.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add latecomer -->
          <div class="flex gap-2 mt-2 max-w-md mx-auto w-full">
            <input v-model="newPersonName" @keyup.enter="addLatecomer" placeholder="Late student name..." class="flex-grow bg-[#0D0D0F] border border-[#1E3A5F]/40 rounded px-4 py-2 text-[#F5F1E8] focus:border-[#D4AF37] focus:outline-none placeholder-[#F5F1E8]/20" />
            <button @click="addLatecomer" class="px-4 py-2 bg-[#1E3A5F]/20 hover:bg-[#1E3A5F]/40 text-[#D4AF37] border border-[#1E3A5F]/40 rounded font-bold transition-colors">Add</button>
          </div>
        </div>
      </div>

      <!-- Desk queue at bottom -->
      <div v-show="!showIntro && turnState !== 'ready_to_start_turn'" class="absolute -bottom-24 w-full px-12 flex justify-center gap-4">
        <div v-for="p in availableParticipants" :key="p.id" class="flex flex-col items-center group mt-4">
          <div class="w-16 h-16 bg-[#0D0D0F] border-4 border-[#1E3A5F]/60 rounded shadow-lg overflow-hidden group-hover:-translate-y-2 transition-transform cursor-help" :title="p.name">
            <img :src="p.avatar" class="w-full h-full" />
          </div>
          <div class="w-20 h-6 bg-[#1E3A5F]/40 border-t-2 border-[#1E3A5F]/60 shadow-md mt-1 rounded-sm flex items-center justify-center text-[10px] text-[#F5F1E8]/40 font-mono overflow-hidden whitespace-nowrap px-1">
            {{ p.name }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import useStandup from '../composables/useStandup'
import { X as XIcon } from 'lucide-vue-next'
import SenseiAvatar from '../components/SenseiAvatar.vue'
import { playDojoIntro, playDojoPraise, playDojoPunish, playDojoSelect, playDojoTimer30, playDojoTimer10 } from '../utils/audio'

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

// Sensei expression — timer urgency overrides mood (intentional)
const senseiExpression = computed(() => {
  if (timeRemaining.value <= 10 && timeRemaining.value > 0) return 'stern'
  if (feedback.value === 'praise') return 'pleased'
  if (feedback.value === 'punish') return 'stern'
  return 'default'
})

// Intro sequence
onMounted(() => {
  playDojoIntro()
  introPhase.value = 1
  setTimeout(() => (introPhase.value = 2), 2000)
  setTimeout(() => (introPhase.value = 3), 4000)
  setTimeout(() => (showIntro.value = false), 5000)
})

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
    playDojoPraise()
    showFeedback('praise')
  } else {
    endTurn('done')
  }
}

// Watch timer for auto-elimination + audio cues
watch(timeRemaining, (newVal, oldVal) => {
  if (newVal === 0 && oldVal > 0) {
    playDojoPunish()
    showFeedback('punish')
    endTurn('eliminated')
  } else if (newVal === 30 && oldVal > 30) {
    playDojoTimer30()
  } else if (newVal === 10 && oldVal > 10) {
    playDojoTimer10()
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
@import './dojo-assets.css';

/* ====== INTRO ====== */
.dojo-intro {
  position: fixed; inset: 0; z-index: 10001;
  background: #0D0D0F;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.phase-kanji {
  font-family: 'Shippori Mincho', 'Noto Serif JP', serif;
  font-size: 6rem; color: #D4AF37;
  animation: fadeIn 0.8s ease-out;
}
.phase-subtitle {
  font-family: 'Noto Sans JP', sans-serif;
  color: #F5F1E8; font-size: 1.2rem; margin-top: 1.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  animation: fadeIn 0.6s ease-out;
}
.phase-subtitle .en { font-size: 0.95rem; opacity: 0.85; }
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
.dojo-timer-pulse { animation: timer-pulse 0.5s ease-in-out infinite; }
.animate-fade-in { animation: fade-in-anim 0.6s ease-out forwards; }

/* ====== SCROLLBAR ====== */
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #0D0D0F; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 2px; }

/* ====== REDUCED MOTION ====== */
@media (prefers-reduced-motion: reduce) {
  .dojo-timer-pulse { animation: none; }
  .animate-bounce-in { animation: none; opacity: 1; }
  .animate-fade-in { animation: none; opacity: 1; }
  .phase-kanji, .phase-subtitle, .phase-title { animation: none; }
}
</style>