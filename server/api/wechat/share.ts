import crypto from 'crypto';
import { getToken } from '~/server/utils/wechat';

export default defineEventHandler(async (event) => {
  console.log('============ 微信分享配置开始 ============');
  try {
    const query = getQuery(event);
    const url = query.url as string;
    console.log('请求URL:', url);

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
    const timestamp = Math.floor(Date.now() / 1000);
    
    // 按字典序排序参数
    const str = [
      `jsapi_ticket=${ticketRes.ticket}`,
      `noncestr=${nonceStr}`, 
      `timestamp=${timestamp}`,
      `url=${url}`
    ].sort().join('&');
    
    console.log('签名字符串:', str);

    // SHA1签名
    const signature = crypto.createHash('sha1').update(str).digest('hex');
    console.log('生成签名:', signature);

    const result = {
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ]
    };

    console.log('返回配置:', JSON.stringify(result));
    console.log('============ 微信分享配置完成 ============');
    return result;

  } catch (error) {
    console.error('微信分享配置失败:', error);
    console.log('============ 微信分享配置失败 ============');
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
});

