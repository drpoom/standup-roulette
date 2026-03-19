<template>
  <div class="h-screen w-full flex flex-col items-center justify-center p-8 bg-slate-900 text-slate-200 relative">
    
    <button v-if="appState !== 'finished'" @click="stopMeeting" class="absolute top-6 left-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 font-bold border border-slate-700 transition-colors flex items-center gap-2">
      <XIcon class="w-4 h-4" /> Exit
    </button>

    <div v-if="appState === 'finished'" class="z-10 text-center animate-fade-in p-12 bg-slate-800/80 border border-slate-700 rounded-xl backdrop-blur max-w-2xl w-full">
      <h2 class="text-5xl font-bold text-cyan-400 mb-6" style="font-family: 'Silkscreen', cursive;">Standup Complete</h2>
      <p class="text-xl text-slate-400 mb-8">Great job team, let's crush it today!</p>

      <div class="bg-slate-900 border border-slate-700 p-6 rounded-lg mb-8">
        <p class="text-xl text-slate-400 mb-2 uppercase tracking-widest text-sm">Survivors</p>
        <div class="flex justify-center flex-wrap gap-2 mb-4">
          <div v-for="p in survivors" :key="p.id" class="w-12 h-12 rounded-full border-2 border-cyan-400 overflow-hidden" :title="p.name">
            <img :src="p.avatar" class="w-full h-full bg-slate-800" />
          </div>
          <div v-if="survivors.length === 0" class="text-red-400 font-bold uppercase tracking-widest py-2">No Survivors</div>
        </div>
      </div>

      <button @click="stopMeeting" class="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold border border-slate-700 transition-colors">
        Back to Dashboard
      </button>
    </div>

    <div v-else class="w-full max-w-2xl flex flex-col items-center mt-8">
      <!-- Active Speaker -->
      <div v-if="activeParticipant" class="flex flex-col items-center w-full">
        <div class="relative w-48 h-48 mb-8 animate-bounce-subtle">
          <div class="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <img :src="activeParticipant.avatar" :title="activeParticipant.name" class="relative w-48 h-48 rounded-full border-4 border-cyan-400 bg-slate-800 shadow-2xl" />
        </div>
        <h2 class="text-4xl font-bold mb-4 tracking-tight">{{ activeParticipant.name }}</h2>
      </div>
      
      <div v-else class="flex flex-col items-center w-full mb-12">
        <div class="w-48 h-48 mb-8 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-600 text-6xl font-bold">?</div>
        <h2 class="text-4xl font-bold mb-4 tracking-tight text-slate-500">Ready to Start</h2>
      </div>

      <!-- Timer -->
      <div v-if="turnState === 'active' && activeParticipant">
        <div v-if="timeRemaining > -1" class="text-7xl font-mono mb-12 text-center" :class="timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'">
          {{ formatTime(timeRemaining) }}
        </div>
        <div v-else class="text-2xl text-slate-500 font-mono mb-12 text-center">
          Infinite Time
        </div>
      </div>
      <div v-else-if="activeParticipant && turnState === 'ready_to_start_turn'" class="text-6xl font-bold text-lime-400 font-mono leading-none mb-12 animate-pulse">
        READY!
      </div>
      <div v-else class="text-7xl font-mono mb-12 text-slate-700 text-center">00:00</div>

      <!-- Controls -->
      <div v-if="turnState === 'active' && activeParticipant" class="flex gap-4">
        <button @click="endTurn('done')" class="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2">
          <CheckIcon class="w-5 h-5" /> DONE
        </button>
      </div>
      <div v-else class="flex flex-col gap-6 w-full bg-slate-800/80 p-6 rounded-xl border border-slate-700 backdrop-blur">
        <div class="flex justify-between items-center gap-6">
          <button 
            @click="selectNextPerson()"
            :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
            class="px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded shadow-lg transition-transform flex-none whitespace-nowrap"
          >
            {{ activeParticipant && turnState === 'ready_to_start_turn' ? 'Selected' : (activeParticipant ? 'Next (Random)' : 'Start (Random)') }}
          </button>
          
          <div class="flex-grow flex gap-3 items-center border-l border-slate-600 pl-6 overflow-x-auto custom-scrollbar pb-2">
            <span class="text-slate-400 text-sm whitespace-nowrap">Or pick:</span>
            <div v-for="p in availableParticipants" :key="p.id" class="group relative flex-none">
              <button 
                @click="selectNextPerson(p.id)"
                :disabled="activeParticipant && turnState === 'ready_to_start_turn'"
                class="w-12 h-12 rounded-full border-2 border-slate-600 overflow-visible hover:border-cyan-400 transition-colors"
                :class="{'border-cyan-400': p.id === activeParticipantId}"
                :title="p.name"
              >
                <img :src="p.avatar" class="w-full h-full bg-slate-900 rounded-full" />
              </button>
              <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">{{ p.name }}</span>
            </div>
          </div>
        </div>

        <button 
          v-if="turnState === 'ready_to_start_turn' && activeParticipant"
          @click="startTurn()"
          class="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold rounded shadow-lg transition-transform active:scale-95 mt-4"
        >
          START COUNTDOWN FOR {{ activeParticipant.name.toUpperCase() }}
        </button>
        
        <!-- Add Latecomer -->
        <div class="flex gap-2 pt-4 border-t border-slate-700">
          <input v-model="newPersonName" @keyup.enter="addLatecomer" placeholder="Late arrival name..." class="flex-grow bg-slate-900 border border-slate-600 rounded px-4 py-2 text-white focus:border-cyan-400 focus:outline-none" />
          <button @click="addLatecomer" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold transition-colors">Add</button>
        </div>
      </div>

      <!-- Up Next Queue -->
      <div v-if="availableParticipants.length > 0 && turnState === 'active'" class="mt-12 w-full text-center">
        <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Remaining ({{ availableParticipants.length }})</p>
        <div class="flex justify-center flex-wrap gap-2">
          <div v-for="p in availableParticipants" :key="p.id" class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 opacity-50 flex items-center justify-center overflow-hidden" :title="p.name">
            <img :src="p.avatar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useStandup from '../composables/useStandup';
import { Check as CheckIcon, X as XIcon } from 'lucide-vue-next';

const { appState, activeParticipant, availableParticipants, turnState, timeRemaining, endTurn, selectNextPerson, startTurn, stopMeeting, addParticipant, activeParticipantId, survivors } = useStandup();
const newPersonName = ref('');

// Base theme starts directly in 'awaiting_start' state, no intro, no auto-next on mounted.

function addLatecomer() {
  if (newPersonName.value.trim()) {
    addParticipant(newPersonName.value);
    newPersonName.value = '';
  }
}

function formatTime(seconds) {
  if (seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
</script>

<style>
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