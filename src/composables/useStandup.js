import { ref, reactive, watch, computed } from 'vue';

// Global state - shared across all components
const STORAGE_KEY = 'gamified-standup-state';
const participants = ref([]);
const settings = reactive({ theme: 'base', duration: 60, nextMode: 'random', allowReuse: false });
const appState = ref('setup'); // 'setup', 'running', 'finished'
const turnState = ref('awaiting_start'); // 'awaiting_start', 'active', 'ended', 'ready_to_start_turn'
const activeParticipantId = ref(null);
const timeRemaining = ref(0);
let timerInterval = null;

// Total prize money for Squid Game theme
const TOTAL_PRIZE = 45600000000; // 45.6 billion KRW

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      participants.value = parsed.participants || [];
      Object.assign(settings, parsed.settings || {});
    } catch (e) {}
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ participants: participants.value, settings }));
}

watch([participants, settings], saveData, { deep: true });
loadData();

const activeParticipant = computed(() => participants.value.find(p => p.id === activeParticipantId.value) || null);
const survivors = computed(() => participants.value.filter(p => p.status === 'done'));

// Add the missing computed property for available participants (those with 'waiting' status)
const availableParticipants = computed(() => participants.value.filter(p => p.status === 'waiting'));

// Prize money calculations for Squid Game theme
const remainingPlayers = computed(() => participants.value.filter(p => p.status !== 'eliminated').length);
const prizeMoney = computed(() => {
  const eliminatedCount = participants.value.filter(p => p.status === 'eliminated').length;
  const totalPlayers = participants.value.length;
  if (totalPlayers === 0) return 0;
  return eliminatedCount * (TOTAL_PRIZE / totalPlayers);
});

const gameShouldEnd = computed(() => {
  if (appState.value !== 'running') return false; // Only consider ending if game is running

  if (settings.allowReuse) {
    // If reuse is allowed, game ends when there are NO participants, or all are eliminated.
    // This means a cycle has completed and no one is left or able to be reset to waiting.
    return participants.value.length === 0 || 
           participants.value.every(p => p.status === 'eliminated');
  } else {
    // If reuse is NOT allowed, game ends when no one is waiting AND no one is active.
    return availableParticipants.value.length === 0 && !activeParticipantId.value;
  }
});

watch(gameShouldEnd, (shouldEnd) => {
  if (shouldEnd) {
    participants.value.forEach(p => {
      if (p.status === 'waiting' || p.status === 'active') {
        p.status = 'eliminated';
      }
    });
    appState.value = 'finished';
    activeParticipantId.value = null;
    clearTimer(); 
  }
});

function addParticipant(name) {
  if (!name.trim()) return;
  participants.value.push({
    id: Date.now().toString(), name: name.trim(),
    avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    status: 'waiting'
  });
}

function removeParticipant(id) { participants.value = participants.value.filter(p => p.id !== id); }

function startMeeting() {
  if (participants.value.length === 0) return;
  appState.value = 'running';
  participants.value.forEach(p => p.status = 'waiting'); 
  activeParticipantId.value = null;
  turnState.value = 'awaiting_start';
}

function stopMeeting() {
  appState.value = 'setup';
  activeParticipantId.value = null;
  clearTimer();
}

function endTurn(result = 'done') {
  if (activeParticipantId.value) {
    const current = participants.value.find(p => p.id === activeParticipantId.value);
    if (current) current.status = result;
  }
  turnState.value = 'ended'; 
  clearTimer();
}

function selectNextPerson(manualId = null) {
  clearTimer();

  let candidatesForNextTurn = participants.value.filter(p => p.status === 'waiting');

  if (candidatesForNextTurn.length === 0) {
    if (!settings.allowReuse) {
      activeParticipantId.value = null;
      turnState.value = 'ended';
      return; 
    } else {
      participants.value.forEach(p => {
        if (p.status === 'done' || p.status === 'eliminated') {
          p.status = 'waiting';
        }
      });
      candidatesForNextTurn = participants.value.filter(p => p.status === 'waiting');
      if (candidatesForNextTurn.length === 0) {
        activeParticipantId.value = null;
        turnState.value = 'ended'; 
        return;
      }
    }
  }

  if (manualId) {
    activeParticipantId.value = manualId;
  } else {
    activeParticipantId.value = candidatesForNextTurn[Math.floor(Math.random() * candidatesForNextTurn.length)].id;
  }

  const newActive = participants.value.find(p => p.id === activeParticipantId.value);
  if (newActive) newActive.status = 'active';
  turnState.value = 'ready_to_start_turn';
  timeRemaining.value = settings.duration > 0 ? settings.duration : -1;
}

function startTurn() {
  if (!activeParticipantId.value || turnState.value !== 'ready_to_start_turn') return;
  turnState.value = 'active';

  if (settings.duration > 0) {
    timerInterval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--;
      } else {
        clearTimer();
        if (activeParticipantId.value && turnState.value === 'active') {
          endTurn('eliminated');
        }
      }
    }, 1000);
  } 
}

function clearTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

export default function useStandup() {
  // Return the composable's state and functions
  return {
    participants,
    settings,
    appState,
    turnState,
    activeParticipantId,
    timeRemaining,
    activeParticipant,
    survivors,
    availableParticipants,
    remainingPlayers,
    prizeMoney,
    gameShouldEnd,
    addParticipant,
    removeParticipant,
    startMeeting,
    stopMeeting,
    endTurn,
    selectNextPerson,
    startTurn,
    clearTimer
  };
}