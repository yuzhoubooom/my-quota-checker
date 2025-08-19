// pages/api/check.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 从前端获取用户输入的，想要查询余额的“API密钥” (例如 ...RL7C)
  const { token: apiKeyToQuery } = req.body;
  if (!apiKeyToQuery) {
    return res.status(400).json({ error: '您需要输入一个API Key进行查询' });
  }

  // --- 这是我们的制胜法宝 ---
  // 读取 Vercel 环境变量中存储的“超级门禁卡”（系统访问令牌）
  const accessToken = process.env.GLOBAL_VIP_ACCESS_TOKEN;

  if (!accessToken) {
    // 如果服务器没有配置这个环境变量，就提前报错，这是一个安全措施
    console.error("错误：服务器环境变量 GLOBAL_VIP_ACCESS_TOKEN 未设置！");
    return res.status(500).json({ error: '服务器配置错误，管理员未设置访问令牌。' });
  }
  
  // -- 定义常量 --
  const API_URL = 'https://globalai.vip/api/token';
  const QUOTA_TO_USD_RATE = 500000;

  // 使用“超级门禁卡” (Access Token) 进行身份验证
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(API_URL, { headers });
    const data = await response.json();

    if (!response.ok || data.success === false) {
      // 如果API返回错误（例如Access Token失效），将服务商的错误信息直接返回
      throw new Error(data.message || '查询失败，请检查您的系统访问令牌是否有效。');
    }

    // 从返回的所有密钥列表中，找到我们想查询的那一个
    const allTokens = data.data.items;
    if (!allTokens) {
      // 如果API返回的数据结构不符合预期
      console.log('Unexpected API response structure:', JSON.stringify(data, null, 2));
      throw new Error('服务商API响应结构异常，请联系管理员。');
    }

    const currentTokenInfo = allTokens.find(item => item.key === apiKeyToQuery);

    if (!currentTokenInfo) {
      // 如果在列表中没找到用户输入的那个密钥
      throw new Error('查询成功，但在您的账户下未找到这个API Key。');
    }

    // --- 余额计算逻辑（保持不变） ---
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
