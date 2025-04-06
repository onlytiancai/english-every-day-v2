import { useRuntimeConfig } from '#imports'

export interface UserInfo {
  id: string;
  nickname: string;
  headimgurl: string;
}

export function getWechatLoginUrl() {
  const config = useRuntimeConfig();
  const redirectUri = encodeURIComponent(config.public.returnUrl);
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.public.wechatAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
}

export async function handleAuthentication() {
  const token = localStorage.getItem('token');
  const userInfoStr = localStorage.getItem('userInfo');
  const route = useRoute();
  const code = route.query.code as string;
  const config = useRuntimeConfig();

  if (token && userInfoStr) {
    const userInfo = JSON.parse(userInfoStr);
    return { isAuthenticated: true, userInfo };
  }

  if (code) {
    try {
      const response = await fetch(`${config.public.returnUrl}api/wechat-login?code=${code}`);
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        return { isAuthenticated: true, userInfo: data.userInfo };
      }
      return { isAuthenticated: false, error: data.error };
    } catch (error) {
      return { isAuthenticated: false, error: 'WeChat login error' };
    }
  }

  return { isAuthenticated: false };
}

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
