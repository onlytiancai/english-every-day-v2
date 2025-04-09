<template>
  <div class="container py-4">
    <!-- Welcome Section -->
    <div class="card bg-light mb-4">
      <div class="card-body d-flex align-items-center justify-content-between p-3">
        <div class="d-flex align-items-center">
          <img v-if="user?.avatar" :src="user.avatar" class="rounded-circle border shadow-sm me-3" width="64"
            height="64" :alt="user?.name">
          <div>
            <h2 class="h4 mb-1">欢迎回来，{{ user?.name || '同学' }}</h2>
            <p class="text-muted mb-0">让我们继续今天的学习吧！</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button @click="handleShare" class="btn btn-outline-primary">
            <ShareAltOutlined /> 分享
          </button>
          <button @click="handleLogout" class="btn btn-outline-danger">
            退出登录
          </button>
        </div>
      </div>
    </div>

    <!-- Learning Status Button -->
    <div class="text-center mb-4">
      <button @click="startLearning" class="btn btn-lg px-5 py-3"
        :class="todayCompleted ? 'btn-success' : 'btn-primary'">
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
            <UserRankList :users="dailyRanking" @like="likeUser" @follow="followUser" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header bg-light">
            <h5 class="card-title mb-0">本周排行榜</h5>
          </div>
          <div class="card-body">
            <UserRankList :users="weeklyRanking" @like="likeUser" @follow="followUser" />
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Messages Section -->
    <DebugMessages 
      :messages="debugMessages" 
      @clear="clearDebugMessages"
    />
  </div>
</template>

<script setup lang="ts">
import { checkAuth, logout } from '~/utils/auth';
const { debugMessages, logDebug, clearDebugMessages } = useDebugLog();

const isAuthenticated = ref(false);
const errorMessage = ref('');
const stats = ref({
  todaySentences: 0,
  weekSentences: 0,
  todayLikes: 0,
  weekLikes: 0
});

const dailyRanking = ref([]);
const weeklyRanking = ref([]);
const friends = ref<Array<{
  id: number;
  name: string;
  avatar: string;
  todayCount: number;
  weekCount: number;
}>>([]);
const todayCompleted = ref(false);
const user = ref(null);

// Add helper function for API error handling
const handleApiError = async (error: any) => {
  logDebug(`API Error ${error?.response?.status}: ${error?.message || error}`);
  if (error?.response?.status === 401) {
    logDebug('Unauthorized, redirecting to login...');
    await navigateTo('/login');
  }
};

// Fetch initial data
const fetchData = async () => {
  const { getAuthHeaders } = await import('~/utils/auth');
  const headers = getAuthHeaders();
  
  try {
    const [statsData, dailyRank, weeklyRank, friendsData] = await Promise.all([
      $fetch('/api/stats', { headers }),
      $fetch('/api/ranking/daily', { headers }),
      $fetch('/api/ranking/weekly', { headers }),
      $fetch('/api/friends', { headers })
    ]);

    logDebug(`Data fetched successfully - Stats: ${JSON.stringify(statsData)}`);
    
    stats.value = statsData;
    dailyRanking.value = dailyRank;
    weeklyRanking.value = weeklyRank;
    friends.value = friendsData;
    todayCompleted.value = statsData.todaySentences > 0;
  } catch (error) {
    await handleApiError(error);
  }
};

// Actions
const startLearning = () => {
  navigateTo('/learn');
};

const likeUser = async (userId: number) => {
  const { getAuthHeaders } = await import('~/utils/auth');
  try {
    await $fetch(`/api/users/${userId}/like`, { 
      method: 'POST',
      headers: getAuthHeaders()
    });
    await fetchData();
  } catch (error) {
    await handleApiError(error);
  }
};

const followUser = async (userId: number) => {
  const { getAuthHeaders } = await import('~/utils/auth');
  try {
    await $fetch(`/api/users/${userId}/follow`, { 
      method: 'POST',
      headers: getAuthHeaders()
    });
    await fetchData();
  } catch (error) {
    await handleApiError(error);
  }
};

const unfollowUser = async (userId: number) => {
  const { getAuthHeaders } = await import('~/utils/auth');
  try {
    await $fetch(`/api/users/${userId}/unfollow`, { 
      method: 'POST',
      headers: getAuthHeaders()
    });
    await fetchData();
  } catch (error) {
    await handleApiError(error);
  }
};

const handleLogout = async () => {
  logDebug('Logging out...');
  await logout();
  isAuthenticated.value = false;
  user.value = null;
  await navigateTo('/login');
};

const handleShare = async () => {
  try {
    logDebug('开始处理分享...');
    
    // 检查是否在微信环境
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    logDebug(`当前环境: ${isWechat ? '微信' : '非微信'}`);
    
    if (!isWechat) {
      alert('请在微信中打开进行分享');
      return;
    }

    logDebug('配置分享数据...');
    const config = useRuntimeConfig();

    const shareData = {
      title: '每日英语学习',
      desc: `${user.value?.name}已经学习了${stats.value.weekSentences}句，快来一起打卡吧！`,
      link: window.location.href.split('#')[0],
      imgUrl: `${config.public.baseUrl}share-logo.png`,
      type: 'link',
      dataUrl: '',
      success: function () {
        logDebug('分享设置成功');
      },
      cancel: function () {
        logDebug('用户取消分享');
      },
      fail: function (res: any) {
        logDebug('分享失败: ' + JSON.stringify(res));
      }
    };
    logDebug('shareData: ' + JSON.stringify(shareData, null, 2));

    try {
      // @ts-ignore
      wx.updateAppMessageShareData({
        ...shareData,
        success: () => {
          logDebug('分享到好友配置成功');
        },
        fail: (res: any) => {
          logDebug('分享到好友配置失败: ' + JSON.stringify(res));
        }
      });

      // @ts-ignore
      wx.updateTimelineShareData({
        ...shareData,
        success: () => {
          logDebug('分享到朋友圈配置成功');
        },
        fail: (res: any) => {
          logDebug('分享到朋友圈配置失败: ' + JSON.stringify(res));
        }
      });
      
      logDebug('分享接口设置完成');
    } catch (e) {
      const errorMsg = '注册分享接口失败: ' + e;
      logDebug(errorMsg);
      alert(errorMsg);
    }
  } catch (error) {
    const errorMsg = `分享处理失败: ${error.message || error}`;
    logDebug(errorMsg);
    alert(errorMsg);
  }
};

// Authentication logic
onMounted(async () => {
  logDebug(`Mounting component...`);
  const { isAuthenticated: authStatus, error, userInfo } = await checkAuth(logDebug);
  logDebug(`Authentication status: ${authStatus}, error: ${error}`);
  
  if (!authStatus) {
    await navigateTo('/login');
    return;
  }

  logDebug(`User authenticated: ${userInfo.nickname}`);
  user.value = {
    name: userInfo.nickname,
    avatar: userInfo.headimgurl
  };
  await fetchData();

  // 初始化微信配置
  try {
    const { getAuthHeaders } = await import('~/utils/auth');
    const currentUrl = window.location.href.split('#')[0];
    logDebug(`初始化微信配置，当前URL: ${currentUrl}`);
    
    const { data: response } = await useFetch('/api/wechat/share', {
      headers: getAuthHeaders(),
      params: { url: encodeURIComponent(currentUrl) }
    });

    if (!response.value || !response.value.success) {
      throw new Error('Failed to get WeChat config');
    }

    const wxConfig = response.value.data;
    logDebug('微信配置参数: ' + JSON.stringify(wxConfig, null, 2));

    // @ts-ignore
    wx.config({
      debug: false,
      appId: wxConfig.appId,
      timestamp: wxConfig.timestamp,
      nonceStr: wxConfig.nonceStr,
      signature: wxConfig.signature,
      jsApiList: wxConfig.jsApiList,
      openTagList: ['wx-open-launch-weapp']
    });

    // @ts-ignore
    wx.ready(() => {
      logDebug('微信配置就绪');
    });

    // @ts-ignore
    wx.error((res: any) => {
      const errorMsg = '微信配置失败: ' + JSON.stringify(res);
      logDebug(errorMsg);
    });

  } catch (error) {
    await handleApiError(error);
    const errorMsg = `微信配置初始化失败: ${error.message || error}`;
    logDebug(errorMsg);
  }
});
</script>
