<template>
  <div class="list-group list-group-flush">
    <div v-for="(user, index) in users" 
         :key="user.id" 
         class="list-group-item d-flex align-items-center justify-content-between py-3">
      <div class="d-flex align-items-center gap-3">
        <span class="fw-bold" :class="{'text-primary': index < 3}">{{ index + 1 }}</span>
        <img :src="user.avatar" class="rounded-circle" width="40" height="40" :alt="user.name">
        <div>
          <div>{{ user.name }}</div>
          <small class="text-muted">{{ user.sentenceCount }}句</small>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button @click="$emit('like', user.id)" 
                class="btn btn-outline-danger btn-sm">
          <HeartOutlined v-if="!user.hasLikedToday" />
          <HeartFilled v-else />
        </button>
        <button @click="$emit('follow', user.id)" 
                class="btn btn-outline-primary btn-sm">
          <UserAddOutlined />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartOutlined, HeartFilled } from '@ant-design/icons-vue';

interface User {
  id: number;
  name: string;
  avatar: string;
  sentenceCount: number;
  hasLikedToday: boolean;
}

defineProps<{
  users: User[];
}>();

defineEmits<{
  (e: 'like', userId: number): void;
  (e: 'follow', userId: number): void;
}>();
</script>
