<template>
  <div >

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item">Day {{ parseInt(route.query.index) + 1 }}</li>
        <li class="breadcrumb-item active" aria-current="page">Step 3: Words Study</li>
      </ol>
    </nav>
    <p v-if="sentence">{{ sentence.sentence }}</p>
    <p v-else>Invalid sentence index.</p>
    <ul v-if="sentence">
      <li v-for="word in sentence.keywords" :key="word.word">
        <p>{{ word.word }}, [{{ word.phonetic }}],{{ word.part_of_speech }}, {{ word.translation }}</p>
      </li>
    </ul>
    <div style="margin-top: 20px;">
      <div class="btn-group">
        <a :href="`/step4?index=${route.query.index}`" class="btn btn-primary">Next</a>
        <a :href="`/step2?index=${route.query.index}`" class="btn btn-outline-primary">Previous</a>
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
    const fetchSentence = async (index) => {
      const response = await fetch('/sentences.json');
      const sentences = await response.json();
      sentence.value = sentences[index] || null;
    };
    watch(() => route.query.index, (newIndex) => {
      fetchSentence(newIndex);
    }, { immediate: true });
    return {
      sentence,
      route
    };
  },
};
</script>
<style scoped>

ul {
  text-align: left;
}
</style>