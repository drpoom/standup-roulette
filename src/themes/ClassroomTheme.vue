<template>
  <div class="h-screen w-full p-4 flex flex-col justify-center items-center bg-yellow-900/40 relative" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px);">
    
    <!-- EXIT BUTTON for all themes -->
    <button v-show="!showIntro" @click="stopMeeting" class="absolute top-6 left-6 z-50 px-4 py-2 bg-black/50 hover:bg-[#8B5A2B] text-[#8B5A2B] hover:text-white border border-[#8B5A2B] font-bold transition-colors">
      <XIcon class="w-4 h-4 inline mr-2" /> EXIT
    </button>

    <!-- Retro Kunio-Style Intro Cutscene -->
    <div v-if="showIntro" class="absolute inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center font-mono p-8 text-center" style="font-family: 'Silkscreen', cursive;">
      <div class="w-24 h-24 bg-white/20 rounded-full mb-8 animate-pulse flex items-center justify-center text-4xl">👨‍🏫</div>
      <div class="text-3xl text-yellow-400 mb-4">{{ introTextJp }}</div>
      <div class="text-xl text-slate-400 opacity-80 mt-2">{{ introTextEn }}</div>
    </div>

    <!-- Chalkboard Frame -->
    <div v-show="!showIntro" class="relative w-full max-w-5xl h-[85vh] bg-[#2E5A35] rounded-lg shadow-2xl border-[16px] border-[#5E4226] flex flex-col items-center justify-between p-12">
      <!-- Top Chalk Ledge effect -->
      <div class="absolute bottom-[-16px] left-0 right-0 h-4 bg-[#4A3219] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
        <!-- Chalk pieces -->
        <div class="absolute bottom-2 right-12 w-6 h-2 bg-white/80 rounded shadow-sm"></div>
        <div class="absolute bottom-2 right-24 w-8 h-2 bg-pink-200/80 rounded shadow-sm rotate-3"></div>
        <!-- Eraser -->
        <div class="absolute bottom-1 right-36 w-16 h-4 bg-yellow-100/90 rounded-sm shadow-sm border-t-2 border-slate-600 flex overflow-hidden">
          <div class="w-full h-1 bg-black/20"></div>
        </div>
      </div>

      <!-- Content Area -->
      <div v-if="appState === 'finished'" class="z-10 text-center animate-fade-in text-white/90 p-12 bg-black/40 border border-white/20 rounded-xl backdrop-blur max-w-2xl w-full">
        <h2 class="text-7xl font-bold mb-6 font-serif opacity-90" style="text-shadow: 2px 2px 0 rgba(0,0,0,0.2);">終業</h2>
        <p class="text-4xl opacity-80 mb-8" style="font-family: 'Kalam', cursive;">Class Dismissed!</p>

        <div class="bg-white/10 border border-white/20 p-6 rounded-lg mb-8">
          <p class="text-xl text-white/70 mb-2 uppercase tracking-widest text-sm">Students who passed:</p>
          <div class="flex justify-center flex-wrap gap-2 mb-4">
            <div v-for="p in survivors" :key="p.id" class="w-12 h-12 rounded-full border-2 border-green-400 overflow-hidden" :title="p.name">
              <img :src="p.avatar" class="w-full h-full bg-slate-800" />
            </div>
            <div v-if="survivors.length === 0" class="text-red-400 font-bold uppercase tracking-widest py-2">No one passed!</div>
          </div>
        </div>

        <button @click="stopMeeting" class="px-8 py-3 bg-transparent border-2 border-white/40 hover:bg-white/10 text-white font-bold rounded-lg text-xl transition-colors">
          Return to Dashboard
        </button>
      </div>

      <div v-else class="w-full flex-grow flex flex-col justify-between h-full items-center relative">
        <div v-if="feedback" class="absolute inset-0 z-50 flex items-center justify-center animate-bounce-in pointer-events-none">
          <div class="text-[8rem] font-bold rotate-[-15deg] px-8 py-4 border-8 rounded-2xl bg-white/10 backdrop-blur-sm"
               :class="feedback === 'praise' ? 'text-pink-300 border-pink-300' : 'text-red-500 border-red-500'">
            {{ feedback === 'praise' ? 'すごい! (GREAT!)' : '罰! (PUNISHMENT!)' }}
          </div>
        </div>

        <div class="w-full flex justify-between items-start">
          <div class="text-left text-white/70 font-serif text-2xl tracking-widest border-b-2 border-white/20 pb-2">
            発表者 (SPEAKER)
          </div>
          <div class="text-right text-white/90 font-mono text-5xl opacity-80" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
            {{ activeParticipant ? formatTime(timeRemaining) : '--:--' }}
          </div>
        </div>
        
        <div v-if="activeParticipant" class="flex flex-col items-center flex-grow justify-center mt-8">
          <div class="relative group">
            <div class="w-48 h-48 rounded-full bg-white/5 border-8 border-white/20 p-2 shadow-xl overflow-hidden mb-6 transition-transform hover:scale-105" :title="activeParticipant.name">
              <img :src="activeParticipant.avatar" class="w-full h-full object-cover rounded-full" />
            </div>
            <!-- Hand raise icon or something cute -->
            <div class="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg animate-pulse" v-if="timeRemaining > 0 && timeRemaining <= 10">
              !!
            </div>
          </div>

          <h2 class="text-6xl font-bold text-white/90 font-serif" style="text-shadow: 2px 2px 0 rgba(0,0,0,0.2);">
            {{ activeParticipant.name }}<span class="text-4xl text-white/60 ml-2">-san</span>
          </h2>
        </div>
        
        <div v-else class="flex flex-col items-center flex-grow justify-center mt-8">
          <div class="w-48 h-48 rounded-full bg-white/5 border-8 border-white/20 p-2 shadow-xl flex items-center justify-center mb-6">
            <span class="text-6xl text-white/50">?</span>
          </div>
          <h2 class="text-5xl font-bold text-white/50 font-serif">Awaiting Student</h2>
        </div>

        <!-- Controls -->
        <div v-if="turnState === 'active' && activeParticipant" class="flex gap-6 mt-12 mb-4 w-full justify-center">
          <button @click="handleDone" class="px-10 py-4 bg-transparent border-4 border-white/40 hover:bg-white/10 hover:border-white/60 text-white font-bold rounded-2xl text-2xl transition-all font-serif">
            完了 (Done)
          </button>
        </div>

        <!-- Ended Controls -->
        <div v-else class="flex flex-col gap-6 mt-12 mb-4 bg-black/40 p-6 rounded-xl border border-white/20 backdrop-blur w-full max-w-3xl">
          <!-- When a participant is ready to start their turn -->
          <div v-if="activeParticipant && turnState === 'ready_to_start_turn'" class="relative z-20 flex flex-col items-center gap-6">
            <div class="p-4 mb-4 border-2 border-yellow-400 bg-yellow-900/20 rounded-lg text-center w-full">
              <div class="text-5xl font-bold text-yellow-400 font-mono leading-none animate-pulse">
                READY!
              </div>
            </div>
            <button
              @click="startTurn()"
              class="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-2xl text-2xl transition-all font-serif"
            >
              始めて (START) {{ activeParticipant.name.toUpperCase() }}!
            </button>
          </div>

          <!-- Default selection controls (Next Random / Or Pick) -->
          <div v-else class="flex flex-col gap-6">
            <div class="flex justify-center items-center gap-6">
              <button
                @click="selectNextPerson()"
                :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded text-lg whitespace-nowrap"
              >
                {{ activeParticipant && turnState === 'ready_to_start_turn' ? 'Selected' : (activeParticipant ? 'Next (Random)' : 'Start (Random)') }}
              </button>
              <div class="flex gap-3 items-center pl-4 border-l border-white/20 overflow-x-auto custom-scrollbar">
                <span class="text-white/50 text-sm whitespace-nowrap">Or pick:</span>
                <div v-for="p in availableParticipants" :key="p.id" class="group relative flex-none">
                  <button
                    @click="selectNextPerson(p.id)"
                    :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                    class="w-10 h-10 rounded-full border border-white/40 overflow-hidden hover:scale-110 transition-transform"
                    :class="{'border-white': p.id === activeParticipantId}"
                    :title="p.name"
                  >
                    <img :src="p.avatar" class="w-full h-full bg-slate-800" />
                  </button>
                  <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded border border-white/40 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">{{ p.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Latecomer - always visible in this block -->
          <div class="flex gap-2 mt-2 max-w-md mx-auto w-full">
            <input v-model="newPersonName" @keyup.enter="addLatecomer" placeholder="Late student name..." class="flex-grow bg-black/50 border border-white/30 rounded px-4 py-2 text-white focus:border-white focus:outline-none placeholder-white/30" />
            <button @click="addLatecomer" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded font-bold transition-colors">Add</button>
          </div>
        </div>

      </div>

      <!-- Desk Queue at bottom -->
      <div v-show="!showIntro && turnState !== 'ready_to_start_turn'" class="absolute -bottom-24 w-full px-12 flex justify-center gap-4">
        <div v-for="p in availableParticipants" :key="p.id" class="flex flex-col items-center group mt-4">
          <div class="w-16 h-16 bg-white border-4 border-[#5E4226] rounded shadow-lg overflow-hidden group-hover:-translate-y-2 transition-transform cursor-help" :title="p.name">
            <img :src="p.avatar" class="w-full h-full" />
          </div>
          <!-- Desk -->
          <div class="w-20 h-6 bg-[#8B5A2B] border-t-2 border-[#A0522D] shadow-md mt-1 rounded-sm flex items-center justify-center text-[10px] text-yellow-100/50 font-mono overflow-hidden whitespace-nowrap px-1">
            {{ p.name }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import useStandup from '../composables/useStandup';
import { playBlip, playPraise, playPunish, playStart } from '../utils/audio';
import { X as XIcon } from 'lucide-vue-next';

const { appState, activeParticipant, availableParticipants, turnState, timeRemaining, endTurn, selectNextPerson, startTurn, stopMeeting, addParticipant, activeParticipantId, survivors } = useStandup();

const showIntro = ref(true);
const introTextJp = ref('');
const introTextEn = ref('');
const feedback = ref(null); // 'praise' or 'punish'
const newPersonName = ref('');

onMounted(() => {
  // Retro Intro Sequence
  setTimeout(() => { introTextJp.value = '静かにしろ！'; introTextEn.value = 'SHUT UP AND SIT DOWN!'; playBlip(); }, 500);
  setTimeout(() => { introTextJp.value = '今日から俺がルールだ。'; introTextEn.value = 'I AM THE LAW TODAY.'; playBlip(); }, 2500);
  setTimeout(() => { introTextJp.value = 'STAND UP ROULETTE...'; introTextEn.value = 'HAJIMERU (START)!!'; playStart(); }, 4500);
  setTimeout(() => { showIntro.value = false; }, 6500); // Wait for input instead of auto-next
});

function addLatecomer() {
  if (newPersonName.value.trim()) {
    addParticipant(newPersonName.value);
    newPersonName.value = '';
  }
}

function formatTime(seconds) {
  if (seconds < 0) return '∞';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// User clicked Next before time ran out -> Praise
function handleDone() {
  if (timeRemaining.value > 0 || timeRemaining.value === -1) {
    playPraise();
    showFeedback('praise');
  } else {
    // If already timed out, just end turn
    endTurn('done');
  }
}

// Watcher for automatic punishment
watch(timeRemaining, (newVal, oldVal) => {
  if (newVal === 0 && oldVal > 0) {
    playPunish();
    showFeedback('punish');
    endTurn('eliminated'); // End the turn as eliminated when time runs out
  }
});

function showFeedback(type) {
  if (feedback.value) return; // Prevent double trigger
  feedback.value = type;
  
  // Wait 1.5 seconds, then move to next person
  setTimeout(() => {
    feedback.value = null;
    endTurn(type === 'praise' ? 'done' : 'eliminated');
  }, 1500);
}
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>