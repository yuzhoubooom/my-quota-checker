export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许 (Method Not Allowed)' });
  }

  try {
    // 从前端请求中获取用户输入的 token
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: '必须提供令牌 (Token is required)' });
    }

    // 调用上游 API
    const response = await fetch('https://globalai.vip/api/token/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Accept': 'application/json'
      }
    });

    // 检查上游 API 响应是否成功
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upstream API Error:', errorText);
      return res.status(response.status).json({ message: `上游服务器错误: ${response.statusText}` });
    }

    const apiResponseObject = await response.json();

    // --- 【核心修正】---
    // 根据您提供的正确JSON格式，我们现在精确定位到 .data.items 数组
    const allTokens = apiResponseObject?.data?.items;

    // 添加一个健壮的检查，确保我们成功找到了那个数组
    if (!Array.isArray(allTokens)) {
      console.error('Invalid data structure from upstream API. Expected `.data.items` to be an array.', apiResponseObject);
      return res.status(500).json({ message: '从源API收到的数据格式无效，无法找到令牌列表。' });
    }

    // 在正确的令牌数组中进行查找
    const foundToken = allTokens.find(t => t.key === token.trim());

    // 根据查找结果返回数据
    if (foundToken) {
      // 成功找到，返回200和该令牌的数据
      res.status(200).json(foundToken);
    } else {
      // 未找到，返回404
      res.status(404).json({ message: '令牌未找到或无效 (Token not found or invalid)' });
    }

  } catch (error) {
    console.error('Server-side Error:', error);
    res.status(500).json({ message: `服务器内部错误: ${error.message}` });
  }
}
