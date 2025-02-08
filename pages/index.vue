<template>
  <div class="container">
    <Header />
    <ul class="icon-list">
      <li v-for="(sentence, index) in sentences" :key="index">
        <router-link :to="{ name: 'step1', query: { index: index.toString() } }" class="styled-link">
          <CheckCircleOutlined class="icon" />
          <span class="link-text">Day {{ index + 1 }}</span>
        </router-link>
      </li>
    </ul>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    CheckCircleOutlined,
    Header,
    Footer,
  },
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

<style scoped>
@import '@/assets/css/common.css';

.icon-list {
  list-style-type: none;
  padding: 0;
}

.styled-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.styled-link:hover {
  background-color: #ecf0f1;
}

.icon {
  margin-right: 8px;
}

.link-text {
  display: inline-block;
}
</style>