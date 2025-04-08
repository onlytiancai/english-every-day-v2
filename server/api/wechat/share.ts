import crypto from 'crypto';
import { getToken } from '~/server/utils/wechat';

export default defineEventHandler(async (event) => {
  console.log('============ 微信分享配置开始 ============');
  try {
    const query = getQuery(event);
    const url = decodeURIComponent(query.url as string);  // Decode the URL first
    console.log('解码后的URL:', url);

    if (!url) {
      console.error('URL参数缺失');
      throw new Error('URL is required');
    }

    const config = useRuntimeConfig();
    const appId = config.wechatAppId;
    console.log('使用AppID:', appId);
    
    // 获取access token
    console.log('开始获取access token...');
    const accessToken = await getToken();
    console.log('获取access token成功:', accessToken.substring(0, 10) + '...');
    
    // 获取jsapi_ticket
    console.log('开始获取jsapi ticket...');
    const ticketRes = await $fetch(`https://api.weixin.qq.com/cgi-bin/ticket/getticket`, {
      params: {
        access_token: accessToken,
        type: 'jsapi'
      }
    });
    console.log('ticket响应:', JSON.stringify(ticketRes));

    if (!ticketRes.ticket) {
      console.error('获取ticket失败:', ticketRes);
      throw new Error('Failed to get jsapi ticket');
    }
    console.log('获取ticket成功:', ticketRes.ticket.substring(0, 10) + '...');

    // 生成签名所需参数
    const nonceStr = Math.random().toString(36).substr(2, 15);
    const timestamp = Math.floor(Date.now() / 1000).toString(); // Convert to string
    
    // 按字典序排序参数，确保完全按照微信的规则
    const signParams = {
      jsapi_ticket: ticketRes.ticket,
      noncestr: nonceStr,
      timestamp: timestamp,
      url: url // 使用解码后的URL
    };

    // 按字典序排序并构建签名字符串
    const str = Object.keys(signParams)
      .sort()
      .map(key => `${key}=${signParams[key]}`)
      .join('&');
    
    console.log('排序后的签名字符串:', str);

    // SHA1签名
    const signature = crypto.createHash('sha1').update(str).digest('hex');
    console.log('生成签名:', signature);

    const result = {
      debug: process.env.NODE_ENV !== 'production', // 添加debug模式
      appId,
      timestamp: Number(timestamp), // 转回number类型
      nonceStr,
      signature,
      url: url, // 返回URL以便前端验证
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ]
    };

    console.log('返回配置:', JSON.stringify(result));
    console.log('============ 微信分享配置完成 ============');
    return { success: true, data: result };

  } catch (error) {
    console.error('微信分享配置失败:', error);
    console.log('============ 微信分享配置失败 ============');
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
});

