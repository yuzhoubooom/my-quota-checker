// pages/api/check.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token: apiKeyToQuery } = req.body;
  if (!apiKeyToQuery) {
    return res.status(400).json({ error: '您需要输入一个API Key进行查询' });
  }

  // --- 读取双重验证信息 ---
  const accessToken = process.env.GLOBAL_VIP_ACCESS_TOKEN;
  const userId = process.env.GLOBAL_VIP_USER_ID;

  // --- 安全检查 ---
  if (!accessToken || !userId) {
    console.error("服务器配置错误：GLOBAL_VIP_ACCESS_TOKEN 或 GLOBAL_VIP_USER_ID 未设置！");
    return res.status(500).json({ error: '服务器配置错误，管理员未设置完整的访问凭证。' });
  }

  // --- 定义API常量 ---
  const API_URL = 'https://globalai.vip/api/token';
  const QUOTA_TO_USD_RATE = 500000;

  // --- 构建包含双重验证的请求头 ---
  const headers = {
    'Authorization': `Bearer ${accessToken}`, // “门禁卡”
    'New-Api-User': userId,                   // “员工ID”
  };

  try {
    const response = await fetch(API_URL, { headers });
    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || '查询失败，请检查您的访问凭证是否有效。');
    }

    const allTokens = data.data.items;
    if (!allTokens) {
      console.log('Unexpected API response structure:', JSON.stringify(data, null, 2));
      throw new Error('服务商API响应结构异常，请联系管理员。');
    }
    
    const currentTokenInfo = allTokens.find(item => item.key === apiKeyToQuery);

    if (!currentTokenInfo) {
      throw new Error('查询成功，但在您的账户下未找到这个API Key。');
    }

    // --- 余额计算逻辑 ---
    const usedQuota = currentTokenInfo.used_quota;
    
    if (currentTokenInfo.unlimited_quota) {
        res.status(200).json({
          total_granted: "无限",
          total_used: (usedQuota / QUOTA_TO_USD_RATE).toFixed(4),
          total_available: "无限",
        });
        return;
    }
    
    const remainQuota = currentTokenInfo.remain_quota;
    const totalGranted = (remainQuota + usedQuota) / QUOTA_TO_USD_RATE;
    const totalUsed = usedQuota / QUOTA_TO_USD_RATE;
    const totalAvailable = remainQuota / QUOTA_TO_USD_RATE;

    res.status(200).json({
      total_granted: totalGranted.toFixed(4),
      total_used: totalUsed.toFixed(4),
      total_available: totalAvailable.toFixed(4),
    });

  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).json({ error: error.message });
  }
}
