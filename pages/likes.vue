<template>
  <div class="container mt-4">
    <h1>Likes</h1>
    <form @submit.prevent="giveLike" class="mb-4">
      <div class="mb-3">
        <label for="giverId" class="form-label">Giver ID</label>
        <input v-model="giverId" type="number" id="giverId" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="receiverId" class="form-label">Receiver ID</label>
        <input v-model="receiverId" type="number" id="receiverId" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Give Like</button>
    </form>

    <h2>Received Likes</h2>
    <div v-if="receivedLikes.length">
      <ul class="list-group">
        <li v-for="like in receivedLikes" :key="like.likedAt" class="list-group-item">
          <strong>{{ like.likedAt }}</strong>: {{ like._count }} likes
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No likes received.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const giverId = ref<number | null>(null)
const receiverId = ref<number | null>(null)
const receivedLikes = ref([])

const giveLike = async () => {
  if (giverId.value && receiverId.value) {
    await $fetch('/api/likes', {
      method: 'POST',
      body: { giverId: giverId.value, receiverId: receiverId.value }
    })
    fetchReceivedLikes()
  }
}

const fetchReceivedLikes = async () => {
  if (receiverId.value) {
    const { data } = await useFetch('/api/likes', {
      params: { userId: receiverId.value }
    })
    receivedLikes.value = data.value || []
  }
}
</script>
