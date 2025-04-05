<template>
  <div class="container py-4">
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
</template>

<script setup lang="ts">
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

// Fetch initial data
const fetchData = async () => {
  const [statsData, dailyRank, weeklyRank, friendsData] = await Promise.all([
    $fetch('/api/stats'),
    $fetch('/api/ranking/daily'),
    $fetch('/api/ranking/weekly'),
    $fetch('/api/friends')
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
  await $fetch(`/api/users/${userId}/like`, { method: 'POST' });
  await fetchData();
};

const followUser = async (userId: string) => {
  await $fetch(`/api/users/${userId}/follow`, { method: 'POST' });
  await fetchData();
};

const unfollowUser = async (userId: string) => {
  await $fetch(`/api/users/${userId}/unfollow`, { method: 'POST' });
  await fetchData();
};

// Initial data fetch
onMounted(() => {
  fetchData();
});
</script>
