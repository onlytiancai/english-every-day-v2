<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item">Day {{ parseInt(route.query.index) + 1 }}</li>
        <li class="breadcrumb-item active" aria-current="page">Step 2: Speaking Practice</li>
      </ol>
    </nav>
    <p v-if="sentence">{{ sentence.sentence }}</p>
    <p v-else>Invalid sentence index.</p>
    <audio v-if="sentence" :src="sentence.audio" controls></audio>
    
    <div style="margin-top: 20px;">
      <button @click="toggleRecording" class="btn btn-secondary">{{ isRecording ? 'Stop Recording' : 'Start Recording' }}</button>
      <p v-if="recordingMessage">{{ recordingMessage }}</p>
      <audio v-if="recordedAudio" :src="recordedAudio" controls></audio>
    </div>
    <div style="margin-top: 20px;">
      <div class="btn-group">
        <a :href="`/step3?index=${route.query.index}`" class="btn btn-primary">Next</a>
        <a :href="`/step1?index=${route.query.index}`" class="btn btn-outline-primary">Previous</a>
        <a href="/complete" class="btn btn-outline-primary">Complete</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {
  },
  setup() {
    const route = useRoute();
    const sentence = ref(null);
    const isRecording = ref(false);
    const recordedAudio = ref(null);
    const recordingMessage = ref('');
    let mediaRecorder;
    let audioChunks = [];

    const fetchSentence = async (index) => {
      const response = await fetch('/sentences.json');
      const sentences = await response.json();
      sentence.value = sentences[index] || null;
    };

    const toggleRecording = async () => {
      if (isRecording.value) {
        mediaRecorder.stop();
        isRecording.value = false;
        recordingMessage.value = 'Recording stopped.';
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          recordedAudio.value = URL.createObjectURL(audioBlob);
          audioChunks = [];
        };
        mediaRecorder.start();
        isRecording.value = true;
        recordingMessage.value = 'Recording started...';
      }
    };

    watch(() => route.query.index, (newIndex) => {
      fetchSentence(newIndex);
    }, { immediate: true });

    return {
      sentence,
      route,
      isRecording,
      recordedAudio,
      recordingMessage,
      toggleRecording
    };
  },
};
</script>