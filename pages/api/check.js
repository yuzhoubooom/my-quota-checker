// pages/api/check.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅允许POST方法' });
  }

  try {
    const { apiKey } = JSON.parse(req.body);
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return res.status(400).json({ success: false, message: '请输入有效的API Key。' });
    }

    const API_BASE_URL = 'https://globalai.vip';

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const subscriptionPromise = fetch(`${API_BASE_URL}/v1/dashboard/billing/subscription`, { headers });

    const today = new Date();
    const startDate = '2023-01-01'; 
    const endDate = new Date(new Date().setDate(today.getDate() + 1)).toISOString().split('T')[0];
    const usagePromise = fetch(`${API_BASE_URL}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`, { headers });

    const [subscriptionRes, usageRes] = await Promise.all([subscriptionPromise, usagePromise]);

    if (subscriptionRes.status === 401 || usageRes.status === 401) {
        return res.status(200).json({ success: false, message: 'API Key 无效或已过期 (Auth failed at globalai.vip)。' });
    }

    if (!subscriptionRes.ok || !usageRes.ok) {
        throw new Error('无法从 globalai.vip API 获取数据。');
    }

    const subscriptionData = await subscriptionRes.json();
    const usageData = await usageRes.json();

    const totalGranted = subscriptionData.hard_limit_usd;
    const totalUsed = usageData.total_usage / 100;
    const totalAvailable = totalGranted - totalUsed;

    res.status(200).json({
      success: true,
      total_granted: totalGranted,
      total_used: totalUsed,
      total_available: totalAvailable,
    });

  } catch (error) {
    console.error('API Route Error in check.js:', error);
    res.status(500).json({ success: false, message: error.message || '服务器内部错误' });
  }
}
