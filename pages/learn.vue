<template>
  <div class="container mx-auto p-4 space-y-8">
    <!-- Header with progress -->
    <div class="flex justify-between items-center">
      <div class="text-lg">
        Sentences learned today: {{ todayLearned }}
      </div>
    </div>

    <!-- Audio player -->
    <div>
      <audio ref="audioPlayer" :src="currentSentence.mp3" controls class="w-full" @ended="handleAudioEnd"></audio>
    </div>

    <!-- Sentence content -->
    <div class="space-y-4">
      <div v-if="showEnglish" class="text-xl font-semibold">
        {{ currentSentence.english }}
      </div>
      <div v-if="showChinese" class="text-lg text-gray-600">
        {{ currentSentence.chinese }}
      </div>
      <div v-if="showExplanation" class="text-gray-700 bg-gray-50 p-4 rounded">
        {{ currentSentence.explanation }}
      </div>
    </div>

    <!-- Control buttons -->
    <div class="btn-group">
      <button @click="toggleEnglish" class="btn btn-outline-primary">
        {{ showEnglish ? 'Hide' : 'Show' }} English
      </button>
      <button @click="toggleChinese" class="btn btn-outline-primary">
        {{ showChinese ? 'Hide' : 'Show' }} Chinese
      </button>
      <button @click="toggleExplanation" class="btn btn-outline-primary">
        {{ showExplanation ? 'Hide' : 'Show' }} Explanation
      </button>
    </div>

    <!-- Auto-play mode -->
    <div class="flex items-center gap-4">
      <label class="flex items-center">
        <input type="checkbox" v-model="autoPlayMode" class="form-checkbox">
        <span class="ml-2">Auto-play Mode</span>
      </label>
      <div v-if="autoPlayMode" class="text-sm text-gray-600">
        Repetition: {{ repetitionCount }}/3 | Sentences: {{ sentenceCount }}/10
      </div>
    </div>

    <!-- Action buttons -->
    <div class="btn-group">
      <button @click="nextSentence" class="btn btn-primary">
        Next Sentence
      </button>
      <button @click="completeLearning" class="btn btn-success">
        Complete Learning
      </button>
      <button @click="navigateHome" class="btn btn-secondary">
        Back to Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { handleAuthentication } from '~/utils/auth';

const route = useRoute();
const router = useRouter();
const audioPlayer = ref<HTMLAudioElement>();
const todayLearned = ref(0);
const showEnglish = ref(false);
const showChinese = ref(false);
const showExplanation = ref(false);
const autoPlayMode = ref(false);
const repetitionCount = ref(0);
const sentenceCount = ref(0);
const currentSentence = ref({
  id: '',
  english: '',
  chinese: '',
  explanation: '',
  mp3: ''
});

// Add watcher for autoPlayMode
watch(autoPlayMode, (newValue) => {
  if (newValue && audioPlayer.value) {
    audioPlayer.value.play();
  }
});

// Authentication check
onMounted(async () => {
  const { isAuthenticated: authStatus, error } = await handleAuthentication(null);
  if (!authStatus) {
    await navigateTo('/login');
    return;
  }
  
  await fetchNewSentence();
  await fetchTodayProgress();
  setTimeout(() => {
    audioPlayer.value?.play();
  }, 500);
});

// Fetch a new random sentence
async function fetchNewSentence() {
  try {
    const { getAuthHeaders } = await import('~/utils/auth');
    const response = await useFetch('/api/sentences/random', {
      headers: getAuthHeaders()
    });
    if (response.data.value) {
      currentSentence.value = response.data.value;
      // Auto-play audio after loading new sentence
      setTimeout(() => {
        audioPlayer.value?.play();
      }, 500);
    }
  } catch (error) {
    console.error('Error fetching sentence:', error);
  }
}

// Fetch today's learning progress
async function fetchTodayProgress() {
  try {
    const { getAuthHeaders } = await import('~/utils/auth');
    const response = await useFetch('/api/learning/today-count', {
      headers: getAuthHeaders()
    });
    if (response.data.value) {
      todayLearned.value = response.data.value.count;
    }
  } catch (error) {
    console.error('Error fetching progress:', error);
  }
}

// Handle audio playback end
function handleAudioEnd() {
  if (autoPlayMode.value) {
    repetitionCount.value++;
    if (repetitionCount.value >= 3) {
      repetitionCount.value = 0;
      sentenceCount.value++;
      if (sentenceCount.value < 10) {
        nextSentence();
      } else {
        autoPlayMode.value = false;
        sentenceCount.value = 0;
      }
    } else {
      audioPlayer.value?.play();
    }
  }
}

// Record completed sentence
async function recordLearnedSentence() {
  try {
    const { getAuthHeaders } = await import('~/utils/auth');
    await $fetch('/api/learning', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        sentenceId: currentSentence.value.id
      }
    });
    todayLearned.value++;
  } catch (error) {
    console.error('Error recording learned sentence:', error);
  }
}

// Navigation and UI control functions
function nextSentence() {
  recordLearnedSentence();
  fetchNewSentence();
}

function completeLearning() {
  recordLearnedSentence();
  navigateHome();
}

function navigateHome() {
  router.push('/');
}

const toggleEnglish = () => showEnglish.value = !showEnglish.value;
const toggleChinese = () => showChinese.value = !showChinese.value;
const toggleExplanation = () => showExplanation.value = !showExplanation.value;
</script>