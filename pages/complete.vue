<template>
  <div>
    <h1>Congratulations!</h1>
    <p>You have completed your English study for today. Keep up the great work!</p>
    <button @click="goHome">Home</button>
  </div>
</template>

<script>

export default {
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