export default async function handler(req, res) {
  // 1. 确保请求方法正确
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许 (Method Not Allowed)' });
  }

  try {
    // 2. 从请求体中获取用户输入的token
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: '必须提供令牌 (Token is required)' });
    }

    // 3. 调用上游API获取所有token的列表
    const response = await fetch('https://globalai.vip/api/token/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Accept': 'application/json'
      }
    });

    // 4. 检查上游API的响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upstream API Error:', errorText);
      return res.status(response.status).json({ message: `上游服务器错误: ${response.statusText}` });
    }

    const allData = await response.json();

    // 5. --- 【核心修正】---
    // 我们直接检查返回的数据是不是一个数组，这才是符合真实情况的逻辑。
    if (!Array.isArray(allData)) {
      console.error('Invalid data structure from upstream API. Expected a direct array.', allData);
      return res.status(500).json({ message: '从源API收到的数据格式不是预期的数组格式。' });
    }

    // 6. 在这个正确的数组结构中查找用户提供的token
    const foundToken = allData.find(t => t.key === token.trim());

    // 7. 根据查找结果返回数据
    if (foundToken) {
      res.status(200).json(foundToken);
    } else {
      res.status(404).json({ message: '令牌未找到或无效 (Token not found or invalid)' });
    }

  } catch (error) {
    console.error('Server-side Error:', error);
    res.status(500).json({ message: `服务器内部错误: ${error.message}` });
  }
}
