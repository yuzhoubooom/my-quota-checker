import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const accessToken = process.env.API_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ message: 'API access token is not configured on the server.' });
  }

  try {
    // --- 这里是唯一的、关键的修正：将 size=10 改为 size=1000 ---
    const apiResponse = await fetch('https://globalai.vip/api/token/?p=1&size=1000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Upstream API error:', errorText);
      return res.status(apiResponse.status).json({ message: 'Failed to fetch data from upstream API.', details: errorText });
    }

    const data = await apiResponse.json();

    // 假设数据结构是 { ..., data: { data: [...] } }
    if (data && data.data && Array.isArray(data.data.data)) {
        res.status(200).json(data.data.data);
    } else {
        console.error('Unexpected data structure from upstream API:', data);
        res.status(500).json({ message: 'Received unexpected data structure from upstream API.' });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};
