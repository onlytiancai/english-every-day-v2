<template>
  <div class="container mt-4">
    <h1>Follows</h1>
    <form @submit.prevent="followUser" class="mb-4">
      <div class="mb-3">
        <label for="followerId" class="form-label">Follower ID</label>
        <input v-model="followerId" type="number" id="followerId" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="followingId" class="form-label">Following ID</label>
        <input v-model="followingId" type="number" id="followingId" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Follow</button>
    </form>

    <h2>Followers</h2>
    <div v-if="followers.length">
      <ul class="list-group">
        <li v-for="follower in followers" :key="follower.id" class="list-group-item">
          {{ follower.follower.name }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No followers found.</p>
    </div>

    <h2>Following</h2>
    <div v-if="following.length">
      <ul class="list-group">
        <li v-for="follow in following" :key="follow.id" class="list-group-item">
          {{ follow.following.name }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Not following anyone.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const followerId = ref<number | null>(null)
const followingId = ref<number | null>(null)
const followers = ref([])
const following = ref([])

const followUser = async () => {
  if (followerId.value && followingId.value) {
    await $fetch('/api/follows', {
      method: 'POST',
      body: { followerId: followerId.value, followingId: followingId.value }
    })
    fetchFollowers()
    fetchFollowing()
  }
}

const fetchFollowers = async () => {
  if (followingId.value) {
    const { data } = await useFetch('/api/follows', {
      params: { userId: followingId.value, type: 'followers' }
    })
    followers.value = data.value || []
  }
}

const fetchFollowing = async () => {
  if (followerId.value) {
    const { data } = await useFetch('/api/follows', {
      params: { userId: followerId.value, type: 'following' }
    })
    following.value = data.value || []
  }
}
</script>
