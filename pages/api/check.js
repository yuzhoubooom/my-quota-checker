// pages/api/check.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅允许POST方法' });
  }

  try {
    const { apiKey } = JSON.parse(req.body);
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return res.status(400).json({ success: false, message: '请输入有效的API Key (sk-...).' });
    }

    // [核心变更] 1. 定义正确的API地址和请求方法
    const API_URL = 'https://globalai.vip/api/token'; 
    
    // [核心变更] 2. 使用您的 sk- key 作为 Bearer Token 进行认证
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
    };

    const response = await fetch(API_URL, {
      method: 'GET', // [核心变更] 3. 使用GET方法
      headers: headers,
    });

    if (response.status === 401) {
      return res.status(200).json({ success: false, message: '认证失败 (401 Unauthorized)。请确认您的API Key有权限执行此操作，或该Key本身是否正确。' });
    }

    if (!response.ok) {
        throw new Error(`globalai.vip API 返回错误: ${response.status} ${response.statusText}`);
    }

    const jsonResponse = await response.json();

    // [核心变更] 4. 在返回的列表中查找匹配的Key
    const keyWithoutPrefix = apiKey.substring(3); // 移除 "sk-"
    const keyData = jsonResponse.data.items.find(item => item.key === keyWithoutPrefix);

    if (!keyData) {
      return res.status(200).json({ success: false, message: '成功连接到API，但在返回的列表中未找到您输入的这个Key。' });
    }

    // 5. 提取数据并返回
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
