<template>
  <div class="container mt-4">
    <h1>Learning Records</h1>
    <form @submit.prevent="recordLearning" class="mb-4">
      <div class="mb-3">
        <label for="userId" class="form-label">User ID</label>
        <input v-model="userId" type="number" id="userId" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="sentenceId" class="form-label">Sentence ID</label>
        <input v-model="sentenceId" type="number" id="sentenceId" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Record Learning</button>
    </form>

    <h2>Learning Statistics</h2>
    <div v-if="learningStats.length">
      <ul class="list-group">
        <li v-for="stat in learningStats" :key="stat.learnedAt" class="list-group-item">
          <strong>{{ stat.learnedAt }}</strong>: {{ stat._count.sentenceId }} sentences
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No learning statistics available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const userId = ref<number | null>(1)
const sentenceId = ref<number | null>(0)
interface LearningStat {
  learnedAt: string
  _count: {
    sentenceId: number
  }
}

const learningStats = ref<LearningStat[]>([])

const recordLearning = async () => {
  if (userId.value && sentenceId.value) {
    await $fetch('/api/learning', {
      method: 'POST',
      body: { userId: userId.value, sentenceId: sentenceId.value }
    })
    fetchLearningStats()
  }
}

const fetchLearningStats = async () => {
  if (userId.value) {
    const { data } = await useFetch('/api/learning', {
      params: { userId: userId.value }
    })
    learningStats.value = data.value || []
  }
}

fetchLearningStats()

</script>
