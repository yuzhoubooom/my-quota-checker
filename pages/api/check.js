export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 1. 同时读取令牌和用户ID两个环境变量
    const token = process.env.GLOBAL_VIP_ACCESS_TOKEN;
    const userId = process.env.GLOBAL_VIP_USER_ID;

    // 2. 确保两个变量都已成功配置
    if (!token || !userId) {
      let missingVars = [];
      if (!token) missingVars.push('GLOBAL_VIP_ACCESS_TOKEN');
      if (!userId) missingVars.push('GLOBAL_VIP_USER_ID');
      return res.status(500).json({ error: `服务端未配置必要的环境变量: ${missingVars.join(', ')}` });
    }

    try {
      const url = 'https://globalai.vip/api/token/';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 3. 【决定性修正】将从环境变量中读取到的 userId 作为 'New-Api-User' 头的值
          'New-Api-User': userId, 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`上游API请求失败: ${response.status}`, errorText);
        return res.status(401).json({ error: `上游API认证失败: ${errorText}` });
      }

      const result = await response.json();

      if (result && result.success && result.data && Array.isArray(result.data.items)) {
        res.status(200).json(result.data.items);
      } else {
        res.status(500).json({ error: '上游API返回数据格式不正确', details: result });
      }

    } catch (error) {
      console.error('调用外部API时发生网络或解析错误:', error);
      res.status(500).json({ error: '调用上游API失败，请检查网络或服务器日志。' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
