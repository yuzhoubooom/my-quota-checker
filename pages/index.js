import { useState, useEffect } from 'react';

// --- 数据转换核心函数 (无任何改变) ---
const CONVERSION_RATE = 500000;
const convertToUSD = (quota) => (quota / CONVERSION_RATE).toFixed(4);

// --- 页面核心组件 ---
export default function HomePage() {
  // --- 状态管理 (无任何改变) ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [tokenInput, setTokenInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');

  // --- 数据获取逻辑 (无任何改变) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/check', { method: 'POST' });
        if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);
        const data = await response.json();
        setAllItems(data);
        setSearchMessage('服务已就绪，请输入您的Token进行查询。');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 查询处理逻辑 (无任何改变) ---
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchResult(null);
    if (!tokenInput) {
      setSearchMessage('请输入一个Token进行查询。');
      return;
    }
    const keyToFind = tokenInput.trim().startsWith('sk-') 
      ? tokenInput.trim().substring(3) 
      : tokenInput.trim();
    const foundItem = allItems.find(item => item.key === keyToFind);
    if (foundItem) {
      setSearchResult(foundItem);
      setSearchMessage('');
    } else {
      setSearchMessage('未找到Token，请检查后重试。');
    }
  };

  // --- RENDER ---
  return (
    <>
      <style jsx>{`
        .page-container {
          padding: 0 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          background-color: #fbfbfb;
          color: #333;
        }
        .main-layout {
          min-height: 100vh;
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        .content-wrapper {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .title {
          margin: 0 0 2rem 0;
          line-height: 1.2;
          font-size: 2.5rem;
          font-weight: 600;
          text-align: center;
        }
        .search-box {
          width: 100%;
          max-width: 600px;
          margin-bottom: 1.5rem;
        }
        .form {
          display: flex;
          gap: 10px;
        }
        .input {
          flex: 1;
          font-size: 1rem;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #0070f3;
          outline: none;
        }
        .button {
          font-size: 1rem;
          padding: 12px 24px;
          border: none;
          background-color: #0070f3;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .button:hover {
          background-color: #005bb5;
        }
        .message {
          margin-top: 1rem;
          font-size: 1rem;
          color: #555;
          text-align: center;
        }
        .error {
          color: #d32f2f;
          font-weight: bold;
        }
        .table-container {
            width: 100%;
            overflow-x: auto;
            margin-top: 1rem;
            border-radius: 8px;
            border: 1px solid #eaeaea;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        table {
            width: 100%;
            min-width: 700px; /* 强制在窄屏上出现滚动条 */
            border-collapse: collapse;
        }
        th, td {
            padding: 14px 18px;
            text-align: left;
            white-space: nowrap;
            border-bottom: 1px solid #eaeaea;
        }
        th {
            background-color: #f9f9f9;
            font-weight: 600;
        }
        tbody tr:last-child td {
            border-bottom: none;
        }
        .status-active { color: #2e7d32; }
        .status-inactive { color: #d32f2f; }
        .footer {
          width: 100%;
          padding-top: 2rem;
          text-align: center;
          color: #999;
          font-size: 0.9rem;
        }

        /* 响应式设计: 手机端 */
        @media (max-width: 640px) {
          .main-layout { padding: 1rem 0; }
          .title { font-size: 2rem; }
          .form {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="page-container">
        <main className="main-layout">
          <div className="content-wrapper">
            <h1 className="title">个人Token额度查询</h1>

            <div className="search-box">
              <form onSubmit={handleSearch} className="form">
                <input
                  type="text"
                  className="input"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="在此输入您的完整Token (例如 sk-...)"
                />
                <button type="submit" className="button">查询</button>
              </form>
            </div>

            {isLoading && <p className="message">正在初始化查询服务...</p>}
            {error && <p className="message error">服务初始化失败: {error}</p>}
            {searchMessage && <p className="message">{searchMessage}</p>}

            {searchResult && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>名称</th>
                      <th>已用额度 (USD)</th>
                      <th>剩余额度 (USD)</th>
                      <th>总额度 (USD)</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{searchResult.name}</td>
                      <td>${convertToUSD(searchResult.used_quota)}</td>
                      <td>${convertToUSD(searchResult.remain_quota)}</td>
                      <td>{searchResult.unlimited_quota ? '无限制' : `$${(parseFloat(convertToUSD(searchResult.used_quota)) + parseFloat(convertToUSD(searchResult.remain_quota))).toFixed(4)}`}</td>
                      <td className={searchResult.status === 1 ? 'status-active' : 'status-inactive'}>
                        {searchResult.status === 1 ? '✅ 正常' : '❌ 禁用'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <footer className="footer">
            @2025 宇宙编辑部 boom 提供技术支持
          </footer>
        </main>
      </div>
    </>
  );
}

