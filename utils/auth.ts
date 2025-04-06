import { useRuntimeConfig } from '#imports'
import { logDebug } from './debug'

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

  logDebug(`Handling authentication - token exists: ${!!token}, code: ${code}`);

  if (token && userInfoStr) {
    const userInfo = JSON.parse(userInfoStr);
    logDebug(`Using existing token for user: ${userInfo.nickname}`);
    return { isAuthenticated: true, userInfo };
  }

  if (code) {
    logDebug(`Processing WeChat auth code`);
    try {
      const response = await fetch(`${config.public.returnUrl}api/wechat-login?code=${code}`);
      const data = await response.json();
      if (data.success) {
        logDebug(`WeChat login successful for user: ${data.userInfo.nickname}`);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        return { isAuthenticated: true, userInfo: data.userInfo };
      }
      logDebug(`WeChat login failed: ${data.error}`);
      return { isAuthenticated: false, error: data.error };
    } catch (error) {
      logDebug(`WeChat login error: ${error}`);
      return { isAuthenticated: false, error: 'WeChat login error' };
    }
  }

  logDebug('No authentication token or code found');
  return { isAuthenticated: false };
}

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
