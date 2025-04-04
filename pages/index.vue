<template>
  <div class="container py-4">
    <div v-if="!isAuthenticated">
      <div v-if="isWeChat">
        <a :href="loginWechatUrl" class="btn btn-success btn-lg">微信登录</a>
        <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
      </div>
      <div v-else>
        <p class="text-center">请在微信中打开</p>
      </div>
    </div>
    <div v-else>
      <!-- Welcome Section -->
      <div class="card bg-light mb-4">
        <div class="card-body d-flex align-items-center p-3">
          <img 
            v-if="user?.avatar" 
            :src="user.avatar" 
            class="rounded-circle border shadow-sm me-3" 
            width="64" 
            height="64" 
            :alt="user?.name"
          >
          <div>
            <h2 class="h4 mb-1">欢迎回来，{{ user?.name || '同学' }}</h2>
            <p class="text-muted mb-0">让我们继续今天的学习吧！</p>
          </div>
        </div>
      </div>

      <!-- Learning Status Button -->
      <div class="text-center mb-4">
        <button
          @click="startLearning"
          class="btn btn-lg px-5 py-3"
          :class="todayCompleted ? 'btn-success' : 'btn-primary'"
        >
          <span class="fs-4">{{ todayCompleted ? '今日学习已完成 🎉' : '开始今日学习' }}</span>
        </button>
      </div>

      <!-- Dashboard Stats -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <DashboardCard title="今日学习句子" :value="stats.todaySentences" icon="BookOutlined" />
        </div>
        <div class="col-md-3">
          <DashboardCard title="本周学习句子" :value="stats.weekSentences" icon="CalendarOutlined" />
        </div>
        <div class="col-md-3">
          <DashboardCard title="今日获赞" :value="stats.todayLikes" icon="HeartOutlined" />
        </div>
        <div class="col-md-3">
          <DashboardCard title="本周获赞" :value="stats.weekLikes" icon="LikeOutlined" />
        </div>
      </div>

      <!-- Friends List -->
      <div class="card mb-4">
        <div class="card-header bg-light">
          <h5 class="card-title mb-0">好友列表</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <template v-for="friend in friends" :key="friend.id">
              <div class="col-md-6">
                <div class="d-flex align-items-center p-2 border rounded">
                  <img :src="friend.avatar" class="rounded-circle me-3" width="48" height="48" :alt="friend.name">
                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ friend.name }}</h6>
                    <small class="text-muted">
                      今日: {{ friend.todayCount }}句 / 本周: {{ friend.weekCount }}句
                    </small>
                  </div>
                  <div class="d-flex gap-2">
                    <button @click="likeUser(friend.id)" class="btn btn-outline-danger btn-sm">
                      <HeartOutlined />
                    </button>
                    <button @click="unfollowUser(friend.id)" class="btn btn-outline-secondary btn-sm">
                      <UserDeleteOutlined />
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Rankings -->
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">今日排行榜</h5>
            </div>
            <div class="card-body">
              <UserRankList
                :users="dailyRanking"
                @like="likeUser"
                @follow="followUser"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">本周排行榜</h5>
            </div>
            <div class="card-body">
              <UserRankList
                :users="weeklyRanking"
                @like="likeUser"
                @follow="followUser"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isWeChat, getWechatLoginUrl, handleAuthentication } from '~/utils/auth';

const isAuthenticated = ref(false);
const errorMessage = ref('');
const loginWechatUrl = ref(getWechatLoginUrl());

const stats = ref({
  todaySentences: 0,
  weekSentences: 0,
  todayLikes: 0,
  weekLikes: 0
});

const dailyRanking = ref([]);
const weeklyRanking = ref([]);
const friends = ref([]);
const todayCompleted = ref(false);
const user = ref(null);

// Fetch initial data
const fetchData = async () => {
  const { getAuthHeaders } = await import('~/utils/auth');
  const headers = getAuthHeaders();
  
  const [statsData, dailyRank, weeklyRank, friendsData] = await Promise.all([
    $fetch('/api/stats', { headers }),
    $fetch('/api/ranking/daily', { headers }),
    $fetch('/api/ranking/weekly', { headers }),
    $fetch('/api/friends', { headers })
  ]);

  stats.value = statsData;
  dailyRanking.value = dailyRank;
  weeklyRanking.value = weeklyRank;
  friends.value = friendsData;
  todayCompleted.value = statsData.todaySentences > 0;
};

// Actions
const startLearning = () => {
  navigateTo('/learn');
};

const likeUser = async (userId: string) => {
  const { getAuthHeaders } = await import('~/utils/auth');
  await $fetch(`/api/users/${userId}/like`, { 
    method: 'POST',
    headers: getAuthHeaders()
  });
  await fetchData();
};

const followUser = async (userId: string) => {
  const { getAuthHeaders } = await import('~/utils/auth');
  await $fetch(`/api/users/${userId}/follow`, { 
    method: 'POST',
    headers: getAuthHeaders()
  });
  await fetchData();
};

const unfollowUser = async (userId: string) => {
  const { getAuthHeaders } = await import('~/utils/auth');
  await $fetch(`/api/users/${userId}/unfollow`, { 
    method: 'POST',
    headers: getAuthHeaders()
  });
  await fetchData();
};

// Authentication logic
onMounted(async () => {
  const { isAuthenticated: authStatus, error, userInfo } = await handleAuthentication();
  isAuthenticated.value = authStatus;
  if (error) {
    errorMessage.value = error;
  }
  if (authStatus) {
    user.value = {
      name: userInfo.nickname,
      avatar: userInfo.headimgurl
    };
    await fetchData();
  }
});
</script>
