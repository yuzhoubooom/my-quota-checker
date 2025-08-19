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

  const API_URL = 'https://globalai.vip/api/token';
  const QUOTA_TO_USD_RATE = 500000;

  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(API_URL, { headers });
    const data = await response.json();

    // --- !! 新增的关键日志 !! ---
    // 无论成功失败, 我们都将收到的原始数据打印到Vercel的服务器日志中
    console.log('Received raw data from globalai.vip:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
        throw new Error(data.message || '查询失败，请检查Token或API服务商状态。');
    }

    // --- !! 代码加固 !! ---
    // 我们不再假设 data.data.items 存在, 而是安全地检查它
    // 我们使用可选链 (?.), 如果路径上任何一步是 undefined, 结果就是 undefined, 不会崩溃
    const allTokens = data?.data?.items; 

    // 如果 allTokens 最终是 undefined 或 null, 说明数据结构确实不符合预期
    if (!allTokens) {
      // 抛出一个更明确的错误
      throw new Error('Unexpected API response structure from globalai.vip. Check Vercel logs for raw data.');
    }
    
    const currentTokenInfo = allTokens.find(item => item.key === token);

    if (!currentTokenInfo) {
      throw new Error('无效的Token，未在您的账户下找到该Token。');
    }

    const remainQuota = currentTokenInfo.remain_quota;
    const usedQuota = currentTokenInfo.used_quota;
    
    if (currentTokenInfo.unlimited_quota) {
        res.status(200).json({
          total_granted: "无限",
          total_used: (usedQuota / QUOTA_TO_USD_RATE).toFixed(4),
          total_available: "无限",
        });
        return;
    }

    const totalGranted = (remainQuota + usedQuota) / QUOTA_TO_USD_RATE;
    const totalUsed = usedQuota / QUOTA_TO_USD_RATE;
    const totalAvailable = remainQuota / QUOTA_TO_USD_RATE;

    res.status(200).json({
      total_granted: totalGranted.toFixed(4),
      total_used: totalUsed.toFixed(4),
      total_available: totalAvailable.toFixed(4),
    });

  } catch (error) {
    // 将错误信息打印到服务器日志，并返回给前端
    console.error('Error in API handler:', error);
    res.status(500).json({ error: error.message });
  }
}
