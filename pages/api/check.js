// pages/api/check.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  // --- 基于侦察结果的配置 ---
  // global.vip 的 Token 信息接口
  const API_URL = 'https://globalai.vip/api/token';
  // global.vip 的 Quota 与 美元 的换算比例
  const QUOTA_TO_USD_RATE = 500000;

  const headers = {
    // 使用从前端传来的 token 进行认证
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(API_URL, { headers });
    const data = await response.json();

    if (!response.ok) {
        // 如果API返回错误（例如Token无效），将服务商的错误信息直接返回给用户
        throw new Error(data.message || '查询失败，请检查Token或API服务商状态。');
    }

    // 从返回的 টোকেন列表 (items array) 中，找到用户输入的那一个
    const allTokens = data.data.items;
    const currentTokenInfo = allTokens.find(item => item.key === token);

    // 如果在返回的列表中没找到这个token，说明token无效
    if (!currentTokenInfo) {
      throw new Error('无效的Token，未在您的账户下找到该Token。');
    }

    // 从找到的Token信息中提取配额
    const remainQuota = currentTokenInfo.remain_quota;
    const usedQuota = currentTokenInfo.used_quota;
    
    // 如果是无限额度，则特殊处理
    if (currentTokenInfo.unlimited_quota) {
        res.status(200).json({
          total_granted: "无限",
          total_used: (usedQuota / QUOTA_TO_USD_RATE).toFixed(4),
          total_available: "无限",
        });
        return;
    }

    // 使用破解的公式进行换算
    const totalGranted = (remainQuota + usedQuota) / QUOTA_TO_USD_RATE;
    const totalUsed = usedQuota / QUOTA_TO_USD_RATE;
    const totalAvailable = remainQuota / QUOTA_TO_USD_RATE;

    // 将格式化后的结果以 JSON 格式成功返回给前端
    res.status(200).json({
      total_granted: totalGranted.toFixed(4),
      total_used: totalUsed.toFixed(4),
      total_available: totalAvailable.toFixed(4),
    });

  } catch (error) {
    console.error('API查询失败:', error);
    res.status(500).json({ error: error.message });
  }
}
