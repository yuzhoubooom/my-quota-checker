// pages/api/check.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅允许POST方法' });
  }

  try {
    // 从前端获取用户想要查询的那个 sk-key
    const { apiKey: userProvidedKey } = JSON.parse(req.body);
    if (!userProvidedKey || !userProvidedKey.startsWith('sk-')) {
      return res.status(400).json({ success: false, message: '请输入有效的API Key (sk-...).' });
    }

    // [颠覆性变更] 1. 从Vercel环境变量中读取真正的系统访问令牌
    const SYSTEM_ACCESS_TOKEN = process.env.GLOBAL_VIP_ACCESS_TOKEN;
    if (!SYSTEM_ACCESS_TOKEN) {
        throw new Error('服务器配置错误：未找到 GLOBAL_VIP_ACCESS_TOKEN 环境变量。');
    }

    // 2. 定义正确的API地址和请求方法
    const API_URL = 'https://globalai.vip/api/token'; 
    
    // [颠覆性变更] 3. 使用系统令牌作为 Bearer Token 进行认证
    const headers = {
      'Authorization': `Bearer ${SYSTEM_ACCESS_TOKEN}`,
    };

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 401) {
      // 这个401错误现在指向的是您的系统令牌，而不是用户的key
      return res.status(200).json({ success: false, message: '系统认证失败 (401)。请检查Vercel环境变量中的 GLOBAL_VIP_ACCESS_TOKEN 是否正确或已过期。' });
    }

    if (!response.ok) {
        throw new Error(`globalai.vip API 返回错误: ${response.status} ${response.statusText}`);
    }

    const jsonResponse = await response.json();

    // [颠覆性变更] 4. 使用用户输入的 key 作为查询条件，在返回的列表中查找匹配项
    const keyWithoutPrefix = userProvidedKey.substring(3); // 移除 "sk-"
    const keyData = jsonResponse.data.items.find(item => item.key === keyWithoutPrefix);

    if (!keyData) {
      return res.status(200).json({ success: false, message: '成功连接并获取列表，但在您的账户下未找到用户输入的这个Key。' });
    }

    // 5. 提取数据并返回给前端
    const { used_quota, remain_quota, unlimited_quota } = keyData;
    res.status(200).json({
      success: true,
      is_unlimited: unlimited_quota,
      used_quota: used_quota,
      remain_quota: remain_quota,
    });

  } catch (error) {
    console.error('API Route Error in check.js:', error);
    res.status(500).json({ success: false, message: error.message || '服务器内部错误，请检查Vercel后台日志。' });
  }
}
