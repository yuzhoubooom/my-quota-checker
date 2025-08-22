import { useState, useEffect } from 'react';

// --- 样式对象 (内联, 无需额外CSS文件) ---
const styles = {
  container: { padding: '0 2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' },
  main: { minHeight: '100vh', padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { margin: '0 0 2rem 0', lineHeight: '1.15', fontSize: '3rem', textAlign: 'center' },
  // 新增搜索区域样式
  searchBox: { marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' },
  input: { fontSize: '1.1rem', padding: '10px', width: '80%', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' },
  button: { fontSize: '1.1rem', padding: '10px 20px', border: 'none', backgroundColor: '#0070f3', color: 'white', borderRadius: '4px', cursor: 'pointer' },
  form: { display: 'flex', width: '100%' },
  message: { marginTop: '1rem', fontSize: '1.1rem', color: '#555', fontWeight: 'bold' },
  // 表格和通用样式
  grid: { display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '900px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  th: { borderBottom: '2px solid #0070f3', padding: '12px 15px', textAlign: 'left', backgroundColor: '#f8f9fa', color: '#333', fontWeight: '600' },
  td: { borderBottom: '1px solid #eaeaea', padding: '10px 15px', textAlign: 'left' },
  keyName: { fontWeight: 'bold' },
  currency: { fontFamily: 'monospace', fontSize: '1rem' },
  statusActive: { color: 'green' },
  statusInactive: { color: 'red' },
  error: { color: 'red', fontWeight: 'bold' },
  loading: { fontSize: '1.2rem', color: '#555' }
};

// --- 额度转换核心函数 ---
const CONVERSION_RATE = 500000;
const convertToUSD = (quota) => (quota / CONVERSION_RATE).toFixed(4);

// --- 页面核心组件 ---
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allItems, setAllItems] = useState([]); // 存储所有密钥信息
  const [tokenInput, setTokenInput] = useState(''); // 存储用户输入的token
  const [searchResult, setSearchResult] = useState(null); // 存储查询结果
  const [searchMessage, setSearchMessage] = useState(''); // 存储提示信息，如"未找到"

  // 1. 页面加载时，获取一次所有数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/check', { method: 'POST' });
        if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);
        const data = await response.json();
        setAllItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. 处理查询逻辑
  const handleSearch = (e) => {
    e.preventDefault(); // 防止表单提交导致页面刷新
    setSearchMessage(''); // 清空旧的提示信息
    setSearchResult(null); // 清空旧的查询结果

    if (!tokenInput) {
      setSearchMessage('请输入一个Token进行查询。');
      return;
    }

    // 核心匹配逻辑：移除前3位 'sk-'
    const keyToFind = tokenInput.trim().startsWith('sk-') 
      ? tokenInput.trim().substring(3) 
      : tokenInput.trim();

    const foundItem = allItems.find(item => item.key === keyToFind);

    if (foundItem) {
      setSearchResult(foundItem);
    } else {
      setSearchMessage('Token未找到。请检查您输入的Token是否正确。');
    }
  };

  // 3. 渲染查询结果表格
  const renderResultTable = () => {
    if (!searchResult) return null; // 如果没有查询结果，不渲染表格

    const item = searchResult;
    const usedUSD = convertToUSD(item.used_quota);
    const remainingUSD = convertToUSD(item.remain_quota);
    const totalUSD = item.unlimited_quota
      ? '无限制'
      : (parseFloat(usedUSD) + parseFloat(remainingUSD)).toFixed(4);

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>名称</th>
            <th style={styles.th}>已用额度 (USD)</th>
            <th style={styles.th}>剩余额度 (USD)</th>
            <th style={styles.th}>总额度 (USD)</th>
            <th style={styles.th}>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{...styles.td, ...styles.keyName}}>{item.name}</td>
            <td style={{...styles.td, ...styles.currency}}>${usedUSD}</td>
            <td style={{...styles.td, ...styles.currency}}>${remainingUSD}</td>
            <td style={{...styles.td, ...styles.currency}}>{totalUSD.startsWith('无') ? totalUSD : `$${totalUSD}`}</td>
            <td style={item.status === 1 ? styles.statusActive : styles.statusInactive}>{item.status === 1 ? '✅ 正常' : '❌ 禁用'}</td>
          </tr>
        </tbody>
      </table>
    );
  };
  
  // 4. 主渲染函数
  const renderContent = () => {
    if (isLoading) return <p style={styles.loading}>正在初始化查询服务...</p>;
    if (error) return <p style={styles.error}>服务初始化失败: {error}</p>;

    return (
      <>
        <div style={styles.searchBox}>
          <form onSubmit={handleSearch} style={styles.form}>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="请在此输入您的完整Token..."
              style={styles.input}
            />
            <button type="submit" style={styles.button}>查询</button>
          </form>
          {searchMessage && <p style={styles.message}>{searchMessage}</p>}
        </div>
        {renderResultTable()}
      </>
    );
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>个人Token额度查询</h1>
        <div style={styles.grid}>{renderContent()}</div>
      </main>
    </div>
  );
}
