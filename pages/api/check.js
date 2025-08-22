export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许 (Method Not Allowed)' });
  }

  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: '必须提供令牌 (Token is required)' });
    }

    const response = await fetch('https://globalai.vip/api/token/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upstream API Error:', errorText);
      return res.status(response.status).json({ message: `上游服务器错误: ${response.statusText}` });
    }

    const apiResponseObject = await response.json();

    // --- 【关键修正】 ---
    // 之前忽略的核心步骤：检查返回对象中 .data 是否存在且为数组
    if (!apiResponseObject || !Array.isArray(apiResponseObject.data)) {
        console.error('Invalid data structure from upstream API:', apiResponseObject);
        // 如果数据结构不正确，向上游 API 问题归因，并返回一个清晰的服务器错误
        return res.status(500).json({ message: '从源服务器收到的数据格式无效 (Invalid data format received from source API)' });
    }

    // 现在可以安全地使用 .data
    const allTokens = apiResponseObject.data;
    const foundToken = allTokens.find(t => t.key === token.trim());

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
