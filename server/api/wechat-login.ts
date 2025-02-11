import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  console.log('wechat-login API triggered');
  const query = getQuery(event);
  const code = query.code;
  const config = useRuntimeConfig();
  console.log('Query:', query);
  console.log('Code:', code);

  if (!code) {
    return { error: 'No code found' };
  }

  try {
    const url =`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wechatAppId}&secret=${config.wechatAppSecret}&code=${code}&grant_type=authorization_code`

    const tokenResponse = await axios.get(url);
    console.log(url, 'Token response:', tokenResponse.data);

    const { access_token, openid } = tokenResponse.data;

    const userInfoResponse = await axios.get(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    );
    console.log('User info response:', userInfoResponse.data);

    if (userInfoResponse.data.errcode) {
      return { error: userInfoResponse.data.errmsg };
    }

    const userInfo = userInfoResponse.data;

    return { success: true, userInfo };
  } catch (error) {
    console.error('WeChat login error:', error);
    return { error: 'WeChat login error' };
  }
});
