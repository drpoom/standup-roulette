<template>
  <div class="max-w-4xl mx-auto p-6 pt-12">
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold tracking-tight mb-2 text-white" style="font-family: 'Silkscreen', cursive;">
        STANDUP<span class="text-cyan-400">.</span>ROULETTE
      </h1>
      <p class="text-slate-400">Gamify your daily engineering syncs</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Settings Panel -->
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          <SettingsIcon class="w-5 h-5 text-cyan-400" /> Game Settings
        </h2>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Select Theme</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="t in availableThemes" :key="t.id"
                @click="settings.theme = t.id"
                :class="[
                  'py-2 px-3 rounded-lg text-sm border font-medium transition-all',
                  settings.theme === t.id 
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                ]"
              >
                {{ t.name }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Time per Person (seconds)</label>
            <input 
              type="number" 
              v-model.number="settings.duration"
              class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="e.g. 60 (0 for infinite)"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-slate-300">Allow Multiple Turns?</label>
            <button 
              @click="settings.allowReuse = !settings.allowReuse"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.allowReuse ? 'bg-cyan-500' : 'bg-slate-600'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.allowReuse ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>

        <button 
          @click="handleStart"
          :disabled="participants.length === 0"
          class="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <PlayIcon class="w-5 h-5" />
          START ROULETTE
        </button>
      </div>

      <!-- Team Panel -->
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <h2 class="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          <UsersIcon class="w-5 h-5 text-cyan-400" /> Team Members
        </h2>

        <form @submit.prevent="handleAdd" class="flex gap-2 mb-6">
          <input 
            type="text" 
            v-model="newName"
            class="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            placeholder="Add participant name..."
          />
          <button type="submit" class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Add
          </button>
        </form>

        <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <div v-if="participants.length === 0" class="text-center py-8 text-slate-500 italic">
            No participants added yet.
          </div>
          <div 
            v-for="p in participants" :key="p.id"
            class="flex items-center justify-between bg-slate-800 border border-slate-700 p-3 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <img :src="p.avatar" :title="p.name" alt="Avatar" class="w-10 h-10 rounded-full bg-slate-900 border border-slate-600" />
              <span class="font-medium text-white">{{ p.name }}</span>
            </div>
            <button 
              @click="removeParticipant(p.id)"
              class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Trash2Icon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useStandup from '../composables/useStandup';
import { Settings as SettingsIcon, Users as UsersIcon, Play as PlayIcon, Trash2 as Trash2Icon } from 'lucide-vue-next';
import { initAudio } from '../utils/audio';

const { participants, settings, addParticipant, removeParticipant, startMeeting } = useStandup();
const newName = ref('');

const availableThemes = [
  { id: 'base', name: 'Minimalist' },
  { id: 'squid', name: 'Octopus Game' },
  { id: 'classroom', name: '教室 Classroom', description: 'Classic 90s Japanese homeroom — the teacher is watching' }
];

function handleAdd() {
  if (newName.value) {
    addParticipant(newName.value);
    newName.value = '';
  }
}

function handleStart() {
  initAudio();
  startMeeting();
}
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 20px;
}
</style>