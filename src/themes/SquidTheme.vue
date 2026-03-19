<template>
  <div class="h-screen w-full p-8 flex flex-col justify-center items-center bg-black text-pink-500 overflow-hidden relative">
    
    <!-- EXIT BUTTON for all themes -->
    <button v-show="!showIntro" @click="stopMeeting" class="absolute top-6 left-6 z-50 px-4 py-2 bg-black/50 hover:bg-pink-900/50 text-pink-500 border border-pink-600 font-bold transition-colors">
      <XIcon class="w-4 h-4 inline mr-2" /> EXIT
    </button>

    <!-- Retro Octopus Game Intro -->
    <div v-if="showIntro" class="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono p-8 text-center" style="font-family: 'Silkscreen', cursive;">
      <div v-if="introStep >= 1" class="flex gap-4 mb-12 animate-fade-in text-6xl text-pink-500 font-bold">
        <div class="w-20 h-20 border-8 border-pink-500 rounded-full flex items-center justify-center"></div>
        <div class="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[69.3px] border-b-pink-500 relative"><div class="absolute w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[43.3px] border-b-black -left-[25px] top-[15px]"></div></div>
        <div class="w-20 h-20 border-8 border-pink-500"></div>
      </div>
      
      <h2 v-if="introStep >= 1" class="text-6xl font-black text-white mb-6 uppercase tracking-[0.2em] animate-fade-in">Welcome to the Octopus Game</h2>
      
      <p v-if="introStep >= 2" class="text-2xl text-pink-400 mb-6 animate-fade-in">You owe 45.6 billion won.</p>
      
      <p v-if="introStep >= 3" class="text-3xl text-white mb-6 animate-fade-in bg-pink-900/30 border border-pink-600 p-4">
        Rule 1: Give your standup update within the time limit.
      </p>
      
      <p v-if="introStep >= 4" class="text-3xl text-red-500 animate-fade-in font-bold bg-red-900/30 border border-red-600 p-4">
        Rule 2: Fail to finish, and you will be eliminated.
      </p>

      <button v-if="introStep >= 5" @click="finishIntro" class="mt-12 px-12 py-6 bg-pink-600 hover:bg-pink-500 text-black font-black text-2xl uppercase tracking-widest transition-transform animate-bounce-subtle hover:scale-105 active:scale-95">
        START GAME
      </button>
    </div>

    <!-- Background Details -->
    <div class="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
      <div class="w-full max-w-[800px] aspect-square border-[20px] border-pink-600 rounded-full animate-pulse blur-sm"></div>
    </div>

    <!-- Piggy Bank HUD -->
    <div v-show="!showIntro" class="absolute top-6 right-6 z-50 flex flex-col items-end">
      <div class="text-xs text-white/50 uppercase tracking-[0.2em] font-mono mb-1">Prize Pool</div>
      <div class="text-3xl font-bold font-mono tracking-wider flex items-center gap-2" :class="prizeMoney > 0 ? 'text-yellow-400' : 'text-slate-600'">
        <span :class="prizeMoney > 0 ? 'text-yellow-600' : 'text-slate-700'">₩</span>{{ prizeMoney.toLocaleString() }}
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="appState === 'finished'" class="z-10 text-center animate-fade-in relative p-12 bg-black/80 border border-pink-600 rounded-2xl backdrop-blur max-w-2xl w-full">
      <h2 class="text-6xl font-black text-white mb-8 uppercase tracking-[0.2em]" style="font-family: 'Silkscreen', cursive;">Game Over</h2>
      
      <div class="bg-slate-900 border border-slate-700 p-6 rounded-lg mb-8">
        <p class="text-xl text-slate-400 mb-2 uppercase tracking-widest text-sm">Total Prize Money</p>
        <p class="text-5xl text-yellow-400 font-mono font-bold mb-6">₩{{ prizeMoney.toLocaleString() }}</p>
        
        <p class="text-xl text-slate-400 mb-2 uppercase tracking-widest text-sm">Survivors</p>
        <div class="flex justify-center flex-wrap gap-2 mb-4">
          <div v-for="p in survivors" :key="p.id" class="w-12 h-12 rounded-full border-2 border-pink-500 overflow-hidden" :title="p.name">
            <img :src="p.avatar" class="w-full h-full bg-slate-800" />
          </div>
          <div v-if="survivors.length === 0" class="text-red-500 font-bold uppercase tracking-widest py-2">No Survivors</div>
        </div>
        
        <div v-if="survivors.length > 0" class="border-t border-slate-700 pt-4 mt-4">
          <p class="text-sm text-slate-400 mb-1">Each survivor receives:</p>
          <p class="text-3xl text-pink-400 font-mono font-bold">₩{{ Math.floor(prizeMoney / survivors.length).toLocaleString() }}</p>
        </div>
      </div>

      <button @click="stopMeeting" class="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-black font-black uppercase tracking-widest transition-colors w-full rounded-sm">
        Return to Dashboard
      </button>
    </div>

    <!-- Game Screen -->
    <div v-else class="z-10 w-full max-w-4xl grid md:grid-cols-[1fr_2fr] gap-12 items-center mt-12">
      
      <!-- Current Target -->
      <div class="flex flex-col items-center">
        <div class="text-xs uppercase tracking-[0.3em] text-white/50 mb-4 font-mono">Current Player</div>
        
        <div v-if="activeParticipant" class="flex flex-col items-center">
          <div class="relative w-64 h-64 mb-6 transition-transform duration-300 transform" :class="{ 'scale-90 opacity-50 grayscale': timeRemaining === 0 }">
            <!-- Frame -->
            <div class="absolute inset-0 border-4 border-pink-500 bg-slate-900 overflow-hidden" :class="{ 'bg-red-900 border-red-500': timeRemaining === 0 }" :title="activeParticipant.name">
              <img :src="activeParticipant.avatar" class="w-full h-full object-cover scale-110" />
            </div>
            
            <!-- Crosshair Overlay when time runs out -->
            <div v-if="timeRemaining === 0" class="absolute inset-0 flex items-center justify-center text-red-500 bg-red-900/40 pointer-events-none">
              <CrosshairIcon class="w-32 h-32 animate-ping" />
            </div>
          </div>

          <h2 class="text-3xl font-bold mb-2 text-white font-mono bg-pink-900/50 px-4 py-2 border border-pink-500/50 w-full text-center truncate">
            {{ activeParticipant.name }}
          </h2>
          <div class="text-pink-400 font-mono text-sm tracking-widest bg-black px-3 py-1 border border-pink-600">Player #{{ activeParticipant.id.slice(-3).padStart(3, '0') }}</div>
        </div>

        <div v-else class="flex flex-col items-center">
          <div class="relative w-64 h-64 mb-6 border-4 border-pink-500/30 bg-slate-900 flex items-center justify-center text-pink-500/50 text-6xl">
            ?
          </div>
          <h2 class="text-3xl font-bold mb-2 text-white/50 font-mono bg-pink-900/30 px-4 py-2 border border-pink-500/30 w-full text-center truncate">
            Awaiting Victim
          </h2>
        </div>
      </div>

      <!-- Controls & Timer -->
      <div class="flex flex-col items-center justify-center h-full">
        <div class="text-xs uppercase tracking-[0.3em] text-white/50 mb-2 font-mono">Time Remaining</div>
        
        <div v-if="activeParticipant">
          <div v-if="timeRemaining > -1" class="text-[8rem] font-mono leading-none mb-12 font-bold" 
            :class="[
              timeRemaining > 10 ? 'text-white' : 'text-red-500 animate-pulse',
              timeRemaining === 0 ? 'opacity-50' : ''
            ]">
            {{ timeRemaining }}
          </div>
          <div v-else class="text-4xl text-slate-500 font-mono mb-12 border border-slate-700 px-6 py-4 uppercase">
            Infinite
          </div>
        </div>
        <div v-else class="text-[8rem] font-mono leading-none mb-12 font-bold text-slate-700">00</div>

        <div v-if="turnState === 'active' && activeParticipant" class="flex gap-4 w-full">
          <button @click="endTurn('done')" class="flex-1 py-6 bg-pink-600 hover:bg-pink-500 text-white font-black text-xl uppercase tracking-widest transition-transform active:scale-95 group relative overflow-hidden">
            <span class="relative z-10 flex items-center justify-center gap-2"><SquareIcon class="w-5 h-5" /> Survive (Done)</span>
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
        </div>

        <!-- Start Countdown Button -->
        <button 
          v-if="activeParticipant && turnState === 'ready_to_start_turn'"
          @click="startTurn()"
          class="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-black text-xl uppercase tracking-widest transition-transform active:scale-95 mt-4"
        >
          START COUNTDOWN FOR {{ activeParticipant.name.toUpperCase() }}
        </button>

        <div v-if="activeParticipant && turnState === 'ended' || !activeParticipant" class="w-full bg-pink-900/20 border border-pink-600 p-6 rounded text-center backdrop-blur flex flex-col gap-4 mt-8">
          <div v-if="activeParticipant && turnState === 'ended'" class="text-xl text-white uppercase tracking-widest font-bold" :class="currentTurnEliminated ? 'text-red-500' : 'text-pink-400'">
            {{ currentTurnEliminated ? 'ELIMINATED' : 'SURVIVED' }}
          </div>
          
          <div class="flex justify-center items-center gap-4">
            <button 
              @click="selectNextPerson()"
              :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
              class="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold uppercase transition-colors whitespace-nowrap"
            >
              {{ activeParticipant && turnState === 'ready_to_start_turn' ? 'Selected' : (activeParticipant ? 'Next (Random)' : 'Start (Random)') }}
            </button>
            <div class="flex gap-2 items-center pl-4 border-l border-pink-600/50 overflow-x-auto custom-scrollbar">
              <span class="text-white/50 text-sm whitespace-nowrap">Or pick:</span>
              <div v-for="p in availableParticipants" :key="p.id" class="group relative flex-none">
                <button 
                  @click="selectNextPerson(p.id)"
                  :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                  class="w-10 h-10 rounded-full border border-pink-600/50 overflow-hidden hover:border-pink-400 hover:scale-110 transition-all"
                  :class="{'border-pink-400': p.id === activeParticipantId}"
                  :title="p.name"
                >
                  <img :src="p.avatar" class="w-full h-full bg-slate-800" />
                </button>
                <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-pink-400 text-xs px-2 py-1 rounded border border-pink-600/50 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">{{ p.name }}</span>
              </div>
            </div>
          </div>

          <!-- Add Latecomer -->
          <div class="flex gap-2 mt-4 max-w-md mx-auto w-full">
            <input v-model="newPersonName" @keyup.enter="addLatecomer" placeholder="New Player Name..." class="flex-grow bg-black border border-pink-600/50 rounded px-4 py-2 text-pink-100 focus:border-pink-400 focus:outline-none placeholder-pink-800" />
            <button @click="addLatecomer" class="px-4 py-2 bg-slate-900 border border-pink-600 text-pink-500 hover:bg-pink-900/50 rounded uppercase text-sm font-bold transition-colors">Add</button>
          </div>
        </div>

      </div>

    </div>

    <!-- Players Grid (Eliminated vs Alive) -->
    <div v-show="!showIntro" class="absolute bottom-0 w-full bg-black/80 border-t border-pink-900/50 p-6 z-10">
      <div class="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-2 custom-scrollbar items-end h-20">
        <div v-for="p in participants" :key="p.id" class="flex-none relative w-12 h-12 border border-pink-900/50 bg-slate-900 flex items-center justify-center transition-all"
             :class="{
               'border-pink-500 ring-2 ring-pink-500 scale-110 mb-2': p.id === activeParticipantId && turnState !== 'awaiting_start' && turnState !== 'ended',
               'opacity-20 grayscale': p.status === 'done' || p.status === 'eliminated',
               'border-red-500 bg-red-900/20': p.status === 'eliminated'
             }"
             :title="p.name"
        >
          <img :src="p.avatar" class="w-full h-full object-cover" />
          <div v-if="p.status === 'done' || p.status === 'eliminated'" class="absolute inset-0 flex items-center justify-center text-red-500 bg-black/60">
            <XIcon class="w-8 h-8 opacity-75" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import useStandup from '../composables/useStandup';
import { playBlip, playEliminate, playStart, playCoin } from '../utils/audio';
import { X as XIcon, Crosshair as CrosshairIcon, Square as SquareIcon } from 'lucide-vue-next';

const { appState, activeParticipant, availableParticipants, participants, turnState, timeRemaining, endTurn, selectNextPerson, startTurn, stopMeeting, addParticipant, activeParticipantId, prizeMoney, survivors } = useStandup();

const showIntro = ref(true);
const introStep = ref(0);
const newPersonName = ref('');

const currentTurnEliminated = computed(() => activeParticipant.value?.status === 'eliminated');

let introTimeouts = [];

onMounted(() => {
  // Step 1: Symbol & Welcome
  introTimeouts.push(setTimeout(() => { introStep.value = 1; playBlip(); }, 500));
  
  // Step 2: Debt
  introTimeouts.push(setTimeout(() => { introStep.value = 2; playBlip(); }, 2500));
  
  // Step 3: Rule 1
  introTimeouts.push(setTimeout(() => { introStep.value = 3; playStart(); }, 4500));
  
  // Step 4: Rule 2 (Elimination)
  introTimeouts.push(setTimeout(() => { introStep.value = 4; playEliminate(); }, 7000));
  
  // Step 5: Start Button appears
  introTimeouts.push(setTimeout(() => { introStep.value = 5; playBlip(); }, 9500));
});

function finishIntro() {
  introTimeouts.forEach(clearTimeout);
  showIntro.value = false;
  playStart();
  // After intro, transition to awaiting_start to show selection menu
  turnState.value = 'awaiting_start';
}

function addLatecomer() {
  if (newPersonName.value.trim()) {
    addParticipant(newPersonName.value);
    newPersonName.value = '';
  }
}

watch(timeRemaining, (val, oldVal) => {
  // Only trigger elimination when time runs out AND turn is active
  if (val === 0 && oldVal > 0 && activeParticipant.value && turnState.value === 'active') {
    playEliminate();
    endTurn('eliminated');
    setTimeout(() => { playCoin(); }, 1000); // Coin drops into piggy bank shortly after
  }
});
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 30s linear infinite;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 3s infinite ease-in-out;
}
</style>