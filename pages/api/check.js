export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许 (Method Not Allowed)' });
  }

  try {
    // 从前端请求的 body 中获取用户输入的 token
    const { token } = req.body;

    // 如果用户没有提供 token，返回错误
    if (!token) {
      return res.status(400).json({ message: '必须提供令牌 (Token is required)' });
    }

    // --- 后端仍然需要获取完整列表以进行查找 ---
    const response = await fetch('https://globalai.vip/api/token/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      // 如果上游服务器出错，则将错误传递给前端
      const errorText = await response.text();
      console.error('Upstream API Error:', errorText);
      return res.status(response.status).json({ message: `上游服务器错误 (Upstream server error): ${response.statusText}` });
    }

    const allData = await response.json();
    const allTokens = allData.data;

    // --- 核心逻辑：在列表中查找匹配的 token ---
    const foundToken = allTokens.find(t => t.key === token.trim());

    if (foundToken) {
      // 如果找到了，只返回那一条数据
      res.status(200).json(foundToken);
    } else {
      // 如果没找到，返回 404 Not Found
      res.status(404).json({ message: '令牌未找到或无效 (Token not found or invalid)' });
    }

  } catch (error) {
    console.error('Server-side Error:', error);
    res.status(500).json({ message: '服务器内部错误 (Internal Server Error)' });
  }
}
