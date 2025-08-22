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
      console.error('Upstream API Error Response Text:', errorText);
      return res.status(response.status).json({
        message: '上游API返回错误状态码。',
        debug_response_text: errorText
      });
    }

    // 将响应解析为JSON
    const apiResponseObject = await response.json();

    // --- 【核心诊断步骤】---
    // 1. 在服务器后台打印出收到的完整数据结构，这是最重要的线索。
    console.log('--- UPSTREAM API RESPONSE RECEIVED BY SERVER ---');
    console.log(JSON.stringify(apiResponseObject, null, 2));

    // 2. 尝试按照您给的正确格式去解析
    const allTokens = apiResponseObject?.data?.items;

    // 3. 如果解析失败，我们将把服务器实际收到的内容，直接通过错误信息返回给前端页面！
    if (!Array.isArray(allTokens)) {
      const receivedDataStructure = JSON.stringify(apiResponseObject);
      console.error(`关键错误：期望 .data.items 是一个数组，但解析失败。收到的完整数据是: ${receivedDataStructure}`);
      
      // 在前端页面上直接显示出服务器收到了什么，这样我们就能看到问题所在！
      return res.status(500).json({
        message: '服务器收到的数据结构非预期，无法处理。',
        debug_received_data: apiResponseObject // 把收到的整个对象都发回前端
      });
    }

    // 如果代码能走到这里，说明数据结构是对的，剩下的逻辑就没问题
    const foundToken = allTokens.find(t => t.key === token.trim());

    if (foundToken) {
      res.status(200).json(foundToken);
    } else {
      res.status(404).json({ message: '令牌在列表中未找到。' });
    }

  } catch (error) {
    // 捕获比如 response.json() 失败等错误
    console.error('Server-side Catch Block Error:', error);
    res.status(500).json({
      message: '服务器在处理过程中发生异常。',
      debug_error_message: error.message
    });
  }
}
