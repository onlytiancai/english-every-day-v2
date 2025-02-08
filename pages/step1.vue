<template>
  <div>
    <h1>Step 1</h1>
    <p v-if="sentence">{{ sentence.sentence }}</p>
    <p v-else>Invalid sentence index.</p>
    <audio v-if="sentence" :src="sentence.audio" controls></audio>
    <div>
      <button @click="goHome">Home</button>
      <button @click="goComplete">Complete</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const sentence = ref(null);

    const fetchSentence = async (index) => {
      const response = await fetch('/sentences.json');
      const sentences = await response.json();
      sentence.value = sentences[index] || null;
    };

    watch(() => route.query.index, (newIndex) => {
      fetchSentence(newIndex);
    }, { immediate: true });

    const goHome = () => {
      router.push({ name: 'index' });
    };

    const goComplete = () => {
      router.push({ name: 'complete' });
    };

    return {
      sentence,
      goHome,
      goComplete,
    };
  },
};
</script>