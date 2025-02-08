<template>
  <div>
    <h1>English Every Day</h1>
    <ul>
      <li v-for="(sentence, index) in sentences" :key="index">
        <router-link :to="{ name: 'step1', query: { index: index.toString() } }">
          Day {{ index + 1 }}
        </router-link>
      </li>
    </ul>
    <a-button>
    button
  </a-button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const sentences = ref([]);
    const router = useRouter();

    onMounted(async () => {
      const response = await fetch('/sentences.json');
      sentences.value = await response.json();
    });

    return {
      sentences,
    };
  },
};
</script>