<template>
  <div class="space-y-4">
    <div v-for="friend in friends" :key="friend.id" class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img :src="friend.avatar" class="w-10 h-10 rounded-full" :alt="friend.name">
        <div>
          <div>{{ friend.name }}</div>
          <div class="text-sm text-gray-500">
            今日: {{ friend.todayCount }}句 / 本周: {{ friend.weekCount }}句
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
        <button
          @click="$emit('like', friend.id)"
          class="p-2 text-pink-500 hover:bg-pink-50 rounded"
        >
          <HeartOutlined />
        </button>
        <button
          @click="$emit('unfollow', friend.id)"
          class="p-2 text-red-500 hover:bg-red-50 rounded"
        >
          <UserDeleteOutlined />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Friend {
  id: string;
  name: string;
  avatar: string;
  todayCount: number;
  weekCount: number;
}

defineProps<{
  friends: Friend[];
}>();

defineEmits<{
  (e: 'like', userId: string): void;
  (e: 'unfollow', userId: string): void;
}>();
</script>
