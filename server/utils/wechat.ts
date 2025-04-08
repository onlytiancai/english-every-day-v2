let accessToken = '';
let tokenExpireTime = 0;

export async function getToken() {
  console.log('============ 获取微信Token开始 ============');
  
  // 检查缓存的token
  if (accessToken && Date.now() < tokenExpireTime) {
    const remainingTime = Math.floor((tokenExpireTime - Date.now()) / 1000);
    console.log(`使用缓存Token: ${accessToken.substring(0, 10)}...`);
    console.log(`Token剩余有效期: ${remainingTime}秒`);
    console.log('============ 获取微信Token完成(缓存) ============');
    return accessToken;
  }

  console.log('Token已过期或不存在，开始获取新Token');
  const config = useRuntimeConfig();
  const appId = config.wechatAppId;
  console.log('AppID:', appId);

  try {
    // 获取新token
    console.log('正在请求微信接口...');
    const res = await $fetch('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: appId,
        secret: config.wechatAppSecret
      }
    });

    console.log('微信接口响应:', JSON.stringify(res));

    if (!res.access_token) {
      console.error('获取Token失败:', res);
      throw new Error('Failed to get access token');
    }

    accessToken = res.access_token;
    tokenExpireTime = Date.now() + (res.expires_in * 1000);

    console.log(`获取新Token成功: ${accessToken.substring(0, 10)}...`);
    console.log(`Token有效期: ${res.expires_in}秒`);
    console.log('============ 获取微信Token完成(新) ============');
    
    return accessToken;
  } catch (error) {
    console.error('获取Token发生错误:', error);
    console.log('============ 获取微信Token失败 ============');
    throw error;
  }
}
