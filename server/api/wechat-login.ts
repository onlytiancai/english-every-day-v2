import { defineEventHandler, getQuery } from 'h3';
import axios from 'axios';
import { generateToken } from '../utils/auth';
import prisma from "~/lib/prisma";

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

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        unionid: userInfo.unionid
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userInfo.nickname,
          openid: openid,
          unionid: userInfo.unionid,
          userinfo: JSON.stringify(userInfo)
        }
      });
    }

    // Generate token with user ID
    const token = await generateToken({ 
      openid,
      unionid: userInfo.unionid,
      userId: user.id
    });

    return { success: true, userInfo, token };
  } catch (error) {
    console.error('WeChat login error:', error);
    return { error: 'WeChat login error' };
  }
});
