export default async function handler(req, res) {
  if (req.method === 'POST') {
    const token = process.env.GLOBAL_VIP_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({ error: '服务端未配置API密钥' });
    }

    try {
      // 1. 使用您截图中显示的【唯一正确】的API地址
      const url = 'https://globalai.vip/api/token/';

      const response = await fetch(url, {
        method: 'GET', // 2. 使用截图中显示的GET方法
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API请求失败: ${response.status}`, errorText);
        return res.status(response.status).json({ error: `上游API认证失败: ${errorText}` });
      }

      const result = await response.json();

      // 3. 按照截图中【正确的数据结构】进行解析
      if (result && result.success && result.data && Array.isArray(result.data.items)) {
        // 直接将我们需要的令牌列表数组返回给前端
        res.status(200).json(result.data.items);
      } else {
        // 如果返回的数据结构不符合预期
        res.status(500).json({ error: '上游API返回数据格式不正确' });
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
