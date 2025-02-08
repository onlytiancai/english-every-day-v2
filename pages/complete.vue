<template>
  <div class="container">
    <Header />
    <h1>Congratulations!</h1>
    <p>You have completed your English study for today. Keep up the great work!</p>
    <button @click="goHome">Home</button>
    <Footer />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push({ name: 'index' });
    };

    return {
      goHome,
    };
  },
};
</script>

<style scoped>
@import '@/assets/css/common.css';
</style>