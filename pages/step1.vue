<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item">Day {{ parseInt(route.query.index) + 1 }}</li>
        <li class="breadcrumb-item active" aria-current="page"> Step 1: Listening Practice</li>
      </ol>
    </nav>
    <audio v-if="sentence" :src="sentence.audio" controls></audio>
    <div v-if="!showSentence">
      <p>Can you hear this sentence?</p>
      <div class="btn-group">
      <button @click="handleYes" class="btn btn-success">Yes</button>
      <button @click="handleNo" class="btn btn-danger">No</button>
    </div>
    </div>
    <div v-else>
      <p v-if="sentence">{{ sentence.sentence }}</p>
      <p v-if="sentence">{{ sentence.translation }}</p> <!-- Added translation display -->
      <p v-else>Invalid sentence index.</p>
      <div style="margin-top: 20px;">
      <div class="btn-group">
        <a :href="`/step2?index=${route.query.index}`" class="btn btn-primary">Next</a>
        <a href="/complete" class="btn btn-outline-primary">Complete</a>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const sentence = ref(null);
    const showSentence = ref(false);
    const encouragement = ref('');

    const fetchSentence = async (index) => {
      const response = await fetch('/sentences.json');
      const sentences = await response.json();
      sentence.value = sentences[index] || null;
    };

    const handleYes = () => {
      encouragement.value = 'Great job! Keep it up!';
      showSentence.value = true;
      router.push({ path: '/step2', query: { index: route.query.index } });
    };

    const handleNo = () => {
      showSentence.value = true;
    };

    watch(() => route.query.index, (newIndex) => {
      fetchSentence(newIndex);
    }, { immediate: true });

    return {
      sentence,
      showSentence,
      encouragement,
      handleYes,
      handleNo,
      route
    };
  },
};
</script>
